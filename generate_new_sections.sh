#!/bin/bash
DIR="src/components/sections"

cat << 'INNER' > $DIR/Environment.tsx
import { projectData } from '../../data/content';
import { Leaf, Trash2, Droplet, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Environment() {
  return (
    <section id="environment" className="py-24 bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Environmental Cleanliness</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Protecting our water sources starts with maintaining a clean and healthy environment.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            {projectData.environmentalCleanliness.map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
              >
                <div className="mt-1 bg-emerald-100 p-2 rounded-lg text-emerald-600 shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <p className="text-slate-700 font-medium">{item}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="relative p-8 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
            <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Community Impact</h3>
            <div className="flex flex-col gap-6 relative">
              <div className="flex items-center gap-6 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <Trash2 className="w-10 h-10 text-rose-500 shrink-0" />
                <div>
                  <div className="font-bold text-rose-900 mb-1">BEFORE</div>
                  <div className="text-sm text-rose-800">Unclean surroundings and stagnant water lead to contamination.</div>
                </div>
              </div>
              
              <div className="absolute left-9 top-1/2 -translate-y-1/2 flex flex-col items-center">
                <ArrowRight className="w-5 h-5 text-slate-400 rotate-90 my-2" />
              </div>
              
              <div className="flex items-center gap-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 mt-2">
                <Droplet className="w-10 h-10 text-emerald-500 shrink-0" />
                <div>
                  <div className="font-bold text-emerald-900 mb-1">AFTER</div>
                  <div className="text-sm text-emerald-800">Cleaner environment ensures safe water and a healthy community.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
INNER

cat << 'INNER' > $DIR/ProjectActivities.tsx
import { projectData } from '../../data/content';
import { motion } from 'framer-motion';

export function ProjectActivities() {
  return (
    <section id="activities" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Project Activity Timeline</h2>
          <p className="text-slate-600">The structured approach taken during the community service project.</p>
        </div>
        
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {projectData.projectActivities.map((act, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={act.title} 
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-brand-500 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="text-xs font-bold">{i + 1}</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xs font-bold text-brand-600 mb-1">{act.phase}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{act.title}</h3>
                <p className="text-sm text-slate-600">{act.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
INNER
