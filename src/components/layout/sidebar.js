'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { AppContext } from '@/context/app-context';
import { 
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  Receipt,
  BarChart,
  Settings,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Dashboard sidebar component
 */
export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useContext(AppContext);

  // Sidebar navigation items
  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Customers',
      href: '/dashboard/customers',
      icon: Users
    },
    {
      title: 'Products',
      href: '/dashboard/products',
      icon: Package
    },
    {
      title: 'Subscriptions',
      href: '/dashboard/subscriptions',
      icon: CreditCard
    },
    {
      title: 'Orders',
      href: '/dashboard/orders',
      icon: Receipt
    },
    {
      title: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: Settings
    }
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-all duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
      )}
    >
      <div className="flex h-full flex-col">
        {/* User profile section */}
        <div className={cn(
          "flex items-center border-b p-4 transition-all",
          sidebarOpen ? "justify-between" : "justify-center md:p-2"
        )}>
          <div className={cn(
            "flex items-center space-x-3 transition-all",
            !sidebarOpen && "md:hidden"
          )}>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
          </div>
          <button className={cn(
            "rounded-full p-1 hover:bg-accent",
            !sidebarOpen && "md:hidden"
          )}>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                pathname === item.href 
                  ? "bg-accent text-accent-foreground" 
                  : "hover:bg-accent/50",
                !sidebarOpen && "md:justify-center md:px-2"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                pathname === item.href 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )} />
              <span className={cn(
                "ml-3",
                !sidebarOpen && "md:hidden"
              )}>
                {item.title}
              </span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className={cn(
          "border-t p-4",
          !sidebarOpen && "md:p-2"
        )}>
          <div className={cn(
            "flex items-center justify-between",
            !sidebarOpen && "md:justify-center"
          )}>
            <p className={cn(
              "text-xs text-muted-foreground",
              !sidebarOpen && "md:hidden"
            )}>
              &copy; 2023 Digital Store
            </p>
            <Package className={cn(
              "h-4 w-4 text-muted-foreground",
              sidebarOpen && "md:hidden"
            )} />
          </div>
        </div>
      </div>
    </aside>
  );
}