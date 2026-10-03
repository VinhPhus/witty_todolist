import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Trophy, ShoppingBag, User } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="app-container flex flex-col relative bg-[#F8FAFC]">
      {/* Top Header / Status bar space can go here */}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 hide-scrollbar">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-4 flex justify-between items-center rounded-b-[40px] z-50">
        <NavItem to="/" icon={<Home size={24} />} />
        <NavItem to="/leaderboard" icon={<Trophy size={24} />} />
        
        {/* Floating Add Button in the middle */}
        <div className="relative -top-8">
          <button className="bg-primary hover:bg-blue-600 transition-colors text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-2xl font-light">+</span>
          </button>
        </div>

        <NavItem to="/shop" icon={<ShoppingBag size={24} />} />
        <NavItem to="/profile" icon={<User size={24} />} />
      </nav>
    </div>
  );
};

const NavItem = ({ to, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `p-2 rounded-full transition-colors ${
        isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
      }`
    }
  >
    {icon}
  </NavLink>
);

export default MainLayout;
