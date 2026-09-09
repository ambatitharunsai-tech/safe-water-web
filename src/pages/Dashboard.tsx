import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  ShieldCheck, Droplet, Activity, User, 
  CheckCircle2, Circle, Plus, Minus, Beaker, RotateCcw,
  CalendarDays, AlertTriangle, CheckCircle, Award, Star, Zap, TrendingUp,
  Radio, Stethoscope, MapPin, HeartPulse, Calculator, Coins, Lightbulb,
  FileText, BarChart3, Info, AlertOctagon, ChevronLeft, ChevronRight,
  MessageSquareOff, Phone, Sparkles, Truck, Flame, Gauge, BellRing
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CHECKLIST_ITEMS = [
  "Store water in clean, covered containers.",
  "Wash hands with soap before handling water.",
  "Boil water for at least 1 minute before drinking.",
  "Keep the water storage area clean and elevated.",
  "Use a long-handled dipper to take water out."
];

const SYMPTOMS = [
  { id: 'diarrhea', label: 'Diarrhea / Loose Stools', severity: 'high' },
  { id: 'vomiting', label: 'Nausea or Vomiting', severity: 'high' },
  { id: 'fever', label: 'High Fever', severity: 'high' },
  { id: 'cramps', label: 'Severe Abdominal Cramps', severity: 'medium' },
  { id: 'fatigue', label: 'Extreme Fatigue / Dehydration', severity: 'medium' }
];

const getDateString = (d: Date) => {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// --- ANIMATION VARIANTS ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariant: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function Dashboard() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'personal' | 'community' | 'health' | 'calculator' | 'study' | 'directory'>('personal');

  const [hydrationHistory, setHydrationHistory] = useState<Record<string, number>>({});
  const [checklist, setChecklist] = useState<boolean[]>(new Array(CHECKLIST_ITEMS.length).fill(false));
  const [waterGlasses, setWaterGlasses] = useState<number>(0);
  const [lastCleaned, setLastCleaned] = useState<number>(Date.now() - 12 * 24 * 60 * 60 * 1000);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Real Backend Data Settings
  const [hydrationGoal, setHydrationGoal] = useState<number>(8);
  const [familySize, setFamilySize] = useState<number>(4);
  const [waterCanCost, setWaterCanCost] = useState<number>(80);

  // Real Backend Alerts
  const [alerts, setAlerts] = useState<any[]>([]);
  const [newAlert, setNewAlert] = useState('');
  const [newAlertType, setNewAlertType] = useState<'danger'|'warning'|'info'>('warning');

  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  // Load from localStorage for local states
  useEffect(() => {
    if (user) {
      const savedData = localStorage.getItem(`water_app_data_${user.id}`);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.checklist) setChecklist(parsed.checklist);
          if (parsed.lastCleaned !== undefined) setLastCleaned(parsed.lastCleaned);
          if (parsed.hydrationHistory) {
            setHydrationHistory(parsed.hydrationHistory);
            const todayStr = getDateString(new Date());
            setWaterGlasses(parsed.hydrationHistory[todayStr] || 0);
          }
        } catch (e) {}
      }
    }
  }, [user]);

  // Save to localStorage for local states
  useEffect(() => {
    if (user) {
      localStorage.setItem(`water_app_data_${user.id}`, JSON.stringify({ 
        checklist, lastCleaned, hydrationHistory
      }));
    }
  }, [checklist, lastCleaned, hydrationHistory, user]);

  // 🔴 NEW: Fetch user settings from Backend
  const fetchSettings = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setFamilySize(data.settings.family_size);
          setWaterCanCost(data.settings.water_can_cost);
          setHydrationGoal(data.settings.hydration_goal);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  // 🔴 NEW: Fetch live global alerts from Backend
  const fetchAlerts = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/alerts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchSettings();
      fetchAlerts();
      // Poll alerts every 10 seconds for real-time feel
      const interval = setInterval(fetchAlerts, 10000);
      return () => clearInterval(interval);
    }
  }, [token, fetchSettings, fetchAlerts]);

  // 🔴 NEW: Save user settings to Backend
  const saveSettings = async (updates: { family_size?: number, water_can_cost?: number, hydration_goal?: number }) => {
    if (!token) return;
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          family_size: updates.family_size || familySize,
          water_can_cost: updates.water_can_cost || waterCanCost,
          hydration_goal: updates.hydration_goal || hydrationGoal
        })
      });
    } catch (e) {
      addToast('Failed to sync settings to server', 'error');
    }
  };

  const handleUpdateFamilySize = (val: number) => {
    setFamilySize(val);
    saveSettings({ family_size: val });
  };

  const handleUpdateWaterCost = (val: number) => {
    setWaterCanCost(val);
    saveSettings({ water_can_cost: val });
  };

  const handleUpdateHydrationGoal = (val: number) => {
    setHydrationGoal(val);
    saveSettings({ hydration_goal: val });
    addToast(`Hydration goal updated to ${val} glasses.`, 'info');
  };

  const updateGlasses = (newAmount: number) => {
    const amount = Math.max(0, newAmount);
    setWaterGlasses(amount);
    const todayStr = getDateString(new Date());
    setHydrationHistory(prev => ({ ...prev, [todayStr]: amount }));
    if (amount === hydrationGoal && amount > 0) {
      addToast(`Hydration Hero! You reached your goal of ${hydrationGoal} glasses.`, 'success');
    }
  };

  const handleResetTimer = () => {
    setLastCleaned(Date.now());
    addToast('Storage cleaning timer reset successfully.', 'success');
  }

  const toggleChecklist = (index: number) => {
    const newChecklist = [...checklist];
    newChecklist[index] = !newChecklist[index];
    setChecklist(newChecklist);
    
    if (newChecklist.every(Boolean) && !checklist.every(Boolean)) {
       addToast('Safety Inspector unlocked! All checks complete.', 'success');
    }
  };

  // 🔴 NEW: Post alert to Backend Global Feed
  const handlePostAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlert.trim()) return;
    
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newAlert,
          location: 'Narasaraopeta',
          type: newAlertType
        })
      });
      
      if (res.ok) {
        setNewAlert('');
        setNewAlertType('warning');
        addToast('Alert published to the global community feed.', 'success');
        fetchAlerts(); // Immediately pull fresh feed
      } else {
        addToast('Failed to post alert', 'error');
      }
    } catch (e) {
      addToast('Network error while posting alert', 'error');
    }
  };

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading || !user) return null;

  // Personal Stats
  const safetyScore = Math.round((checklist.filter(Boolean).length / CHECKLIST_ITEMS.length) * 100);
  const daysSinceCleaning = Math.floor((Date.now() - lastCleaned) / (1000 * 60 * 60 * 24));
  
  // Health Logic
  let diagnosis = null;
  let riskLevel = 0; // 0 to 100
  if (selectedSymptoms['diarrhea'] && selectedSymptoms['vomiting']) {
    riskLevel = 95;
    diagnosis = { status: 'danger', title: 'High Risk: Cholera / Gastroenteritis', desc: 'Seek immediate medical attention. Begin ORS (Oral Rehydration Salts) immediately to prevent severe dehydration.', details: 'Cholera is an acute diarrheal illness caused by infection of the intestine with Vibrio cholerae bacteria.' };
  } else if (selectedSymptoms['fever'] && (selectedSymptoms['cramps'] || selectedSymptoms['diarrhea'])) {
    riskLevel = 85;
    diagnosis = { status: 'danger', title: 'High Risk: Typhoid Fever', desc: 'Consult a doctor immediately for a blood test and antibiotics.', details: 'Typhoid is a life-threatening bacterial infection spread through contaminated food and water.' };
  } else if (Object.values(selectedSymptoms).some(Boolean)) {
    riskLevel = 45;
    diagnosis = { status: 'caution', title: 'Possible Mild Illness', desc: 'Drink ONLY boiled or RO-purified water. Monitor your symptoms for 24 hours.', details: 'Mild waterborne pathogens can cause temporary stomach upset.' };
  } else {
    riskLevel = 0;
    diagnosis = { status: 'safe', title: 'Healthy', desc: 'No symptoms detected. Keep drinking safe, purified water to maintain your health!', details: 'Consistent consumption of clean water boosts immunity and prevents outbreaks.' };
  }

  // Cost Calculator Logic
  const dailyLiters = familySize * 4;
  const yearlyLiters = dailyLiters * 365;
  const costPerLiter = waterCanCost / 20;
  const bottledYearly = Math.round(yearlyLiters * costPerLiter);
  const boilingYearly = Math.round(yearlyLiters * 1);
  const filterYearly = 12000 + 2500; 
  const filter5Years = 12000 + (2500 * 5);
  const bottled5Years = bottledYearly * 5;
  const boiling5Years = boilingYearly * 5;
  
  // Calculate max cost for charting scales
  const max5YearCost = Math.max(bottled5Years, boiling5Years, filter5Years);
  const getBarHeight = (val: number) => `${Math.max((val / max5YearCost) * 100, 5)}%`;

  // Calendar
  const calYear = currentDate.getFullYear();
  const calMonth = currentDate.getMonth();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const getActualUsage = (day: number) => hydrationHistory[getDateString(new Date(calYear, calMonth, day))] || 0;
  
  const todayDate = new Date();
  const last7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(todayDate);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = getDateString(d);
    return { dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }), value: hydrationHistory[dateStr] || 0, isToday: i === 6 };
  });

  const isHydrationHero = waterGlasses >= hydrationGoal;
  const isSafetyInspector = checklist.every(Boolean);
  const isPristineStorage = daysSinceCleaning <= 7;

  const NavItem = ({ id, icon: Icon, label, colorClass }: { id: any, icon: any, label: string, colorClass: string }) => {
    const isActive = activeTab === id;
    return (
      <button 
        onClick={() => setActiveTab(id)} 
        className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 font-bold relative overflow-hidden group
          ${isActive ? `bg-white/10 text-white shadow-lg border border-white/20` : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'}
        `}
      >
        {isActive && (
          <motion.div layoutId="activeNavIndicator" className={`absolute left-0 top-0 bottom-0 w-1.5 ${colorClass}`} />
        )}
        <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} /> 
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDEBAR */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-32 bg-brand-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-brand-500/20 transition-all duration-1000"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-500 to-emerald-400 rounded-full animate-spin-slow opacity-50 blur-md"></div>
                <div className="relative w-full h-full bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-800 shadow-xl">
                  <User className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">{user.name}</h1>
              <p className="text-brand-400 font-bold text-sm tracking-widest uppercase mt-1 mb-6">Safe Water Advocate</p>
              <div className="w-full flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                <span className="text-slate-400 font-medium text-sm">Community Rank</span>
                <span className="text-white font-black flex items-center gap-1"><Flame className="w-4 h-4 text-orange-500"/> Top 15%</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-4 border border-white/10 shadow-2xl flex flex-col gap-2">
            <NavItem id="personal" icon={Activity} label="My Dashboard" colorClass="bg-brand-500" />
            <NavItem id="community" icon={Radio} label="Live Community Alerts" colorClass="bg-amber-500" />
            <NavItem id="health" icon={Stethoscope} label="Health Checker" colorClass="bg-rose-500" />
            <NavItem id="calculator" icon={Calculator} label="Cost Calculator" colorClass="bg-emerald-500" />
            <NavItem id="directory" icon={Phone} label="Local Contacts" colorClass="bg-indigo-500" />
            <NavItem id="study" icon={FileText} label="Local Survey Data" colorClass="bg-blue-500" />
          </motion.div>

          <motion.div className="bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/10 shadow-2xl flex flex-col gap-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400"/> Live Achievements
            </h3>
            
            <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-all duration-500 ${isHydrationHero ? 'bg-gradient-to-r from-brand-500/20 to-transparent border-brand-500/50 scale-[1.02]' : 'bg-white/5 border-white/5 opacity-60 hover:opacity-100'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${isHydrationHero ? 'bg-brand-500 text-white shadow-[0_0_15px_rgba(56,189,248,0.5)]' : 'bg-slate-800 text-slate-500'}`}>
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-sm font-bold transition-colors ${isHydrationHero ? 'text-white' : 'text-slate-400'}`}>Hydration Hero</h4>
                <p className="text-[10px] text-slate-400">Hit your daily water goal.</p>
              </div>
            </div>
            <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-all duration-500 ${isSafetyInspector ? 'bg-gradient-to-r from-emerald-500/20 to-transparent border-emerald-500/50 scale-[1.02]' : 'bg-white/5 border-white/5 opacity-60 hover:opacity-100'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${isSafetyInspector ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-500'}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-sm font-bold transition-colors ${isSafetyInspector ? 'text-white' : 'text-slate-400'}`}>Safety Inspector</h4>
                <p className="text-[10px] text-slate-400">Complete all safety checks.</p>
              </div>
            </div>
            <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-all duration-500 ${isPristineStorage ? 'bg-gradient-to-r from-amber-500/20 to-transparent border-amber-500/50 scale-[1.02]' : 'bg-white/5 border-white/5 opacity-60 hover:opacity-100'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${isPristineStorage ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-slate-800 text-slate-500'}`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`text-sm font-bold transition-colors ${isPristineStorage ? 'text-white' : 'text-slate-400'}`}>Pristine Storage</h4>
                <p className="text-[10px] text-slate-400">Tank cleaned in last 7 days.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT MAIN CONTENT */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: PERSONAL DASHBOARD */}
            {activeTab === 'personal' && (
              <motion.div key="personal" variants={staggerContainer} initial="hidden" animate="show" exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }} className="flex flex-col gap-6">
                
                <motion.div variants={cardVariant} className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-emerald-900/60 to-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-[40px] group-hover:bg-emerald-500/30 transition-all"></div>
                    <ShieldCheck className="w-10 h-10 text-emerald-400 mb-4 relative z-10" />
                    <h3 className="text-4xl font-black text-white relative z-10">{safetyScore}%</h3>
                    <p className="text-sm text-emerald-200/80 font-bold uppercase tracking-wider relative z-10 mt-1">Safety Score</p>
                    <div className="mt-6 h-2 w-full bg-black/40 rounded-full overflow-hidden relative z-10">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${safetyScore}%` }} transition={{ duration: 1, type: 'spring' } as any} className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-brand-900/60 to-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-8 border border-brand-500/30 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-brand-500/20 rounded-full blur-[40px] group-hover:bg-brand-500/30 transition-all"></div>
                    <div className="flex justify-between items-start relative z-10">
                      <Droplet className="w-10 h-10 text-brand-400 mb-4" />
                      <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1">
                        <button onClick={() => updateGlasses(waterGlasses - 1)} className="p-1.5 hover:bg-white/10 rounded-md text-brand-400 hover:text-white transition-colors"><Minus className="w-4 h-4"/></button>
                        <button onClick={() => updateGlasses(waterGlasses + 1)} className="p-1.5 hover:bg-white/10 rounded-md text-brand-400 hover:text-white transition-colors"><Plus className="w-4 h-4"/></button>
                      </div>
                    </div>
                    <h3 className="text-4xl font-black text-white relative z-10 tracking-tight">{waterGlasses} <span className="text-2xl text-brand-400/50">/ {hydrationGoal}</span></h3>
                    <p className="text-sm text-brand-200/80 font-bold uppercase tracking-wider relative z-10 mt-1">Daily Glasses</p>
                    <div className="mt-6 h-2 w-full bg-black/40 rounded-full overflow-hidden relative z-10">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((waterGlasses / hydrationGoal) * 100, 100)}%` }} transition={{ duration: 1, type: 'spring' } as any} className="h-full bg-brand-500 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={cardVariant} className="grid md:grid-cols-5 gap-6">
                  <div className="md:col-span-3 bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-[40%] left-0 w-full border-b-2 border-dashed border-brand-500/20 z-0 flex items-center justify-end pr-4">
                      <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest bg-slate-900/80 px-2 rounded-full transform translate-y-[-50%] border border-brand-500/20 shadow-lg">Target: {hydrationGoal}</span>
                    </div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">Hydration Velocity</h3>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-xs text-slate-400">Target Goal:</span>
                           <select value={hydrationGoal} onChange={(e) => handleUpdateHydrationGoal(Number(e.target.value))} className="bg-black/30 border border-white/10 text-brand-400 hover:text-white transition-colors text-xs font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                             {[4,6,8,10,12,14].map(g => <option key={g} value={g} className="bg-slate-900">{g} Glasses</option>)}
                           </select>
                        </div>
                      </div>
                    </div>
                    <div className="h-40 flex items-end justify-between gap-2 sm:gap-3 relative z-10 mt-auto">
                      {last7DaysData.map((data, i) => {
                        const heightPercent = Math.min((data.value / Math.max(hydrationGoal, 8)) * 100, 100);
                        const isGoalMet = data.value >= hydrationGoal;
                        return (
                          <div key={i} className="flex flex-col items-center gap-3 w-full group relative">
                            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-xl border border-white/10">
                              {data.value} {data.value === 1 ? 'Glass' : 'Glasses'}
                            </div>
                            <div className="w-full bg-black/20 rounded-t-xl relative h-full flex items-end overflow-hidden group-hover:bg-black/40 transition-colors border border-white/5 border-b-0">
                              <motion.div initial={{ height: 0 }} animate={{ height: `${heightPercent}%` }} transition={{ duration: 1, delay: i * 0.1, type: 'spring' } as any}
                                className={`w-full rounded-t-xl transition-all duration-300 relative ${
                                  data.isToday ? 'bg-gradient-to-t from-brand-600 to-brand-400 shadow-[0_0_15px_rgba(56,189,248,0.5)] border-t border-brand-300' 
                                  : isGoalMet ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                  : 'bg-gradient-to-t from-slate-600 to-slate-500'
                                }`} 
                              >
                                {isGoalMet && <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-white/40 rounded-full blur-[1px]"></div>}
                              </motion.div>
                            </div>
                            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${data.isToday ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'}`}>{data.dayLabel}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl flex flex-col items-center text-center justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
                    <div className="w-full flex justify-between items-center text-xl font-bold text-white mb-4 relative z-10">
                      <span className="flex items-center gap-2"><CalendarDays className="text-amber-400 w-5 h-5" /> Storage</span>
                    </div>
                    <div className="relative w-36 h-36 flex items-center justify-center my-4 group-hover:scale-105 transition-transform duration-500 z-10">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="72" cy="72" r="64" className="stroke-black/30" strokeWidth="12" fill="none" />
                        <motion.circle initial={{ strokeDashoffset: 402 }} animate={{ strokeDashoffset: 402 - (402 * Math.min((daysSinceCleaning / 30) * 100, 100)) / 100 }} transition={{ duration: 1.5, type: 'spring' } as any}
                          cx="72" cy="72" r="64" 
                          className={`transition-all duration-1000 ease-out drop-shadow-xl ${daysSinceCleaning > 20 ? 'stroke-rose-500' : daysSinceCleaning > 10 ? 'stroke-amber-400' : 'stroke-emerald-400'}`} 
                          strokeWidth="12" fill="none" strokeDasharray="402" strokeLinecap="round" 
                        />
                      </svg>
                      <div className="text-center bg-slate-900/50 backdrop-blur-md rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-inner border border-white/5">
                        <span className="text-3xl font-black text-white">{daysSinceCleaning}</span>
                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Days Ago</span>
                      </div>
                    </div>
                    <button onClick={handleResetTimer} className="mt-2 w-full py-3.5 bg-black/20 hover:bg-white/10 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 hover:shadow-lg relative z-10">
                      <RotateCcw className="w-4 h-4" /> Reset Timer
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={cardVariant} className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl relative">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2"><CalendarDays className="text-brand-400 w-5 h-5" /> Monthly History</h3>
                      <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/10 shadow-inner">
                        <button onClick={() => setCurrentDate(new Date(calYear, calMonth - 1))} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
                        <span className="text-xs font-black text-white min-w-[100px] text-center tracking-wider uppercase">{monthName}</span>
                        <button onClick={() => setCurrentDate(new Date(calYear, calMonth + 1))} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (<div key={day} className="text-center text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">{day}</div>))}
                      {Array.from({ length: firstDayOfMonth }).map((_, i) => (<div key={`empty-${i}`} className="aspect-square"></div>))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const isToday = day === todayDate.getDate() && calMonth === todayDate.getMonth() && calYear === todayDate.getFullYear();
                        const usage = getActualUsage(day);
                        let bgClass = 'bg-black/20 border-white/5 hover:border-brand-500/50 text-slate-400';
                        if (usage >= hydrationGoal) bgClass = 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]';
                        else if (usage >= (hydrationGoal / 2)) bgClass = 'bg-brand-500 border-brand-400 text-white shadow-[0_0_10px_rgba(56,189,248,0.3)]';
                        else if (usage > 0) bgClass = 'bg-brand-500/30 border-brand-500/20 text-white';

                        return (
                          <div key={day} className={`relative group aspect-square rounded-xl border flex items-center justify-center text-xs font-bold transition-all cursor-pointer hover:scale-110 z-10 ${isToday ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 bg-brand-400 text-slate-900 shadow-[0_0_15px_rgba(56,189,248,0.6)]' : bgClass}`}>
                            {day}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10 flex flex-col items-center">
                              <span>{day} {monthName.split(' ')[0]}</span>
                              <span className="text-[9px] font-normal text-brand-300">{usage === 0 ? 'No Data' : `${usage} Glasses`}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
                    <div className="flex justify-between items-end mb-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2"><ShieldCheck className="text-emerald-400 w-5 h-5" />Safety Checklist</h3>
                      <span className="text-xs font-black text-emerald-400 tracking-widest uppercase bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">{checklist.filter(Boolean).length} / {CHECKLIST_ITEMS.length}</span>
                    </div>
                    <div className="w-full h-1 bg-black/30 rounded-full mb-6 overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${(checklist.filter(Boolean).length / CHECKLIST_ITEMS.length) * 100}%` }} className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                    </div>
                    <div className="space-y-3 relative z-10">
                      {CHECKLIST_ITEMS.map((item, index) => (
                        <button key={index} onClick={() => toggleChecklist(index)} className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-300 group ${checklist[index] ? 'bg-emerald-500/10 border-emerald-500/30 text-white shadow-inner' : 'bg-black/20 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10'}`}>
                          {checklist[index] ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 transition-transform group-hover:scale-110" /> : <Circle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5 transition-transform group-hover:scale-110" />}
                          <span className={`text-xs sm:text-sm font-medium leading-snug transition-all ${checklist[index] ? 'line-through opacity-50' : ''}`}>{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* TAB 2: LIVE COMMUNITY ALERTS (NOW FETCHED FROM BACKEND) */}
            {activeTab === 'community' && (
              <motion.div key="community" variants={staggerContainer} initial="hidden" animate="show" exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }} className="flex flex-col gap-6">
                
                <motion.div variants={cardVariant} className="bg-gradient-to-br from-amber-900/40 to-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-8 border border-amber-500/30 shadow-2xl flex items-center gap-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                  <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                    <Radio className="w-8 h-8 text-amber-400 animate-pulse" />
                  </div>
                  <div className="relative z-10">
                    <h2 className="text-3xl font-black text-white tracking-tight mb-1">Global Community Feed</h2>
                    <p className="text-amber-200/80 font-medium">Real-time local water safety reports shared with all citizens.</p>
                  </div>
                </motion.div>

                <motion.form variants={cardVariant} onSubmit={handlePostAlert} className="bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/10 flex flex-col md:flex-row gap-4 shadow-xl">
                  <div className="flex-grow flex gap-4">
                    <select 
                      value={newAlertType} 
                      onChange={e => setNewAlertType(e.target.value as any)}
                      className="bg-black/30 border border-white/10 rounded-xl px-4 text-sm font-bold text-slate-300 outline-none focus:border-amber-400"
                    >
                      <option value="info" className="bg-slate-900">ℹ️ Info</option>
                      <option value="warning" className="bg-slate-900">⚠️ Warning</option>
                      <option value="danger" className="bg-slate-900">🚨 Critical</option>
                    </select>
                    <input 
                      type="text" 
                      value={newAlert} 
                      onChange={e => setNewAlert(e.target.value)} 
                      placeholder="Report a local issue..." 
                      className="flex-grow bg-black/30 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-amber-400 transition-colors" 
                    />
                  </div>
                  <button type="submit" className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2">
                    <BellRing className="w-5 h-5" /> Post Alert
                  </button>
                </motion.form>

                <motion.div variants={cardVariant} className="space-y-4">
                  {alerts.length === 0 ? (
                    <div className="bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-16 border border-white/10 shadow-lg flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                        <CheckCircle className="w-10 h-10 text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2 tracking-tight">All Clear!</h3>
                      <p className="text-slate-400 font-medium max-w-md">Your community water sources are currently safe. No active alerts reported globally.</p>
                    </div>
                  ) : (
                    alerts.map((alert) => {
                      const alertTime = new Date(alert.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
                      return (
                      <div key={alert.id} className={`backdrop-blur-2xl rounded-[1.5rem] p-6 border shadow-lg transition-all hover:scale-[1.01] 
                        ${alert.type === 'danger' ? 'bg-rose-900/20 border-rose-500/30' : alert.type === 'warning' ? 'bg-amber-900/20 border-amber-500/30' : 'bg-blue-900/20 border-blue-500/30'}
                      `}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            {alert.type === 'danger' && (
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                              </span>
                            )}
                            {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                            {alert.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
                            
                            <span className="font-bold text-white text-lg">{alert.title}</span>
                          </div>
                          <span className="text-xs font-black bg-black/40 px-3 py-1.5 rounded-full text-slate-300 border border-white/5 uppercase tracking-wider">{alertTime}</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm font-bold text-slate-400 ml-6">
                          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {alert.location}</span>
                          <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {alert.author}</span>
                        </div>
                      </div>
                    )})
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* TAB 3 (Health Checker) REMAIN UNCHANGED FOR BREVITY */}
            {activeTab === 'health' && (
              <motion.div key="health" variants={staggerContainer} initial="hidden" animate="show" exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }} className="flex flex-col gap-6">
                <motion.div variants={cardVariant} className="bg-gradient-to-br from-rose-900/40 to-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-8 border border-rose-500/30 shadow-2xl flex items-center gap-6">
                  <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                    <Stethoscope className="w-8 h-8 text-rose-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-1">Diagnostic AI</h2>
                    <p className="text-rose-200/80 font-medium">Select your symptoms to receive an instant risk assessment.</p>
                  </div>
                </motion.div>

                <motion.div variants={cardVariant} className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Select Symptoms</h3>
                    <div className="space-y-3">
                      {SYMPTOMS.map((symp) => (
                        <button key={symp.id} onClick={() => toggleSymptom(symp.id)} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 font-bold group
                          ${selectedSymptoms[symp.id] ? 'bg-rose-500/20 border-rose-500/50 text-white shadow-inner' : 'bg-black/20 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'}`}>
                          {symp.label} 
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                            ${selectedSymptoms[symp.id] ? 'border-rose-400 bg-rose-500' : 'border-slate-600 group-hover:border-slate-400'}`}>
                            {selectedSymptoms[symp.id] && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl flex flex-col">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Risk Assessment</h3>
                    <div className={`flex-grow rounded-2xl p-8 border flex flex-col items-center text-center relative overflow-hidden transition-colors duration-500
                      ${diagnosis?.status === 'danger' ? 'bg-rose-900/30 border-rose-500/40' : diagnosis?.status === 'caution' ? 'bg-amber-900/30 border-amber-500/40' : 'bg-emerald-900/30 border-emerald-500/40'}`}>
                      <div className="relative w-32 h-32 mb-6">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="56" className="stroke-black/50" strokeWidth="12" fill="none" />
                          <motion.circle 
                            initial={{ strokeDashoffset: 352 }} animate={{ strokeDashoffset: 352 - (352 * riskLevel) / 100 }} transition={{ duration: 1, type: 'spring' } as any}
                            cx="64" cy="64" r="56" 
                            className={`transition-all duration-1000 ${diagnosis?.status === 'danger' ? 'stroke-rose-500' : diagnosis?.status === 'caution' ? 'stroke-amber-400' : 'stroke-emerald-400'}`} 
                            strokeWidth="12" fill="none" strokeDasharray="352" strokeLinecap="round" 
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Gauge className={`w-8 h-8 mb-1 ${diagnosis?.status === 'danger' ? 'text-rose-400' : diagnosis?.status === 'caution' ? 'text-amber-400' : 'text-emerald-400'}`} />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">{riskLevel}% Risk</span>
                        </div>
                      </div>
                      <h4 className={`text-2xl font-black mb-3 tracking-tight ${diagnosis?.status === 'danger' ? 'text-rose-400' : diagnosis?.status === 'caution' ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {diagnosis?.title}
                      </h4>
                      <p className="text-white/90 font-medium leading-relaxed mb-6">{diagnosis?.desc}</p>
                      <div className="w-full text-left bg-black/40 p-4 rounded-xl border border-white/10 mt-auto">
                        <h5 className="text-xs font-black text-white/50 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4" /> Clinical Context
                        </h5>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">{diagnosis?.details}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* UPGRADED TAB 4: COST CALCULATOR (NOW SAVES TO BACKEND) */}
            {activeTab === 'calculator' && (
              <motion.div key="calculator" variants={staggerContainer} initial="hidden" animate="show" exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }} className="flex flex-col gap-6">
                <motion.div variants={cardVariant} className="bg-gradient-to-br from-emerald-900/40 to-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-8 border border-emerald-500/30 shadow-2xl flex items-center gap-6">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <Calculator className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tight mb-1">Financial Estimator</h2>
                    <p className="text-emerald-200/80 font-medium">Your personalized cost projection synced to your account.</p>
                  </div>
                </motion.div>
                
                <motion.div variants={cardVariant} className="bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/10 shadow-2xl flex flex-col">
                  
                  {/* SLIDERS ROW */}
                  <div className="mb-10 grid md:grid-cols-2 gap-10 bg-black/20 p-6 rounded-[1.5rem] border border-white/5">
                    <div>
                      <label className="flex justify-between items-end mb-4">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Family Size</span>
                        <span className="text-emerald-400 text-2xl font-black">{familySize} <span className="text-sm">Members</span></span>
                      </label>
                      <input type="range" min="1" max="12" value={familySize} onChange={(e) => handleUpdateFamilySize(parseInt(e.target.value))} className="w-full h-3 bg-black rounded-lg appearance-none cursor-pointer accent-emerald-500 shadow-inner" />
                    </div>
                    <div>
                      <label className="flex justify-between items-end mb-4">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Local 20L Can Cost</span>
                        <span className="text-emerald-400 text-2xl font-black">₹{waterCanCost}</span>
                      </label>
                      <input type="range" min="5" max="150" step="1" value={waterCanCost} onChange={(e) => handleUpdateWaterCost(parseInt(e.target.value))} className="w-full h-3 bg-black rounded-lg appearance-none cursor-pointer accent-emerald-500 shadow-inner" />
                    </div>
                  </div>

                  {/* DATA VISUALIZATION: BAR CHARTS */}
                  <div className="mb-8 relative h-72 border-b border-l border-white/10 flex items-end justify-around pb-0 pl-4 pt-10">
                     {/* Y-Axis Grid Lines */}
                     <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-0 pl-4 opacity-20">
                        <div className="border-t border-white/20 w-full h-0"></div>
                        <div className="border-t border-white/20 w-full h-0"></div>
                        <div className="border-t border-white/20 w-full h-0"></div>
                        <div className="border-t border-white/20 w-full h-0"></div>
                     </div>
                     
                     <div className="w-1/4 max-w-[100px] flex justify-center items-end relative h-full group">
                        <div className="absolute -top-8 text-center w-full opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="bg-rose-500/20 text-rose-300 text-[10px] font-black px-2 py-1 rounded border border-rose-500/50">₹{bottled5Years.toLocaleString()}</span>
                        </div>
                        <motion.div initial={{ height: 0 }} animate={{ height: getBarHeight(bottled5Years) }} transition={{ duration: 1, type: "spring" } as any} className="w-full bg-gradient-to-t from-rose-900 to-rose-500 rounded-t-xl border border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.3)] flex items-end justify-center pb-2">
                          <span className="text-white/50 text-[10px] font-black -rotate-90 origin-bottom mb-8 whitespace-nowrap">Bottled Water</span>
                        </motion.div>
                     </div>

                     <div className="w-1/4 max-w-[100px] flex justify-center items-end relative h-full group">
                        <div className="absolute -top-8 text-center w-full opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black px-2 py-1 rounded border border-amber-500/50">₹{boiling5Years.toLocaleString()}</span>
                        </div>
                        <motion.div initial={{ height: 0 }} animate={{ height: getBarHeight(boiling5Years) }} transition={{ duration: 1, type: "spring", delay: 0.1 } as any} className="w-full bg-gradient-to-t from-amber-900 to-amber-500 rounded-t-xl border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-end justify-center pb-2">
                          <span className="text-white/50 text-[10px] font-black -rotate-90 origin-bottom mb-8 whitespace-nowrap">Boiling (LPG)</span>
                        </motion.div>
                     </div>

                     <div className="w-1/4 max-w-[100px] flex justify-center items-end relative h-full group">
                        <div className="absolute -top-8 text-center w-full opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-1 rounded border border-emerald-500/50">₹{filter5Years.toLocaleString()}</span>
                        </div>
                        <motion.div initial={{ height: 0 }} animate={{ height: getBarHeight(filter5Years) }} transition={{ duration: 1, type: "spring", delay: 0.2 } as any} className="w-full bg-gradient-to-t from-emerald-900 to-emerald-500 rounded-t-xl border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-end justify-center pb-2">
                          <span className="text-white/50 text-[10px] font-black -rotate-90 origin-bottom mb-8 whitespace-nowrap">RO Filter</span>
                        </motion.div>
                     </div>
                  </div>
                  
                  <div className="text-center mb-8">
                     <p className="text-xs font-black text-slate-500 uppercase tracking-widest">5-Year Projected Cost Comparison</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-black/20 border border-white/5 rounded-2xl p-6 text-center hover:bg-white/5 transition-colors group">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-rose-400 transition-colors">Buying Bottled</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm"><span className="text-slate-500 font-bold">1 Year</span><span className="text-white font-black">₹{bottledYearly.toLocaleString()}</span></div>
                        <div className="flex justify-between items-center text-sm border-t border-white/5 pt-3"><span className="text-slate-500 font-bold">5 Years</span><span className="text-rose-400 font-black text-lg">₹{bottled5Years.toLocaleString()}</span></div>
                      </div>
                    </div>
                    <div className="bg-black/20 border border-white/5 rounded-2xl p-6 text-center hover:bg-white/5 transition-colors group">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-amber-400 transition-colors">Boiling at Home</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm"><span className="text-slate-500 font-bold">1 Year</span><span className="text-white font-black">₹{boilingYearly.toLocaleString()}</span></div>
                        <div className="flex justify-between items-center text-sm border-t border-white/5 pt-3"><span className="text-slate-500 font-bold">5 Years</span><span className="text-amber-400 font-black text-lg">₹{boiling5Years.toLocaleString()}</span></div>
                      </div>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(16,185,129,0.1)] relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none"></div>
                      <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-4 relative z-10">RO Filter (Best Value)</h3>
                      <div className="space-y-3 relative z-10">
                        <div className="flex justify-between items-center text-sm"><span className="text-slate-400 font-bold">1 Year</span><span className="text-white font-black">₹{filterYearly.toLocaleString()}</span></div>
                        <div className="flex justify-between items-center text-sm border-t border-emerald-500/20 pt-3"><span className="text-slate-400 font-bold">5 Years</span><span className="text-emerald-400 font-black text-lg">₹{filter5Years.toLocaleString()}</span></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* TAB 5 & 6 Unchanged */}
            
            {activeTab === 'study' && (
              <motion.div key="study" variants={staggerContainer} initial="hidden" animate="show" exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }} className="flex flex-col gap-6">
                <motion.div variants={cardVariant} className="bg-blue-500/20 backdrop-blur-xl rounded-[2rem] p-8 border border-blue-500/50 shadow-2xl flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-500/30 rounded-2xl flex items-center justify-center shrink-0">
                    <FileText className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-blue-400 mb-1">Local Survey Data</h2>
                    <p className="text-blue-200/80">Insights from the official Narasaraopeta Municipality Safe Drinking Water Survey.</p>
                  </div>
                </motion.div>

                <motion.div variants={cardVariant} className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-4">Survey Overview</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                      A detailed study was conducted involving <strong>50 selected households</strong> in the Narasaraopeta Municipality to understand drinking water practices, common sources, and disease prevalence.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            {activeTab === 'directory' && (
              <motion.div key="directory" variants={staggerContainer} initial="hidden" animate="show" exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }} className="flex flex-col gap-6">
                <motion.div variants={cardVariant} className="bg-indigo-500/20 backdrop-blur-xl rounded-[2rem] p-8 border border-indigo-500/50 shadow-2xl flex items-center gap-6">
                  <div className="w-16 h-16 bg-indigo-500/30 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone className="w-8 h-8 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-indigo-400 mb-1">Local Emergency Directory</h2>
                    <p className="text-indigo-200/80">Important contacts and resources for Narasaraopeta residents.</p>
                  </div>
                </motion.div>

                <motion.div variants={cardVariant} className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-xl hover:border-indigo-500/50 transition-colors">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                      <Beaker className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Municipal Water Testing Lab</h3>
                    <p className="text-slate-400 text-sm mb-6">Provides free water quality testing for municipal tap users and borewell verification.</p>
                    <div className="mt-auto flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                      <Phone className="w-5 h-5 text-indigo-400" />
                      <span className="text-white font-bold tracking-wider">1800-425-TEST</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
