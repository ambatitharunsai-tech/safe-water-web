import { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const terms = [
  { term: "Borewell", def: "A groundwater source accessed via mechanical pumps. High risk of contamination if untreated." },
  { term: "Cholera", def: "A severe bacterial disease causing acute diarrhea and dehydration, strongly linked to contaminated water." },
  { term: "Typhoid", def: "A bacterial infection causing high fever and gastrointestinal issues, often spread through unsafe water." },
  { term: "Diarrhea", def: "Frequent loose bowel movements often caused by drinking untreated or contaminated water." },
  { term: "Boiling", def: "Heating water to a rolling boil to kill most bacteria and pathogens, making it safe for daily use." },
  { term: "Filtering", def: "Passing water through a clean cloth or standard home filter to remove physical impurities." },
  { term: "Purification Tablets", def: "Chemical tablets added to water to purify it, ideal for emergencies." },
  { term: "Safe Storage", def: "Storing drinking water in clean, covered steel or plastic containers and using a ladle to draw water." },
  { term: "Domestic Hygiene", def: "Practices like proper waste disposal, clean kitchens, and maintaining clean water storage containers." },
  { term: "Personal Hygiene", def: "Practices like washing hands with soap before eating, keeping nails trimmed, and bathing regularly." }
];

export function Glossary() {
  const [query, setQuery] = useState('');

  const filtered = terms.filter(t => 
    t.term.toLowerCase().includes(query.toLowerCase()) || 
    t.def.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section id="glossary" className="py-24 bg-transparent relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold mb-4">
            <BookOpen className="w-4 h-4" />
            <span>KNOWLEDGE BASE</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Project Glossary</h2>
          <p className="text-slate-300 mb-8">Search for key terms and concepts discussed in the Safe Drinking Water project.</p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search terms (e.g., Cholera, Boiling, Storage)..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm transition-all text-slate-200 font-medium"
            />
          </div>
        </div>

        <div className="grid gap-4">
          <AnimatePresence>
            {filtered.length > 0 ? (
              filtered.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={item.term} 
                  className="bg-transparent p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-4 md:items-center hover:bg-transparent hover:shadow-lg hover:shadow-slate-200/50 transition-all"
                >
                  <div className="md:w-1/3">
                    <h3 className="text-lg font-bold text-brand-600">{item.term}</h3>
                  </div>
                  <div className="md:w-2/3">
                    <p className="text-slate-300 leading-relaxed">{item.def}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-slate-400 font-medium"
              >
                No terms found matching "{query}"
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
