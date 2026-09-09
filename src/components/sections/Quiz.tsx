import { useState } from 'react';
import { Award, RefreshCcw, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  { q: "What is a major cause of unsafe water identified in the project?", options: ["Boiling water before use", "Open drains and sewage near sources", "Storing in clean, covered containers", "Using public taps"], a: 1 },
  { q: "Which of the following diseases is specifically water-borne?", options: ["Cholera", "Diabetes", "Asthma", "Hypertension"], a: 0 },
  { q: "How should you properly store drinking water?", options: ["In open buckets to let air in", "In clean, covered containers", "Directly from the tap without storage", "In outdoor unsealed tanks"], a: 1 },
  { q: "What does the process of boiling water achieve?", options: ["Makes water colder", "Adds essential vitamins", "Kills most bacteria and pathogens", "Removes all heavy metals"], a: 2 },
  { q: "How many households were surveyed in the project?", options: ["10", "25", "50", "100"], a: 2 }
];

export function Quiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [name, setName] = useState('');
  const [certIssued, setCertIssued] = useState(false);

  const handleAnswer = (idx: number) => {
    if (idx === questions[current].a) setScore(s => s + 1);
    
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setCurrent(0);
    setScore(0);
    setShowResult(false);
    setCertIssued(false);
    setName('');
  };

  const isPerfect = score === questions.length;

  return (
    <section id="quiz" className="py-24 bg-transparent">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-transparent rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div key="questions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="inline-block px-4 py-1 bg-brand-100 text-brand-700 font-bold text-xs rounded-full mb-6 tracking-widest">
                  QUESTION {current + 1} OF {questions.length}
                </div>
                <h3 className="text-xl md:text-2xl text-slate-100 font-bold mb-10 min-h-[4rem]">{questions[current].q}</h3>
                
                <div className="space-y-3">
                  {questions[current].options.map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleAnswer(i)}
                      className="w-full p-4 rounded-xl border-2 border-slate-100 hover:border-brand-500 hover:bg-transparent font-semibold text-slate-200 transition-all active:scale-95 text-left"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : certIssued ? (
              <motion.div key="cert" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="border-8 border-brand-100 p-8 rounded-2xl bg-transparent relative">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-50 to-white opacity-50 z-0"></div>
                <div className="relative z-10">
                  <Award className="w-20 h-20 text-brand-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-widest">Certificate of Awareness</h2>
                  <p className="text-slate-400 mb-6 font-medium">This certifies that</p>
                  <div className="text-4xl font-serif font-bold text-brand-700 border-b-2 border-brand-200 pb-2 mb-6 inline-block min-w-[250px]">{name}</div>
                  <p className="text-slate-300 max-w-md mx-auto mb-8 leading-relaxed">
                    has successfully demonstrated outstanding knowledge regarding safe drinking water practices, sanitation, and hygiene.
                  </p>
                  <div className="flex justify-between items-end mt-12 px-8">
                    <div className="border-t border-slate-300 pt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Date: {new Date().toLocaleDateString()}</div>
                    <div className="border-t border-slate-300 pt-2 text-xs font-bold text-brand-500 uppercase tracking-widest">Score: 100%</div>
                  </div>
                </div>
                <div className="mt-8 flex justify-center gap-4">
                  <button onClick={() => window.print()} className="px-6 py-2 bg-transparent text-white rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-800">
                    <Download className="w-4 h-4" /> Print / Save PDF
                  </button>
                  <button onClick={reset} className="px-6 py-2 bg-slate-100 text-slate-300 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-200">
                    <RefreshCcw className="w-4 h-4" /> Restart
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h2>
                <div className="text-7xl font-black text-brand-600 mb-6">{score} <span className="text-3xl text-slate-300">/ {questions.length}</span></div>
                
                {isPerfect ? (
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 mb-8 max-w-md mx-auto">
                    <h4 className="font-bold text-emerald-800 mb-2">Perfect Score! Claim your certificate.</h4>
                    <input 
                      type="text" 
                      placeholder="Enter your full name" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-emerald-200 mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-center"
                    />
                    <button 
                      onClick={() => name.trim() !== '' && setCertIssued(true)}
                      disabled={name.trim() === ''}
                      className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      Generate Certificate
                    </button>
                  </div>
                ) : (
                  <p className="text-slate-300 mb-8 text-lg">Great job testing your knowledge! Review the sections above and try again for a perfect score to earn your certificate.</p>
                )}
                
                {!isPerfect && (
                  <button 
                    onClick={reset}
                    className="px-8 py-3 bg-brand-600 text-white font-bold rounded-full hover:bg-brand-700 transition-colors inline-flex items-center gap-2 shadow-lg shadow-brand-500/30"
                  >
                    <RefreshCcw className="w-5 h-5" /> TRY AGAIN
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
