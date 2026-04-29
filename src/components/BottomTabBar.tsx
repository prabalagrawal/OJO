import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Heart, 
  User, 
  LayoutGrid
} from 'lucide-react';
import { motion } from 'motion/react';

export function BottomTabBar() {
  const location = useLocation();

  const tabs = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: null, label: 'Categories', path: '/categories', isCenter: true },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
    { icon: User, label: 'Account', path: '/account' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-[100] bg-[#111111] border-t border-ojo-gold/20 pb-safe lg:hidden">
      <div className="flex items-center justify-around h-16 px-2 relative">
        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;

          if (tab.isCenter) {
            return (
              <div key={i} className="relative -top-6">
                <NavLink
                  to={tab.path}
                   className={({ isActive }) => `
                    w-14 h-14 rounded-full bg-ojo-gold flex items-center justify-center shadow-lg border-4 border-[#111111] transition-transform active:scale-95
                    ${isActive ? 'text-ojo-charcoal' : 'text-ojo-charcoal'}
                  `}
                >
                  <LayoutGrid size={24} />
                </NavLink>
              </div>
            );
          }

          return (
            <NavLink
              key={i}
              to={tab.path}
              className={({ isActive }) => `
                flex flex-col items-center justify-center gap-1 w-full relative
                ${isActive ? 'text-ojo-gold' : 'text-ojo-stone/60'}
              `}
            >
              {Icon && <Icon size={20} weight={isActive ? "fill" : "bold"} />}
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="bottomTabDot"
                  className="absolute -bottom-1 w-1 h-1 bg-ojo-gold rounded-full"
                />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
