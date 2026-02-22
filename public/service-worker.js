// public/service-worker.js

self.addEventListener('push', function (event) {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.message || data.body,
      icon: data.icon || '/icon-192x192.png',
      badge: data.badge || '/badge-72x72.png',
      image: data.image,
      tag: data.tag || data.id,
      requireInteraction: data.priority === 'critical',
      data: {
        url: data.actionUrl || '/',
        notificationId: data.id,
      },
      actions: data.actions || [],
      vibrate: data.priority === 'critical' ? [200, 100, 200] : [100],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  } catch (error) {
    console.error('Error processing push notification:', error);
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        // If a window is already open, focus it
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }

        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});

self.addEventListener('pushsubscriptionchange', function (event) {
  event.waitUntil(
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey:
          self.registration.pushManager.applicationServerKey,
      })
      .then(function (subscription) {
        return fetch('/api/notifications/push-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        });
      }),
  );
});

// Background sync for offline notifications
self.addEventListener('sync', function (event) {
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  try {
    const response = await fetch('/api/notifications/sync');
    const notifications = await response.json();

    // Process any missed notifications
    notifications.forEach((notification) => {
      self.registration.showNotification(notification.title, {
        body: notification.message,
        icon: notification.icon || '/icon-192x192.png',
        tag: notification.id,
      });
    });
  } catch (error) {
    console.error('Failed to sync notifications:', error);
  }
}
