#!/bin/bash
DIR="src/components/sections"

cat << 'INNER' > $DIR/Purification.tsx
import { projectData } from '../../data/content';
import { Flame, Filter, Droplet, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Purification() {
  const icons = [Flame, Filter, Droplet];
  
  return (
    <section id="purification" className="py-24 bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How Can Water Be Purified?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Affordable and effective methods for treating drinking water at the household level.</p>
        </div>
        
        <div className="space-y-12">
          {projectData.purificationMethods.map((method, i) => {
            const Icon = icons[i];
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={method.name} 
                className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row"
              >
                <div className="bg-brand-600 lg:w-1/3 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                  <Icon className="w-16 h-16 text-white mb-6 relative z-10" />
                  <h3 className="text-2xl font-bold text-white mb-2 relative z-10">{method.name}</h3>
                </div>
                
                <div className="p-8 lg:p-12 flex-1 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 mb-8">
                    {method.process.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="bg-slate-100 text-slate-700 text-sm font-medium px-4 py-2 rounded-full border border-slate-200">
                          <span className="text-brand-500 mr-2 font-bold">0{idx + 1}</span>
                          {step}
                        </div>
                        {idx < method.process.length - 1 && <ArrowRight className="w-4 h-4 text-slate-400" />}
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="font-bold text-emerald-900 mb-1">Key Benefit</h4>
                      <p className="text-emerald-800 text-sm">{method.benefits}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
INNER

cat << 'INNER' > $DIR/Storage.tsx
import { projectData } from '../../data/content';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function Storage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="storage" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Keep Purified Water Safe</h2>
            
            <div className="space-y-4">
              {projectData.storagePractices.map((practice, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-slate-700 font-medium">{practice}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="w-64 mx-auto relative cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
              {/* Lid */}
              <motion.div 
                animate={{ y: isOpen ? -40 : 0, rotate: isOpen ? -10 : 0, x: isOpen ? -20 : 0 }}
                className="w-full h-8 bg-slate-300 rounded-t-xl mb-1 border-b-4 border-slate-400 relative z-20 shadow-lg"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-slate-400 rounded-t-md"></div>
              </motion.div>
              
              {/* Container */}
              <div className="w-full h-80 bg-brand-900/10 rounded-b-3xl border-4 border-brand-900/20 relative overflow-hidden backdrop-blur-sm z-10">
                <div className="absolute bottom-0 inset-x-0 h-3/4 bg-gradient-to-t from-brand-400 to-brand-300 opacity-80"></div>
                {/* Reflections */}
                <div className="absolute top-0 right-4 bottom-0 w-8 bg-white/20 skew-x-12"></div>
              </div>
              
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow-xl shadow-slate-200 border border-slate-100 whitespace-nowrap pointer-events-none transition-opacity group-hover:opacity-100 opacity-0 lg:opacity-100">
                <span className="font-bold text-slate-800 block text-sm">Interaction</span>
                <span className="text-xs text-slate-500">Click lid to toggle</span>
              </div>
              
              {!isOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                >
                  <div className="bg-emerald-500 text-white font-bold px-4 py-2 rounded-full shadow-lg text-sm tracking-wide">
                    KEEP WATER COVERED
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
INNER
