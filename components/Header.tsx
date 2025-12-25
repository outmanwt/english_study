
import React from 'react';
import Icon from './Icon';

interface HeaderProps {
  isFocusMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isFocusMode }) => (
  <header className={`bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 transition-all duration-500 ${isFocusMode ? 'py-2 shadow-none' : 'py-4 shadow-sm'}`}>
    <div className="container mx-auto px-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className={`bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl text-white shadow-lg transition-all duration-500 ${isFocusMode ? 'p-1.5' : 'p-2.5'}`}>
          <Icon name="GraduationCap" size={isFocusMode ? 18 : 24} />
        </div>
        <div className="flex flex-col">
          <h1 className={`font-bold text-slate-900 leading-tight transition-all duration-500 ${isFocusMode ? 'text-base' : 'text-lg'}`}>
            考研英语特训
          </h1>
          {!isFocusMode && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Gemini 3 Enhanced</span>
            </div>
          )}
        </div>
      </div>
      
      {!isFocusMode && (
        <div className="hidden md:flex items-center gap-4 animate-fade-in">
          <div className="flex -space-x-2 overflow-hidden">
            {[1,2,3].map(i => (
              <img 
                key={i}
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white" 
                src={`https://picsum.photos/100/100?random=${i}`} 
                alt="User" 
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-slate-400">3.2k 人在线</span>
        </div>
      )}
    </div>
  </header>
);

export default Header;
