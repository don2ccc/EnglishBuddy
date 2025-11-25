
import React from 'react';
import { BookOpen, Camera, Library, ArrowRight, BrainCircuit, Music } from 'lucide-react';
import { AppView, AppLanguage } from '../types';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
  language: AppLanguage;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, language }) => {
  const isZh = language === 'zh';

  const texts = {
    title: isZh ? "欢迎来到 English Buddy" : "Welcome to English Buddy",
    subtitle: isZh 
        ? "这是你的专属 AI 英语学习乐园。拍照、分析句子、积累生词，让英语学习变得超简单！"
        : "Your personal AI playground for English. Snap photos, analyze sentences, and collect words to make learning super easy!",
    tools: [
        {
            title: isZh ? "语法分析助手" : "Grammar & Syntax",
            desc: isZh ? "输入英语句子，AI 帮你分析语法结构和难点。" : "Deep analysis of sentence structure with AI explanations.",
            cta: isZh ? "开始分析" : "Launch Tool"
        },
        {
            title: isZh ? "拍照单词卡" : "Photo Dictionary",
            desc: isZh ? "拍一拍身边的物体，立马学会它的英语单词！" : "Snap a photo of any object to get instant definitions.",
            cta: isZh ? "打开相机" : "Open Camera"
        },
        {
            title: isZh ? "100词阅读挑战" : "100-Word Challenge",
            desc: isZh ? "AI 生成真实场景小故事，读故事答题，培养语感。" : "Read AI-generated mini-stories about real life and test your skills.",
            cta: isZh ? "开始挑战" : "Start Challenge"
        },
        {
            title: isZh ? "音标大冒险" : "Phonics Adventure",
            desc: isZh ? "点击音标听发音，还能生成滑稽的绕口令挑战哦！" : "Master IPA symbols with audio and fun AI tongue twisters.",
            cta: isZh ? "开始冒险" : "Start Adventure"
        },
        {
            title: isZh ? "我的生词本" : "Vocabulary Notebook",
            desc: isZh ? "复习你收藏的单词，见证你的每一次进步。" : "Review your saved words and track your progress.",
            cta: isZh ? "查看单词" : "View Notebook"
        }
    ]
  };

  const tools = [
    {
      id: 'grammar',
      view: AppView.TOOL_GRAMMAR,
      title: texts.tools[0].title,
      description: texts.tools[0].desc,
      icon: BookOpen,
      bg: 'bg-blue-100',
      text: 'text-blue-600',
    },
    {
      id: 'dictionary',
      view: AppView.TOOL_DICTIONARY,
      title: texts.tools[1].title,
      description: texts.tools[1].desc,
      icon: Camera,
      bg: 'bg-pink-100',
      text: 'text-pink-600',
    },
    {
      id: 'reading',
      view: AppView.TOOL_READING,
      title: texts.tools[2].title,
      description: texts.tools[2].desc,
      icon: BrainCircuit,
      bg: 'bg-purple-100',
      text: 'text-purple-600',
    },
    {
      id: 'phonics',
      view: AppView.TOOL_PHONICS,
      title: texts.tools[3].title,
      description: texts.tools[3].desc,
      icon: Music,
      bg: 'bg-teal-100',
      text: 'text-teal-600',
    },
    {
      id: 'vocab',
      view: AppView.TOOL_VOCAB,
      title: texts.tools[4].title,
      description: texts.tools[4].desc,
      icon: Library,
      bg: 'bg-amber-100',
      text: 'text-amber-600',
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 tracking-tight">{texts.title}</h1>
        <p className="text-xl text-text-muted max-w-3xl leading-relaxed">
          {texts.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool, idx) => (
          <div 
            key={tool.id}
            onClick={() => onNavigate(tool.view)}
            className="group bg-surface rounded-[2rem] p-8 border-2 border-transparent hover:border-primary/20 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1"
          >
            <div className={`w-16 h-16 rounded-2xl ${tool.bg} ${tool.text} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-inner`}>
              <tool.icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-text-main mb-3">{tool.title}</h3>
            <p className="text-text-muted mb-8 leading-relaxed text-sm h-16">
              {tool.description}
            </p>
            <div className="flex items-center text-primary font-bold group-hover:translate-x-2 transition-transform text-sm">
              {texts.tools[idx].cta} <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
