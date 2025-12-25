
import React from 'react';
import { AppTab } from '../types';
import Icon from './Icon';

interface NavigationProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => (
  <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[85%] max-w-xs bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-1.5 z-40 flex justify-between">
    <button 
      onClick={() => setActiveTab('drill')}
      className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl transition-all duration-300 ${
        activeTab === 'drill' ? 'bg-white text-slate-900 shadow-xl scale-[1.02]' : 'text-slate-400 hover:text-white'
      }`}
    >
      <Icon name="Target" size={18} />
      <span className="text-[9px] font-black uppercase tracking-widest">特训</span>
    </button>
    <button 
      onClick={() => setActiveTab('article')}
      className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl transition-all duration-300 ${
        activeTab === 'article' ? 'bg-white text-slate-900 shadow-xl scale-[1.02]' : 'text-slate-400 hover:text-white'
      }`}
    >
      <Icon name="Compass" size={18} />
      <span className="text-[9px] font-black uppercase tracking-widest">阅读</span>
    </button>
  </nav>
);

export default Navigation;
