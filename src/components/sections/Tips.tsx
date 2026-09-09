import { projectData } from '../../data/content';
import { Check, Trash2, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function Tips() {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('safe-water-tips');
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const toggleTip = (tip: string) => {
    setCompleted(prev => {
      const updated = prev.includes(tip) ? prev.filter(t => t !== tip) : [...prev, tip];
      localStorage.setItem('safe-water-tips', JSON.stringify(updated));
      return updated;
    });
  };

  const progress = Math.round((completed.length / projectData.tips.length) * 100);

  return (
    <section id="tips" className="py-24 bg-transparent text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Household Checklist</h2>
          <p className="text-slate-400 mb-8">Track your safe water practices. Your progress is saved locally.</p>
          
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 max-w-md mx-auto mb-12 shadow-xl">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Safety Score</span>
              <span className="text-3xl font-black text-brand-400">{progress}%</span>
            </div>
            <div className="h-3 w-full bg-transparent rounded-full overflow-hidden border border-slate-700">
              <motion.div 
                className="h-full bg-transparent0"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {projectData.tips.map((tip, i) => {
            const isDone = completed.includes(tip);
            return (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleTip(tip)}
                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${isDone ? 'bg-brand-900/40 border-brand-500 text-brand-100' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isDone ? 'bg-brand-500 border-brand-400 text-white' : 'bg-slate-900 border-slate-600'}`}>
                  {isDone && <Check className="w-5 h-5" />}
                </div>
                <span className="font-medium text-sm md:text-base">{tip}</span>
              </motion.div>
            );
          })}
        </div>
        
        {completed.length > 0 && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => { setCompleted([]); localStorage.removeItem('safe-water-tips'); }}
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear Progress
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
