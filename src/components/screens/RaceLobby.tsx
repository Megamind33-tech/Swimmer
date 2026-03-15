import React from 'react';

interface LaneData {
  lane: number;
  flagUrl: string;
  flagAlt: string;
  name: string;
  time: string;
  isUser: boolean;
}

export const RaceLobby: React.FC = () => {
  const lanes: LaneData[] = [
    {
      lane: 1,
      flagUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZ_2PXJ8hsLdvuSwOCgM48IYTiAbePOzDLQauyIQ_xXqjzpL88OclnW8jjnXpCqcBLuLHIxM5pwljKv8Le56Vk039MljRm-qJdVPgE652dAfCQgEKFkEpVFLb7dBWsBLm-ZqOOqqs9-Y3okscMxO2OiC3dk_6cJLvADVArRQfaDOJrPF8eMfygO4ncEZY7WQBeMqlAw-fVk8LGmJl5QUl9G_IOEKsqmlXph-BgXkjUsQ5tycbyhIor3aunL16EsdydgyYoayGQXKqz",
      flagAlt: "United States flag icon",
      name: "Michael Phelps",
      time: "47.84s",
      isUser: false,
    },
    {
      lane: 2,
      flagUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuArWC8hcpKy0a1H65fAy2OOq5Ihp5S6s0xxr3nEWHxFfXVdd27o7fIdFHILGE1xYMiLgzfvN-avPZjys0r34CdYU_aV-1bG57tfOUP8GI8W0Wp8I2RetG6Tmb9QtUFrHSlzJl6fKUhX3P_FCD1QXwMqMUX9QPQMqg3GPSOqy-rfu74bDe_OEU5bvPvabTsRbLGJ1p0uZntt3AiUPpnaokFyJ7erhhOwTF7kA4014mzkXTrxQTbVX26Y5o3TbWUlb4D3MSBA_KWRBxJh",
      flagAlt: "Australia flag icon",
      name: "Ian Thorpe",
      time: "48.21s",
      isUser: false,
    },
    {
      lane: 3,
      flagUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6iTxUuguv_NXmpyH9jqOsTnSrvFwMNKeCXkI-frdbeZWC_Fw6uTSo_w2ovYBKnuGet1z3qCoJknkVlNw8mUI8fNlePE6Bow9_M5W6oNhH-rLZRSU5EDiHF6Wj4ttiOBRNOnPrmEdV8ZwoJhtI6YzNEDTyN7-d-9rbn6zGcVynPKIGK3UMPxblBzOuWBEv1K8GaH6ha2OnOCmGuysLrswBSZBmQcvLpC00Neni1dUuRw4bs1_L8bliApYunBQrp1gq1UXyTtAKI2_2",
      flagAlt: "France flag icon",
      name: "Florent Manaudou",
      time: "47.92s",
      isUser: false,
    },
    {
      lane: 4,
      flagUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuALcrXM5PlsiGcRkECx9xDQmYoNu0ktLbwYHUvQzdRVB6a-0qIvf3IqUM9zM7LqjgUx0mJanaKAb4fBQobY1JrKd11rOMjZQOX4B34wwd94ydow399hJhcdvIY8rpGEQu7I2i7xXCoToq2xHmmK6aEofUMgRM_kdITv5gTVoN6FP11mPzlwzegM2PQ_xPI2C3b_XuIwESIYDBwcJx6J6galiMOcRWOOpLYh7eRsFhLX6FVqMlVMVw2tyUPyBHYin7wjpGbPqkFcZCMf",
      flagAlt: "United Kingdom flag icon",
      name: "YOU (Lane Master)",
      time: "47.50s",
      isUser: true,
    },
    {
      lane: 5,
      flagUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuARF2Gg-p9QPX2PI0b57cFIvJkiidkuACJWzpO22o_r3HPePpt8kXqdAFermavoSkZsNI1zYDPFYE-x8dHMquB3t8Yezwe93swcjqYeS7Q8P-mQSz3LIP8TicdndFDqwDq9Buoo1Kla_dueTd8qYKJxL3Dh75fodI55e4tQ7Qpa9Gm1Oy6Dmnu05b-aPf3Gwqq-GJZJWLrrhmTVI2AyDV7qSTca-aq1jVDHt_yj1C4HVF7fnP0y188AkjvR1FWKlrkKoq0MwQYRpwd0",
      flagAlt: "Brazil flag icon",
      name: "César Cielo",
      time: "46.91s",
      isUser: false,
    },
    {
      lane: 6,
      flagUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYhC8jnv6Cq_pBdrQNMbBIssXWBQsk_6fbQmyYKSIUlI0Kz021bTwIblYZKmic6_Zth86SVamomJRW6m93uoSw8kLsTC5grgzpZ9UtAhed2IVZu_GkoKoSaDBujj7n0KpQ3xYsqvyBwHXco7o4frGkCdTr7KhwdocA7PfnX9I5eTxsCp4v-gFxbe0TO0kfaUznbgKkbm6wJdch9QPH2iCRy77TbJXc0PMCQAHBPAOX8vgnOlf6ek8YGIF06INSrvA2AAe19GWTiZsI",
      flagAlt: "China flag icon",
      name: "Ning Zetao",
      time: "47.65s",
      isUser: false,
    },
    {
      lane: 7,
      flagUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA26ebbCIkzaHASFMD30qkkl6vXX74gPvhouO1Bn1_pjOTAUv8Zj_kiHKwP1WDBfDgTxLEphd7T4xYj4zxvn067Ar7OpzeDpFZpwC4ugFssRle9ohE39lK9z1e3rlG4HDzLFpTjuMjYIGfwjpxTecA6-hsKt5L6Fry30dZVFUT2J5g-cuXjhB1U_EmhS2NTueW09BvOfTjnuRzAmKEaSt5D7nIoCBg62nhvWtCmDjVTVedO4K4bRqRAhvTZxIyzwUsd_PnXLKfElG2p",
      flagAlt: "South Africa flag icon",
      name: "Roland Schoeman",
      time: "48.11s",
      isUser: false,
    },
    {
      lane: 8,
      flagUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzGP5wKMaMNMkabqLwCWH9LOjNxzJN8aPh3X1RC_7wowcXXpoWMc1hSOoJnZPUFh27FB3LT6Cm6r0MSH4nX-x6G9Ogh7LK356V42CnJiOVaYtnNSsCHQL5NczEQ4lcueHwCtBlBJdrt6Vdt4aCEhqQ3cdyCiE74CAZYEyKFanxaziv63qdJ-kK-yeD76wtHTduczFepRMeDvt_xFnFYJ6JT4Xg9yr2ILl0WPKR0ZbsZCwglXLZxP_h3jARHXSp4dQZ7z43wABBhcXl",
      flagAlt: "Italy flag icon",
      name: "Filippo Magnini",
      time: "48.04s",
      isUser: false,
    },
  ];

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="h-16 flex items-center justify-between px-4 border-b border-outline-variant bg-surface z-10">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-on-surface" data-icon="menu">menu</span>
          <h1 className="text-xl font-semibold tracking-tight text-on-surface">SWIM26</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface" data-icon="account_circle">account_circle</span>
        </div>
      </header>

      {/* Main Content: Race Lobby */}
      <main className="flex-grow relative overflow-hidden flex flex-col p-6" style={{
        backgroundImage: 'linear-gradient(rgba(15, 98, 254, 0.8), rgba(22, 22, 22, 0.95)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDOvEV97kNUGMhZqKyFNQwpdO4VNRG4Z2sKdTVjLT8wEOtJlsm2ZzLT4YMWSfz2sLuCPfCLfDm7XDnVtqbQA4Fb2NOrpP0pufFvV-kmjDact6l3VlDcaIoFLH2rD4DohD7LQL_w-W3kCcbJZlvdp34971jn2oUjFTH6Ek9x6hnl1sQ_M-P7H5PjGphbqXhysqhZBoQx0TCrJI-OgxcolCj2L7e0InZjeVWOacIl0-b6dpEv0PvKvFrRmxEmM8g0jfVdCiZMIP1RNjZQ)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        {/* Pool Stats Header */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 flex flex-col">
            <span className="text-[12px] uppercase font-semibold text-primary-fixed tracking-widest">Location</span>
            <span className="text-xl text-white font-light">Olympic Stadium</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 flex flex-col">
            <span className="text-[12px] uppercase font-semibold text-primary-fixed tracking-widest">Course</span>
            <span className="text-xl text-white font-light">50m Long Course</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 flex flex-col">
            <span className="text-[12px] uppercase font-semibold text-primary-fixed tracking-widest">Event</span>
            <span className="text-xl text-white font-light">100m Freestyle Heat 4</span>
          </div>
        </section>

        {/* Lanes Layout */}
        <section className="flex-grow flex flex-col gap-2 mb-24 max-w-5xl mx-auto w-full">
          {lanes.map((lane) => (
            lane.isUser ? (
              <div key={lane.lane} className="group flex items-center bg-primary/20 border-l-4 border-primary h-16 shadow-[0_0_20px_rgba(15,98,254,0.3)] backdrop-blur-sm">
                <div className="w-12 flex justify-center text-primary font-bold text-xl">{lane.lane}</div>
                <div className="flex-grow px-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img alt={lane.flagAlt} className="h-4 w-6 object-cover" src={lane.flagUrl} />
                    <span className="text-white font-semibold text-lg">{lane.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm" data-icon="star" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="text-white text-lg">{lane.time}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div key={lane.lane} className="group flex items-center bg-white/5 border-l-4 border-transparent hover:bg-white/10 h-12 transition-all">
                <div className="w-12 flex justify-center text-white/50 font-bold">{lane.lane}</div>
                <div className="flex-grow px-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img alt={lane.flagAlt} className="h-4 w-6 object-cover" src={lane.flagUrl} />
                    <span className="text-white font-medium">{lane.name}</span>
                  </div>
                  <span className="text-white/40 text-sm">{lane.time}</span>
                </div>
              </div>
            )
          ))}
        </section>

        {/* CTA Action */}
        <div className="fixed bottom-24 left-0 right-0 px-6 flex justify-center">
          <button className="bg-primary text-white font-semibold py-4 px-12 text-xl tracking-widest shadow-[0_0_30px_rgba(15,98,254,0.6)] hover:bg-primary-fixed-dim transition-colors flex items-center gap-3">
            START RACE
            <span className="material-symbols-outlined" data-icon="play_arrow">play_arrow</span>
          </button>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="h-16 bg-surface border-t border-outline-variant flex items-center justify-around fixed bottom-0 left-0 right-0 z-10">
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined" data-icon="home" style={{fontVariationSettings: "'FILL' 1"}}>home</span>
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition-colors">
          <span className="material-symbols-outlined" data-icon="emoji_events">emoji_events</span>
          <span className="text-[10px] font-medium">Career</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition-colors">
          <span className="material-symbols-outlined" data-icon="public">public</span>
          <span className="text-[10px] font-medium">Global</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition-colors">
          <span className="material-symbols-outlined" data-icon="person_4">person_4</span>
          <span className="text-[10px] font-medium">Custom</span>
        </button>
      </nav>
    </div>
  );
};
