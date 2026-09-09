import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Users, FileWarning } from 'lucide-react';
import { staggerContainer, fadeInUp, scaleIn } from '../../utils/animations';

export function Health() {
  const risks = [
    { title: "Waterborne Diseases", desc: "Cholera, Typhoid, Dysentery", icon: ShieldAlert, color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
    { title: "Physical Impact", desc: "Dehydration, Weakness, Stunted Growth", icon: Activity, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-100" },
    { title: "Community Impact", desc: "Loss of productivity, increased medical expenses", icon: Users, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
    { title: "Long-term Risks", desc: "Chronic organ damage from chemical pollutants", icon: FileWarning, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-100" }
  ];

  return (
    <section id="health" className="py-24 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="flex-1"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 text-sm font-bold mb-6 border border-red-100">
              <ShieldAlert className="w-4 h-4" />
              HEALTH IMPACT
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              The Hidden Dangers of Contamination
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-lg text-slate-300 mb-8 leading-relaxed">
              Consuming contaminated water doesn't just quench your thirst—it introduces dangerous pathogens and chemicals directly into your system.
            </motion.p>

            <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 gap-6">
              {risks.map((risk, i) => (
                <motion.div variants={scaleIn} key={i} className={`p-6 rounded-2xl border ${risk.bg} ${risk.border} flex flex-col gap-4 hover:-translate-y-1 transition-transform`}>
                  <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm ${risk.color}`}>
                    <risk.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">{risk.title}</h3>
                    <p className="text-sm text-slate-300">{risk.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 w-full"
          >
            <div className="aspect-square rounded-[3rem] overflow-hidden relative shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1541888047970-d830b561c28c?q=80&w=2000&auto=format&fit=crop" 
                alt="Clean Water Concept" 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
              />
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-8 left-8 right-8 z-20"
              >
                <div className="bg-transparent/90 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                  <div className="text-3xl font-black text-brand-600 mb-2">90%</div>
                  <div className="text-sm font-semibold text-slate-200">of diseases in developing regions are waterborne. Protect your family today.</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
