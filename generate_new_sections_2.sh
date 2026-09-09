#!/bin/bash
DIR="src/components/sections"

cat << 'INNER' > $DIR/Objectives.tsx
import { projectData } from '../../data/content';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

export function Objectives() {
  return (
    <section id="objectives" className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Project Learning Objectives</h2>
          <p className="text-slate-400">The primary goals of the community service project.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectData.objectives.map((obj, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-brand-500 transition-colors group"
            >
              <div className="w-12 h-12 bg-slate-700 text-brand-400 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-700 mb-4">0{i + 1}</div>
              <p className="text-slate-300 font-medium">{obj}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
INNER

cat << 'INNER' > $DIR/TakeAction.tsx
import { projectData } from '../../data/content';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';

export function TakeAction() {
  return (
    <section id="action" className="py-32 bg-brand-600 text-white relative overflow-hidden">
      {/* Decorative background ripples */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/20 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <Droplets className="w-16 h-16 text-brand-200 mx-auto mb-8" />
        <h2 className="text-4xl md:text-5xl font-bold mb-8">START WITH ONE DROP</h2>
        
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {["PURIFY WATER", "KEEP IT CLEAN", "KEEP IT COVERED", "PRACTICE HYGIENE", "PROTECT WATER SOURCES", "KEEP SURROUNDINGS CLEAN", "SHARE AWARENESS"].map((action, i) => (
            <motion.div 
              whileHover={{ scale: 1.05 }}
              key={i} 
              className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 font-bold tracking-wide hover:bg-white hover:text-brand-700 transition-colors cursor-pointer"
            >
              {action}
            </motion.div>
          ))}
        </div>
        
        <div className="bg-slate-900 text-white p-12 rounded-3xl shadow-2xl">
          <h3 className="text-3xl font-bold mb-4">SAFE WATER STARTS WITH SAFE PRACTICES.</h3>
          <p className="text-brand-400 font-bold text-xl mb-8 tracking-widest uppercase">Every Drop Matters.</p>
          <a href="#home" className="inline-block px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-brand-50 transition-colors">
            EXPLORE AGAIN
          </a>
        </div>
      </div>
    </section>
  );
}
INNER
