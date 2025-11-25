import React from 'react';
import { VocabItem } from '../types';
import { Volume2, Trash2, Calendar } from 'lucide-react';

interface VocabularyToolProps {
  words: VocabItem[];
  onDelete: (id: string) => void;
}

const VocabularyTool: React.FC<VocabularyToolProps> = ({ words, onDelete }) => {
  
  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (words.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-slate-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-slate-300" />
        </div>
        <h2 className="text-2xl font-medium text-slate-900">No words saved yet</h2>
        <p className="text-slate-500 mt-2">Use the Photo Dictionary or Grammar tools to save new words.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-medium text-slate-900">Vocabulary Notebook</h2>
        <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full font-medium text-sm">
            {words.length} Words
        </span>
      </div>

      <div className="grid gap-4">
        {words.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between group">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-serif text-slate-900">{item.word}</h3>
                <span className="text-sm text-slate-400 font-mono">/{item.phonetic}/</span>
                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase font-bold">{item.partOfSpeech}</span>
                <button 
                  onClick={() => playAudio(item.word)}
                  className="p-1.5 rounded-full bg-blue-50 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-slate-600 mb-1">{item.translation} <span className="text-slate-300 mx-2">|</span> <span className="text-slate-500">{item.meaning}</span></p>
              <p className="text-sm text-slate-400 italic">"{item.exampleSentence}"</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center gap-4 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 md:pl-6 md:border-l md:border-slate-100">
               <div className="text-right hidden md:block">
                   <p className="text-xs text-slate-400">Added</p>
                   <p className="text-sm text-slate-600">{new Date(item.dateAdded).toLocaleDateString()}</p>
               </div>
               <button 
                onClick={() => onDelete(item.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto"
               >
                   <Trash2 className="w-5 h-5" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VocabularyTool;
