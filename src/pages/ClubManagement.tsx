import React from 'react'
import { motion } from 'motion/react'
import { CLUB_OBJECTIVES, CLUB_UPCOMING_EVENTS, CLUB_SPONSORS, ROSTER_HIGHLIGHTS, SWIMMERS, USER_DATA } from '../utils/gameData'
import { SwimmerCard } from '../components/SwimmerCard'
import { ShieldIcon, ActivityIcon, CalendarIcon, FlagIcon, UserPlusIcon } from 'lucide-react'
import { SponsorPanel } from './ProfilePage'
import { useClubRoster, type SignedAthlete } from '../utils/clubRoster'

const AQUA = '#38D6FF'
const GOLD = '#D4A843'
const PANEL = 'rgba(4,20,33,0.76)'
const PANEL_BORDER = 'rgba(56,214,255,0.13)'

// Convert a SignedAthlete to the Swimmer shape expected by SwimmerCard
function toSwimmerCard(a: SignedAthlete) {
  return {
    id: a.id,
    name: a.name,
    ovr: a.ovr,
    stroke: a.stroke as any,
    country: a.flag,
    stats: { speed: a.ovr, stamina: a.ovr, technique: a.ovr, turn: a.ovr },
    rarity: a.ovr >= 95 ? 'legendary' : a.ovr >= 88 ? 'epic' : a.ovr >= 82 ? 'rare' : 'common' as any,
  }
}

export function ClubManagement() {
  const signedAthletes = useClubRoster()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      style={{ position: 'absolute', inset: 0, display: 'flex', gap: '10px', padding: '10px' }}
    >
      {/* ── LEFT COLUMN ── */}
      <div style={{ width: '170px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Team OVR */}
        <div style={{ borderRadius: '12px', border: `1px solid rgba(212,168,67,0.28)`, background: 'linear-gradient(135deg, rgba(42,31,12,0.92) 0%, rgba(26,19,8,0.90) 100%)', backdropFilter: 'blur(12px)', padding: '10px 12px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
            <ShieldIcon size={12} color={GOLD} />
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '9px', color: 'rgba(212,168,67,0.60)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Team OVR</span>
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', color: GOLD, letterSpacing: '0.04em', lineHeight: 1, textShadow: '0 0 16px rgba(212,168,67,0.45)' }}>{USER_DATA.clubOvr}</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.50)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '3px' }}>My Club</div>
        </div>

        {/* Active Training */}
        <div style={{ borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '12px 14px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <ActivityIcon size={12} color={AQUA} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.06em' }}>TRAINING</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <TrainingSlot name="M. Phelps" type="Speed Drill" time="45m" progress={60} />
            <TrainingSlot name="K. Ledecky" type="Endurance" time="1h 20m" progress={30} />
          </div>
          <button style={{ width: '100%', marginTop: '8px', height: '28px', borderRadius: '8px', cursor: 'pointer', background: 'rgba(56,214,255,0.05)', border: '1px dashed rgba(56,214,255,0.20)', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(169,211,231,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span style={{ fontSize: '14px', lineHeight: 1 }}>+</span> UNLOCK SLOT
          </button>
        </div>

        {/* Weekly Objectives */}
        <div style={{ flex: 1, borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '12px 14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.06em', marginBottom: '10px', flexShrink: 0 }}>OBJECTIVES</div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {CLUB_OBJECTIVES.map((objective, index) => (
              <div key={objective} style={{ borderRadius: '8px', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(56,214,255,0.03)', padding: '7px 10px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '9px', color: GOLD }}>{index + 1}</span>
                </div>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.80)', lineHeight: 1.4 }}>{objective}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
        {/* Starting Lineup */}
        <div style={{ borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '12px 14px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FlagIcon size={12} color={GOLD} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.06em' }}>STARTING LINEUP</span>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.50)', marginLeft: '4px' }}>
                {SWIMMERS.length + signedAthletes.length} athletes
              </span>
            </div>
            <button style={{ height: '24px', paddingInline: '10px', borderRadius: '6px', cursor: 'pointer', background: 'rgba(56,214,255,0.08)', border: `1px solid rgba(56,214,255,0.20)`, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: AQUA }}>
              AUTO BUILD
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
            {/* Core squad */}
            {SWIMMERS.map((swimmer, i) => (
              <motion.div key={swimmer.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} style={{ flexShrink: 0 }}>
                <SwimmerCard swimmer={swimmer} size="sm" />
              </motion.div>
            ))}

            {/* Signed athletes from Transfer Market */}
            {signedAthletes.map((athlete, i) => (
              <motion.div
                key={athlete.id}
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
                style={{ flexShrink: 0, position: 'relative' }}
              >
                {/* "NEW" badge for recently signed */}
                <div style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: '#C41E3A',
                  color: '#fff',
                  fontSize: '6px',
                  fontWeight: 900,
                  padding: '2px 5px',
                  borderRadius: '100px',
                  zIndex: 10,
                  letterSpacing: '0.08em',
                  fontFamily: "'Rajdhani', sans-serif",
                }}>
                  NEW
                </div>
                <SwimmerCard swimmer={toSwimmerCard(athlete)} size="sm" />
              </motion.div>
            ))}

            {/* Add slot */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{ width: '60px', height: '88px', borderRadius: '10px', border: '2px dashed rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
            >
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,0,0,0.40)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: '14px', lineHeight: 1 }}>+</span>
              </div>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '8px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.10em', textAlign: 'center' }}>ADD</span>
            </motion.div>
          </div>
        </div>

        {/* Sponsors */}
        <SponsorPanel sponsors={CLUB_SPONSORS} title="CLUB SPONSORS" compact />

        {/* Bottom Row: Roster + Events */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', minHeight: 0 }}>
          {/* Roster */}
          <div style={{ borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '12px 14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', flexShrink: 0 }}>
              <FlagIcon size={12} color={GOLD} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.06em' }}>ROSTER</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {/* Core roster highlights */}
              {ROSTER_HIGHLIGHTS.map((entry) => {
                const swimmer = SWIMMERS.find((item) => item.id === entry.swimmerId)
                if (!swimmer) return null
                return (
                  <div key={entry.id} style={{ borderRadius: '10px', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(56,214,255,0.03)', padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '12px', color: '#F3FBFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{swimmer.name}</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: GOLD, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '2px' }}>{entry.role}</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.45)', marginTop: '2px' }}>Age {entry.age} · {entry.weeklyWage}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1 }}>{swimmer.ovr}</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.40)', textTransform: 'uppercase' }}>{entry.morale}</div>
                    </div>
                  </div>
                )
              })}

              {/* Signed athletes from Transfer Market */}
              {signedAthletes.map((athlete) => (
                <motion.div
                  key={athlete.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ borderRadius: '10px', border: `1px solid rgba(54,198,144,0.25)`, background: 'rgba(54,198,144,0.05)', padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ fontSize: '12px' }}>{athlete.flag}</span>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '12px', color: '#F3FBFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{athlete.name}</div>
                    </div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: '#38D6FF', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '2px' }}>{athlete.stroke} · {athlete.tier}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.45)', marginTop: '2px' }}>Age {athlete.age} · {athlete.nationality}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: '#F3FBFF', letterSpacing: '0.04em', lineHeight: 1 }}>{athlete.ovr}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}>
                      <UserPlusIcon size={8} color="rgba(54,198,144,0.80)" />
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(54,198,144,0.80)', textTransform: 'uppercase' }}>SIGNED</div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Empty state for signed section */}
              {signedAthletes.length === 0 && (
                <div style={{ borderRadius: '10px', border: '1px dashed rgba(56,214,255,0.15)', padding: '10px', textAlign: 'center' }}>
                  <UserPlusIcon size={14} color="rgba(169,211,231,0.30)" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.35)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                    Sign athletes from the Transfer Market
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div style={{ borderRadius: '14px', border: `1px solid ${PANEL_BORDER}`, background: PANEL, backdropFilter: 'blur(12px)', padding: '12px 14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', flexShrink: 0 }}>
              <CalendarIcon size={12} color={GOLD} />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: '#F3FBFF', letterSpacing: '0.06em' }}>UPCOMING EVENTS</span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {CLUB_UPCOMING_EVENTS.map((event) => (
                <div key={event.id} style={{ borderRadius: '10px', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(56,214,255,0.03)', padding: '8px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2px' }}>{event.type}</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '12px', color: '#F3FBFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.name}</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.45)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.location}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', color: '#F3FBFF', letterSpacing: '0.04em' }}>{event.time}</div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', color: GOLD, letterSpacing: '0.04em', marginTop: '2px' }}>{event.prize}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function TrainingSlot({ name, type, time, progress }: { name: string; type: string; time: string; progress: number }) {
  return (
    <div style={{ borderRadius: '8px', border: `1px solid ${PANEL_BORDER}`, background: 'rgba(0,0,0,0.30)', padding: '7px 10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px', gap: '6px' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '11px', color: '#F3FBFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: GOLD, textTransform: 'uppercase', letterSpacing: '0.10em' }}>{type}</div>
        </div>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', color: 'rgba(169,211,231,0.55)', letterSpacing: '0.04em', flexShrink: 0 }}>{time}</span>
      </div>
      <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(0,0,0,0.40)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: GOLD, boxShadow: `0 0 4px rgba(212,168,67,0.50)` }} />
      </div>
    </div>
  )
}
