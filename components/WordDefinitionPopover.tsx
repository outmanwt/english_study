
import React from 'react';
import { WordDefinition } from '../types';
import Icon from './Icon';

interface WordDefinitionPopoverProps {
  word: string;
  definition: WordDefinition | null;
  loading: boolean;
  onClose: () => void;
  onSpeak: (text: string) => void;
}

const WordDefinitionPopover: React.FC<WordDefinitionPopoverProps> = ({
  word,
  definition,
  loading,
  onClose,
  onSpeak
}) => {
  if (!loading && !definition) return null;

  return (
    <div className="mt-4 z-20 flex justify-center animate-fade-in">
      <div className="bg-slate-800 text-white text-sm px-5 py-4 rounded-2xl shadow-2xl flex flex-col gap-2 max-w-sm w-full border border-slate-700">
        {loading ? (
          <div className="flex items-center gap-3 justify-center py-4">
            <Icon name="Sparkles" size={18} className="text-indigo-400 animate-pulse" />
            <span className="font-medium">AI 正在深度解析语义...</span>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-yellow-400 text-xl">{word}</span>
                <span className="text-slate-400 font-mono text-xs">{definition?.ipa}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onSpeak(word)} 
                  className="p-1.5 rounded-full hover:bg-slate-700 text-indigo-300 transition-colors"
                >
                  <Icon name="Volume2" size={18} />
                </button>
                <button 
                  onClick={onClose} 
                  className="p-1.5 rounded-full hover:bg-slate-700 text-slate-500 transition-colors"
                >
                  <Icon name="X" size={18} />
                </button>
              </div>
            </div>
            
            <div className="border-t border-slate-700 pt-3 mt-1 space-y-3">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">词典释义</div>
                <div className="text-slate-200 leading-relaxed text-sm">{definition?.def}</div>
              </div>
              
              <div className="bg-indigo-950/50 border border-indigo-500/30 rounded-xl p-3">
                <div className="text-[10px] uppercase font-bold text-indigo-400 mb-1 tracking-wider">当前语境建议翻译</div>
                <div className="font-bold text-yellow-300 text-lg">{definition?.trans}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WordDefinitionPopover;
