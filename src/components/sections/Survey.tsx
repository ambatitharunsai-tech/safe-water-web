import { projectData } from '../../data/content';
import { Users, MapPin, Building, Target, TrendingUp, AlertTriangle, Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function Survey() {
  const [activeStat, setActiveStat] = useState<number | null>(null);

  const stats = [
    { 
      id: 0,
      label: 'Municipal Tap Usage', 
      percent: 68, 
      color: 'bg-blue-500', 
      textColor: 'text-blue-400',
      icon: Droplets,
      desc: 'The majority of households rely on municipal tap water, which is prone to seasonal contamination.'
    },
    { 
      id: 1,
      label: 'Groundwater / Borewell', 
      percent: 24, 
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      icon: TrendingUp,
      desc: 'Almost a quarter of residents use borewells. High TDS (Total Dissolved Solids) is a major concern here.'
    },
    { 
      id: 2,
      label: 'RO Filter Usage', 
      percent: 32, 
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      icon: Target,
      desc: 'Only about a third of households have invested in RO filters, leaving many exposed to pathogens.'
    },
    { 
      id: 3,
      label: 'Reported Illness', 
      percent: 42, 
      color: 'bg-rose-500',
      textColor: 'text-rose-400',
      icon: AlertTriangle,
      desc: 'A staggering 42% of households reported at least one case of waterborne illness in the past year.'
    }
  ];

  return (
    <section id="survey" className="py-32 relative overflow-hidden bg-transparent">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 text-brand-400 text-xs font-black tracking-widest uppercase mb-6 border border-brand-500/20"
          >
            <Target className="w-4 h-4" />
            <span>Narasaraopeta Case Study</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight"
          >
            Community <span className="text-brand-400">Project Findings</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-medium"
          >
            Data collected from a detailed household survey of {projectData.projectDetails.surveySample} homes to understand existing practices and vulnerabilities.
          </motion.p>
        </div>
        
        {/* Core Demographics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {[
            { label: 'Location Target', val: 'Narasaraopeta', icon: MapPin },
            { label: 'Sample Size', val: `${projectData.projectDetails.surveySample} Homes`, icon: Users },
            { label: 'City Population', val: projectData.projectDetails.population, icon: Users },
            { label: 'Total Households', val: projectData.projectDetails.households, icon: Building },
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={stat.label} 
              className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 text-center shadow-xl group hover:bg-slate-900/60 transition-colors"
            >
              <div className="w-16 h-16 mx-auto bg-brand-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <stat.icon className="w-8 h-8 text-brand-400" />
              </div>
              <div className="text-2xl font-black text-white mb-2">{stat.val}</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        
        {/* Interactive Data Visualization */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-slate-900/60 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-32 bg-brand-500/5 rounded-full blur-[80px] pointer-events-none"></div>
            
            <h3 className="text-3xl font-black text-white mb-10 relative z-10">Data Breakdown</h3>
            
            <div className="space-y-8 relative z-10">
              {stats.map((stat, index) => (
                <div 
                  key={stat.id}
                  onMouseEnter={() => setActiveStat(stat.id)}
                  onMouseLeave={() => setActiveStat(null)}
                  className="cursor-pointer group"
                >
                  <div className="flex justify-between text-sm mb-3">
                    <span className="font-bold text-white group-hover:text-brand-300 transition-colors flex items-center gap-2">
                      <stat.icon className={`w-4 h-4 ${stat.textColor}`} />
                      {stat.label}
                    </span>
                    <span className={`font-black ${stat.textColor}`}>{stat.percent}%</span>
                  </div>
                  
                  <div className="w-full bg-black/40 rounded-full h-3 border border-white/5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stat.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.2 + (index * 0.2), type: "spring" } as any}
                      className={`h-full rounded-full ${stat.color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative h-full min-h-[400px] flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {activeStat === null ? (
                <motion.div 
                  key="default"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center p-10 bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-white/10"
                >
                  <Target className="w-16 h-16 text-brand-500/50 mx-auto mb-6" />
                  <h4 className="text-2xl font-black text-white mb-4">Hover over the data</h4>
                  <p className="text-slate-400 font-medium">Interact with the charts on the left to reveal detailed clinical insights about the local water infrastructure.</p>
                </motion.div>
              ) : (
                <motion.div 
                  key={activeStat}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className={`w-full p-12 backdrop-blur-2xl rounded-[3rem] border shadow-2xl ${
                    activeStat === 0 ? 'bg-blue-900/20 border-blue-500/30' :
                    activeStat === 1 ? 'bg-amber-900/20 border-amber-500/30' :
                    activeStat === 2 ? 'bg-emerald-900/20 border-emerald-500/30' :
                    'bg-rose-900/20 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                      activeStat === 0 ? 'bg-blue-500/20 text-blue-400' :
                      activeStat === 1 ? 'bg-amber-500/20 text-amber-400' :
                      activeStat === 2 ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {(() => {
                        const Icon = stats[activeStat].icon;
                        return <Icon className="w-8 h-8" />;
                      })()}
                    </div>
                    <div>
                      <h4 className="text-3xl font-black text-white">{stats[activeStat].percent}%</h4>
                      <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">{stats[activeStat].label}</p>
                    </div>
                  </div>
                  
                  <p className="text-xl text-slate-200 leading-relaxed font-medium">
                    {stats[activeStat].desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
