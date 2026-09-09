import { projectData } from '../../data/content';
import { motion } from 'framer-motion';

export function ProjectActivities() {
  return (
    <section id="activities" className="py-24 bg-transparent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Project Activity Timeline</h2>
          <p className="text-slate-300">The structured approach taken during the community service project.</p>
        </div>
        
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {projectData.projectActivities.map((act, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={act.title} 
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-transparent0 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="text-xs font-bold">{i + 1}</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-transparent border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xs font-bold text-brand-600 mb-1">{act.phase}</div>
                <h3 className="text-lg font-bold text-white mb-2">{act.title}</h3>
                <p className="text-sm text-slate-300">{act.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
