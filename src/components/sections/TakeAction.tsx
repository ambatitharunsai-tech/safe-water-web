import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { pulseAnimation } from '../../utils/animations';

export function TakeAction() {
  return (
    <section className="py-32 bg-transparent relative overflow-hidden">
      {/* Animated geometric background */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-transparent0/20 text-brand-400 text-sm font-bold mb-8 border border-brand-500/30"
        >
          <Sparkles className="w-4 h-4" />
          JOIN THE MOVEMENT
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight"
        >
          Ready to Make Every Drop <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-300">Count?</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto"
        >
          Whether through better home purification or community advocacy, safe drinking water starts with informed choices.
        </motion.p>
        
        <motion.button 
          variants={pulseAnimation}
          animate="animate"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-5 bg-transparent0 text-white rounded-full font-black text-lg shadow-2xl flex items-center gap-3 mx-auto group border border-brand-400"
        >
          START YOUR JOURNEY
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </motion.button>
      </div>
    </section>
  );
}
