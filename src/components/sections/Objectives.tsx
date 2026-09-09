import { projectData } from '../../data/content';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

export function Objectives() {
  return (
    <section id="objectives" className="py-24 bg-transparent text-white">
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
              <div className="w-12 h-12 bg-slate-700 text-brand-400 rounded-full flex items-center justify-center mb-6 group-hover:bg-transparent0 group-hover:text-white transition-colors">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-200 mb-4">0{i + 1}</div>
              <p className="text-slate-300 font-medium">{obj}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
