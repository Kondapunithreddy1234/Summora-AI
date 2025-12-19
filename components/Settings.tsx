
import React from 'react';
import { SummaryConfig, SummaryLength, SummaryTone, SummaryFormat } from '../types';

interface SettingsProps {
  config: SummaryConfig;
  onChange: (newConfig: SummaryConfig) => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onChange }) => {
  const updateConfig = <K extends keyof SummaryConfig,>(key: K, value: SummaryConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Summary Length</h3>
        <div className="flex flex-wrap gap-2">
          {Object.values(SummaryLength).map((l) => (
            <button
              key={l}
              onClick={() => updateConfig('length', l)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                config.length === l
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Tone</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(SummaryTone).map((t) => (
            <button
              key={t}
              onClick={() => updateConfig('tone', t)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                config.tone === t
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Format</h3>
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          {Object.values(SummaryFormat).map((f) => (
            <button
              key={f}
              onClick={() => updateConfig('format', f)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                config.format === f
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
