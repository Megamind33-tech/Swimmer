/**
 * Live Events Screen - Retention and excitement
 * Daily events, weekly championships, seasonal tours, limited-time cups
 */

import React, { useState } from 'react';

type EventCategory = 'DAILY' | 'WEEKLY' | 'SEASONAL' | 'SPONSOR' | 'SPECIAL';

interface EventCard {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  timeLeft: string;
  reward: string;
  participants?: number;
  featured?: boolean;
  color: string;
  icon: React.ReactNode;
}

interface LiveEventsScreenProps {
  onEventSelect?: (eventId: string) => void;
}

const LiveEvents: EventCard[] = [
  {
    id: 'featured-1',
    title: 'World Sprint Cup',
    description: 'Global sprint championship with elite swimmers',
    category: 'SEASONAL',
    timeLeft: '05h 14m 22s',
    reward: '2000 XP • 5000 Coins',
    participants: 12500,
    featured: true,
    color: 'from-yellow-500 to-amber-500',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'daily-1',
    title: 'Daily Sprint Challenge',
    description: 'Complete 2 sprint races for bonus rewards',
    category: 'DAILY',
    timeLeft: '18h 42m',
    reward: '200 XP',
    color: 'from-emerald-500 to-teal-500',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      </svg>
    ),
  },
  {
    id: 'weekly-1',
    title: 'Butterfly Marathon',
    description: 'Test your endurance in butterfly events',
    category: 'WEEKLY',
    timeLeft: '2d 14h 30m',
    reward: '1500 XP • 3000 Coins',
    participants: 8300,
    color: 'from-purple-500 to-pink-500',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'sponsor-1',
    title: 'AquaPro Sponsor Challenge',
    description: 'Win 3 events wearing AquaPro gear',
    category: 'SPONSOR',
    timeLeft: '3d 8h',
    reward: '500 Coins • Exclusive Suit',
    color: 'from-blue-500 to-cyan-500',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'daily-2',
    title: 'Perfect Turn Drills',
    description: 'Execute 3 perfect turns for rewards',
    category: 'DAILY',
    timeLeft: '18h 42m',
    reward: '150 XP',
    color: 'from-cyan-500 to-blue-500',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    id: 'seasonal-1',
    title: 'Continental Relay Championship',
    description: 'Team-based relay event across regions',
    category: 'SEASONAL',
    timeLeft: '4d 2h 15m',
    reward: '3000 XP • Premium Pass Tier',
    participants: 6200,
    color: 'from-orange-500 to-red-500',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zM5 20a3 3 0 015.856-1.487M5 10a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'special-1',
    title: 'Midnight Finals Series',
    description: 'Special night-time racing event',
    category: 'SPECIAL',
    timeLeft: '6d 12h',
    reward: '2500 XP • Neon Cosmetics',
    participants: 4100,
    color: 'from-indigo-500 to-purple-500',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 015.646 5.646 9.001 9.001 0 0020.354 15.354z" />
      </svg>
    ),
  },
];

const EventCategories = [
  { id: 'DAILY', label: 'Daily', color: 'text-emerald-400' },
  { id: 'WEEKLY', label: 'Weekly', color: 'text-blue-400' },
  { id: 'SEASONAL', label: 'Seasonal', color: 'text-yellow-400' },
  { id: 'SPONSOR', label: 'Sponsor', color: 'text-cyan-400' },
  { id: 'SPECIAL', label: 'Special', color: 'text-purple-400' },
];

export const LiveEventsScreen: React.FC<LiveEventsScreenProps> = ({ onEventSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);

  const filteredEvents = selectedCategory
    ? LiveEvents.filter((e) => e.category === selectedCategory)
    : LiveEvents;

  const featuredEvent = LiveEvents.find((e) => e.featured);

  return (
    <div className="w-full h-full overflow-y-auto p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Live Events</h1>
          <p className="text-slate-400">Limited-time challenges and competitions</p>
        </div>

        {/* Featured Event Banner */}
        {featuredEvent && (
          <div
            className={`relative rounded-lg p-8 overflow-hidden border-2 border-yellow-500/50 cursor-pointer hover:scale-105 transition-transform`}
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${featuredEvent.color} opacity-20`}
            ></div>

            {/* Content */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-sm font-black text-yellow-400 uppercase tracking-wider mb-2">
                  Featured Event
                </div>
                <h2 className="text-3xl font-black text-white mb-3">{featuredEvent.title}</h2>
                <p className="text-lg text-slate-300 mb-4">{featuredEvent.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Time Remaining:</span>
                    <span className="text-yellow-300 font-mono font-bold text-lg">{featuredEvent.timeLeft}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">Reward:</span>
                    <span className="text-emerald-300 font-bold">{featuredEvent.reward}</span>
                  </div>
                  {featuredEvent.participants && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Participants:</span>
                      <span className="text-cyan-300 font-bold">{featuredEvent.participants.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => onEventSelect?.(featuredEvent.id)}
                className="px-8 py-6 bg-gradient-to-r from-yellow-500 to-amber-500 hover:shadow-2xl hover:shadow-yellow-500/50 text-white font-black text-2xl rounded-lg uppercase transition-all h-full flex items-center justify-center"
              >
                Enter Event
              </button>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-bold uppercase text-sm transition-all ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            All Events
          </button>
          {EventCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as EventCategory)}
              className={`px-4 py-2 rounded-lg font-bold uppercase text-sm transition-all ${
                selectedCategory === cat.id
                  ? `bg-gradient-to-r ${EventCategories.find((c) => c.id === cat.id)?.color || ''} text-white`
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.filter((e) => !e.featured).map((event) => (
            <button
              key={event.id}
              onClick={() => onEventSelect?.(event.id)}
              className={`relative rounded-lg overflow-hidden border transition-all hover:scale-105 hover:shadow-lg group`}
            >
              {/* Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-90 group-hover:opacity-100`}
              ></div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

              {/* Content */}
              <div className="relative h-full p-6 flex flex-col justify-between min-h-80">
                {/* Top Section */}
                <div className="space-y-4">
                  <div className="text-white/80 group-hover:text-white transition-colors">{event.icon}</div>
                  <div>
                    <div className="text-xs font-black text-white/70 uppercase tracking-wider mb-1">
                      {event.category}
                    </div>
                    <h3 className="text-xl font-black text-white">{event.title}</h3>
                    <p className="text-sm text-gray-200 mt-2">{event.description}</p>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="space-y-3 pt-4 border-t border-white/20">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>Ends in:</span>
                      <span className="font-mono font-bold">{event.timeLeft}</span>
                    </div>
                    {event.participants && (
                      <div className="flex justify-between text-xs text-gray-300">
                        <span>Players:</span>
                        <span className="font-bold text-cyan-300">{event.participants.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-white/20 rounded px-3 py-2">
                    <div className="text-xs text-gray-300 mb-1">Reward</div>
                    <div className="text-sm font-bold text-white">{event.reward}</div>
                  </div>
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveEventsScreen;
