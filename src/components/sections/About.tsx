import { Info, HeartPulse, Droplets, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, scaleIn, floatAnimation } from '../../utils/animations';

export function About() {
  const features = [
    { num: '01', title: 'WHAT IS SAFE WATER?', desc: 'Water free from contamination, bacteria, and harmful chemicals, safe for drinking and daily use.', icon: Droplets },
    { num: '02', title: 'WHY WATER MATTERS', desc: 'It is a basic human need, and ensuring its safety is everyone’s responsibility.', icon: Info },
    { num: '03', title: 'WATER AND HEALTH', desc: 'Safe water prevents diseases like cholera and typhoid, keeping the body healthy.', icon: HeartPulse },
    { num: '04', title: 'WATER AND HYGIENE', desc: 'Clean water is the foundation of both domestic and personal hygiene.', icon: ShieldCheck }
  ];

  return (
    <section id="about" className="py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-white mb-4">Understanding Safe Drinking Water</motion.h2>
          <motion.p variants={fadeInUp} className="text-slate-300 text-lg">Clean water and good hygiene are not luxuries — they are the foundation of life, health, and progress.</motion.p>
        </motion.div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((f, i) => (
            <motion.div 
              variants={scaleIn}
              key={f.num} 
              className="bg-transparent rounded-3xl p-8 border border-slate-100 hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-100/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-100 rounded-full opacity-0 group-hover:opacity-50 transition-opacity blur-2xl"></div>
              
              <motion.div variants={floatAnimation} animate="animate" className="w-14 h-14 bg-transparent rounded-2xl shadow-sm flex items-center justify-center mb-6 text-brand-500 group-hover:scale-110 transition-transform border border-slate-100 relative z-10">
                <f.icon className="w-7 h-7" />
              </motion.div>
              
              <div className="text-xs font-black text-brand-500 mb-2 tracking-widest">{f.num}</div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
