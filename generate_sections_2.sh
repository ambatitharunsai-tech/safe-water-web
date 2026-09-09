#!/bin/bash
DIR="src/components/sections"

cat << 'INNER' > $DIR/Contamination.tsx
import { projectData } from '../../data/content';
import { AlertCircle, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

export function Contamination() {
  return (
    <section id="contamination" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Water Becomes Unsafe</h2>
          <p className="text-slate-400">Contamination sources identified during community research.</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="grid sm:grid-cols-2 gap-4">
              {projectData.contaminationCauses.map((cause, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 flex gap-4 items-start"
                >
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">{cause}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="relative flex flex-col items-center justify-center p-8 bg-slate-800/30 rounded-3xl border border-slate-700/50">
            {['SOURCE', 'CONTAMINATION', 'UNSAFE WATER', 'HEALTH RISK'].map((step, i, arr) => (
              <div key={step} className="flex flex-col items-center">
                <div className="px-6 py-3 bg-slate-800 border border-slate-600 rounded-lg text-sm font-bold tracking-widest text-slate-200">
                  {step}
                </div>
                {i < arr.length - 1 && (
                  <ArrowDown className="w-6 h-6 text-slate-500 my-4 animate-bounce" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
INNER

cat << 'INNER' > $DIR/Health.tsx
import { projectData } from '../../data/content';
import { ShieldAlert, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export function Health() {
  return (
    <section id="health" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Health Risks of Unsafe Water</h2>
          <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 px-4 py-2 rounded-full text-sm">
            <Info className="w-4 h-4" />
            <span>This section presents educational information from the project source.</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {projectData.healthRisks.map((risk, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={risk.disease} 
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50"
            >
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{risk.disease}</h3>
              <p className="text-slate-600 mb-6">{risk.explanation}</p>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs font-bold text-slate-500 mb-2">PREVENTION</div>
                <div className="text-sm font-medium text-slate-800">{risk.prevention}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
INNER
