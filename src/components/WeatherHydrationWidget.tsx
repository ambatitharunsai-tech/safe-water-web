import React, { useState, useEffect } from 'react';
import { Sun, Thermometer, Droplets, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export function WeatherHydrationWidget() {
  const [weather, setWeather] = useState<{ temp: number, description: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
          if (!response.ok) throw new Error('Weather fetch failed');
          const data = await response.json();
          
          setWeather({
            temp: data.current_weather.temperature,
            description: getWeatherDesc(data.current_weather.weathercode)
          });
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError('Location access denied. Enable it to get weather-based hydration tips.');
        setLoading(false);
      }
    );
  }, []);

  const getWeatherDesc = (code: number) => {
    if (code <= 3) return "Clear/Partly Cloudy";
    if (code <= 49) return "Foggy";
    if (code <= 69) return "Rainy";
    if (code <= 79) return "Snowy";
    return "Stormy";
  };

  const getHydrationTip = (temp: number) => {
    if (temp > 35) return "+ 1.5L extra recommended (Extreme Heat)";
    if (temp > 30) return "+ 1.0L extra recommended (Very Hot)";
    if (temp > 25) return "+ 0.5L extra recommended (Warm)";
    return "Standard hydration needed";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-900/30 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-xl w-full mb-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Sun size={120} />
      </div>
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
          <MapPin size={24} />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Local Weather & Hydration</h3>
          <p className="text-blue-300 text-sm">Real-time adjustments based on your climate</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 relative z-10">
        <div className="bg-black/20 p-4 rounded-xl flex items-center gap-4">
          <Thermometer className={weather && weather.temp > 30 ? "text-rose-400" : "text-amber-400"} size={32} />
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Current Temp</p>
            {loading ? (
              <p className="text-white font-black animate-pulse">Loading...</p>
            ) : error ? (
              <p className="text-rose-400 text-sm font-medium">{error}</p>
            ) : weather ? (
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-white">{weather.temp}°C</span>
                <span className="text-slate-300 text-sm mb-1">{weather.description}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="bg-black/20 p-4 rounded-xl flex items-center gap-4">
          <Droplets className="text-cyan-400" size={32} />
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Adjustment</p>
            {loading ? (
              <p className="text-white font-black animate-pulse">Calculating...</p>
            ) : error ? (
              <p className="text-slate-500 text-sm">Unavailable</p>
            ) : weather ? (
              <div className="flex flex-col">
                <span className="text-cyan-400 font-bold">{getHydrationTip(weather.temp)}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
