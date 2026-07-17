import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { showToast } from '../UI/Toast';
import { 
  User, 
  Key, 
  Sliders, 
  CreditCard, 
  Trash2, 
  Mail, 
  Bell, 
  Settings, 
  ShieldAlert, 
  LogOut 
} from 'lucide-react';
import { getGeminiApiKey, setGeminiApiKey } from '../../services/agentService';

export const SettingsPage: React.FC = () => {
  const [profileName, setProfileName] = useState('Forge Guest');
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [temperature, setTemperature] = useState(0.4);
  const [modelType, setModelType] = useState('gemini-1.5-flash');

  const [notifications, setNotifications] = useState({
    sessionCompletions: true,
    agentAlerts: false,
    weeklySummaries: true
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile configuration updated.', 'success');
  };

  const handleSaveApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(apiKey);
    showToast('Gemini API Credential locked inside local storage!', 'success');
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to permanently delete your student profile? This action is irreversible.")) {
      showToast('Profile deletion triggered (mock).', 'danger');
    }
  };

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      
      {/* Page Title */}
      <div className="border-b border-white/5 pb-4">
        <h2 className="text-2xl font-bold font-outfit text-white">System Settings</h2>
        <p className="text-sm text-zinc-400 font-light mt-1">Configure user profiles, AI prompt temperatures, APIs, and billing models.</p>
      </div>

      <div className="space-y-6">
        
        {/* 1. Profile Section */}
        <Card className="p-6" hoverEffect={false}>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <User size={16} /> Student Credentials
          </h3>
          
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 font-bold uppercase block">Display Name</label>
              <input 
                type="text" 
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)} 
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 font-bold uppercase block">Email Address</label>
              <div className="flex gap-2 items-center text-xs text-zinc-400 bg-white/3 border border-white/5 px-4 py-2.5 rounded-xl">
                <Mail size={13} /> scholar.demo@learnforge.ai
              </div>
            </div>
            <Button type="submit" variant="primary" size="sm" className="text-xs">
              Save Changes
            </Button>
          </form>
        </Card>

        {/* 2. API Key Section */}
        <Card className="p-6" hoverEffect={false}>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Key size={16} /> Gemini API Locker
          </h3>
          
          <form onSubmit={handleSaveApiKeys} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 font-bold uppercase block">Gemini API Key</label>
              <input 
                type="password" 
                placeholder="AIzaSy..." 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
              />
              <span className="text-[9px] text-zinc-500 leading-normal block">
                Bypasses cloud backend processing queue by routing requests client-side directly to Google Studio services.
              </span>
            </div>
            <Button type="submit" variant="glass" size="sm" className="text-xs">
              Lock Key
            </Button>
          </form>
        </Card>

        {/* 3. AI Preferences */}
        <Card className="p-6" hoverEffect={false}>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Sliders size={16} /> Model Hyperparameters
          </h3>

          <div className="space-y-5 max-w-md text-xs">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 font-bold uppercase block">LLM Provider Node</label>
              <select 
                value={modelType} 
                onChange={(e) => setModelType(e.target.value)} 
                className="w-full px-4 py-2.5 rounded-xl glass-input bg-slate-950/60"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Default)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase">
                <span>Temperature</span>
                <span>{temperature}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={temperature} 
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-white"
              />
              <span className="text-[9px] text-zinc-500 leading-normal block">
                Lower values make responses more factual; higher values increase analogical creativity.
              </span>
            </div>
          </div>
        </Card>

        {/* 4. Billing Subscriptions */}
        <Card className="p-6" hoverEffect={false}>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <CreditCard size={16} /> Billing Subscriptions
          </h3>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/3 border border-white/5 p-4 rounded-xl">
            <div className="space-y-1">
              <div className="text-xs font-bold text-white">LearnForge Sandbox Pro</div>
              <p className="text-[10px] text-zinc-400">Next renewal date: August 17, 2026</p>
            </div>
            
            <div className="flex items-center gap-4 text-xs">
              <span className="font-bold text-white">$15 / month</span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                Active
              </span>
            </div>
          </div>
        </Card>

        {/* 5. Danger zone */}
        <Card className="p-6 border-red-500/15" hoverEffect={false}>
          <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <ShieldAlert size={16} className="text-rose-400" /> Danger Zone
          </h3>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <div className="text-xs font-bold text-white">Delete Profile Account</div>
              <p className="text-[10px] text-zinc-500">Purges cached note documents, certificates, and streak registers.</p>
            </div>
            
            <Button variant="danger" size="sm" onClick={handleDeleteAccount} className="text-xs flex items-center gap-1">
              <Trash2 size={12} /> Purge Account
            </Button>
          </div>
        </Card>

      </div>

    </div>
  );
};
export default SettingsPage;
