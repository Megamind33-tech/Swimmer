import React from 'react';

interface MemberData {
  id: number;
  name: string;
  level: number;
  specialty: string;
  avatarUrl: string;
  online: boolean;
  offline?: boolean;
  grayscale?: boolean;
}

export const SocialClubScreen: React.FC = () => {
  const members: MemberData[] = [
    {
      id: 1,
      name: "HYDR0_VOSS",
      level: 48,
      specialty: "Freestyle Pro",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBELpN9Tbu_FFujeNEEvGZ_D_iyVNrfPzZm0KoazQ_S2WQzKcAU7w7hVqPAqDHeBLun-2bbwiZyU7gZFOGp-_3Ad0YzH07ioRmQBVzSytnLkzQ7BCNJiohE79mJAt3sTKS3-qBrR2JQDrzHGyhn0eRjME9aRPXcMV3kUCn3CkqdbvUugZHDaTz6b6x94_61dky5a9w8GKB0bCaTb8j4mjzcTsXITAE4FcYFEwRG8ySPrK-9ZaDIirE6FknOztPhsaMBs5BMZqQyRxOJ",
      online: true,
    },
    {
      id: 2,
      name: "WAVE_RUNNER",
      level: 32,
      specialty: "Backstroke Master",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxAhsxguiT9KVaXloci75k6404hdVCtWsiylPJg0CXr44RdJ8IG-6gR6Ixu4EobKkeB0xTx94KoqEr6tp5hCVvZQKUWivp7vkMxdvFG1pb6zH4UPAzNUgR2kUsyXBz62gT9DhiyHzw6iVrAXEShGtGkq3HPFbfbStQDpgV01jlSZSLrWI9WmZJfsV3s6qJc2tJlE5n0DSL0zo9a0AdtQVZHr7yheT4qSyUUWbOAX6ugqcQXivTlN5HzCDwLr69h4LvqIX4jZ0QF635",
      online: true,
    },
    {
      id: 3,
      name: "DEPTH_CHARGE",
      level: 0,
      specialty: "Training Mode",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCckRby7_VG2-e4y7eXIk9TOjP3s1qd2rumCGRRxAeLzuWqlD8EvMLsUiYyeBe5kghEddPnHNjz6mnnWMroqUL5Ef_bYJbdn3Zd7RwzyrGVI1GbDH56K94qb22FqyTCGl8KDqax4_ru8zPC1ikYveKpt3KNrtu-avmaL9HceriCXXaTGgRU_t6e_-OVabBMIl9AEexmNwvDU2jZrT_yL7yjxUURIOkV0Tk9gMP60FqEGciTij-_DMTWSarPHrp_VUUaJJGiaS2oIN1G",
      online: false,
      offline: true,
      grayscale: true,
    },
  ];

  const chatMessages = [
    {
      id: 3,
      username: "AQUA_WOLF",
      message: "Just hit a new PR on the 200m! This game's physics are insane lately.",
      time: "13:45",
      isOwn: false,
    },
    {
      id: 2,
      username: "YOU",
      message: "Count me in. I've got the Hydro-Skins equipped. Let's crush that leaderboard.",
      time: "13:58",
      isOwn: true,
      badge: "CAPTAIN",
    },
    {
      id: 1,
      username: "FIN_REAPER",
      message: "Anyone down for the 4x100 Relay challenge starting in 5 mins? We need one more power-swimmer.",
      time: "14:02",
      isOwn: false,
      badge: "MVP",
    },
  ];

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen flex flex-col dark">
      {/* TopAppBar */}
      <header className="h-16 flex items-center justify-between px-6 bg-surface-container border-b border-outline-variant/20 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>waves</span>
          <h1 className="font-headline font-bold text-2xl tracking-tighter uppercase italic text-glow">SWIM26</h1>
        </div>
        <div className="bg-surface-container-highest px-4 py-1 flex items-center gap-4">
          <span className="font-label text-xs font-bold tracking-widest text-on-surface-variant">1,250 Gold | 50 SP</span>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-screen-2xl mx-auto w-full">
        {/* Left Column: Club Identity (Bento Style) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Club Crest Card */}
          <div className="relative overflow-hidden bg-surface-container-high p-8 flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <img alt="" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB03Sl5zVVzdPbuy_n5kC81OMW9XURyFsz6XzdWHaGBhwvDl2HsUwGlDon8DMENvwEQ7uzZ6CNqlQALRZZrfpfRJq0v7Xz944Bka0qmkoHyd0_5ODAYRLkC0HfB95XhUkonIQD6T6l8xuq3E8E1iv0jNoeieofDr1wv2CZMPWWjOiLoLbaKVW51FcbY4aGsa4wW_EAei9WuzDHVaOKJV2vw2ijiHAC2PqVau3r6MAr-St1BatmsGern2GIGuDO2YeMLuYwZNVwHnZds" />
            </div>
            <div className="relative z-10">
              <div className="w-32 h-32 bg-primary flex items-center justify-center mb-4 transform -skew-x-12 border-4 border-on-primary">
                <span className="material-symbols-outlined text-on-primary text-6xl" style={{fontVariationSettings: "'FILL' 1"}}>military_tech</span>
              </div>
              <h2 className="font-headline text-4xl font-black italic uppercase -skew-x-6">Team SWIM</h2>
              <p className="font-label text-primary text-sm tracking-[0.2em] font-bold mt-2">ELITE DIVISION | RANK #12</p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full relative z-10">
              <div className="bg-surface-container-lowest p-4 text-left border-l-2 border-primary">
                <p className="text-[10px] uppercase font-bold text-on-surface-variant">Active Members</p>
                <p className="text-2xl font-headline font-bold italic">142/150</p>
              </div>
              <div className="bg-surface-container-lowest p-4 text-left border-l-2 border-primary">
                <p className="text-[10px] uppercase font-bold text-on-surface-variant">Season Points</p>
                <p className="text-2xl font-headline font-bold italic">89.4k</p>
              </div>
            </div>
          </div>

          {/* Online Now Vertical List */}
          <div className="bg-surface-container p-6 flex flex-col flex-1 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline text-lg font-bold italic uppercase">Active Members</h3>
              <span className="bg-primary/20 text-primary px-2 py-0.5 text-[10px] font-bold tracking-tighter">ONLINE: 48</span>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {members.map((member) => (
                <div key={member.id} className={`flex items-center gap-4 bg-surface-container-low p-3 hover:bg-surface-container-high transition-colors group ${member.grayscale ? 'opacity-70' : ''}`}>
                  <div className="relative">
                    <div className={`w-12 h-12 bg-outline-variant overflow-hidden ${member.grayscale ? 'grayscale' : ''}`}>
                      <img alt="" className="w-full h-full object-cover" src={member.avatarUrl} />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-surface ${member.online ? 'bg-primary' : 'bg-outline'}`}></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-headline font-bold text-sm tracking-tight italic">{member.name}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase">{member.offline ? 'Offline' : `Lvl ${member.level}`} • {member.specialty}</p>
                  </div>
                  <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">send</span>
                </div>
              ))}
            </div>
            <button className="mt-auto w-full bg-surface-container-highest py-3 font-label text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-primary hover:text-on-primary transition-all">VIEW FULL ROSTER</button>
          </div>
        </div>

        {/* Right Column: Interactive Hub */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Global Feed / Chat (Main Canvas) */}
          <div className="flex-1 glass-panel flex flex-col relative overflow-hidden min-h-[600px] border-t-4 border-primary" style={{background: 'rgba(28, 38, 57, 0.6)', backdropFilter: 'blur(12px)'}}>
            {/* Chat Background Texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
            </div>

            {/* Chat Header */}
            <div className="relative z-10 flex items-center justify-between p-6 border-b border-outline-variant/30">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">groups</span>
                <div>
                  <h2 className="font-headline text-xl font-bold italic uppercase tracking-tight">Global Hub</h2>
                  <p className="text-[10px] text-on-surface-variant font-bold tracking-widest">2,842 PLAYERS ACTIVE IN CHAT</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 flex items-center justify-center bg-surface-container-highest hover:bg-primary hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-surface-container-highest hover:bg-primary hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined text-sm">settings</span>
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6 flex flex-col-reverse">
              {chatMessages.map((msg, idx) => (
                msg.isOwn ? (
                  <div key={msg.id} className="flex gap-4 flex-row-reverse self-end max-w-[80%] text-right">
                    <div className="w-10 h-10 bg-primary flex-shrink-0">
                      <img alt="" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeYbciEnggKz2R2XVVX-8TORWcdx2TIm6z8ko507GT8GctQDNj1Xsup7aZxq6pacTg2ukeRlHLgzsjguIdKFofvajodAKB5WqMiwNoEUUxBbu0sloS4zA--nyVdXkPP6XIShzx2TjqSm032YleiusxKN0fXKHB0si3nOrmx8mimSWr1mB6_RCocJSrBk2JLnu5cn8KGWbIK4ESAFccBo-MJrqgSHwBWUFWKAWEt_E0xDaEjkDFkRSanQwgAw3zDd5-2ShaLgCNASWG" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <span className="font-headline text-xs font-bold italic text-on-surface">YOU</span>
                        <span className="text-[8px] bg-primary text-on-primary px-1 font-black">CAPTAIN</span>
                      </div>
                      <div className="bg-primary/20 p-3 relative transform skew-x-2 border-r-2 border-primary">
                        <p className="text-sm font-light">{msg.message}</p>
                      </div>
                      <span className="text-[9px] text-on-surface-variant font-bold">{msg.time}</span>
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex gap-4 max-w-[80%]">
                    <div className="w-10 h-10 bg-outline-variant flex-shrink-0">
                      <img alt="" className="w-full h-full object-cover" src={msg.id === 1 ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCqElRoyhVJr4gHAzGDenp6kn_S8Tf9uSPpLPIxTWpsUF_qEmyBU4Q-UbcvkWUCFoov0Dt7jENHLc2KE-QOJiHbITibioFYG4XsymS0TfV8KiMzUIg1TTbzIFbroVQx4a-XvIUrSMFYP0P2y3PKGqJIWgv2WN55JoKk7zlTCuUpiAfVqbmvVpdSwpvl_4y4i7NGOM7KSrJ2V2gQfR6W-HSZnPSTdizn2SYjT8a8qyTIQBz6bACLGBy6nmJroxA2JlF-X8ltlcjDTlbx" : "https://lh3.googleusercontent.com/aida-public/AB6AXuD8z5JC7my7N36ji5DRMqL8Y_zlY6dYPU90cyywvNM7lBm6GSKv64UJ4V56VZqAn-KMYptN3uTulCBCZ3j8xhsDvfJzl_m3AtaoTE1o3uHJdxhIZRx3ADNF9s83rSqHI_NR74FnynnlrtbTd2T2sYzBlTqlAmeTIjfoUhGbiwFKS6DI85xhATDG_jWJm750qsiaBUoN8GgyiERdPBjU06Zepxf01PEEb3rZ3wXdT2BbgiYRTFxbJER2Cb2Pnv_fb7yEW0aC4BFi1OWS"} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-headline text-xs font-bold italic text-primary">{msg.username}</span>
                        {msg.badge && <span className="text-[8px] bg-secondary-container px-1 text-on-secondary-container font-black">{msg.badge}</span>}
                      </div>
                      <div className="bg-surface-container-high p-3 relative transform -skew-x-2">
                        <p className="text-sm font-light">{msg.message}</p>
                      </div>
                      <span className="text-[9px] text-on-surface-variant font-bold">{msg.time}</span>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Input Area */}
            <div className="relative z-10 p-6 bg-surface-container-highest/80 border-t border-outline-variant/30">
              <div className="flex items-center gap-4 bg-surface-container-lowest p-1">
                <input className="flex-1 bg-transparent border-none focus:ring-0 font-label text-sm uppercase placeholder:text-on-surface-variant/50 px-4" placeholder="TRANSMIT MESSAGE TO SECTOR 26..." type="text" />
                <button className="bg-primary text-on-primary w-12 h-12 flex items-center justify-center hover:bg-primary-container transition-all">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Slanted Section: Rankings & Social Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-high slanted-right h-24 flex items-center px-8 group hover:bg-surface-container-highest transition-colors cursor-pointer border-r-4 border-primary/40">
              <div className="flex items-center gap-6">
                <span className="material-symbols-outlined text-4xl text-primary-fixed" style={{fontVariationSettings: "'FILL' 1"}}>emoji_events</span>
                <div>
                  <p className="font-headline text-2xl font-black italic uppercase">League Rank</p>
                  <p className="text-xs font-bold tracking-[0.4em] text-primary">#142 GLOBAL</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-high h-24 flex items-center px-8 border-l-4 border-secondary group hover:bg-surface-container-highest transition-colors cursor-pointer">
              <div className="flex items-center gap-6 ml-auto md:ml-0">
                <div className="text-right md:text-left">
                  <p className="font-headline text-2xl font-black italic uppercase">Social Feed</p>
                  <p className="text-xs font-bold tracking-[0.4em] text-secondary">24 NEW NOTIFICATIONS</p>
                </div>
                <span className="material-symbols-outlined text-4xl text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>notifications_active</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="h-20 bg-surface-container border-t border-outline-variant/20 flex items-center justify-around px-2 sticky bottom-0 z-50">
        <a className="flex flex-col items-center gap-1 w-full text-on-surface-variant hover:text-primary transition-colors" href="#">
          <span className="material-symbols-outlined">home</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-widest">Home</span>
        </a>
        <a className="flex flex-col items-center gap-1 w-full text-on-surface-variant hover:text-primary transition-colors" href="#">
          <span className="material-symbols-outlined">sports_score</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-widest">Career</span>
        </a>
        <a className="flex flex-col items-center gap-1 w-full text-primary border-t-2 border-primary pt-1" href="#">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>groups</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-widest">Social</span>
        </a>
        <a className="flex flex-col items-center gap-1 w-full text-on-surface-variant hover:text-primary transition-colors" href="#">
          <span className="material-symbols-outlined">military_tech</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-widest">Rewards</span>
        </a>
      </nav>

      <style>{`
        .slanted-right { clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%); }
        .slanted-left { clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%); }
        .glass-panel { backdrop-filter: blur(12px); background: rgba(28, 38, 57, 0.6); }
        .kinetic-border { border-left: 4px solid #81ecff; }
        .text-glow { text-shadow: 0 0 10px rgba(129, 236, 255, 0.5); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #414857; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #81ecff; }
      `}</style>
    </div>
  );
};
