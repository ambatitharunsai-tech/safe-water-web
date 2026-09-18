import React, { useState } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function AIAssistant() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Hello! I am AquaBot, your AI water safety and hydration assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-purple-500/30 shadow-2xl overflow-hidden relative">
      <div className="bg-purple-500/20 p-6 border-b border-purple-500/30 flex items-center gap-4 shrink-0">
        <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
          <Bot className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-purple-400">AquaBot AI</h2>
          <p className="text-purple-200/80 text-sm">Your intelligent hydration & safety assistant</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-brand-500' : 'bg-purple-500/40'}`}>
              {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-purple-200" />}
            </div>
            <div className={`p-4 max-w-[80%] rounded-2xl ${msg.role === 'user' ? 'bg-brand-500/20 text-white border border-brand-500/30 rounded-tr-none' : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none'}`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/40 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-purple-200" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-none flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 bg-black/40 border-t border-white/10 shrink-0">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about water safety, purification, or hydration..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:hover:bg-purple-500 text-white rounded-lg px-3 flex items-center justify-center transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
