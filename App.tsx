
import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SettingsModal from './components/SettingsModal';
import InputArea from './components/InputArea';
import AnalysisResults from './components/AnalysisResults';
import PhotoDictionaryTool from './components/PhotoDictionaryTool';
import VocabularyTool from './components/VocabularyTool';
import ReadingChallengeTool from './components/ReadingChallengeTool';
import PhonicsTool from './components/PhonicsTool';
import { AnalysisResult, AppState, User, AppView, UserSettings, DictionaryResult, VocabItem, AppTheme, AppLanguage } from './types';
import { analyzeText, lookupWord } from './services/aiService';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

// --- Theme Configurations ---
const themes: Record<AppTheme, React.CSSProperties> = {
  classic: {
    '--color-primary': '#2563eb',       // Blue 600
    '--color-primary-hover': '#1d4ed8', // Blue 700
    '--color-secondary': '#64748b',     // Slate 500
    '--color-accent': '#f59e0b',        // Amber 500
    '--color-bg': '#f8fafc',            // Slate 50
    '--color-surface': '#ffffff',       // White
    '--color-text-main': '#0f172a',     // Slate 900
    '--color-text-muted': '#64748b',    // Slate 500
  } as React.CSSProperties,
  candy: {
    '--color-primary': '#ec4899',       // Pink 500
    '--color-primary-hover': '#db2777', // Pink 600
    '--color-secondary': '#8b5cf6',     // Violet 500
    '--color-accent': '#facc15',        // Yellow 400
    '--color-bg': '#fffbeb',            // Amber 50 (Warm Cream)
    '--color-surface': '#ffffff',       // White
    '--color-text-main': '#4c1d95',     // Violet 900
    '--color-text-muted': '#86198f',    // Magenta 700
  } as React.CSSProperties,
  dark: {
    '--color-primary': '#818cf8',       // Indigo 400
    '--color-primary-hover': '#6366f1', // Indigo 500
    '--color-secondary': '#94a3b8',     // Slate 400
    '--color-accent': '#38bdf8',        // Sky 400
    '--color-bg': '#0f172a',            // Slate 900
    '--color-surface': '#1e293b',       // Slate 800
    '--color-text-main': '#f1f5f9',     // Slate 100
    '--color-text-muted': '#94a3b8',    // Slate 400
  } as React.CSSProperties,
};

const App: React.FC = () => {
  // --- State ---
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Grammar Tool State
  const [grammarState, setGrammarState] = useState<AppState>(AppState.IDLE);
  const [grammarData, setGrammarData] = useState<AnalysisResult | null>(null);
  const [grammarInput, setGrammarInput] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- Theme Effect ---
  useEffect(() => {
    const themeToApply = user?.settings.theme || 'classic';
    const themeVariables = themes[themeToApply];
    
    const root = document.documentElement;
    Object.entries(themeVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value as string);
    });

    // Handle Font for Candy Theme
    if (themeToApply === 'candy') {
       document.body.classList.add('font-fun');
    } else {
       document.body.classList.remove('font-fun');
    }
  }, [user?.settings.theme]);

  // --- Effects ---
  useEffect(() => {
    const savedVocab = localStorage.getItem('english_labs_vocab');
    if (savedVocab) {
        try {
            setVocabList(JSON.parse(savedVocab));
        } catch (e) { console.error("Failed to load vocab", e) }
    }
  }, []);

  useEffect(() => {
     if (vocabList.length > 0) {
         localStorage.setItem('english_labs_vocab', JSON.stringify(vocabList));
     }
  }, [vocabList]);

  // --- Handlers ---

  const handleLogin = (u: User) => {
    setUser(u);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.LOGIN);
    setGrammarData(null);
    setGrammarState(AppState.IDLE);
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    if (user) {
      setUser({ ...user, settings: newSettings });
    }
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    setErrorMsg(null);
  };

  // Tool: Grammar Analysis
  const handleAnalyzeGrammar = async (text: string) => {
    if (!user) return;
    setGrammarState(AppState.LOADING);
    setErrorMsg(null);
    setGrammarData(null);
    setGrammarInput(text);

    try {
      const result = await analyzeText(text, user.settings);
      setGrammarData(result);
      setGrammarState(AppState.SUCCESS);
    } catch (err) {
      console.error(err);
      setGrammarState(AppState.ERROR);
      setErrorMsg(user.settings.language === 'zh' ? "分析失败，请检查网络或设置。" : "Analysis failed. Please check your settings or network.");
    }
  };

  // Tool: Save Word
  const handleSaveWord = (word: DictionaryResult) => {
      const newItem: VocabItem = {
          ...word,
          id: Date.now().toString(),
          dateAdded: Date.now()
      };
      setVocabList(prev => [newItem, ...prev]);
      
      // Show Toast
      setToastMessage(`Saved: ${word.word}`);
      setTimeout(() => setToastMessage(null), 3000);
  };

  // Tool: Smart Save
  const handleSmartSave = async (text: string) => {
      if (!user) return;
      try {
          const detail = await lookupWord(text, user.settings);
          handleSaveWord(detail);
      } catch (e) {
          console.error("Smart save failed", e);
          setToastMessage(user.settings.language === 'zh' ? "无法查询详情" : "Look up failed");
          setTimeout(() => setToastMessage(null), 3000);
      }
  };

  const handleDeleteWord = (id: string) => {
      setVocabList(prev => prev.filter(w => w.id !== id));
  };

  // --- Render ---

  if (!user || currentView === AppView.LOGIN) {
    return <Login onLogin={handleLogin} initialTheme={'classic'} initialLang={'zh'} />;
  }

  const lang = user.settings.language;
  const isZh = lang === 'zh';

  return (
    <div className="min-h-screen bg-background font-sans text-text-main transition-colors duration-300">
      <NavBar 
        user={user} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Global Toast */}
      {toastMessage && (
          <div className="fixed top-24 right-4 z-[100] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl animate-fade-in-up flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
              <span className="font-bold text-sm">{toastMessage}</span>
          </div>
      )}

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={user.settings}
        onSave={handleUpdateSettings}
      />

      <main className="animate-fade-in pb-12">
        {/* Dashboard */}
        {currentView === AppView.DASHBOARD && (
          <Dashboard onNavigate={handleNavigate} language={user.settings.language} />
        )}

        {/* Grammar Tool Wrapper */}
        {currentView === AppView.TOOL_GRAMMAR && (
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center mb-8">
                <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="mr-4 p-2 hover:bg-surface rounded-full transition-colors text-text-muted hover:text-primary">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-primary">{isZh ? "语法分析助手" : "Grammar & Syntax Analyzer"}</h2>
            </div>
            
            <InputArea 
              onAnalyze={handleAnalyzeGrammar} 
              isLoading={grammarState === AppState.LOADING} 
            />

            {grammarState === AppState.ERROR && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <p className="font-medium">{errorMsg}</p>
              </div>
            )}

            {grammarState === AppState.SUCCESS && grammarData && (
              <AnalysisResults 
                data={grammarData} 
                originalText={grammarInput} 
                onSaveWord={handleSmartSave}
              />
            )}
          </div>
        )}

        {/* Dictionary Tool */}
        {currentView === AppView.TOOL_DICTIONARY && (
             <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-center mb-2">
                    <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="mr-4 p-2 hover:bg-surface rounded-full transition-colors text-text-muted hover:text-primary">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-primary">{isZh ? "拍照单词卡" : "Photo Dictionary"}</h2>
                </div>
                <PhotoDictionaryTool settings={user.settings} onSaveWord={handleSaveWord} />
            </div>
        )}

        {/* Reading Challenge Tool */}
        {currentView === AppView.TOOL_READING && (
             <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-center mb-2">
                    <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="mr-4 p-2 hover:bg-surface rounded-full transition-colors text-text-muted hover:text-primary">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-primary">{isZh ? "100词阅读挑战" : "100-Word Challenge"}</h2>
                </div>
                <ReadingChallengeTool settings={user.settings} onSaveWord={handleSmartSave} />
            </div>
        )}

        {/* Phonics Tool (New) */}
        {currentView === AppView.TOOL_PHONICS && (
             <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center mb-2">
                    <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="mr-4 p-2 hover:bg-surface rounded-full transition-colors text-text-muted hover:text-primary">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-primary">{isZh ? "音标大冒险" : "Phonics Adventure"}</h2>
                </div>
                <PhonicsTool settings={user.settings} />
            </div>
        )}

        {/* Vocab Tool */}
        {currentView === AppView.TOOL_VOCAB && (
             <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-center mb-2">
                    <button onClick={() => setCurrentView(AppView.DASHBOARD)} className="mr-4 p-2 hover:bg-surface rounded-full transition-colors text-text-muted hover:text-primary">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-primary">{isZh ? "我的生词本" : "My Notebook"}</h2>
                </div>
                <VocabularyTool words={vocabList} onDelete={handleDeleteWord} />
            </div>
        )}

      </main>
    </div>
  );
};

export default App;
