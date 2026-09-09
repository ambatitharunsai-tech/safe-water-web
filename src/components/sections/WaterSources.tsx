import { projectData } from '../../data/content';
import { Droplet, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, floatAnimation } from '../../utils/animations';

export function WaterSources() {
  return (
    <section id="sources" className="py-24 bg-transparent relative overflow-hidden">
      {/* Animated wave background */}
      <motion.div 
        animate={{ x: ['0%', '-50%'] }} 
        transition={{ repeat: Infinity, ease: 'linear', duration: 40 }}
        className="absolute top-0 left-0 w-[200%] h-full opacity-30 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 50px 50px, rgba(14, 165, 233, 0.1) 2%, transparent 5%)', backgroundSize: '100px 100px' }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-black text-white mb-4">Common Water Sources</motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-300 text-lg">The primary sources of water identified in the community survey.</motion.p>
        </motion.div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {projectData.waterSources.map((source, i) => (
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              key={source.name} 
              className="bg-transparent rounded-3xl p-8 shadow-lg shadow-slate-200/40 border border-slate-100 transition-all flex flex-col h-full relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
              
              <motion.div variants={floatAnimation} animate="animate" className="w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-brand-200">
                <Droplet className="w-8 h-8" />
              </motion.div>
              
              <h3 className="text-2xl font-black text-white mb-4">{source.name}</h3>
              <p className="text-slate-300 mb-8 flex-grow leading-relaxed">{source.description}</p>
              
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
                  <div>
                    <div className="text-xs font-black text-orange-800 tracking-wider mb-1">POTENTIAL CONCERN</div>
                    <div className="text-sm text-orange-700 font-medium">{source.concern}</div>
                  </div>
                </div>
                
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                  <div>
                    <div className="text-xs font-black text-emerald-800 tracking-wider mb-1">SAFE PRACTICE</div>
                    <div className="text-sm text-emerald-700 font-medium">{source.practice}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
