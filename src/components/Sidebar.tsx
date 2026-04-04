import { Link, useLocation } from 'react-router-dom';
import { IconDashboard, IconHome, IconShield } from '@tabler/icons-react';

const links = [
  { path: '/', label: 'Home', icon: <IconHome size={20} /> },
  { path: '/dashboard', label: 'Dashboard', icon: <IconDashboard size={20} /> },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 glass border-r border-glass-border/50 p-4">
      <div className="flex items-center gap-2 px-3 mb-6">
        <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
          <IconShield size={16} className="text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-sm">Moderation Panel</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              location.pathname === link.path
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
