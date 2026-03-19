import React from 'react';

interface HeatData {
  rank: string;
  name: string;
  team: string;
  lane: string;
  time: string;
  avatarUrl: string;
  isTop?: boolean;
  isRecordPace?: boolean;
  grayscale?: boolean;
}

export const ChampionshipScreen: React.FC = () => {
  const heats: HeatData[] = [
    {
      rank: "01",
      name: "MARCUS REED",
      team: "Titan Aquatics",
      lane: "Lane 4",
      time: "21.42s",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1U9eAOoLC-Li1aeARZD1KbXaKh1pC_8GAZJqc6r0F6i5y2Po53GGVMpTSqrM_Y4cyUYj0IIjkImMol50aLiVGw5wiwHAdfNio-FoU0JxL0Cs4HvO3NgE0qEuW-TBVkGr0hF7-kK6afPohb7qyUZ_uClCaefdKN8zBfFcsFBlmr3JEnTPpGkp-lqLb3NarTsHLCMRCvR9KuPuTUcDjjLB8dVdCFfiwexYiHw_j-wAZzH-HJ2_rGw7td9CTCiws7fi-E67Ma2ke_DCE",
      isTop: true,
      isRecordPace: true,
    },
    {
      rank: "02",
      name: "SARAH CHEN",
      team: "Pacific Blue",
      lane: "Lane 5",
      time: "21.89s",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuChq9C06fqhdjTYi-aQywidG2bgeWPkBmTlsHR98HWKoWx6AZ2Mv4gMXm1r959WOvZlzdgpeO7BajAg9XaXPo9nIIMjNWR5VY-E4j3N8fws95qEUPbYr2gMEtNsoo9C81EWzzqm4LI1UGnE1jvYfvGm--q4zEsA1ZEDg4Ens-IUNSfFIMFxFA6ilP7I8qRQkixk3uiM01ab7NiAuPGuMqpxGloE57nfOkmBiBACIeaGn6S6nLx729uQTItF3JQ-fMPJ3NgOt8F-LErU",
      grayscale: true,
    },
    {
      rank: "03",
      name: "JACK DAWSON",
      team: "Vortex Swim",
      lane: "Lane 3",
      time: "22.01s",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-1kpqY6ArTnr3fkTiKHTjEc_C9OAcpsYqCiatp3Wj0ZxCmp-eKligfGHAL0zO66o_qE5oyBCbiiZEGmTcTjJmr8BmTfcnCiwHhfTUide7zyeOzBCS-NWhG3m0I8Wx-wgneOfHlYrdDjHGIv2OUcES-ren-o7H4R9hkZYG65NPKNHTORZMRIscSwXs-_iedrMODb-dwRnWzDDBkzwA122v0Oecw2JOy4vM5ykLZc3n25xrDrwMnQiw7Fssjk13l_Dx7PJ9WmTX-ZMZ",
      grayscale: true,
    },
  ];

  return (
    <div className="bg-background text-on-surface font-body overflow-x-hidden dark">
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}} className="text-primary">〜</span>
          <span className="font-headline font-bold text-xl tracking-tighter">SWIM26</span>
        </div>
        <div className="bg-surface-container-highest px-4 py-1 -skew-x-12 border border-primary/30">
          <div className="skew-x-12 flex items-center gap-4 text-xs font-label font-bold text-primary">
            <span>1,250 Gold</span>
            <span className="text-on-surface-variant">|</span>
            <span>50 SP</span>
          </div>
        </div>
      </nav>

      <main className="relative min-h-screen pt-16 pb-24">
        {/* Hero Section with Background */}
        <div className="relative h-[45vh] w-full overflow-hidden">
          <img className="absolute inset-0 w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx1sRlpWamMkB7FEIkDklAKTT4ZjDB-b5CbRzW_FNAVeZYANVgz__S-UTlhvXXaA6PCzMCp44FK10JVYu-zVHcrqf1GBD9hKFsNpkgE5_a2uu6iWlfkxJ7tkpPipXeg5mI01qeVNqO7nxUQfKdmmRicHpCTlARKQC71hBW5AbMsItbUD4HvfhzHBuK6iDv4-mrLHWzaj1q6on4iKYeqZ59dCQXYvefWt0UF4ZB7nQYAFPjZMJUZdGcSwjyLPHar16AnmPIx43lrZaE" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="mb-4 relative">
              <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full"></div>
              <span style={{fontSize:'96px', lineHeight:1, display:'inline-block', filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.4))'}} className="text-yellow-400">🏅</span>
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-bold italic uppercase tracking-tighter leading-none -skew-x-12">
              National<br /><span className="text-primary">Championships</span>
            </h1>
            <p className="mt-4 font-label text-sm uppercase tracking-[0.3em] text-on-surface-variant">Season 26 • Elite Division</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 glass-panel border-l-4 border-primary" style={{background: 'rgba(28, 38, 57, 0.6)', backdropFilter: 'blur(12px)'}}>
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] uppercase font-label text-on-surface-variant">Prize Pool</p>
                <p className="text-2xl font-headline font-bold text-yellow-400">50,000 GOLD</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-label text-on-surface-variant">Registration</p>
                <p className="text-2xl font-headline font-bold">CLOSING SOON</p>
              </div>
            </div>
            <button className="bg-primary hover:bg-primary-dim text-on-primary font-headline font-bold px-10 py-4 uppercase tracking-wider -skew-x-12 transition-all">
              <span className="inline-block skew-x-12">Register Now</span>
            </button>
          </div>
        </div>

        {/* Competition Grid */}
        <div className="max-w-5xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Top 8 Heats */}
          <div className="lg:col-span-7">
            <div className="flex items-end justify-between mb-8 border-b border-outline-variant/30 pb-2">
              <h2 className="font-headline text-3xl font-bold italic uppercase">Top 8 Heats</h2>
              <span className="font-label text-xs text-primary font-bold">LIVE UPDATES</span>
            </div>
            <div className="space-y-3">
              {heats.map((heat, idx) => (
                <div key={heat.rank} className={`group flex items-center justify-between p-4 ${heat.isTop ? 'bg-surface-container-low' : 'bg-surface-container-low/60'} hover:bg-surface-container-high transition-colors relative overflow-hidden`}>
                  {heat.isTop && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>}
                  <div className="flex items-center gap-6">
                    <span className="font-headline text-2xl font-bold italic text-on-surface-variant w-8">{heat.rank}</span>
                    <div className={`h-12 w-12 bg-surface-variant relative ${heat.grayscale ? 'grayscale opacity-50' : ''}`}>
                      <img className="w-full h-full object-cover" src={heat.avatarUrl} />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-lg leading-none">{heat.name}</h3>
                      <p className="text-xs font-label text-on-surface-variant uppercase mt-1">{heat.team} • {heat.lane}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-headline font-bold text-xl text-primary tracking-tight">{heat.time}</p>
                    {heat.isRecordPace && <div className="bg-yellow-400/10 text-yellow-400 text-[10px] px-2 py-0.5 inline-block font-bold">RECORD PACE</div>}
                  </div>
                </div>
              ))}
              <div className="p-4 border border-dashed border-outline-variant/30 flex justify-center cursor-pointer hover:bg-surface-container-low transition-all">
                <span className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest">View Full Leaderboard</span>
              </div>
            </div>
          </div>

          {/* Right Column: Tournament Bracket Mini & Stats */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="font-headline text-xl font-bold italic uppercase mb-4 border-l-4 border-yellow-400 pl-4">Quarter Finals</h2>
              <div className="glass-panel p-6 space-y-6" style={{background: 'rgba(28, 38, 57, 0.6)', backdropFilter: 'blur(12px)'}}>
                {/* Matchup 1 */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center bg-surface-container-highest p-2 border-r-4 border-primary">
                    <span className="font-label text-xs font-bold">M. REED</span>
                    <span className="font-headline font-bold text-primary">WIN</span>
                  </div>
                  <div className="flex justify-between items-center bg-surface-container p-2 opacity-50">
                    <span className="font-label text-xs font-bold">T. WOLFE</span>
                    <span className="font-headline font-bold">22.4</span>
                  </div>
                </div>
                {/* Matchup 2 */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center bg-surface-container-highest p-2 border-r-4 border-yellow-400">
                    <span className="font-label text-xs font-bold">S. CHEN</span>
                    <span className="font-headline font-bold text-yellow-400">WIN</span>
                  </div>
                  <div className="flex justify-between items-center bg-surface-container p-2 opacity-50">
                    <span className="font-label text-xs font-bold">V. ROSS</span>
                    <span className="font-headline font-bold">22.1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Milestone Card */}
            <div className="relative group p-6 overflow-hidden bg-surface-container-highest" style={{borderLeft: '4px solid', borderImage: 'linear-gradient(to right, #81ecff, transparent) 1'}}>
              <div className="relative z-10">
                <p className="font-label text-[10px] uppercase text-primary font-bold mb-1">Your Standing</p>
                <h3 className="font-headline text-3xl font-bold italic mb-4">TIER: ELITE</h3>
                <div className="h-2 w-full bg-surface-container-low mb-4">
                  <div className="h-full bg-primary" style={{width: '75%'}}></div>
                </div>
                <p className="font-body text-xs text-on-surface-variant">Rank #142 globally. Need 4,500 more SP to qualify for the Semi-Finals.</p>
              </div>
              <span style={{fontSize:'128px', lineHeight:1, display:'inline-block'}} className="absolute -right-4 -bottom-4 text-on-surface/5 rotate-12">↗</span>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl border-t border-outline-variant/20 px-2 h-20 flex justify-around items-center">
        <div className="flex flex-col items-center gap-1 cursor-pointer transition-all border-t-2 border-primary px-4 pt-2">
          <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}} className="text-primary">⌂</span>
          <span className="font-label text-[10px] font-bold uppercase text-primary">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer opacity-50 hover:opacity-100 transition-all px-4 pt-2">
          <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}}>🏅</span>
          <span className="font-label text-[10px] font-bold uppercase">Career</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer opacity-50 hover:opacity-100 transition-all px-4 pt-2">
          <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}}>👥</span>
          <span className="font-label text-[10px] font-bold uppercase">Social</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer opacity-50 hover:opacity-100 transition-all px-4 pt-2">
          <span style={{fontSize:'24px', lineHeight:1, display:'inline-block'}}>🏅</span>
          <span className="font-label text-[10px] font-bold uppercase">Rewards</span>
        </div>
      </nav>

      <style>{`
        .glass-panel {
          background: rgba(28, 38, 57, 0.6);
          backdrop-filter: blur(12px);
        }
      `}</style>
    </div>
  );
};
