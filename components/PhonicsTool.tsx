
import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Wand2, Music, Mic } from 'lucide-react';
import { generateTongueTwister } from '../services/aiService';
import { UserSettings, TongueTwisterResult } from '../types';

interface PhonicsToolProps {
  settings: UserSettings;
}

// Data: IPA Symbols
const VOWELS = [
  { symbol: 'i:', word: 'sheep' }, { symbol: 'ɪ', word: 'ship' },
  { symbol: 'e', word: 'bed' }, { symbol: 'æ', word: 'cat' },
  { symbol: 'ɑ:', word: 'car' }, { symbol: 'ɒ', word: 'pot' },
  { symbol: 'ɔ:', word: 'door' }, { symbol: 'ʊ', word: 'good' },
  { symbol: 'u:', word: 'food' }, { symbol: 'ʌ', word: 'cup' },
  { symbol: 'ɜ:', word: 'bird' }, { symbol: 'ə', word: 'teacher' },
  { symbol: 'eɪ', word: 'cake' }, { symbol: 'aɪ', word: 'bike' },
  { symbol: 'ɔɪ', word: 'boy' }, { symbol: 'əʊ', word: 'rose' },
  { symbol: 'aʊ', word: 'cow' }, { symbol: 'ɪə', word: 'ear' },
  { symbol: 'eə', word: 'hair' }, { symbol: 'ʊə', word: 'tour' }
];

const CONSONANTS = [
  { symbol: 'p', word: 'pen' }, { symbol: 'b', word: 'bee' },
  { symbol: 't', word: 'tea' }, { symbol: 'd', word: 'dog' },
  { symbol: 'k', word: 'cat' }, { symbol: 'g', word: 'go' },
  { symbol: 'f', word: 'fish' }, { symbol: 'v', word: 'van' },
  { symbol: 'θ', word: 'think' }, { symbol: 'ð', word: 'this' },
  { symbol: 's', word: 'sun' }, { symbol: 'z', word: 'zoo' },
  { symbol: 'ʃ', word: 'she' }, { symbol: 'ʒ', word: 'vision' },
  { symbol: 'h', word: 'hat' }, { symbol: 'm', word: 'man' },
  { symbol: 'n', word: 'no' }, { symbol: 'ŋ', word: 'sing' },
  { symbol: 'tʃ', word: 'chips' }, { symbol: 'dʒ', word: 'job' },
  { symbol: 'l', word: 'leg' }, { symbol: 'r', word: 'red' },
  { symbol: 'j', word: 'yes' }, { symbol: 'w', word: 'we' }
];

const PhonicsTool: React.FC<PhonicsToolProps> = ({ settings }) => {
  const [tab, setTab] = useState<'vowels' | 'consonants'>('vowels');
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [sampleWord, setSampleWord] = useState<string | null>(null);
  const [twisterData, setTwisterData] = useState<TongueTwisterResult | null>(null);
  const [loading, setLoading] = useState(false);

  const activeSet = tab === 'vowels' ? VOWELS : CONSONANTS;

  // Initialize voices on mount to ensure they are ready when clicked
  useEffect(() => {
    const initVoices = () => {
      window.speechSynthesis.getVoices();
    };
    initVoices();
    window.speechSynthesis.onvoiceschanged = initVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const playAudio = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Your browser does not support text-to-speech.");
      return;
    }

    // Cancel any currently playing speech to avoid overlap
    window.speechSynthesis.cancel();

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8; // Slow down slightly for clarity

      const voices = window.speechSynthesis.getVoices();
      
      // Try to find a British English voice (RP is good for phonics)
      // Fallback to any English voice, then default
      const preferredVoice = voices.find(v => v.lang === 'en-GB' || v.name.includes('Google UK')) ||
                             voices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    };

    // Handle Chrome's async voice loading
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        speak();
        // Remove listener to prevent multiple triggers
        window.speechSynthesis.onvoiceschanged = null; 
      };
    } else {
      speak();
    }
  };

  const handleSelectSound = (symbol: string, word: string) => {
    setSelectedSound(symbol);
    setSampleWord(word);
    setTwisterData(null); // Reset previous result
    playAudio(word);
  };

  const handleGenerateChallenge = async () => {
    if (!selectedSound) return;
    setLoading(true);
    try {
      const res = await generateTongueTwister(selectedSound, settings);
      setTwisterData(res);
    } catch (e) {
      console.error(e);
      alert("Oops, AI needs a break. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="text-center mb-10">
         <h1 className="text-4xl font-black text-primary mb-2 flex items-center justify-center gap-3">
             <Music className="w-10 h-10 text-accent" /> 
             Phonics Adventure
         </h1>
         <p className="text-text-muted">Click a sound to hear it, then ask AI for a challenge!</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Panel: Sound Board */}
        <div className="lg:w-2/3">
           {/* Tabs */}
           <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
               <button 
                  onClick={() => { setTab('vowels'); setSelectedSound(null); }}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${tab === 'vowels' ? 'bg-white shadow-sm text-pink-600' : 'text-slate-400 hover:text-slate-600'}`}
               >
                   Vowels (元音)
               </button>
               <button 
                  onClick={() => { setTab('consonants'); setSelectedSound(null); }}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${tab === 'consonants' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
               >
                   Consonants (辅音)
               </button>
           </div>

           {/* Grid */}
           <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
               {activeSet.map((item) => (
                   <button
                      key={item.symbol}
                      onClick={() => handleSelectSound(item.symbol, item.word)}
                      className={`
                        relative group flex flex-col items-center justify-center aspect-square rounded-2xl border-2 transition-all transform active:scale-95
                        ${selectedSound === item.symbol 
                            ? (tab === 'vowels' ? 'bg-pink-100 border-pink-500 scale-105 shadow-lg' : 'bg-blue-100 border-blue-500 scale-105 shadow-lg')
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'}
                      `}
                   >
                       <span className={`text-2xl font-serif font-bold ${selectedSound === item.symbol ? 'text-slate-900' : 'text-slate-700'}`}>
                           {item.symbol}
                       </span>
                       <span className="text-xs text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           {item.word}
                       </span>
                   </button>
               ))}
           </div>
        </div>

        {/* Right Panel: Interaction Area */}
        <div className="lg:w-1/3 space-y-6">
            
            {/* 1. Selected Sound Detail */}
            <div className={`p-6 rounded-3xl border-2 transition-all ${selectedSound ? 'bg-surface border-primary/20 shadow-xl' : 'bg-slate-50 border-transparent'}`}>
                {selectedSound ? (
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-inner mb-4">
                            <span className="text-4xl font-serif font-bold text-primary">{selectedSound}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-text-main mb-1 capitalize">{sampleWord}</h3>
                        <button 
                            onClick={() => sampleWord && playAudio(sampleWord)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-bold hover:bg-primary/20 transition-colors mb-6"
                        >
                            <Volume2 className="w-4 h-4" /> Listen
                        </button>
                        
                        <div className="pt-6 border-t border-gray-100">
                             <button
                                onClick={handleGenerateChallenge}
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-accent to-orange-400 text-white rounded-xl font-bold shadow-lg hover:shadow-orange-200 transition-all flex items-center justify-center gap-2"
                             >
                                 {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                                 {loading ? 'Creating...' : 'Create Tongue Twister'}
                             </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                        <Mic className="w-12 h-12 mb-4 opacity-50" />
                        <p>Select a sound to start!</p>
                    </div>
                )}
            </div>

            {/* 2. AI Tongue Twister Result */}
            {twisterData && (
                <div className="bg-white rounded-3xl p-6 shadow-2xl border-2 border-accent/30 animate-fade-in-up relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Music className="w-24 h-24 text-accent" />
                    </div>
                    
                    <span className="inline-block px-3 py-1 bg-accent/20 text-accent-dark rounded-full text-xs font-bold uppercase mb-4">
                        {twisterData.challengeLevel} Challenge
                    </span>
                    
                    <p className="text-xl font-bold text-slate-800 mb-4 leading-relaxed font-serif relative z-10">
                        "{twisterData.tongueTwister}"
                    </p>
                    
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <button 
                            onClick={() => playAudio(twisterData.tongueTwister)}
                            className="p-3 bg-accent text-white rounded-full shadow-lg hover:bg-orange-500 transition-colors"
                        >
                            <Volume2 className="w-6 h-6" />
                        </button>
                        <p className="text-sm text-slate-500">{twisterData.chineseTranslation}</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl text-sm relative z-10">
                        <span className="font-bold text-slate-700">💡 Tip: </span>
                        <span className="text-slate-600">{twisterData.funFact}</span>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PhonicsTool;
