import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import AdminSidebar from '../components/AdminSidebar';

const Analytics = () => {
  return (
    <div className="ml-64 min-h-screen bg-surface text-on-surface font-body pb-10">
      <AdminSidebar />

      {/* Header */}
      <header className="h-16 bg-stone-50 dark:bg-stone-950 flex justify-between items-center px-8 w-full border-b border-stone-200/20">
        <div className="flex items-center gap-4">
          <span className="text-stone-400 font-label text-sm uppercase tracking-tighter">Wedlink / Analytics</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="material-symbols-outlined text-rose-900">notifications</button>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-on-surface">Admin User</p>
              <p className="text-[10px] text-stone-500">Senior Curator</p>
            </div>
            <span className="material-symbols-outlined text-3xl text-stone-400">account_circle</span>
          </div>
        </div>
      </header>

      {/* Content Canvas */}
      <div className="p-12 max-w-7xl mx-auto space-y-12">
        {/* Page Title & Filters */}
        <section className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="font-headline serif text-4xl font-bold text-on-surface">Reports & Analytics</h2>
            <p className="text-stone-500 mt-2 font-label">Global performance overview and user behavior metrics.</p>
          </div>
          <div className="flex items-center gap-3 p-1.5 bg-surface-container-low rounded-xl">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-outline-variant/10">
              <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
              <span className="text-sm font-medium">Last 30 Days</span>
            </div>
            <select className="bg-transparent border-none text-sm font-medium focus:ring-0">
              <option>All Regions</option>
              <option>North America</option>
              <option>Europe</option>
            </select>
            <select className="bg-transparent border-none text-sm font-medium focus:ring-0">
              <option>User Tier: All</option>
              <option>Free</option>
              <option>Gold</option>
              <option>Diamond</option>
            </select>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_64px_-12px_rgba(27,28,29,0.06)] border border-outline-variant/5">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Monthly Active Users</p>
            <h3 className="font-headline serif text-3xl font-bold text-primary">24,812</h3>
            <div className="mt-4 flex items-center gap-2 text-green-600">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs font-semibold">+12.4% vs prev</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_64px_-12px_rgba(27,28,29,0.06)] border border-outline-variant/5">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Match Conversion</p>
            <h3 className="font-headline serif text-3xl font-bold text-primary">68.2%</h3>
            <div className="mt-4 flex items-center gap-2 text-rose-900">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs font-semibold">+4.1% vs prev</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_64px_-12px_rgba(27,28,29,0.06)] border border-outline-variant/5">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Revenue Growth</p>
            <h3 className="font-headline serif text-3xl font-bold text-primary">$142.5k</h3>
            <div className="mt-4 flex items-center gap-2 text-stone-400">
              <span className="material-symbols-outlined text-sm">remove</span>
              <span className="text-xs font-semibold">Stable</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_64px_-12px_rgba(27,28,29,0.06)] border border-outline-variant/5">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Avg. Verification</p>
            <h3 className="font-headline serif text-3xl font-bold text-primary">4.2h</h3>
            <div className="mt-4 flex items-center gap-2 text-green-600">
              <span className="material-symbols-outlined text-sm">trending_down</span>
              <span className="text-xs font-semibold">-15% time reduction</span>
            </div>
          </div>
        </section>

        {/* Main Elegant Chart Area (PowerBI Dashboard) */}
        <section className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_32px_64px_-12px_rgba(27,28,29,0.06)] border border-outline-variant/5 relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="font-headline serif text-xl font-bold">Comprehensive PowerBI Analytics</h4>
              <p className="text-sm text-stone-500">Deep dive into matrimonial metrics via connected PowerBI instance.</p>
            </div>
          </div>
          
          <div className="w-full h-[600px] rounded-xl overflow-hidden bg-gray-50 border border-stone-100">
            {/* Condition to prevent crashing before actual credentials are given */}
            {'YOUR_EMBED_URL_HERE'.startsWith('http') ? (
              <PowerBIEmbed
                embedConfig={{
                  type: 'report',
                  id: 'YOUR_REPORT_ID_HERE',
                  embedUrl: 'YOUR_EMBED_URL_HERE',
                  accessToken: 'YOUR_ACCESS_TOKEN_HERE',
                  tokenType: models.TokenType.Embed,
                  settings: {
                    panes: {
                      filters: { expanded: false, visible: true }
                    },
                    background: models.BackgroundType.Transparent,
                  }
                }}
                cssClassName={"w-full h-full"}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-stone-400 space-y-4">
                <span className="material-symbols-outlined text-6xl">analytics</span>
                <p className="font-serif italic text-xl">Power BI Dashboard Pending Configuration</p>
                <p className="text-xs">Update `embedUrl`, `id`, and `accessToken` in AdminAnalytics.tsx with your actual Power BI values.</p>
              </div>
            )}
          </div>
        </section>

        {/* Grid of Secondary Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-surface-container-low p-8 rounded-xl">
            <h5 className="font-headline serif text-lg font-bold mb-6">User Tier Distribution</h5>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase mb-2">
                  <span>Diamond Elite</span>
                  <span>18%</span>
                </div>
                <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '18%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold uppercase mb-2">
                  <span>Gold Premium</span>
                  <span>42%</span>
                </div>
                <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container" style={{ width: '42%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold uppercase mb-2">
                  <span>Standard Free</span>
                  <span>40%</span>
                </div>
                <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                  <div className="h-full bg-stone-300" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-xl flex flex-col items-center">
            <div className="w-full">
              <h5 className="font-headline serif text-lg font-bold mb-6">Gender Demographics</h5>
            </div>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="w-full h-full rounded-full border-[16px] border-rose-900/10 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-[24px] border-rose-900 border-t-secondary-container border-l-secondary-container transform rotate-45"></div>
              </div>
              <div className="absolute text-center">
                <span className="font-headline serif text-2xl font-bold text-rose-900">48:52</span>
                <p className="text-[10px] text-stone-500 uppercase font-bold tracking-tighter">Male/Female</p>
              </div>
            </div>
            <div className="mt-8 flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-xs font-medium">Female</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary-container"></div>
                <span className="text-xs font-medium">Male</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-xl overflow-hidden relative min-h-[300px]">
            <h5 className="font-headline serif text-lg font-bold mb-2">Regional Activity</h5>
            <p className="text-xs text-stone-500 mb-6">Top performing metropolitan areas</p>
            <div className="absolute bottom-0 left-0 right-0 top-24 bg-cover bg-center opacity-40 grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAy4mQHWpf9nQf5aC1CGjZcBPN8m_6fr_OWDEhAcex5X4Hj3FSsQYJ2UkoqFRg4HOi7sZ6FJZy2UhrZCo4KYAPaTuti3q6URKxY2PE_KJYjIQ-FPxzNWZbSb89KAdg_cOcJ34ekq4pFRAI-FKIAkm_A7umL7wQMdaSvOlFPPPZMrIniEHZwmiVDowiWBnkQFASheCmJT8U2ZvVl3btm3k1ACLLSvm7sAKwOoOR5P-N0QlHJbwczlffYJY_21YBKSEozBLhuxecSzK-S')" }}></div>
            <div className="relative z-10 space-y-3 mt-4">
              <div className="flex items-center justify-between p-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/40">
                <span className="text-xs font-bold">New York City</span>
                <span className="text-xs font-medium text-rose-900">High Density</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/40">
                <span className="text-xs font-bold">London, UK</span>
                <span className="text-xs font-medium text-rose-900">Growing</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/40">
                <span className="text-xs font-bold">Paris, FR</span>
                <span className="text-xs font-medium text-tertiary">Moderate</span>
              </div>
            </div>
          </div>
        </section>

        {/* Generated Reports Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-stone-200 pb-4">
            <h4 className="font-headline serif text-2xl font-bold">Generated Reports</h4>
            <button className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-container transition-colors">Generate New Audit</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Report Items */}
            <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-outline-variant/10 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary-container/30 text-secondary rounded-lg">
                  <span className="material-symbols-outlined">summarize</span>
                </div>
                <div>
                  <h6 className="font-bold text-sm">Weekly Performance Summary</h6>
                  <p className="text-[10px] text-stone-500 uppercase tracking-tighter mt-0.5">Aug 21 - Aug 28, 2023 • PDF • 2.4 MB</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary/5 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-lg">download</span> Download
              </button>
            </div>
            
            <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-outline-variant/10 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-fixed/30 text-primary rounded-lg">
                  <span className="material-symbols-outlined">account_balance</span>
                </div>
                <div>
                  <h6 className="font-bold text-sm">Q3 Revenue & Subscription Audit</h6>
                  <p className="text-[10px] text-stone-500 uppercase tracking-tighter mt-0.5">Jul 01 - Sep 30, 2023 • CSV • 1.1 MB</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary/5 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-lg">download</span> Download
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-8 px-12 bg-surface-container-low border-t border-stone-200/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-stone-400">
          <span>© 2024 Ethereal Union Matrimonial Systems</span>
          <div className="flex gap-8">
            <a className="hover:text-primary transition-colors" href="#">System Status: Optimal</a>
            <a className="hover:text-primary transition-colors" href="#">Data Privacy Protocol</a>
            <a className="hover:text-primary transition-colors" href="#">Log Export</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Analytics;