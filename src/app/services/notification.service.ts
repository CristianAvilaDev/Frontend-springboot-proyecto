import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();
  private notificationId = 0;

  constructor() {}

  showSuccess(message: string, duration: number = 3000): void {
    this.addNotification({
      id: this.notificationId++,
      type: 'success',
      message,
      duration
    });
  }

  showError(message: string, duration: number = 4000): void {
    this.addNotification({
      id: this.notificationId++,
      type: 'error',
      message,
      duration
    });
  }

  showInfo(message: string, duration: number = 3000): void {
    this.addNotification({
      id: this.notificationId++,
      type: 'info',
      message,
      duration
    });
  }

  showWarning(message: string, duration: number = 3000): void {
    this.addNotification({
      id: this.notificationId++,
      type: 'warning',
      message,
      duration
    });
  }

  private addNotification(notification: Notification): void {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, notification]);

    // Auto-remover después de la duración
    if (notification.duration) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.duration);
    }
  }

  removeNotification(id: number): void {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next(current.filter(n => n.id !== id));
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
  }
}
