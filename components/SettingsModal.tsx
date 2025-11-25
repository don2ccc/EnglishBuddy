import React from 'react';
import { X, Save } from 'lucide-react';
import { UserSettings, AIProvider } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = React.useState<UserSettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-medium text-slate-900">Settings</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">AI Provider</label>
            <div className="grid grid-cols-2 gap-3">
              {(['gemini', 'deepseek', 'doubao', 'openai'] as AIProvider[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setLocalSettings({ ...localSettings, provider: p })}
                  className={`px-4 py-3 rounded-xl text-sm font-medium capitalize transition-all border ${
                    localSettings.provider === p
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">Model Name</label>
             <input 
                type="text"
                value={localSettings.modelName || ''}
                onChange={(e) => setLocalSettings({...localSettings, modelName: e.target.value})}
                placeholder="e.g. gemini-2.5-flash"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
             />
             <p className="text-xs text-slate-400 mt-1">Specific model ID for the chosen provider.</p>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">Custom API Base URL</label>
             <input 
                type="text"
                value={localSettings.baseUrl || ''}
                onChange={(e) => setLocalSettings({...localSettings, baseUrl: e.target.value})}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
             />
             <p className="text-xs text-slate-400 mt-1">Use this for proxy services (e.g. in China).</p>
          </div>

           <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">API Key</label>
             <input 
                type="password"
                value={localSettings.apiKey || ''}
                onChange={(e) => setLocalSettings({...localSettings, apiKey: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
             />
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex justify-end">
          <button 
            onClick={() => { onSave(localSettings); onClose(); }}
            className="flex items-center px-6 py-2.5 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
