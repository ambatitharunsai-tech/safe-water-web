import { projectData } from '../../data/content';
import { Leaf, Trash2, Droplet, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Environment() {
  return (
    <section id="environment" className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Environmental Cleanliness</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">Protecting our water sources starts with maintaining a clean and healthy environment.</p>
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
                className="flex items-start gap-4 bg-transparent p-5 rounded-2xl border border-slate-100 shadow-sm"
              >
                <div className="mt-1 bg-emerald-100 p-2 rounded-lg text-emerald-600 shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <p className="text-slate-200 font-medium">{item}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="relative p-8 bg-transparent rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Community Impact</h3>
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
