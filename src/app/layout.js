'use client';

import React from 'react';
import { NotificationProvider } from '@/context/notification-context';
import Notifications from '@/components/ui/notifications';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          {children}
          <Notifications />
        </NotificationProvider>
      </body>
    </html>
  );
}