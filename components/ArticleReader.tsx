
import React, { useState } from 'react';
import { Article } from '../types';
import Icon from './Icon';

const ArticleReader: React.FC<{ article: Article }> = ({ article }) => {
  const [activeSentence, setActiveSentence] = useState<number | null>(null);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-2xl mx-auto animate-fade-in">
      <header className="mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">{article.title}</h2>
        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1"><Icon name="MousePointer2" size={12} /> 点击句子翻译</span>
          <span className="flex items-center gap-1"><Icon name="Highlighter" size={12} className="text-yellow-500" /> 高亮词汇重点记忆</span>
        </div>
      </header>

      <div className="space-y-2">
        {article.sentences.map((s, idx) => (
          <div key={idx} className="group">
            <div 
              onClick={() => setActiveSentence(activeSentence === idx ? null : idx)}
              className={`p-4 rounded-2xl transition-all cursor-pointer border ${
                activeSentence === idx 
                ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                : 'bg-white border-transparent hover:bg-slate-50'
              }`}
            >
              <p className="text-lg text-slate-700 leading-relaxed font-medium">
                {s.en.split(/\s+/).map((word, wIdx) => {
                  const clean = word.replace(/[.,]/g, '');
                  const keyword = s.keywords?.find(k => k.word.toLowerCase() === clean.toLowerCase());
                  return (
                    <span key={wIdx} className="inline-block mr-1">
                      {keyword ? (
                        <span 
                          className="bg-yellow-200 text-slate-800 px-1 rounded-sm border-b-2 border-yellow-400"
                          title={keyword.mean}
                        >
                          {word}
                        </span>
                      ) : (
                        word
                      )}
                    </span>
                  );
                })}
              </p>
              
              {activeSentence === idx && (
                <div className="mt-4 pl-4 border-l-4 border-indigo-500 animate-fade-in">
                  <p className="text-indigo-900 font-medium text-base mb-3">{s.zh}</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); speak(s.en); }}
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-xs font-bold"
                    >
                      <Icon name="Volume2" size={14} /> 语音朗读
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleReader;
