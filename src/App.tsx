/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  LayoutDashboard, 
  BarChart3, 
  Zap, 
  Megaphone, 
  Users, 
  FileText, 
  Search, 
  TrendingUp, 
  Activity, 
  MousePointer2,
  Settings,
  Bell,
  ChevronRight
} from 'lucide-react';

export default function App() {
  return (
    <div className="flex min-h-screen w-full bg-[#0A0A0B] text-zinc-400 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-zinc-800 flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center gap-3 text-white mb-10 group cursor-pointer">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight italic">NEONX</span>
          </div>
          
          <nav className="space-y-8">
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-4">Overview</p>
              <a href="#" className="flex items-center gap-3 text-indigo-400 group transition-all duration-200 py-1">
                <div className="w-1 h-4 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                <LayoutDashboard className="w-4 h-4" />
                <span className="font-medium">Dashboard</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 hover:text-white transition-all duration-200 py-1 group">
                <BarChart3 className="w-4 h-4 group-hover:text-indigo-400" />
                Analytics
              </a>
              <a href="#" className="flex items-center gap-3 px-4 hover:text-white transition-all duration-200 py-1 group">
                <Activity className="w-4 h-4 group-hover:text-indigo-400" />
                Performance
              </a>
            </div>
            
            <div className="space-y-3 pt-2">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-4">Management</p>
              <a href="#" className="flex items-center gap-3 px-4 hover:text-white transition-all duration-200 py-1 group">
                <Megaphone className="w-4 h-4 group-hover:text-indigo-400" />
                Campaigns
              </a>
              <a href="#" className="flex items-center gap-3 px-4 hover:text-white transition-all duration-200 py-1 group">
                <Users className="w-4 h-4 group-hover:text-indigo-400" />
                Audiences
              </a>
              <a href="#" className="flex items-center gap-3 px-4 hover:text-white transition-all duration-200 py-1 group">
                <FileText className="w-4 h-4 group-hover:text-indigo-400" />
                Reporting
              </a>
            </div>

            <div className="space-y-3 pt-2 border-t border-zinc-800/50">
              <a href="#" className="flex items-center gap-3 px-4 hover:text-white transition-all duration-200 py-1 group">
                <Settings className="w-4 h-4 group-hover:text-indigo-400" />
                Settings
              </a>
            </div>
          </nav>
        </div>
        
        <div className="mt-auto p-8">
          <div className="bg-zinc-900/40 rounded-2xl p-5 border border-zinc-800/50 hover:border-indigo-500/30 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-white font-semibold">Pro Account</p>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
            </div>
            <p className="text-[10px] text-zinc-500 mb-4">Expires in 14 days</p>
            <button className="w-full bg-indigo-600 text-white text-[11px] font-bold py-2.5 rounded-xl hover:bg-indigo-500 active:scale-95 transition-all duration-200 uppercase tracking-widest shadow-lg shadow-indigo-600/20">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-6 md:px-10 bg-[#0A0A0B]/80 backdrop-blur-xl sticky top-0 z-50">
          <div>
            <h1 className="text-white text-lg font-semibold tracking-tight">Command Center</h1>
            <p className="text-[10px] md:text-xs text-zinc-500 font-medium">Real-time system intelligence</p>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <div className="relative hidden lg:block">
              <input 
                type="text" 
                placeholder="Search commands..." 
                className="bg-zinc-900/50 border border-zinc-800 rounded-full py-2 px-10 text-xs w-72 focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-900 transition-all duration-300 placeholder:text-zinc-600"
              />
              <Search className="w-4 h-4 absolute left-4 top-2.5 text-zinc-600" />
              <div className="absolute right-4 top-2 text-[10px] text-zinc-600 border border-zinc-800 px-1.5 rounded bg-zinc-900">⌘K</div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-6">
              <button className="text-zinc-500 hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0A0A0B]"></span>
              </button>
              
              <div className="w-[1px] h-6 bg-zinc-800 hidden md:block"></div>
              
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 border-2 border-zinc-800 group-hover:border-indigo-500 transition-all duration-300 p-0.5 shadow-lg shadow-indigo-600/10">
                  <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">Marcus Travalen</p>
                  <p className="text-[10px] text-zinc-500 font-medium">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Body Area */}
        <div className="p-6 md:p-10 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-indigo-600/10 border border-indigo-500/20 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back, Marcus!</h2>
              <p className="text-zinc-400 max-w-md text-sm md:text-base">
                Your systems are currently performing at <span className="text-emerald-400 font-bold">99.8%</span> efficiency. No critical alerts detected.
              </p>
            </div>
            <button className="relative z-10 px-6 py-3 bg-white text-indigo-900 font-bold rounded-2xl text-sm hover:bg-zinc-100 transition-colors flex items-center gap-2 group">
              View Audit Log
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* Abstract Background Shapes */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-violet-500/10 rounded-full blur-2xl"></div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Monthly Revenue', value: '$42,108.00', trend: '+12.4%', up: true, icon: TrendingUp },
              { label: 'Active Sessions', value: '12,842', trend: '+4.2%', up: true, icon: Activity },
              { label: 'Conversion Rate', value: '3.24%', trend: '-0.8%', up: false, icon: MousePointer2 }
            ].map((metric, i) => (
              <div key={i} className="bg-[#121214] border border-zinc-800/80 p-7 rounded-3xl hover:border-indigo-500/40 transition-all duration-300 group shadow-xl shadow-black/20">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">{metric.label}</p>
                  <div className={`p-2 rounded-xl transition-colors ${metric.up ? 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white'}`}>
                    <metric.icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <h2 className="text-3xl font-light text-white tracking-tight">{metric.value}</h2>
                  <span className={`text-[11px] font-bold pb-2 transition-transform duration-300 group-hover:-translate-y-0.5 ${metric.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {metric.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Table Section */}
          <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
            <div className="px-8 py-6 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/20">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">System Node Status</h3>
                <p className="text-[10px] text-zinc-500">Last updated: 2 minutes ago</p>
              </div>
              <button className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold hover:text-indigo-300 transition-colors bg-indigo-500/5 px-4 py-2 rounded-full border border-indigo-500/10 hover:border-indigo-500/30">
                Export Data
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] text-zinc-500 bg-black/40 uppercase tracking-[0.15em]">
                  <tr>
                    <th className="px-8 py-4 font-bold">Event Source</th>
                    <th className="px-8 py-4 font-bold">Status</th>
                    <th className="px-8 py-4 font-bold">System Load</th>
                    <th className="px-8 py-4 font-bold text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {[
                    { source: 'US-East-1 Edge', status: 'Online', load: '68%', color: 'emerald', time: '14:22:01' },
                    { source: 'Data Warehouse Alpha', status: 'Online', load: '24%', color: 'emerald', time: '14:18:45' },
                    { source: 'Main API Cluster', status: 'Degraded', load: '85%', color: 'amber', time: '14:15:30' },
                    { source: 'Asset Pipeline', status: 'Online', load: '52%', color: 'emerald', time: '14:12:12' }
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-zinc-800/30 hover:bg-indigo-500/[0.03] transition-colors group">
                      <td className="px-8 py-5 text-white font-semibold flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${row.color}-500 shadow-[0_0_8px_rgba(var(--${row.color}-red),0.4)]`}></div>
                        {row.source}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          row.status === 'Online' 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-zinc-800/50 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--color-rgb),0.3)] ${
                                row.color === 'emerald' ? 'bg-indigo-500 shadow-indigo-500/40' : 'bg-amber-500 shadow-amber-500/40'
                              }`}
                              style={{ width: row.load }}
                            ></div>
                          </div>
                          <span className="text-zinc-500 font-mono text-[10px]">{row.load}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right text-zinc-500 font-mono font-medium tracking-tight group-hover:text-indigo-400 transition-colors">
                        {row.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
