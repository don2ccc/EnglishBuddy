import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';

interface InputAreaProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onAnalyze(text);
    }
  };

  return (
    <div className="w-full mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-shadow hover:shadow-md">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          className="w-full h-40 p-6 text-lg text-slate-800 placeholder-slate-400 focus:bg-slate-50 transition-colors outline-none resize-none font-serif leading-relaxed"
          placeholder="Enter English text here for deep structural analysis..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
        
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`
              flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-medium transition-all
              ${!text.trim() || isLoading 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'}
            `}
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputArea;
