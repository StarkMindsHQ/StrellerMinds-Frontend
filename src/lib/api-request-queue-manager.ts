export type RequestPriority = 'high' | 'normal' | 'low';

export interface QueueRequestOptions<T> {
  key: string;
  request: (signal: AbortSignal) => Promise<T>;
  priority?: RequestPriority;
  staleAfterMs?: number;
}

type QueuedRequest<T> = {
  key: string;
  priority: RequestPriority;
  staleAfterMs: number;
  createdAt: number;
  controller: AbortController;
  request: (signal: AbortSignal) => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
  promise: Promise<T>;
};

const DEFAULT_STALE_AFTER_MS = 15_000;

export class APIRequestQueueManager {
  private readonly maxConcurrency: number;
  private activeCount = 0;
  private readonly queues: Record<RequestPriority, QueuedRequest<unknown>[]> = {
    high: [],
    normal: [],
    low: [],
  };
  private readonly byKey = new Map<string, QueuedRequest<unknown>>();

  constructor(maxConcurrency = 4) {
    this.maxConcurrency = Math.max(1, maxConcurrency);
  }

  enqueue<T>(options: QueueRequestOptions<T>): Promise<T> {
    const existing = this.byKey.get(options.key) as QueuedRequest<T> | undefined;
    if (existing) {
      return existing.promise;
    }

    const controller = new AbortController();
    const priority = options.priority ?? 'normal';
    const staleAfterMs = options.staleAfterMs ?? DEFAULT_STALE_AFTER_MS;

    let resolveRef: (value: T) => void = () => undefined;
    let rejectRef: (reason?: unknown) => void = () => undefined;

    const promise = new Promise<T>((resolve, reject) => {
      resolveRef = resolve;
      rejectRef = reject;
    });

    const task: QueuedRequest<T> = {
      key: options.key,
      priority,
      staleAfterMs,
      createdAt: Date.now(),
      controller,
      request: options.request,
      resolve: resolveRef,
      reject: rejectRef,
      promise,
    };

    this.byKey.set(task.key, task as QueuedRequest<unknown>);
    this.queues[priority].push(task as QueuedRequest<unknown>);
    this.flush();

    return promise;
  }

  cancel(key: string): boolean {
    const task = this.byKey.get(key);
    if (!task) return false;

    task.controller.abort();
    this.removeFromQueues(task);
    this.byKey.delete(key);
    task.reject(new DOMException('Request cancelled', 'AbortError'));
    return true;
  }

  cancelStaleRequests(maxAgeMs = DEFAULT_STALE_AFTER_MS): number {
    const now = Date.now();
    const staleKeys: string[] = [];

    this.byKey.forEach((task, key) => {
      if (now - task.createdAt > maxAgeMs || now - task.createdAt > task.staleAfterMs) {
        staleKeys.push(key);
      }
    });

    staleKeys.forEach((key) => this.cancel(key));
    return staleKeys.length;
  }

  getStatus() {
    return {
      activeCount: this.activeCount,
      pendingCount:
        this.queues.high.length + this.queues.normal.length + this.queues.low.length,
      inflightKeys: Array.from(this.byKey.keys()),
    };
  }

  private nextTask(): QueuedRequest<unknown> | undefined {
    if (this.queues.high.length > 0) return this.queues.high.shift();
    if (this.queues.normal.length > 0) return this.queues.normal.shift();
    if (this.queues.low.length > 0) return this.queues.low.shift();
    return undefined;
  }

  private removeFromQueues(task: QueuedRequest<unknown>) {
    (Object.keys(this.queues) as RequestPriority[]).forEach((priority) => {
      const queue = this.queues[priority];
      const index = queue.findIndex((entry) => entry.key === task.key);
      if (index >= 0) queue.splice(index, 1);
    });
  }

  private flush() {
    this.cancelStaleRequests();

    while (this.activeCount < this.maxConcurrency) {
      const task = this.nextTask();
      if (!task) break;

      if (task.controller.signal.aborted) {
        this.byKey.delete(task.key);
        task.reject(new DOMException('Request cancelled', 'AbortError'));
        continue;
      }

      this.activeCount += 1;
      task
        .request(task.controller.signal)
        .then((value) => task.resolve(value))
        .catch((error) => task.reject(error))
        .finally(() => {
          this.activeCount -= 1;
          this.byKey.delete(task.key);
          this.flush();
        });
    }
  }
}

