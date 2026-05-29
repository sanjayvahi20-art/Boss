import { Home, Trophy, Wallet, Medal, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavigationProps {
  currentTab: ActiveTab;
  onSwitchTab: (tab: ActiveTab) => void;
}

export default function BottomNavigation({ currentTab, onSwitchTab }: BottomNavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'contests', label: 'Arena', icon: Trophy },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'leaderboard', label: 'Ranks', icon: Medal },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-150 flex justify-center shadow-lg">
      <div className="w-full max-w-md grid grid-cols-5 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSwitchTab(tab.id)}
              className="flex flex-col items-center justify-center p-1 relative focus:outline-none transition-all duration-150"
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-red-650 rounded-full" />
              )}
              
              <Icon
                size={18}
                className={`transition-colors duration-200 ${
                  isActive ? 'text-red-600 scale-105' : 'text-slate-400 group-hover:text-slate-650'
                }`}
              />
              
              <span
                className={`text-[9px] font-black tracking-wide uppercase mt-1 ${
                  isActive ? 'text-red-650 font-black' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </footer>
  );
}
