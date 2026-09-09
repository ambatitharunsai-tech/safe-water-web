#!/bin/bash
DIR="src/components/sections"

cat << 'INNER' > $DIR/Quiz.tsx
import { useState } from 'react';

const questions = [
  { q: "What is a major cause of unsafe water?", options: ["Boiling water", "Open drains near sources", "Storing in clean containers"], a: 1 },
  { q: "Which disease is water-borne?", options: ["Cholera", "Diabetes", "Asthma"], a: 0 },
  { q: "How should you store drinking water?", options: ["In open buckets", "In clean, covered containers", "Directly from the tap"], a: 1 },
  { q: "What does boiling do?", options: ["Makes water cold", "Kills bacteria", "Adds vitamins"], a: 1 }
];

export function Quiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (idx: number) => {
    if (idx === questions[current].a) setScore(s => s + 1);
    
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <section id="quiz" className="py-24 bg-brand-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
          {!showResult ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Quick Quiz: Question {current + 1} of {questions.length}</h2>
              <h3 className="text-xl text-slate-700 mb-8">{questions[current].q}</h3>
              <div className="space-y-4">
                {questions[current].options.map((opt, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleAnswer(i)}
                    className="w-full p-4 rounded-xl border-2 border-slate-100 hover:border-brand-500 hover:bg-brand-50 font-semibold text-slate-700 transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Quiz Complete!</h2>
              <div className="text-6xl font-black text-brand-600 mb-8">{score} / {questions.length}</div>
              <p className="text-slate-600 mb-8">Great job testing your knowledge on safe drinking water.</p>
              <button 
                onClick={() => { setCurrent(0); setScore(0); setShowResult(false); }}
                className="px-8 py-3 bg-brand-600 text-white font-bold rounded-full hover:bg-brand-700 transition-colors"
              >
                TRY AGAIN
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
INNER
