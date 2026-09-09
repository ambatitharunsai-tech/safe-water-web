import { motion } from 'framer-motion';
import { Droplets, Info } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="relative pt-12 pb-32 overflow-hidden min-h-[90vh] flex items-center bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 text-center lg:text-left bg-slate-900/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500 text-white text-xs font-bold mb-8 shadow-lg shadow-brand-500/30">
              <Droplets className="w-4 h-4" />
              <span>EVERY DROP MATTERS</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1] drop-shadow-lg">
              SAFE <span className="text-brand-400">DRINKING</span> WATER
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-200 font-medium mb-8 max-w-2xl mx-auto lg:mx-0">
              Clean water is essential for a healthy community. Discover how we can protect our water sources, prevent disease, and ensure a safer tomorrow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#about" className="px-8 py-4 bg-brand-500 text-white rounded-full font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/40 flex items-center justify-center gap-2">
                EXPLORE THE PROJECT
              </a>
              <a href="#purification" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-bold border border-white/20 hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                <Info className="w-5 h-5 text-brand-400" />
                PURIFICATION METHODS
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 relative hidden lg:block"
          >
            {/* The right side is left empty to showcase the beautiful animated background */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
