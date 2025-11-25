import React, { useState } from 'react';
import { ArrowRight, Sparkles, Languages, Check } from 'lucide-react';
import { User, AIProvider, AppTheme, AppLanguage } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  initialTheme?: AppTheme;
  initialLang?: AppLanguage;
}

const Login: React.FC<LoginProps> = ({ onLogin, initialTheme = 'classic', initialLang = 'zh' }) => {
  const [apiKey, setApiKey] = useState('');
  const [name, setName] = useState('');
  const [theme, setTheme] = useState<AppTheme>(initialTheme);
  const [language, setLanguage] = useState<AppLanguage>(initialLang);
  
  // Attempt to auto-fill from environment variable
  React.useEffect(() => {
    if (process.env.API_KEY) {
      setApiKey(process.env.API_KEY);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    onLogin({
      name,
      avatar: '',
      settings: {
        apiKey: apiKey || process.env.API_KEY || '',
        provider: 'gemini',
        modelName: 'gemini-2.5-flash',
        baseUrl: process.env.GEMINI_API_BASE_URL,
        theme: theme,
        language: language
      }
    });
  };

  const isZh = language === 'zh';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500
      ${theme === 'candy' ? 'bg-[#fffbeb] font-fun' : theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-blue-50'}`}>
      
      {/* Brand Header */}
      <div className="text-center mb-10">
        <div className={`mx-auto h-20 w-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl transform rotate-3 transition-all
          ${theme === 'candy' ? 'bg-pink-500' : theme === 'dark' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
           <span className="text-4xl">🦄</span>
        </div>
        <h1 className={`text-5xl font-black tracking-tight mb-2
           ${theme === 'candy' ? 'text-pink-600' : theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          English Buddy
        </h1>
        <p className={`text-xl ${theme === 'dark' ? 'text-slate-400' : theme === 'candy' ? 'text-purple-600' : 'text-slate-500'}`}>
          {isZh ? "你的 AI 英语学习好伙伴" : "Your AI English Learning Companion"}
        </p>
      </div>
      
      <div className={`max-w-md w-full rounded-3xl shadow-2xl overflow-hidden
         ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white/80 backdrop-blur-xl border border-white/50'}`}>
        
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Name Input */}
            <div>
              <label htmlFor="name" className={`block text-sm font-bold mb-2 ml-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                {isZh ? "你叫什么名字？" : "What's your name?"}
              </label>
              <input
                id="name"
                type="text"
                required
                className={`w-full px-5 py-4 rounded-xl border-2 outline-none transition-all font-bold text-lg
                  ${theme === 'dark' 
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-indigo-500' 
                    : theme === 'candy' 
                      ? 'bg-yellow-50 border-yellow-200 text-purple-900 focus:border-pink-400 placeholder-purple-300' 
                      : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'}`}
                placeholder={isZh ? "输入你的昵称..." : "Enter your nickname..."}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Language Toggle */}
            <div className="flex bg-slate-100/50 p-1.5 rounded-xl border border-black/5">
                <button
                    type="button"
                    onClick={() => setLanguage('zh')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${language === 'zh' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    中文
                </button>
                <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${language === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    English
                </button>
            </div>

            {/* Theme Selection */}
            <div>
              <label className={`block text-sm font-bold mb-3 ml-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                {isZh ? "选择你喜欢的风格" : "Pick your style"}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {/* Classic Option */}
                <button
                  type="button"
                  onClick={() => setTheme('classic')}
                  className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group
                    ${theme === 'classic' 
                      ? 'border-blue-500 bg-blue-50' 
                      : theme === 'dark' ? 'border-slate-600 bg-slate-700 opacity-60' : 'border-slate-200 bg-white hover:border-blue-300'}`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 shadow-sm"></div>
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    {isZh ? "经典蓝" : "Classic"}
                  </span>
                  {theme === 'classic' && <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5"><Check className="w-3 h-3" /></div>}
                </button>

                {/* Candy Option */}
                <button
                  type="button"
                  onClick={() => setTheme('candy')}
                  className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group
                    ${theme === 'candy' 
                      ? 'border-pink-500 bg-pink-50' 
                      : theme === 'dark' ? 'border-slate-600 bg-slate-700 opacity-60' : 'border-slate-200 bg-white hover:border-pink-300'}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 shadow-sm"></div>
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    {isZh ? "糖果色" : "Candy"}
                  </span>
                   {theme === 'candy' && <div className="absolute top-1 right-1 bg-pink-500 text-white rounded-full p-0.5"><Check className="w-3 h-3" /></div>}
                </button>

                {/* Dark Option */}
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group
                    ${theme === 'dark' 
                      ? 'border-indigo-500 bg-slate-700' 
                      : 'border-slate-200 bg-white hover:border-indigo-300'}`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 shadow-sm"></div>
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                     {isZh ? "深邃黑" : "Dark"}
                  </span>
                   {theme === 'dark' && <div className="absolute top-1 right-1 bg-indigo-500 text-white rounded-full p-0.5"><Check className="w-3 h-3" /></div>}
                </button>
              </div>
            </div>

            {/* Optional API Key Input */}
            <div>
               <details className="group">
                  <summary className={`text-xs font-medium cursor-pointer list-none flex items-center gap-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                     <span>{isZh ? "我有自己的 API Key (可选)" : "I have my own API Key (Optional)"}</span>
                  </summary>
                  <input
                    type="password"
                    className={`mt-2 w-full px-4 py-2 rounded-lg border text-sm outline-none
                     ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
               </details>
            </div>

            <button
              type="submit"
              className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2
                ${theme === 'candy' 
                  ? 'bg-gradient-to-r from-pink-500 to-orange-400 hover:shadow-pink-200' 
                  : theme === 'dark'
                    ? 'bg-indigo-600 hover:bg-indigo-500'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'}`}
            >
              <Sparkles className="w-5 h-5" />
              {isZh ? "开始学习之旅！" : "Start Learning!"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;