
import React from 'react';
import Icon from './Icon';

const Loading: React.FC<{ text?: string }> = ({ text = "加载中..." }) => (
  <div className="flex flex-col items-center justify-center p-8 space-y-3 animate-pulse">
    <Icon name="Loader2" size={32} className="text-indigo-600 animate-spin" />
    <span className="text-slate-500 font-medium text-sm">{text}</span>
  </div>
);

export default Loading;
