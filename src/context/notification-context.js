'use client';

import { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  clearNotifications: () => {},
});

/**
 * Notification types
 * @type {{SUCCESS: string, ERROR: string, INFO: string, WARNING: string}}
 */
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

/**
 * Notification context provider
 * @param {Object} props - Provider props
 * @param {React.ReactNode} props.children - Child components
 */
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  /**
   * Add a notification
   * @param {Object} notification - Notification to add
   * @param {string} notification.type - Notification type
   * @param {string} notification.message - Notification message
   * @param {number} [notification.duration=5000] - Auto-dismiss duration in ms
   */
  const addNotification = useCallback((notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      type: notification.type || NOTIFICATION_TYPES.INFO,
      message: notification.message,
      duration: notification.duration || 5000,
    };
    
    setNotifications((prev) => [...prev, newNotification]);
    
    // Auto-dismiss notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  /**
   * Remove a notification by ID
   * @param {string} id - Notification ID
   */
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  /**
   * Clear all notifications
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}