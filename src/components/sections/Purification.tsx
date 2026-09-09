import { projectData } from '../../data/content';
import { Flame, Filter, Droplet, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Purification() {
  const icons = [Flame, Filter, Droplet];
  
  return (
    <section id="purification" className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How Can Water Be Purified?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">Affordable and effective methods for treating drinking water at the household level.</p>
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
                className="bg-transparent rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row"
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
                        <div className="bg-slate-100 text-slate-200 text-sm font-medium px-4 py-2 rounded-full border border-slate-200">
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
