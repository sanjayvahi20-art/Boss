import { useState } from 'react';
import { Menu, Bell, Wallet } from 'lucide-react';
import { ActiveTab, UserProfile } from '../types';

interface HeaderProps {
  currentTab: ActiveTab;
  onSwitchTab: (tab: ActiveTab) => void;
  walletBalance: number;
  onShowToast: (msg: string) => void;
  onUnlockAdmin?: () => void;
  onOpenMenu: () => void;
  profile?: UserProfile;
}

export default function Header({ currentTab, onSwitchTab, walletBalance, onShowToast, onUnlockAdmin, onOpenMenu, profile }: HeaderProps) {
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    onSwitchTab('home');
    if (onUnlockAdmin) {
      const nextClicks = logoClicks + 1;
      if (nextClicks >= 5) {
        setLogoClicks(0);
        onUnlockAdmin();
      } else {
        setLogoClicks(nextClicks);
      }
    }
  };

  return (
    <header className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 pt-3 pb-3 sticky top-0 z-50 shadow-md animate-fade-in">
      <div className="flex items-center justify-between">
        
        {/* Left Section: Hamburger Menu + Brand Logo (Phoenix Icon Drawing) */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenMenu}
            className="text-white hover:text-yellow-350 transition text-lg p-1"
          >
            <Menu size={20} />
          </button>
          
          <div
            onClick={handleLogoClick}
            className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center shadow-md border border-red-500/10 cursor-pointer hover:scale-105 transition"
          >
            {/* Real Phoenix Wing / Book Logo Mascot Fallback */}
            <img
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&auto=format&fit=crop"
              alt="Udan Emblem Logo"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="cursor-pointer font-sans shadow-sm" onClick={handleLogoClick}>
            <h1 className="text-sm font-black tracking-wider text-yellow-300 flex items-center gap-1">
              UDAN <span className="text-white text-[9px] font-extrabold px-1.5 py-0.5 bg-blue-800 rounded">EXAM LEAGUE</span>
            </h1>
            <p className="text-[8px] text-gray-200 font-bold uppercase tracking-wide">Gyan Aur Samriddhi Ki Nayi Udan</p>
          </div>
        </div>

        {/* Right Section: Wallet Balance + active notification pill + Profile stamp */}
        <div className="flex items-center space-x-2">
          {/* Wallet pill */}
          <button
            onClick={() => onSwitchTab('wallet')}
            className={`transition px-2.5 py-1 rounded-full flex items-center space-x-1 text-[11px] font-black border hover:scale-102 flex items-center gap-0.5 ${
              currentTab === 'wallet'
                ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                : 'bg-white/15 text-white border-white/20 hover:bg-white/25'
            }`}
          >
            <span className="text-yellow-300 text-xs">₹</span>
            <span>{walletBalance.toFixed(1)}</span>
          </button>

          {/* Active notification indicator */}
          <button
            onClick={() => onShowToast('🔔 Notification Alert: SSC CGL mock registration closing in 2 hours! Enroll ASAP.')}
            className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition"
          >
            <Bell size={18} className="text-white" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-300 rounded-full ring-2 ring-red-600 animate-pulse" />
          </button>

          {/* Circular Stamp profile link mascot */}
          <div
            onClick={() => onSwitchTab('profile')}
            className="w-8 h-8 rounded-full border border-yellow-300 overflow-hidden bg-white flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transform transition duration-150 relative"
          >
            <img
              src={profile?.avatarUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&auto=format&fit=crop"}
              alt="Books and prosperity mascot trigger"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </header>
  );
}
