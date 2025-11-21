import React, { useRef, useState } from 'react';
import { AnalysisResult } from '../types';
import { Languages, GraduationCap, MessageCircle, Award, FileText, FileDown, Loader2, Quote } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface AnalysisResultsProps {
  data: AnalysisResult;
  originalText: string;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data, originalText }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadTxt = () => {
    const { chineseTranslation, difficultyLevel, encouragement, grammarAnalysis, keyPhrases } = data;
    
    let content = `English Buddy 学习报告\n`;
    content += `====================================\n\n`;
    content += `[英语原文]\n${originalText}\n\n`;
    content += `[难度等级]: ${difficultyLevel}\n`;
    content += `[AI 老师寄语]: ${encouragement}\n\n`;
    content += `====================================\n`;
    content += `[中文翻译]:\n${chineseTranslation}\n\n`;
    content += `====================================\n`;
    
    content += `[语法小讲堂]:\n`;
    if (grammarAnalysis.length === 0) content += `(无特殊语法点)\n`;
    grammarAnalysis.forEach((g, i) => {
        content += `${i+1}. ${g.rule}\n   解释: ${g.explanation}\n   例句: ${g.example}\n\n`;
    });
    
    content += `====================================\n`;
    content += `[重点短语与单词]:\n`;
    if (keyPhrases.length === 0) content += `(无生僻短语)\n`;
    keyPhrases.forEach((p, i) => {
        content += `${i+1}. ${p.original} - ${p.translation}\n   解释: ${p.explanation}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'english-buddy-analysis.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;
    
    try {
      setIsGeneratingPdf(true);
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, // Higher scale for better resolution
        backgroundColor: '#ffffff', // Force white background for the PDF
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('english-buddy-analysis.pdf');
    } catch (error) {
      console.error("PDF Generation failed", error);
      alert("生成 PDF 失败，请重试");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 pb-20">
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mb-4 px-4 md:px-0">
        <button 
          onClick={handleDownloadTxt}
          className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-sm shadow-sm"
        >
          <FileText className="w-4 h-4" />
          <span>保存文本</span>
        </button>
        <button 
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 border-2 border-indigo-600 text-white rounded-xl hover:bg-indigo-600 transition-all font-bold text-sm shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
          <span>{isGeneratingPdf ? '生成中...' : '保存为 PDF'}</span>
        </button>
      </div>

      {/* Printable Content Wrapper */}
      <div ref={contentRef} className="space-y-8 p-6 md:p-8 bg-white/40 backdrop-blur-sm rounded-[3rem] border border-white/50 shadow-xl">
        
        {/* Encouragement & Difficulty Badge */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 p-6 rounded-3xl border-2 border-white shadow-sm">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Award className="w-8 h-8 text-orange-400" />
            </div>
            <p className="text-lg text-indigo-800 font-bold">{data.encouragement}</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-sm">
            <span className="text-sm font-bold text-slate-500">难度等级:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-black ${
              data.difficultyLevel === 'Beginner' ? 'bg-green-100 text-green-600' :
              data.difficultyLevel === 'Intermediate' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {data.difficultyLevel}
            </span>
          </div>
        </div>

        {/* Original Text Card */}
        <div className="group relative bg-white rounded-3xl p-8 shadow-lg border-b-4 border-indigo-100">
          <div className="absolute -top-5 left-8">
            <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-xl shadow-md transform rotate-1">
              <Quote className="w-5 h-5" />
              <span className="font-bold">英语原文</span>
            </div>
          </div>
          <p className="mt-4 text-2xl font-serif font-medium text-slate-800 leading-relaxed italic">
            "{originalText}"
          </p>
        </div>

        {/* Translation Card */}
        <div className="group relative bg-white rounded-3xl p-8 shadow-lg border-b-4 border-blue-100">
          <div className="absolute -top-5 left-8">
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl shadow-md transform -rotate-1">
              <Languages className="w-5 h-5" />
              <span className="font-bold">中文翻译</span>
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold text-slate-700 leading-relaxed">
            {data.chineseTranslation}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Grammar Analysis */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border-b-4 border-purple-100 relative">
             <div className="absolute -top-5 left-8">
              <div className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-xl shadow-md transform rotate-1">
                <GraduationCap className="w-5 h-5" />
                <span className="font-bold">语法小讲堂</span>
              </div>
            </div>
            
            <div className="mt-4 space-y-6">
              {data.grammarAnalysis.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-purple-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-purple-200 text-purple-700 rounded-full text-xs font-black">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-purple-800">{item.rule}</h3>
                  </div>
                  <p className="text-slate-600 mb-2">{item.explanation}</p>
                  <div className="text-sm text-purple-600 bg-white/60 p-2 rounded-lg italic border border-purple-100">
                    "{item.example}"
                  </div>
                </div>
              ))}
               {data.grammarAnalysis.length === 0 && (
                 <p className="text-slate-400 text-center italic">这句话语法很简单哦！</p>
               )}
            </div>
          </div>

          {/* Vocabulary & Phrases */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border-b-4 border-green-100 relative">
             <div className="absolute -top-5 left-8">
              <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-md transform -rotate-1">
                <MessageCircle className="w-5 h-5" />
                <span className="font-bold">短语和单词</span>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {data.keyPhrases.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-4 rounded-2xl bg-emerald-50">
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-emerald-400"></div>
                  <div>
                    <h4 className="font-black text-emerald-800 text-lg">{item.original}</h4>
                    <p className="text-emerald-600 font-bold text-sm mb-1">{item.translation}</p>
                    <p className="text-slate-600 text-sm leading-snug">{item.explanation}</p>
                  </div>
                </div>
              ))}
               {data.keyPhrases.length === 0 && (
                 <p className="text-slate-400 text-center italic">没有发现特别难的短语，真棒！</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;