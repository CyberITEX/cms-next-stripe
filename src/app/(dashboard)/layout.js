import { Sidebar } from '@/components/layout/sidebar';

/**
 * Dashboard layout wrapper
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-16 md:ml-64 p-6">
        {children}
      </div>
    </div>
  );
}