#!/bin/bash
DIR="src/components/sections"

cat << 'INNER' > $DIR/About.tsx
import { Info, HeartPulse, Droplets, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function About() {
  const features = [
    { num: '01', title: 'WHAT IS SAFE WATER?', desc: 'Water free from contamination, bacteria, and harmful chemicals, safe for drinking and daily use.', icon: Droplets },
    { num: '02', title: 'WHY WATER MATTERS', desc: 'It is a basic human need, and ensuring its safety is everyone’s responsibility.', icon: Info },
    { num: '03', title: 'WATER AND HEALTH', desc: 'Safe water prevents diseases like cholera and typhoid, keeping the body healthy.', icon: HeartPulse },
    { num: '04', title: 'WATER AND HYGIENE', desc: 'Clean water is the foundation of both domestic and personal hygiene.', icon: ShieldCheck }
  ];

  return (
    <section id="about" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Understanding Safe Drinking Water</h2>
          <p className="text-slate-600 text-lg">Clean water and good hygiene are not luxuries — they are the foundation of life, health, and progress.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={f.num} 
              className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/50 transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-brand-500 group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-brand-500 mb-2">{f.num}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-600 text-sm mb-6">{f.desc}</p>
              <a href="#health" className="text-brand-600 text-sm font-semibold hover:text-brand-700 flex items-center gap-1">
                Learn More →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
INNER

cat << 'INNER' > $DIR/WaterSources.tsx
import { projectData } from '../../data/content';
import { Droplet, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function WaterSources() {
  return (
    <section id="sources" className="py-24 bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Common Water Sources</h2>
          <p className="text-slate-600">The primary sources of water identified in the community survey.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {projectData.waterSources.map((source, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={source.name} 
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="w-14 h-14 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mb-6">
                <Droplet className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{source.name}</h3>
              <p className="text-slate-600 text-sm mb-8">{source.description}</p>
              
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-orange-800 mb-1">POTENTIAL CONCERN</div>
                    <div className="text-sm text-orange-700">{source.concern}</div>
                  </div>
                </div>
                
                <div className="bg-emerald-50 rounded-xl p-4 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-emerald-800 mb-1">SAFE PRACTICE</div>
                    <div className="text-sm text-emerald-700">{source.practice}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
INNER
