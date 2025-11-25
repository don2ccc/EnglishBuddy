import React, { useState } from 'react';
import { Settings, LogOut, LayoutGrid } from 'lucide-react';
import { User, AppView } from '../types';

interface NavBarProps {
  user: User;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ user, onNavigate, onLogout, onOpenSettings }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-surface border-b border-gray-100/10 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 py-3">
          {/* Brand Logo */}
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate(AppView.DASHBOARD)}>
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-md transform group-hover:rotate-6 transition-all duration-300">
                 <span className="text-2xl">🦄</span>
              </div>
              <div className="flex flex-col">
                  <span className="text-xl font-black text-primary tracking-tight leading-none">
                    English Buddy
                  </span>
                  <span className="text-xs font-bold text-text-muted opacity-70">
                    英语好伙伴
                  </span>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenSettings}
              className="p-2 rounded-full text-text-muted hover:bg-background hover:text-primary transition-colors"
              title="Settings"
            >
              <Settings className="h-6 w-6" />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-background border-2 border-transparent hover:border-gray-100 transition-all"
              >
                 <div className="h-9 w-9 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold border border-secondary/20">
                   {user.name.charAt(0).toUpperCase()}
                 </div>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-xl py-2 ring-1 ring-black ring-opacity-5 animate-fade-in border border-gray-100 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-sm font-bold text-text-main">{user.name}</p>
                    <p className="text-xs text-text-muted capitalize">{user.settings.theme} Theme</p>
                  </div>
                  <button
                    onClick={() => { setIsMenuOpen(false); onNavigate(AppView.DASHBOARD); }}
                    className="flex w-full items-center px-4 py-2 text-sm text-text-muted hover:bg-background hover:text-primary font-medium"
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); onLogout(); }}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;