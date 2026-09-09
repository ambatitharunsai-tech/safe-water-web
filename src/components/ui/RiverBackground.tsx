export function RiverBackground() {
  return (
    <div className="fixed inset-0 z-[-50] bg-slate-950 overflow-hidden pointer-events-none">
      <img 
        src="/waterfall_poster.jpg" 
        alt="Waterfall Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      {/* Global dark overlay to ensure white text pops clearly across all pages */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>
    </div>
  );
}
