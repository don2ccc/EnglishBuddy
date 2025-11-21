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
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border-4 border-indigo-50 p-2">
      <form onSubmit={handleSubmit} className="relative group">
        <textarea
          className="w-full h-40 p-6 rounded-2xl text-lg text-slate-700 placeholder-slate-400 bg-indigo-50/30 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none resize-none"
          placeholder="在这里输入你想学习的英语句子... (Try typing: The quick brown fox jumps over the lazy dog.)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
        
        <div className="absolute bottom-4 right-4">
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-white shadow-md transition-all transform
              ${!text.trim() || isLoading 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 hover:shadow-xl active:scale-95'}
            `}
          >
            {isLoading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>思考中...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>开始分析</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputArea;