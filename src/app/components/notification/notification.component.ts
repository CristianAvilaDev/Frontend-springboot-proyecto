import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: false,
  template: `
    <div class="notification-container" aria-live="polite" aria-atomic="true">
      <div 
        *ngFor="let notification of notifications"
        class="notification toast-notification"
        [ngClass]="'notification-' + notification.type"
        role="alert">
        <div class="notification-content">
          <i [class]="getIconClass(notification.type)" aria-hidden="true"></i>
          <span class="notification-message">{{ notification.message }}</span>
          <button 
            type="button" 
            class="notification-close"
            (click)="close(notification.id)"
            aria-label="Cerrar notificación">
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
      width: 100%;
    }

    .toast-notification {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 15px 20px;
      animation: slideIn 0.3s ease-out;
      border-left: 4px solid;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .notification-success {
      border-left-color: #10b981;
    }

    .notification-error {
      border-left-color: #ef4444;
    }

    .notification-info {
      border-left-color: #3b82f6;
    }

    .notification-warning {
      border-left-color: #f59e0b;
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .notification-content i:first-child {
      font-size: 1.2rem;
    }

    .notification-success .notification-content i:first-child {
      color: #10b981;
    }

    .notification-error .notification-content i:first-child {
      color: #ef4444;
    }

    .notification-info .notification-content i:first-child {
      color: #3b82f6;
    }

    .notification-warning .notification-content i:first-child {
      color: #f59e0b;
    }

    .notification-message {
      flex: 1;
      font-size: 0.9rem;
      color: #374151;
    }

    .notification-close {
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .notification-close:hover {
      background: #f3f4f6;
      color: #374151;
    }

    @media (max-width: 768px) {
      .notification-container {
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription?: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => this.notifications = notifications
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  close(id: number): void {
    this.notificationService.removeNotification(id);
  }

  getIconClass(type: string): string {
    switch(type) {
      case 'success': return 'fa fa-check-circle';
      case 'error': return 'fa fa-exclamation-circle';
      case 'info': return 'fa fa-info-circle';
      case 'warning': return 'fa fa-exclamation-triangle';
      default: return 'fa fa-info-circle';
    }
  }
}
