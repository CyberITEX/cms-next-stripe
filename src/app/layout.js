'use client';

import React, { useContext } from 'react';
import { NotificationContext, NOTIFICATION_TYPES } from '@/context/notification-context';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Notification container and renderer
 */
export function Notifications() {
  const { notifications, removeNotification } = useContext(NotificationContext);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "flex items-center justify-between p-4 rounded-md shadow-md transition-all duration-300 transform translate-x-0",
            notification.type === NOTIFICATION_TYPES.SUCCESS && "bg-success text-success-foreground",
            notification.type === NOTIFICATION_TYPES.ERROR && "bg-destructive text-destructive-foreground",
            notification.type === NOTIFICATION_TYPES.INFO && "bg-info text-info-foreground",
            notification.type === NOTIFICATION_TYPES.WARNING && "bg-warning text-warning-foreground"
          )}
        >
          <div className="flex items-center space-x-3">
            {notification.type === NOTIFICATION_TYPES.SUCCESS && <CheckCircle className="h-5 w-5" />}
            {notification.type === NOTIFICATION_TYPES.ERROR && <AlertCircle className="h-5 w-5" />}
            {notification.type === NOTIFICATION_TYPES.INFO && <Info className="h-5 w-5" />}
            {notification.type === NOTIFICATION_TYPES.WARNING && <AlertTriangle className="h-5 w-5" />}
            <p>{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-sm opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}