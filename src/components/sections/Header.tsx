import { useState } from 'react';
import { Menu, X, Droplet, User, LogOut, LayoutDashboard, Home } from 'lucide-react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-brand-500 origin-left z-[60]"
        style={{ scaleX: scrollYProgress }}
      />
      
      <header className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-2xl border-b border-white/10 transition-all duration-300 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center border border-brand-500/50 group-hover:bg-brand-500 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                <Droplet className="w-6 h-6 text-brand-400 group-hover:text-white transition-colors" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-white hidden sm:block">AQUA<span className="text-brand-400">SAFE</span></span>
            </Link>
            
            {/* DESKTOP NAVIGATION */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className={`font-bold text-sm transition-colors flex items-center gap-2 ${location.pathname === '/' ? 'text-brand-400' : 'text-slate-300 hover:text-white'}`}>
                <Home className="w-4 h-4" /> Home
              </Link>
              
              {user && (
                <Link to="/dashboard" className={`font-bold text-sm transition-colors flex items-center gap-2 ${location.pathname === '/dashboard' ? 'text-brand-400' : 'text-slate-300 hover:text-white'}`}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              )}

              {/* Display jump-links only if on Home page */}
              {location.pathname === '/' && (
                <div className="hidden lg:flex items-center gap-4 border-l border-white/10 pl-8 ml-2">
                   {['ABOUT', 'HEALTH', 'QUIZ'].map(link => (
                    <a key={link} href={`#${link.toLowerCase()}`} className="text-[10px] font-black text-slate-400 hover:text-brand-400 transition-colors uppercase tracking-widest">
                      {link}
                    </a>
                  ))}
                </div>
              )}
            </nav>
            
            {/* RIGHT ACTIONS */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4 bg-white/5 pl-4 pr-2 py-1.5 rounded-full border border-white/10 shadow-inner">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-brand-400" /> {user.name}
                  </span>
                  <div className="w-px h-5 bg-white/20 mx-1"></div>
                  <button onClick={logout} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors" title="Log out">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors px-4">
                    Sign In
                  </Link>
                  <Link to="/register" className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-900 text-sm font-black rounded-full transition-colors shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
            
            {/* MOBILE MENU TOGGLE */}
            <button className="md:hidden p-2 text-slate-300 hover:text-white bg-white/5 rounded-xl border border-white/10" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-slate-900/95 backdrop-blur-3xl border-t border-white/10 absolute w-full shadow-2xl"
            >
              <div className="p-4 space-y-2">
                <Link to="/" onClick={() => setIsOpen(false)} className="block py-4 px-4 text-lg font-black text-white bg-white/5 rounded-2xl flex items-center gap-3">
                  <Home className="w-5 h-5 text-brand-400" /> Home
                </Link>
                
                {user && (
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-4 px-4 text-lg font-black text-white bg-white/5 rounded-2xl flex items-center gap-3">
                    <LayoutDashboard className="w-5 h-5 text-brand-400" /> Dashboard
                  </Link>
                )}
                
                <div className="border-t border-white/10 pt-4 mt-4 px-4">
                  {user ? (
                    <button onClick={() => { logout(); setIsOpen(false); }} className="w-full py-4 text-left text-lg font-black text-rose-400 flex items-center gap-3 bg-rose-500/10 rounded-2xl px-4">
                      <LogOut className="w-5 h-5" /> Sign Out ({user.name})
                    </button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center py-4 text-lg font-black text-white bg-white/10 border border-white/20 rounded-2xl">
                        Sign In
                      </Link>
                      <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center py-4 text-lg font-black text-slate-900 bg-brand-500 shadow-[0_0_20px_rgba(56,189,248,0.4)] rounded-2xl">
                        Sign Up Free
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
