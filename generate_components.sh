#!/bin/bash
DIR="src/components/sections"
mkdir -p $DIR

cat << 'INNER' > $DIR/Header.tsx
import { useState } from 'react';
import { Menu, X, Droplet } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const links = ['HOME', 'ABOUT', 'SOURCES', 'CONTAMINATION', 'HEALTH', 'PURIFICATION', 'HYGIENE', 'AWARENESS', 'SURVEY'];
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-2">
            <Droplet className="w-6 h-6 text-brand-500 fill-brand-100" />
            <span className="font-bold text-xl tracking-tight text-slate-900">SAFE WATER</span>
          </div>
          
          <nav className="hidden md:flex gap-4 lg:gap-6">
            {links.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors">
                {link}
              </a>
            ))}
          </nav>
          
          <div className="hidden md:block">
            <a href="#purification" className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-full transition-colors shadow-sm shadow-brand-500/20">
              LEARN MORE
            </a>
          </div>
          
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {links.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-slate-600">
                {link}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
INNER

cat << 'INNER' > $DIR/Hero.tsx
import { motion } from 'framer-motion';
import { Droplets, Info } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="relative pt-24 pb-32 overflow-hidden bg-brand-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-100/50 via-slate-50 to-slate-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold mb-6">
              <Droplets className="w-4 h-4" />
              <span>EVERY DROP MATTERS</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-[1.1]">
              SAFE <span className="text-brand-600">DRINKING</span> WATER
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Clean water is essential for a healthy and hygienic community. Discover how we can protect our water sources and prevent disease.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#about" className="px-8 py-3.5 bg-brand-600 text-white rounded-full font-semibold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2">
                EXPLORE THE TOPICS
              </a>
              <a href="#purification" className="px-8 py-3.5 bg-white text-slate-700 rounded-full font-semibold border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2">
                <Info className="w-5 h-5" />
                LEARN ABOUT PURIFICATION
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="aspect-square relative max-w-md mx-auto">
              <div className="absolute inset-0 bg-brand-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="relative h-full w-full rounded-full bg-gradient-to-br from-brand-100 to-white shadow-2xl shadow-brand-900/10 border-8 border-white flex items-center justify-center overflow-hidden">
                <Droplets className="w-48 h-48 text-brand-400" strokeWidth={1} />
                {/* Bubble animations */}
                <div className="absolute bottom-10 left-1/4 w-4 h-4 bg-brand-300/40 rounded-full animate-bounce"></div>
                <div className="absolute bottom-20 right-1/3 w-6 h-6 bg-brand-300/30 rounded-full animate-[bounce_2s_infinite]"></div>
                <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-brand-300/50 rounded-full animate-[bounce_3s_infinite]"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
INNER
