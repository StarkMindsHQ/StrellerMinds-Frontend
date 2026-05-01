import { APIRequestQueueManager } from '@/lib/api-request-queue-manager';

export const prefetchRequestQueue = new APIRequestQueueManager(3);
