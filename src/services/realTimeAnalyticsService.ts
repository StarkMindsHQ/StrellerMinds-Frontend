import { v4 as uuidv4 } from 'uuid';

export interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  timestamp: number;
}

export interface AnalyticsEvent {
  id: string;
  type: 'enrollment' | 'completion' | 'payment' | 'user_joined' | 'alert';
  message: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface RealTimeState {
  activeUsers: number;
  totalEnrollments: number;
  revenue: number;
  completionRate: number;
  recentEvents: AnalyticsEvent[];
  metricsHistory: Record<string, number[]>;
}

class RealTimeAnalyticsService {
  private subscribers: ((state: RealTimeState) => void)[] = [];
  private state: RealTimeState = {
    activeUsers: 142,
    totalEnrollments: 1240,
    revenue: 45200,
    completionRate: 68.5,
    recentEvents: [],
    metricsHistory: {
      activeUsers: Array.from(
        { length: 20 },
        () => Math.floor(Math.random() * 50) + 100,
      ),
      revenue: Array.from(
        { length: 20 },
        () => Math.floor(Math.random() * 1000) + 40000,
      ),
    },
  };

  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.startSimulation();
  }

  private startSimulation() {
    this.intervalId = setInterval(() => {
      this.updateState();
      this.notifySubscribers();
    }, 3000);
  }

  private updateState() {
    // Simulate user fluctuations
    const userChange = Math.floor(Math.random() * 11) - 5;
    this.state.activeUsers = Math.max(10, this.state.activeUsers + userChange);

    // Update history
    this.state.metricsHistory.activeUsers.push(this.state.activeUsers);
    if (this.state.metricsHistory.activeUsers.length > 30) {
      this.state.metricsHistory.activeUsers.shift();
    }

    // Occasionally trigger an event
    if (Math.random() > 0.7) {
      this.addMockEvent();
    }
  }

  private addMockEvent() {
    const types: AnalyticsEvent['type'][] = [
      'enrollment',
      'completion',
      'payment',
      'user_joined',
      'alert',
    ];
    const type = types[Math.floor(Math.random() * types.length)];

    let message = '';
    switch (type) {
      case 'enrollment':
        message = 'New student enrolled in Smart Contract Security';
        this.state.totalEnrollments += 1;
        break;
      case 'payment':
        const amount = Math.floor(Math.random() * 100) + 50;
        message = `Payment of $${amount} received`;
        this.state.revenue += amount;
        break;
      case 'user_joined':
        message = 'New user registered on the platform';
        break;
      case 'completion':
        message = 'Course completed: DeFi Fundamentals';
        break;
      case 'alert':
        message = 'High traffic detected from North America';
        break;
    }

    const newEvent: AnalyticsEvent = {
      id: uuidv4(),
      type,
      message,
      timestamp: Date.now(),
    };

    this.state.recentEvents = [
      newEvent,
      ...this.state.recentEvents.slice(0, 9),
    ];
  }

  public subscribe(callback: (state: RealTimeState) => void) {
    this.subscribers.push(callback);
    callback(this.state); // Initial call
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== callback);
    };
  }

  public getHistory(metric: keyof RealTimeState['metricsHistory']) {
    return this.state.metricsHistory[metric] || [];
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

export const realTimeAnalyticsService = new RealTimeAnalyticsService();
