import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-paper text-ink dark:bg-ink dark:text-paper">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
