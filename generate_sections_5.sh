#!/bin/bash
DIR="src/components/sections"

cat << 'INNER' > $DIR/Awareness.tsx
import { projectData } from '../../data/content';
import { Megaphone, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Awareness() {
  return (
    <section id="awareness" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Community Awareness</h2>
          <p className="text-slate-600">Educational activities conducted to promote safe water practices.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {projectData.awarenessActivities.map((act, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={act.title} 
                className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <div className="mt-1 bg-brand-100 p-2 rounded-lg text-brand-600">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{act.title}</h3>
                  <p className="text-sm text-slate-600">{act.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="bg-brand-600 rounded-3xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl font-bold mb-6">Project Outcomes</h3>
            <div className="space-y-4">
              {projectData.outcomes.map((outcome, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-200 shrink-0" />
                  <span className="font-medium">{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
INNER

cat << 'INNER' > $DIR/Tips.tsx
import { projectData } from '../../data/content';
import { Check } from 'lucide-react';

export function Tips() {
  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Simple Ways To Protect Water</h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          {projectData.tips.map((tip, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-800 px-5 py-3 rounded-full border border-slate-700 hover:border-brand-500 hover:bg-slate-700 transition-colors cursor-pointer group">
              <Check className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-slate-300 group-hover:text-white transition-colors">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
INNER

cat << 'INNER' > $DIR/Footer.tsx
import { Droplet } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-white">
          <Droplet className="w-6 h-6 text-brand-500 fill-brand-500" />
          <span className="font-bold text-xl tracking-tight">SAFE WATER</span>
        </div>
        
        <div className="text-sm text-center md:text-left">
          Based on the Community Service Project Report on Awareness of Safe Drinking Water.<br/>
          Narasaraopeta Engineering College.
        </div>
        
        <div className="text-sm font-medium">
          © {new Date().getFullYear()} Safe Drinking Water Awareness Project
        </div>
      </div>
    </footer>
  );
}
INNER
