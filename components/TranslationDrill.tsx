
import React, { useState, useEffect, useCallback } from 'react';
import { Question, InputMode, WordDefinition, AiFeedback } from '../types';
import { geminiService } from '../services/geminiService';
import Icon from './Icon';
import Loading from './Loading';
import WordDefinitionPopover from './WordDefinitionPopover';
import { marked } from 'marked';

interface TranslationDrillProps {
  questions: Question[];
  onRefresh: () => void;
  isRefreshing: boolean;
  onFocusChange?: (focused: boolean) => void;
}

const TranslationDrill: React.FC<TranslationDrillProps> = ({ questions, onRefresh, isRefreshing, onFocusChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputMode, setInputMode] = useState<InputMode>('puzzle');
  const [shuffledParts, setShuffledParts] = useState<string[]>([]);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [userTyping, setUserTyping] = useState('');
  
  const [isCorrect, setIsCorrect] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AiFeedback | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordDef, setWordDef] = useState<WordDefinition | null>(null);
  const [isLoadingDef, setIsLoadingDef] = useState(false);
  
  const [deepAnalysis, setDeepAnalysis] = useState<string | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const current = questions[currentIndex];

  const resetState = useCallback(() => {
    if (!current) return;
    setShuffledParts([...current.zh_parts].sort(() => Math.random() - 0.5));
    setSelectedParts([]);
    setUserTyping('');
    setIsCorrect(false);
    setShowOptions(false);
    setAiFeedback(null);
    setDeepAnalysis(null);
    setSelectedWord(null);
    setWordDef(null);
    onFocusChange?.(false);
  }, [current, onFocusChange]);

  useEffect(() => {
    resetState();
  }, [currentIndex, questions, resetState]);

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  const handleWordClick = async (word: string) => {
    onFocusChange?.(true);
    const cleanWord = word.replace(/[.,!?;:"'()]/g, "");
    if (!cleanWord || !current) return;
    
    setSelectedWord(cleanWord);
    setIsLoadingDef(true);
    setWordDef(null);
    try {
      const def = await geminiService.lookupWord(cleanWord, current.en, current.zh);
      setWordDef(def);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingDef(false);
    }
  };

  const handleGrade = async () => {
    if (!userTyping.trim()) return;
    setIsGrading(true);
    try {
      const feedback = await geminiService.gradeTranslation(current.en, current.zh, userTyping);
      setAiFeedback(feedback);
      if (feedback.score >= 80) setIsCorrect(true);
    } catch (e) {
      alert("评分服务暂不可用");
    } finally {
      setIsGrading(false);
    }
  };

  const handleDeepAnalysis = async () => {
    setIsLoadingAnalysis(true);
    try {
      const analysis = await geminiService.generateDeepAnalysis(current.en);
      setDeepAnalysis(analysis);
    } catch (e) {
      setDeepAnalysis("分析生成失败。");
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const checkPuzzle = () => {
    const userAnswer = selectedParts.join("");
    const target = current.zh.replace(/[。，,.]/g, '');
    const userClean = userAnswer.replace(/[。，,.]/g, '');
    if (userClean === target) {
      setIsCorrect(true);
      speak(current.en);
    } else {
      alert("顺序有误，再检查一下？");
    }
  };

  const handlePartSelect = (part: string, index: number) => {
    onFocusChange?.(true);
    const newShuffled = [...shuffledParts];
    newShuffled.splice(index, 1);
    setShuffledParts(newShuffled);
    setSelectedParts([...selectedParts, part]);
  };

  const handlePartRemove = (part: string, index: number) => {
    const newSelected = [...selectedParts];
    newSelected.splice(index, 1);
    setSelectedParts(newSelected);
    setShuffledParts([...shuffledParts, part]);
  };

  if (isRefreshing) return <Loading text="正在智能生成考研精品新题..." />;
  if (!current) return null;

  return (
    <div className="max-w-3xl mx-auto px-2">
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden animate-fade-in relative">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-50">
          <div 
            className="h-full bg-indigo-500 transition-all duration-1000" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Minimal Tool Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-center text-slate-400">
           <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
            {current.difficulty} · Q{currentIndex + 1}
           </span>
           <button onClick={onRefresh} className="hover:text-indigo-600 transition-colors p-1">
             <Icon name="RefreshCw" size={14} />
           </button>
        </div>

        <div className="px-8 pb-10">
          {/* Source Text Area */}
          <div className="text-center mb-10">
            <div className="inline-flex flex-wrap justify-center items-center gap-y-2">
              {current.en.split(/\s+/).map((word, i) => {
                const clean = word.replace(/[.,!?;:"'()]/g, "");
                const isSelected = selectedWord === clean;
                return (
                  <span 
                    key={i} 
                    onClick={() => handleWordClick(word)}
                    className={`mx-1 cursor-pointer transition-all duration-300 text-2xl font-semibold px-2 py-0.5 rounded-xl ${
                      isSelected 
                      ? 'bg-indigo-600 text-white shadow-xl scale-110' 
                      : 'text-slate-800 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
              <button onClick={() => speak(current.en)} className="p-2 ml-2 text-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                <Icon name="Volume2" size={24} />
              </button>
            </div>

            <WordDefinitionPopover 
              word={selectedWord || ""} 
              definition={wordDef} 
              loading={isLoadingDef} 
              onClose={() => { setSelectedWord(null); setWordDef(null); onFocusChange?.(false); }}
              onSpeak={speak}
            />
          </div>

          {/* Interaction Mode Switcher - Only show if not correct */}
          {!isCorrect && aiFeedback === null && (
            <div className="flex justify-center mb-8">
              <div className="bg-slate-100/50 p-1 rounded-2xl flex gap-1">
                <button 
                  onClick={() => setInputMode('puzzle')}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${inputMode === 'puzzle' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                >
                  拼图挑战
                </button>
                <button 
                  onClick={() => setInputMode('typing')}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${inputMode === 'typing' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                >
                  手写翻译
                </button>
              </div>
            </div>
          )}

          {/* Core Interaction Space */}
          <div className="min-h-[160px]">
            {inputMode === 'puzzle' ? (
              <div className="space-y-8">
                <div className={`p-6 min-h-[100px] rounded-[1.5rem] border-2 transition-all duration-500 flex flex-wrap gap-3 justify-center items-center ${
                  isCorrect ? 'bg-green-50/50 border-green-200' : 'bg-slate-50/30 border-dashed border-slate-200'
                }`}>
                  {selectedParts.length === 0 && !isCorrect && <span className="text-slate-300 text-sm font-medium">请按语序选择中文词块</span>}
                  {selectedParts.map((p, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => !isCorrect && handlePartRemove(p, idx)}
                      className={`px-5 py-2.5 rounded-xl shadow-sm text-sm font-bold transition-all transform hover:scale-105 active:scale-95 ${
                        isCorrect ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {!isCorrect && (
                  <div className="flex flex-wrap gap-2.5 justify-center">
                    {!showOptions ? (
                      <button 
                        onClick={() => { setShowOptions(true); onFocusChange?.(true); }}
                        className="w-full max-w-sm py-10 bg-white border-2 border-dashed border-slate-100 rounded-[1.5rem] text-slate-300 font-bold hover:border-indigo-100 hover:text-indigo-400 hover:bg-indigo-50/10 transition-all flex flex-col items-center gap-4 group"
                      >
                        <Icon name="BrainCircuit" size={40} className="group-hover:scale-110 transition-transform text-slate-200 group-hover:text-indigo-200" />
                        <span className="text-sm tracking-widest uppercase">激活选项</span>
                      </button>
                    ) : (
                      shuffledParts.map((p, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => handlePartSelect(p, idx)}
                          className="bg-white border border-slate-100 px-5 py-2.5 rounded-xl shadow-sm text-slate-600 text-sm font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all active:scale-95"
                        >
                          {p}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <textarea 
                  value={userTyping}
                  onChange={(e) => { setUserTyping(e.target.value); onFocusChange?.(true); }}
                  disabled={isCorrect}
                  className="w-full p-6 rounded-[1.5rem] border-2 border-slate-50 bg-slate-50/50 focus:bg-white focus:border-indigo-400 outline-none transition-all resize-none text-slate-800 placeholder-slate-300 font-semibold text-lg"
                  placeholder="开始你的译文..."
                  rows={3}
                />
                {aiFeedback && (
                  <div className={`p-6 rounded-[1.5rem] border-l-8 animate-fade-in ${aiFeedback.score >= 80 ? 'bg-green-50/80 border-green-500' : 'bg-orange-50/80 border-orange-500'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-xl">AI 诊断: {aiFeedback.score}</span>
                      {aiFeedback.score >= 80 ? <Icon name="Zap" className="text-green-500" /> : <Icon name="Info" className="text-orange-500" />}
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">{aiFeedback.comment}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="mt-10">
            {!isCorrect && aiFeedback === null ? (
              <button 
                disabled={inputMode === 'puzzle' ? (shuffledParts.length > 0 || !showOptions) : (!userTyping.trim() || isGrading)}
                onClick={inputMode === 'puzzle' ? checkPuzzle : handleGrade}
                className={`w-full py-5 rounded-2xl font-black text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all duration-300 ${
                  (inputMode === 'puzzle' && shuffledParts.length === 0 && showOptions) || (inputMode === 'typing' && userTyping.trim() && !isGrading)
                  ? 'bg-indigo-600 text-white shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:scale-[1.02] active:scale-95' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                {isGrading ? <Icon name="Loader2" className="animate-spin" /> : <Icon name="Send" size={18} />}
                {isGrading ? "AI 深度判卷中..." : "提交解析"}
              </button>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-indigo-50/50 rounded-[1.5rem] p-6 border border-indigo-100">
                   <h5 className="flex items-center gap-2 text-indigo-900 font-black text-xs uppercase tracking-widest mb-4">
                     <Icon name="Search" size={14} /> 核心语法点
                   </h5>
                   <p className="text-slate-700 font-medium leading-relaxed">{current.analysis}</p>
                </div>

                {deepAnalysis ? (
                  <div className="bg-white rounded-[1.5rem] p-8 prose prose-indigo max-w-none border border-slate-100 shadow-sm animate-fade-in">
                     <div dangerouslySetInnerHTML={{ __html: marked.parse(deepAnalysis) }} />
                  </div>
                ) : (
                  <button 
                    onClick={handleDeepAnalysis}
                    className="w-full py-4 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2"
                  >
                    {isLoadingAnalysis ? <Icon name="Loader2" className="animate-spin" /> : <Icon name="Sparkles" size={16} />}
                    {isLoadingAnalysis ? "生成深度报告..." : "获取 AI 深度语法报告"}
                  </button>
                )}

                <div className="flex justify-center pt-4">
                  <button 
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % questions.length)}
                    className="px-12 py-4 bg-green-500 text-white rounded-full font-black text-sm tracking-widest uppercase hover:bg-green-600 shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                  >
                    下一题 <Icon name="ChevronRight" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationDrill;
