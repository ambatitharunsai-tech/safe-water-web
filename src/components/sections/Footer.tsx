import { Droplet } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-white">
          <Droplet className="w-6 h-6 text-brand-500 fill-brand-500" />
          <span className="font-bold text-xl tracking-tight">SAFE WATER</span>
        </div>
        
        <div className="text-sm text-center md:text-left">
          Based on the Community Service Project Report on Awareness of Safe Drinking Water.<br/>
          Narasaraopeta Engineering College.
        </div>
        
        <div className="text-sm font-medium">
          © {new Date().getFullYear()} Safe Drinking Water Awareness Project
        </div>
      </div>
    </footer>
  );
}
