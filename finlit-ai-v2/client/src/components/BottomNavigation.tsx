import { Home, TrendingUp, BookOpen, MessageCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Beranda', icon: <Home className="w-6 h-6" />, path: '/' },
  { label: 'Risiko', icon: <TrendingUp className="w-6 h-6" />, path: '/risk-checker' },
  { label: 'Panduan', icon: <BookOpen className="w-6 h-6" />, path: '/money-guide' },
  { label: 'Chat', icon: <MessageCircle className="w-6 h-6" />, path: '/chatbot' },
];


export default function BottomNavigation() {
  const [location, navigate] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-card border-t border-border shadow-lg">
      <div className="flex justify-around items-center h-20 max-w-2xl mx-auto">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200',
              location === item.path
                ? 'text-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label={item.label}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
