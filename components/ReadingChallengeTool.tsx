import React, { useState, useEffect, useRef } from 'react';
import { generateReadingChallenge } from '../services/aiService';
import { UserSettings, ReadingChallengeResult, AppState } from '../types';
import { BookOpen, RefreshCw, CheckCircle2, XCircle, HelpCircle, Loader2, BookmarkPlus } from 'lucide-react';

interface ReadingChallengeToolProps {
  settings: UserSettings;
  onSaveWord: (text: string) => Promise<void>;
}

interface SelectionPopup {
    text: string;
    x: number;
    y: number;
}

const ReadingChallengeTool: React.FC<ReadingChallengeToolProps> = ({ settings, onSaveWord }) => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [data, setData] = useState<ReadingChallengeResult | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  
  // Tooltip Logic States
  const containerRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<SelectionPopup | null>(null);
  const [isSavingSelection, setIsSavingSelection] = useState(false);

  useEffect(() => {
    loadNewStory();
  }, []);

  // --- Tooltip Logic (Shared) ---
  useEffect(() => {
    const handleSelection = () => {
      if (isSavingSelection) return;

      const selectedText = window.getSelection()?.toString().trim();
      
      if (selectedText && selectedText.length > 0 && selectedText.length < 50) {
        const selectionRange = window.getSelection()?.getRangeAt(0);
        
        if (selectionRange && containerRef.current) {
          const rect = selectionRange.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();

          const x = rect.left + (rect.width / 2) - containerRect.left;
          const y = rect.top - containerRect.top - 8; 
          
          setSelection({ text: selectedText, x, y });
        }
      } else {
        setSelection(null);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, [isSavingSelection]);

  const handleSelectionSave = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!selection) return;

    setIsSavingSelection(true);
    await onSaveWord(selection.text);
    setIsSavingSelection(false);
    setSelection(null);
    window.getSelection()?.removeAllRanges(); 
  };
  // -----------------------------

  const loadNewStory = async () => {
    setState(AppState.LOADING);
    setData(null);
    setSelectedAnswers({});
    setShowResults(false);
    
    try {
      const result = await generateReadingChallenge(settings);
      setData(result);
      setState(AppState.SUCCESS);
    } catch (e) {
      console.error(e);
      setState(AppState.ERROR);
    }
  };

  const handleOptionSelect = (questionId: number, optionId: string) => {
    if (showResults) return; // Locked after submit
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const checkAnswers = () => {
    setShowResults(true);
  };

  const getScore = () => {
    if (!data) return 0;
    let correct = 0;
    data.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctOptionId) correct++;
    });
    return correct;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {state === AppState.LOADING && (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-xl font-bold text-primary">Writing a story for you...</p>
          <p className="text-text-muted">Creating a real-world scenario.</p>
        </div>
      )}

      {state === AppState.ERROR && (
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">Oops! Could not generate a story.</p>
          <button onClick={loadNewStory} className="px-6 py-2 bg-primary text-white rounded-lg">Try Again</button>
        </div>
      )}

      {state === AppState.SUCCESS && data && (
        <div className="animate-fade-in space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="inline-block px-3 py-1 bg-accent/20 text-accent-dark rounded-full text-xs font-bold uppercase mb-2">
                {data.topic}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-primary">{data.title}</h1>
            </div>
            <button 
              onClick={loadNewStory}
              className="flex items-center gap-2 px-4 py-2 bg-surface border border-gray-200 rounded-full text-sm font-bold text-text-muted hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>New Story</span>
            </button>
          </div>

          {/* Story Card */}
          <div ref={containerRef} className="relative bg-surface rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-100">
             {/* Selection Tooltip */}
            {selection && (
                <div 
                    className="absolute z-50 transform -translate-x-1/2 -translate-y-full"
                    style={{ left: selection.x, top: selection.y }}
                >
                    <button
                        onClick={handleSelectionSave}
                        disabled={isSavingSelection}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full shadow-xl hover:bg-slate-800 transition-all text-sm font-medium"
                    >
                        {isSavingSelection ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookmarkPlus className="w-4 h-4 text-accent" />}
                        <span>Save "{selection.text.length > 15 ? selection.text.substring(0,12) + '...' : selection.text}"</span>
                    </button>
                    <div className="w-3 h-3 bg-slate-900 rotate-45 absolute left-1/2 -bottom-1 -translate-x-1/2 -z-10"></div>
                </div>
            )}

            <div className="prose prose-lg max-w-none">
              <p className="text-xl md:text-2xl leading-relaxed text-text-main font-serif selection:bg-primary/20 selection:text-primary-dark">
                {data.content}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100">
               <details className="group">
                  <summary className="cursor-pointer text-sm font-bold text-text-muted flex items-center gap-2 hover:text-primary transition-colors">
                     <HelpCircle className="w-4 h-4" /> Need help with translation?
                  </summary>
                  <p className="mt-4 text-lg text-gray-600 bg-gray-50 p-4 rounded-xl leading-relaxed">
                    {data.chineseTranslation}
                  </p>
               </details>
            </div>
          </div>

          {/* Quiz Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
               <BookOpen className="w-6 h-6" /> 
               Reading Challenge
            </h2>
            
            <div className="grid gap-6">
              {data.questions.map((q, index) => {
                 const isCorrect = showResults && selectedAnswers[q.id] === q.correctOptionId;
                 const isWrong = showResults && selectedAnswers[q.id] !== q.correctOptionId && selectedAnswers[q.id] !== undefined;
                 
                 return (
                  <div key={q.id} className={`bg-surface p-6 rounded-2xl border-2 transition-all ${
                      showResults 
                        ? (isCorrect ? 'border-green-200 bg-green-50' : isWrong ? 'border-red-200 bg-red-50' : 'border-gray-100')
                        : 'border-white shadow-md hover:border-blue-100'
                  }`}>
                    <h3 className="font-bold text-lg text-text-main mb-4">
                      <span className="inline-block w-8 h-8 rounded-full bg-primary/10 text-primary text-center leading-8 mr-2 text-sm">{index + 1}</span>
                      {q.question}
                    </h3>
                    
                    <div className="space-y-3 pl-10">
                      {q.options.map((opt) => {
                         const isSelected = selectedAnswers[q.id] === opt.id;
                         const isThisCorrect = showResults && q.correctOptionId === opt.id;
                         
                         let btnClass = "border-gray-200 bg-white text-gray-600 hover:bg-gray-50";
                         
                         if (showResults) {
                            if (isThisCorrect) btnClass = "border-green-500 bg-green-100 text-green-800 font-bold";
                            else if (isSelected && !isThisCorrect) btnClass = "border-red-400 bg-red-100 text-red-800";
                            else btnClass = "border-gray-200 bg-gray-50 text-gray-400 opacity-60";
                         } else {
                            if (isSelected) btnClass = "border-primary bg-primary/10 text-primary font-bold shadow-sm";
                         }

                         return (
                          <button
                            key={opt.id}
                            onClick={() => handleOptionSelect(q.id, opt.id)}
                            disabled={showResults}
                            className={`w-full text-left px-5 py-3 rounded-xl border-2 transition-all flex justify-between items-center ${btnClass}`}
                          >
                            <span>{opt.text}</span>
                            {showResults && isThisCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                            {showResults && isSelected && !isThisCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                          </button>
                         );
                      })}
                    </div>

                    {showResults && (
                      <div className="mt-4 ml-10 p-4 bg-white/60 rounded-xl text-sm text-gray-600 border border-gray-100/50">
                        <span className="font-bold text-primary mr-1">Explanation:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                 );
              })}
            </div>
            
            {!showResults ? (
               <div className="flex justify-end pt-4">
                  <button 
                    onClick={checkAnswers}
                    disabled={Object.keys(selectedAnswers).length < data.questions.length}
                    className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg shadow-lg hover:bg-primary-hover hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                  >
                    Check Answers
                  </button>
               </div>
            ) : (
                <div className="flex flex-col items-center justify-center pt-8 pb-12 animate-fade-in-up">
                    <p className="text-2xl font-black text-text-main mb-4">
                        You got {getScore()} out of {data.questions.length} correct!
                        {getScore() === data.questions.length && " 🎉 Amazing!"}
                    </p>
                    <button 
                        onClick={loadNewStory}
                        className="px-8 py-3 bg-secondary text-white rounded-full font-bold shadow-lg hover:bg-gray-600 transition-all"
                    >
                        Try Another Story
                    </button>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingChallengeTool;