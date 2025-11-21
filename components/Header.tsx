import React from 'react';
import { BookOpen, Star } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-10 flex flex-col items-center justify-center text-center space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Decorative background blobs */}
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-yellow-200 rounded-full blur-2xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-pink-200 rounded-full blur-2xl opacity-60 animate-pulse delay-700"></div>

        <div className="flex items-center justify-center space-x-4 md:space-x-6 z-10">
          <div className="hidden md:block p-3 md:p-4 bg-white border-4 border-brand-yellow rounded-2xl shadow-[4px_4px_0px_0px_rgba(249,248,113,1)] transform -rotate-12 hover:rotate-0 transition-transform duration-300">
            <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-sm transform -rotate-2 hover:scale-105 transition-transform duration-300 cursor-default select-none pb-2">
            English Buddy
          </h1>
          
          <div className="hidden md:block p-3 md:p-4 bg-white border-4 border-brand-pink rounded-2xl shadow-[4px_4px_0px_0px_rgba(255,154,158,1)] transform rotate-12 hover:rotate-0 transition-transform duration-300">
            <Star className="w-8 h-8 md:w-10 md:h-10 text-brand-yellow fill-brand-yellow" />
          </div>
        </div>
      </div>
      
      <div className="bg-white/60 backdrop-blur-sm px-6 py-2 rounded-full border border-indigo-100 shadow-sm">
        <p className="text-indigo-500 font-bold text-lg md:text-xl tracking-wide">
          你的 AI 英语私教，让学习更有趣！ 🚀
        </p>
      </div>
    </header>
  );
};

export default Header;