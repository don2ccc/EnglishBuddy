import React, { useState } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import AnalysisResults from './components/AnalysisResults';
import { AnalysisResult, AppState } from './types';
import { analyzeText } from './services/geminiService';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setAppState(AppState.LOADING);
    setErrorMsg(null);
    setAnalysisData(null);
    setInputText(text);

    try {
      const result = await analyzeText(text);
      setAnalysisData(result);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg("哎呀，AI 老师有点累了，请稍后再试一次吧！(Please check your API key)");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Header />

        <main className="flex flex-col items-center">
          <InputArea 
            onAnalyze={handleAnalyze} 
            isLoading={appState === AppState.LOADING} 
          />

          {/* Error State */}
          {appState === AppState.ERROR && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3 text-red-600 animate-pulse">
              <AlertTriangle className="w-6 h-6" />
              <p className="font-bold">{errorMsg}</p>
            </div>
          )}

          {/* Success State */}
          {appState === AppState.SUCCESS && analysisData && (
            <div className="animate-fade-in-up w-full">
              <AnalysisResults data={analysisData} originalText={inputText} />
            </div>
          )}

          {/* Empty State Decoration (Only shown when idle) */}
          {appState === AppState.IDLE && (
             <div className="mt-12 grid grid-cols-3 gap-8 opacity-40 select-none pointer-events-none">
                <div className="w-24 h-24 bg-blue-200 rounded-full blur-3xl"></div>
                <div className="w-32 h-32 bg-purple-200 rounded-full blur-3xl"></div>
                <div className="w-24 h-24 bg-pink-200 rounded-full blur-3xl"></div>
             </div>
          )}
        </main>

        <footer className="w-full py-6 text-center text-slate-400 text-sm mt-auto">
          <p>Powered by Gemini • Made for Kids ❤️</p>
        </footer>
      </div>
    </div>
  );
};

export default App;