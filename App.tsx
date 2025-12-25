
import React, { useState } from 'react';
import { AppTab, Question } from './types';
import { INITIAL_QUESTIONS, INITIAL_ARTICLE } from './constants';
import { geminiService } from './services/geminiService';
import Header from './components/Header';
import Navigation from './components/Navigation';
import TranslationDrill from './components/TranslationDrill';
import ArticleReader from './components/ArticleReader';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('drill');
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const refreshQuestions = async () => {
    setIsRefreshing(true);
    try {
      const newQuestions = await geminiService.generateNewQuestions();
      if (newQuestions && newQuestions.length > 0) {
        setQuestions(newQuestions);
      }
    } catch (error) {
      console.error("生成题目失败", error);
      alert("AI 生成题目失败，请稍后再试。");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isFocusMode ? 'bg-slate-50' : 'bg-[#f8fafc]'}`}>
      <Header isFocusMode={isFocusMode} />
      
      <main className={`flex-grow container mx-auto px-4 pb-32 transition-all duration-700 ${isFocusMode ? 'pt-6' : 'pt-12'}`}>
        {activeTab === 'drill' ? (
          <div className="space-y-8">
            <div className={`max-w-2xl mx-auto text-center transition-all duration-500 ${isFocusMode ? 'opacity-0 h-0 scale-95 pointer-events-none' : 'opacity-100'}`}>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">每日长难句挑战</h2>
              <p className="text-slate-400 font-bold mt-2 text-sm uppercase tracking-[0.2em]">Grammar • Translation • Intelligence</p>
            </div>
            <TranslationDrill 
              questions={questions} 
              onRefresh={refreshQuestions}
              isRefreshing={isRefreshing}
              onFocusChange={setIsFocusMode}
            />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">深度背景微阅读</h2>
              <p className="text-slate-400 font-bold mt-2 text-sm uppercase tracking-[0.2em]">Reading • Context • Mastery</p>
            </div>
            <ArticleReader article={INITIAL_ARTICLE} />
          </div>
        )}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
