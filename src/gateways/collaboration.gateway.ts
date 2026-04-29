import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/collaboration' })
export class CollaborationGateway {
  private courseContent: Record<string, string> = {};

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() courseId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(courseId);
    client.emit('update', this.courseContent[courseId] || '');
  }

  @SubscribeMessage('change')
  handleChange(
    @MessageBody() data: { courseId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.courseContent[data.courseId] = data.content;
    client.to(data.courseId).emit('update', data.content);
  }
}
  //  // Process any missed notifications
  //   notifications.forEach((notification) => {
  //     self.registration.showNotification(notification.title, {
  //       body: notification.message,
  //       icon: notification.icon || '/icon-192x192.png',
  //       tag: notification.id,
  //     });
  //   });
  // } catch (error) {
  //   console.error('Failed to sync notifications:', error);
  // }