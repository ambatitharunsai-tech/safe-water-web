import { projectData } from '../../data/content';
import { Megaphone, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Awareness() {
  return (
    <section id="awareness" className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Community Awareness</h2>
          <p className="text-slate-300">Educational activities conducted to promote safe water practices.</p>
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
                className="flex gap-4 p-5 bg-transparent rounded-2xl border border-slate-100"
              >
                <div className="mt-1 bg-brand-100 p-2 rounded-lg text-brand-600">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{act.title}</h3>
                  <p className="text-sm text-slate-300">{act.desc}</p>
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
