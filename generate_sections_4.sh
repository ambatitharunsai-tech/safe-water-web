#!/bin/bash
DIR="src/components/sections"

cat << 'INNER' > $DIR/Hygiene.tsx
import { projectData } from '../../data/content';
import { Shield, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hygiene() {
  return (
    <section id="hygiene" className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-brand-500 rounded-xl"><Shield className="w-6 h-6 text-white" /></div>
              <h2 className="text-3xl font-bold">Personal Hygiene</h2>
            </div>
            
            <div className="space-y-4">
              {projectData.personalHygiene.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-500 rounded-xl"><Home className="w-6 h-6 text-white" /></div>
              <h2 className="text-3xl font-bold">Domestic Hygiene</h2>
            </div>
            
            <div className="grid gap-4">
              {projectData.domesticHygiene.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={item.title} 
                  className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 group hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <h3 className="font-bold text-emerald-400 mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
INNER

cat << 'INNER' > $DIR/Survey.tsx
import { projectData } from '../../data/content';
import { Users, MapPin, Building, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export function Survey() {
  return (
    <section id="survey" className="py-24 bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold mb-4">
            <Target className="w-4 h-4" />
            <span>PROJECT SURVEY SAMPLE</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Community Project Findings</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Data collected from household surveys to understand existing practices.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Location', val: 'Narasaraopeta', icon: MapPin },
            { label: 'Sample Size', val: `${projectData.surveySample} Households`, icon: Users },
            { label: 'Total Pop.', val: projectData.population, icon: Users },
            { label: 'Total Households', val: projectData.households, icon: Building },
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              key={stat.label} 
              className="bg-white p-6 rounded-2xl border border-slate-100 text-center shadow-sm"
            >
              <stat.icon className="w-6 h-6 text-brand-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-900 mb-1">{stat.val}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/50 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Key Survey Finding</h3>
          <p className="text-lg text-slate-700 leading-relaxed mb-8">
            The survey found that most families depended on borewell and public tap water, with very few practicing boiling or filtration before drinking. Many were unaware of the importance of these methods and used uncovered or unclean containers for storage.
          </p>
          <div className="inline-block bg-brand-50 text-brand-700 px-6 py-3 rounded-full font-semibold border border-brand-100">
            These findings guided the community awareness activities.
          </div>
        </div>
      </div>
    </section>
  );
}
INNER
