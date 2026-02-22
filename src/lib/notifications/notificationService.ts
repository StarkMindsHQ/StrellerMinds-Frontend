// src/lib/notifications/notificationService.ts

import {
  Notification as AppNotification,
  NotificationFilter,
  NotificationPreferences,
  NotificationChannel,
  NotificationType,
} from '@/types/notification.types';

class NotificationService {
  private baseUrl = '/api/notifications';

  async getNotifications(
    filter?: NotificationFilter,
  ): Promise<AppNotification[]> {
    const params = new URLSearchParams();

    if (filter?.status) params.append('status', filter.status);
    if (filter?.type) params.append('type', filter.type);
    if (filter?.priority) params.append('priority', filter.priority);
    if (filter?.search) params.append('search', filter.search);

    const response = await fetch(`${this.baseUrl}?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch notifications');

    const data = await response.json();
    return data.notifications.map((n: any) => ({
      ...n,
      createdAt: new Date(n.createdAt),
      readAt: n.readAt ? new Date(n.readAt) : undefined,
      expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined,
    }));
  }

  async markAsRead(notificationId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${notificationId}/read`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
  }

  async markAllAsRead(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/read-all`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to mark all as read');
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${notificationId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete notification');
  }

  async deleteAll(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/delete-all`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete all notifications');
  }

  async getPreferences(): Promise<NotificationPreferences> {
    const response = await fetch(`${this.baseUrl}/preferences`);
    if (!response.ok) throw new Error('Failed to fetch preferences');
    return response.json();
  }

  async updatePreferences(
    preferences: Partial<NotificationPreferences>,
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    if (!response.ok) throw new Error('Failed to update preferences');
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Browser does not support notifications');
    }
    return Notification.requestPermission();
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator)) return null;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
      ) as unknown as BufferSource,
    });

    await fetch(`${this.baseUrl}/push-subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });

    return subscription;
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  showBrowserNotification(notification: AppNotification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new window.Notification(notification.title, {
        body: notification.message,
        icon: notification.imageUrl || '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'critical',
      });
    }
  }
}

export const notificationService = new NotificationService();
