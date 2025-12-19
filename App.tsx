
import React, { useState, useCallback, useMemo } from 'react';
import { summarizeText } from './services/geminiService';
import { SummaryConfig, SummaryLength, SummaryTone, SummaryFormat, SummaryResult } from './types';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [config, setConfig] = useState<SummaryConfig>({
    length: SummaryLength.BALANCED,
    tone: SummaryTone.PROFESSIONAL,
    format: SummaryFormat.PARAGRAPH
  });

  const wordCount = useMemo(() => {
    return inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  }, [inputText]);

  const handleSummarize = useCallback(async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }
    if (wordCount < 10) {
        setError("Text is too short to summarize effectively. Try at least 10 words.");
        return;
    }

    setIsSummarizing(true);
    setError(null);
    try {
      const summarizedContent = await summarizeText(inputText, config);
      setResult({
        content: summarizedContent,
        originalWordCount: wordCount,
        wordCount: summarizedContent.split(/\s+/).length
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSummarizing(false);
    }
  }, [inputText, config, wordCount]);

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.content);
      alert("Summary copied to clipboard!");
    }
  };

  const clearInput = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M3 12h18"/></svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Summora AI
            </h1>
          </div>
          <div className="hidden sm:block text-sm text-slate-500 font-medium">
            Powered by Gemini 3 Flash
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Settings */}
          <aside className="lg:col-span-3 space-y-6">
            <Settings config={config} onChange={setConfig} />
            
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
              <h4 className="text-sm font-bold mb-2 uppercase tracking-wide opacity-80">Quick Tips</h4>
              <ul className="text-xs space-y-2 opacity-90 leading-relaxed">
                <li>• Paste long articles or documents.</li>
                <li>• Use "Bullet Points" for quick scanning.</li>
                <li>• Academic tone is great for research.</li>
              </ul>
            </div>
          </aside>

          {/* Main Workspace */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Input Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[400px]">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="text-sm font-semibold text-slate-600">Original Text</span>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400 font-mono">{wordCount} words</span>
                    <button 
                        onClick={clearInput}
                        className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                    >
                        Clear
                    </button>
                </div>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text here (articles, reports, notes...)"
                className="flex-grow p-6 text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none text-lg leading-relaxed"
              />
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-xs text-slate-500">
                    Input limit: ~20,000 characters
                </p>
                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing || !inputText.trim()}
                  className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                    isSummarizing || !inputText.trim()
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                  }`}
                >
                  {isSummarizing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      Generate Summary
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            {/* Result Area */}
            {result && (
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-indigo-100 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                        Intelligent Summary
                      </h2>
                      <p className="text-slate-500 text-sm mt-1">Refined and condensed for clarity</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="prose prose-indigo max-w-none">
                    <div className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap selection:bg-indigo-100">
                      {result.content}
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Reduction</p>
                      <p className="text-xl font-black text-indigo-600">
                        {Math.round(((result.originalWordCount - result.wordCount) / result.originalWordCount) * 100)}%
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">New Words</p>
                      <p className="text-xl font-black text-slate-800">{result.wordCount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Reading Time</p>
                      <p className="text-xl font-black text-slate-800">
                        {Math.ceil(result.wordCount / 200)} min
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Efficiency</p>
                      <p className="text-xl font-black text-emerald-500 font-mono">High</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder if no result and not loading */}
            {!result && !isSummarizing && (
              <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-400">No summary generated yet</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">
                  Enter text above and click "Generate Summary" to see the magic happen.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-10 bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-medium">Summora AI &copy; 2025</p>
          <p className="text-xs mt-2 opacity-60">
            Powered by advanced neural networks for high-fidelity text synthesis.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
