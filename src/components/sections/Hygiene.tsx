import { projectData } from '../../data/content';
import { Shield, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hygiene() {
  return (
    <section id="hygiene" className="py-24 bg-transparent text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-transparent0 rounded-xl"><Shield className="w-6 h-6 text-white" /></div>
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
