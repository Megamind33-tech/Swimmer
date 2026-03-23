import React, { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  ActivityIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BadgeDollarSignIcon,
  Building2Icon,
  CalendarIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  CrownIcon,
  DumbbellIcon,
  FlameIcon,
  HandshakeIcon,
  LockIcon,
  PlusIcon,
  ShieldIcon,
  StarIcon,
  TargetIcon,
  TrendingUpIcon,
  UserPlusIcon,
  Users2Icon,
  WavesIcon,
  XCircleIcon,
  ZapIcon,
} from 'lucide-react'
import { SwimmerCard } from '../components/SwimmerCard'
import { CLUB_SPONSORS, SWIMMERS, USER_DATA, type Swimmer } from '../utils/gameData'
import { PaneSwitcher, useIsLandscapeMobile } from '../ui/PaneSwitcher'
import { useTrainingEngineState } from '../hooks/useTrainingEngineState'
import { CLUB_PHILOSOPHIES, CLUB_PROJECTS } from '../utils/careerModeData'
import { CLUB_TRAINING_GROUPS } from '../utils/trainingEngineData'
import { useClubCareer } from '../context/CareerSaveContext'
import { ProgressBar } from '../components/ProgressBar'

const AQUA = '#81ECFF'
const GOLD = '#D4A843'
const SUCCESS = '#36C690'
const ALERT = '#F87171'
const PANEL = 'rgba(4,20,33,0.82)'
const PANEL_BORDER = 'rgba(56,214,255,0.13)'

const panelStyle: React.CSSProperties = {
  borderRadius: '14px',
  border: `1px solid ${PANEL_BORDER}`,
  background: PANEL,
  backdropFilter: 'blur(12px)',
}

// Board expectations for the season
const BOARD_TARGETS = [
  { id: 'bt1', label: 'Finish top 4 in Regional Cup', met: true },
  { id: 'bt2', label: 'Qualify at least 1 athlete for National Trials', met: true },
  { id: 'bt3', label: 'Academy: promote 1 prospect to senior squad', met: false },
  { id: 'bt4', label: 'Secure at least 2 active sponsor deals', met: false },
]

export function ClubManagement() {
  const { state: clubState, dispatch: clubDispatch } = useClubCareer()
  const isLandscape = useIsLandscapeMobile()
  const [selectedPhilosophyId, setSelectedPhilosophyId] = useState(clubState.philosophyId ?? CLUB_PHILOSOPHIES[0]?.id ?? '')
  const [enteredComps, setEnteredComps] = useState<Set<string>>(new Set(
    clubState.competitions.filter((c) => c.entered).map((c) => c.id)
  ))
  const { selectedDrill, cyclePhase, sessionActive } = useTrainingEngineState()

  const selectedPhilosophy = useMemo(
    () => CLUB_PHILOSOPHIES.find((item) => item.id === selectedPhilosophyId) ?? CLUB_PHILOSOPHIES[0],
    [selectedPhilosophyId],
  )

  const rosterAsSwimmers: Swimmer[] = useMemo(() =>
    clubState.roster.map((a) => ({
      id: a.id,
      name: a.name,
      ovr: a.ovr,
      stroke: a.stroke as any,
      country: a.country,
      stats: { speed: a.speed, stamina: a.stamina, technique: a.technique, turn: a.turns },
      rarity: a.ovr >= 90 ? 'legendary' as const : a.ovr >= 83 ? 'epic' as const : a.ovr >= 76 ? 'rare' as const : 'common' as const,
    })), [clubState.roster])

  const clubOvr = rosterAsSwimmers.length > 0
    ? Math.round(rosterAsSwimmers.reduce((sum, s) => sum + s.ovr, 0) / rosterAsSwimmers.length)
    : USER_DATA.clubOvr

  const weeklyBalance = clubState.weeklyIncome - clubState.weeklyWages
  const academyAthletes = useMemo(() => clubState.roster.filter((a) => a.isAcademy), [clubState.roster])
  const hiredStaff = useMemo(() => clubState.staff.filter((s) => s.hired), [clubState.staff])
  const availableStaff = useMemo(() => clubState.staff.filter((s) => !s.hired), [clubState.staff])

  const toggleComp = (id: string) => {
    setEnteredComps((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // ─── HQ PANE ─────────────────────────────────────────────────────────────
  const hqPane = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Club header */}
      <div style={{
        ...panelStyle, padding: '14px 16px',
        background: 'linear-gradient(145deg, rgba(31,30,15,0.98) 0%, rgba(8,17,28,0.92) 100%)',
        border: '1px solid rgba(212,168,67,0.22)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(212,168,67,0.70)', fontWeight: 800 }}>Club / Coaching Career</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', color: '#F3FBFF', lineHeight: 1, marginTop: '3px' }}>{clubState.clubName || 'Aqua FC'}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.58)', marginTop: '3px' }}>
              Season {clubState.season} · Week {clubState.currentWeek}/{clubState.totalWeeks}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', color: GOLD, lineHeight: 1 }}>{clubOvr}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(212,168,67,0.65)', fontWeight: 700 }}>CLUB OVR</div>
          </div>
        </div>

        {/* 4-stat row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '12px' }}>
          {[
            { label: 'Prestige', value: clubState.prestige, color: GOLD },
            { label: 'Budget', value: `$${(clubState.budget / 1000).toFixed(0)}K`, color: SUCCESS },
            { label: 'Balance', value: `${weeklyBalance >= 0 ? '+' : ''}${weeklyBalance.toLocaleString()}`, color: weeklyBalance >= 0 ? SUCCESS : ALERT },
            { label: 'Roster', value: clubState.roster.length, color: AQUA },
          ].map((m) => (
            <div key={m.label} style={{ background: 'rgba(0,0,0,0.30)', borderRadius: '9px', padding: '8px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: m.color, lineHeight: 1 }}>{m.value}</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '8px', color: 'rgba(169,211,231,0.48)', textTransform: 'uppercase', letterSpacing: '0.10em', fontWeight: 700, marginTop: '2px' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Board expectations */}
      <div style={{ ...panelStyle, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <TargetIcon size={13} color={GOLD} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Board Expectations</span>
          <span style={{ marginLeft: 'auto', fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.45)', fontWeight: 700 }}>
            {BOARD_TARGETS.filter((t) => t.met).length}/{BOARD_TARGETS.length} MET
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {BOARD_TARGETS.map((target) => (
            <div key={target.id} style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 9px', borderRadius: '8px',
              background: target.met ? 'rgba(54,198,144,0.06)' : 'rgba(255,255,255,0.02)',
              border: target.met ? '1px solid rgba(54,198,144,0.18)' : '1px solid rgba(255,255,255,0.05)',
            }}>
              {target.met ? <CheckCircle2Icon size={13} color={SUCCESS} /> : <XCircleIcon size={13} color="rgba(248,113,113,0.55)" />}
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', fontWeight: target.met ? 700 : 400, color: target.met ? '#F3FBFF' : 'rgba(169,211,231,0.60)' }}>{target.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Club philosophy */}
      <div style={{ ...panelStyle, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <FlameIcon size={13} color={AQUA} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Club Doctrine</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {CLUB_PHILOSOPHIES.map((philosophy) => {
            const active = philosophy.id === selectedPhilosophy.id
            return (
              <button
                key={philosophy.id}
                onClick={() => { setSelectedPhilosophyId(philosophy.id); clubDispatch({ type: 'CLUB_SET_PHILOSOPHY', philosophyId: philosophy.id as any }) }}
                style={{
                  textAlign: 'left', borderRadius: '10px', padding: '10px 11px', cursor: 'pointer',
                  border: active ? '1px solid rgba(129,236,255,0.34)' : '1px solid rgba(255,255,255,0.06)',
                  background: active ? 'linear-gradient(135deg, rgba(129,236,255,0.10) 0%, rgba(0,0,0,0) 100%)' : 'rgba(255,255,255,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: active ? '#F3FBFF' : 'rgba(169,211,231,0.60)' }}>{philosophy.title}</span>
                  {active && <CheckCircle2Icon size={13} color={AQUA} />}
                </div>
                {active && (
                  <>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: SUCCESS, marginTop: '4px' }}>{philosophy.upside}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.55)', marginTop: '2px' }}>{philosophy.tradeoff}</div>
                  </>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Facilities */}
      {clubState.facilities.length > 0 && (
        <div style={{ ...panelStyle, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Building2Icon size={13} color={GOLD} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Facilities</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {clubState.facilities.map((fac) => (
              <div key={fac.type} style={{ borderRadius: '9px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: '9px 11px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '11px', color: '#F3FBFF', textTransform: 'capitalize' }}>{fac.type}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.55)', marginTop: '2px' }}>{fac.effect}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} style={{ width: '8px', height: '8px', borderRadius: '2px', background: i < fac.level ? GOLD : 'rgba(255,255,255,0.12)' }} />
                      ))}
                    </div>
                    <button style={{
                      padding: '5px 8px', borderRadius: '7px', cursor: 'pointer',
                      background: 'rgba(129,236,255,0.08)', border: '1px solid rgba(129,236,255,0.22)',
                      fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: AQUA, letterSpacing: '0.08em',
                      display: 'flex', alignItems: 'center', gap: '3px',
                    }}>
                      <ArrowUpIcon size={10} />
                      ${(fac.upgradeCost / 1000).toFixed(0)}K
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Academy */}
      <div style={{ ...panelStyle, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <WavesIcon size={13} color={GOLD} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Academy</span>
          <span style={{ marginLeft: 'auto', fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: AQUA, fontWeight: 700 }}>{academyAthletes.length} PROSPECTS</span>
        </div>
        {academyAthletes.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {academyAthletes.map((prospect) => (
              <div key={prospect.id} style={{ borderRadius: '9px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: '9px 11px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '11px', color: '#F3FBFF' }}>{prospect.name}</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: GOLD, letterSpacing: '0.08em', marginTop: '1px' }}>AGE {prospect.age} · {prospect.stroke}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: AQUA, lineHeight: 1 }}>{prospect.ovr}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '8px', color: 'rgba(169,211,231,0.45)', fontWeight: 700 }}>→{prospect.potential}</div>
                  </div>
                </div>
                <div style={{ marginTop: '6px' }}>
                  <ProgressBar progress={Math.round(prospect.developmentProgress)} max={100} color="bg-[#36C690]" showLabel />
                </div>
                {prospect.readiness >= 80 && (
                  <button style={{
                    marginTop: '6px', width: '100%', padding: '6px', borderRadius: '7px', cursor: 'pointer',
                    background: 'rgba(54,198,144,0.10)', border: '1px solid rgba(54,198,144,0.30)',
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', color: SUCCESS, letterSpacing: '0.08em',
                  }}>PROMOTE TO SENIOR SQUAD</button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(169,211,231,0.40)', textAlign: 'center', padding: '10px' }}>No academy prospects. Scout to recruit young talent.</div>
        )}
      </div>
    </div>
  )

  // ─── DYNASTY PANE ────────────────────────────────────────────────────────
  const dynastyPane = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Transfer market */}
      <div style={{ ...panelStyle, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <UserPlusIcon size={13} color={AQUA} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Transfer Market</span>
          <span style={{ marginLeft: 'auto', fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.45)', fontWeight: 700 }}>{clubState.transferTargets?.filter((t) => t.available).length ?? 0} AVAILABLE</span>
        </div>
        {(clubState.transferTargets?.filter((t) => t.available) ?? []).length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(clubState.transferTargets?.filter((t) => t.available) ?? []).map((target) => (
              <div key={target.id} style={{
                borderRadius: '10px', border: '1px solid rgba(129,236,255,0.14)', background: 'rgba(255,255,255,0.02)', padding: '10px 11px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>{target.name}</span>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.50)', textTransform: 'uppercase' }}>Age {target.age}</span>
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: AQUA, letterSpacing: '0.08em', marginTop: '2px' }}>{target.stroke.toUpperCase()}</div>
                  </div>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', color: target.ovr >= 80 ? GOLD : AQUA, lineHeight: 1 }}>{target.ovr}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '8px', color: 'rgba(169,211,231,0.45)', fontWeight: 700 }}>OVR</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', color: SUCCESS }}>${(target.price / 1000).toFixed(0)}K</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '8px', color: 'rgba(169,211,231,0.45)' }}>${(target.weeklyWage / 1000).toFixed(1)}K/wk</div>
                  </div>
                </div>
                <button
                  disabled={clubState.budget < target.price}
                  style={{
                    marginTop: '8px', width: '100%', padding: '8px', borderRadius: '8px', cursor: clubState.budget >= target.price ? 'pointer' : 'not-allowed',
                    background: clubState.budget >= target.price ? 'rgba(129,236,255,0.10)' : 'rgba(255,255,255,0.04)',
                    border: clubState.budget >= target.price ? '1px solid rgba(129,236,255,0.30)' : '1px solid rgba(255,255,255,0.08)',
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: '12px', letterSpacing: '0.08em',
                    color: clubState.budget >= target.price ? AQUA : 'rgba(169,211,231,0.35)',
                  }}
                >
                  {clubState.budget >= target.price ? `SIGN FOR $${(target.price / 1000).toFixed(0)}K` : 'INSUFFICIENT BUDGET'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '11px', color: 'rgba(169,211,231,0.40)', textAlign: 'center', padding: '10px' }}>No transfer targets available. Scout for new signings.</div>
        )}
      </div>

      {/* Core squad */}
      <div style={{ ...panelStyle, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <ShieldIcon size={13} color={AQUA} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Squad</span>
          <span style={{ marginLeft: 'auto', fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.45)', fontWeight: 700 }}>{rosterAsSwimmers.length} ATHLETES</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {(rosterAsSwimmers.length > 0 ? rosterAsSwimmers : SWIMMERS.slice(0, 5)).map((swimmer, i) => (
            <motion.div key={swimmer.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} style={{ flexShrink: 0 }}>
              <SwimmerCard swimmer={swimmer} size="sm" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Staff */}
      <div style={{ ...panelStyle, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <Users2Icon size={13} color={AQUA} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Staff</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {hiredStaff.map((staff) => (
            <div key={staff.id} style={{ borderRadius: '9px', border: '1px solid rgba(54,198,144,0.18)', background: 'rgba(54,198,144,0.04)', padding: '9px 11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '11px', color: '#F3FBFF' }}>{staff.name}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: GOLD, letterSpacing: '0.08em', marginTop: '1px' }}>{staff.role.toUpperCase()} · LVL {staff.level}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: SUCCESS, marginTop: '3px' }}>{staff.boost}: +{staff.boostValue}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.55)' }}>{staff.salary.toLocaleString()}/wk</div>
                  <button style={{
                    marginTop: '5px', padding: '5px 9px', borderRadius: '7px', cursor: 'pointer',
                    background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.24)',
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: GOLD, letterSpacing: '0.06em',
                    display: 'flex', alignItems: 'center', gap: '3px',
                  }}>
                    <ArrowUpIcon size={9} /> UPGRADE
                  </button>
                </div>
              </div>
            </div>
          ))}
          {availableStaff.slice(0, 2).map((staff) => (
            <div key={staff.id} style={{ borderRadius: '9px', border: '1px dashed rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.01)', padding: '9px 11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '11px', color: 'rgba(169,211,231,0.60)' }}>{staff.name}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', color: 'rgba(212,168,67,0.50)', letterSpacing: '0.08em', marginTop: '1px' }}>{staff.role.toUpperCase()}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.45)', marginTop: '3px' }}>{staff.salary.toLocaleString()}/wk</div>
                </div>
                <button style={{
                  padding: '7px 11px', borderRadius: '8px', cursor: 'pointer',
                  background: 'rgba(129,236,255,0.08)', border: '1px solid rgba(129,236,255,0.28)',
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', color: AQUA, letterSpacing: '0.08em',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <PlusIcon size={11} /> HIRE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Training groups */}
      <div style={{ ...panelStyle, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <DumbbellIcon size={13} color={AQUA} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Training Groups</span>
          <span style={{ marginLeft: 'auto', fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: sessionActive ? SUCCESS : GOLD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em' }}>
            {sessionActive ? '● SESSION LIVE' : '○ PLAN READY'}
          </span>
        </div>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: AQUA, marginBottom: '8px' }}>{selectedDrill.label} · {cyclePhase.name}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {CLUB_TRAINING_GROUPS.map((group) => (
            <div key={group.id} style={{ borderRadius: '9px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: '9px 11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>{group.name}</span>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: AQUA, textTransform: 'uppercase', letterSpacing: '0.10em' }}>{group.currentLoad}</span>
              </div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.60)', marginTop: '4px' }}>{group.purpose}</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: SUCCESS, marginTop: '3px' }}>{group.payoff}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Meet calendar */}
      <div style={{ ...panelStyle, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <CalendarIcon size={13} color={GOLD} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Meet Calendar</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {clubState.competitions.map((event) => {
            const entered = enteredComps.has(event.id)
            return (
              <div key={event.id} style={{
                borderRadius: '10px',
                border: entered ? '1px solid rgba(54,198,144,0.28)' : '1px solid rgba(255,255,255,0.07)',
                background: entered ? 'rgba(54,198,144,0.05)' : 'rgba(255,255,255,0.02)',
                padding: '10px 11px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '12px', color: '#F3FBFF' }}>{event.name}</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: GOLD, marginTop: '2px' }}>{event.stakes}</div>
                    {entered && (
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '9px', color: SUCCESS, letterSpacing: '0.10em', marginTop: '4px' }}>
                        ✓ ENTERED · {event.lineup?.length ?? 0} ATHLETES
                      </div>
                    )}
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.45)', marginBottom: '5px' }}>W{event.week}</div>
                    <button
                      onClick={() => toggleComp(event.id)}
                      style={{
                        padding: '6px 10px', borderRadius: '8px', cursor: 'pointer',
                        background: entered ? 'rgba(248,113,113,0.08)' : 'rgba(54,198,144,0.10)',
                        border: entered ? '1px solid rgba(248,113,113,0.28)' : '1px solid rgba(54,198,144,0.28)',
                        fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '0.08em',
                        color: entered ? ALERT : SUCCESS,
                      }}
                    >
                      {entered ? 'WITHDRAW' : 'ENTER'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Active club sponsors */}
      {CLUB_SPONSORS.length > 0 && (
        <div style={{ ...panelStyle, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <HandshakeIcon size={13} color={SUCCESS} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Partners & Sponsors</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {CLUB_SPONSORS.slice(0, 4).map((sp) => (
              <div key={sp.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
                padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '11px', color: '#F3FBFF' }}>{sp.name}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.50)' }}>{sp.category}</div>
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', color: sp.tier === 'Title' ? GOLD : sp.tier === 'Gold' ? '#FCD34D' : AQUA }}>{sp.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Growth projects */}
      <div style={{ ...panelStyle, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <TrendingUpIcon size={13} color={GOLD} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.08em', color: '#F3FBFF' }}>Club Projects</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {CLUB_PROJECTS.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                borderRadius: '9px',
                border: project.status === 'ahead' ? '1px solid rgba(54,198,144,0.24)' : project.status === 'risk' ? '1px solid rgba(248,113,113,0.22)' : '1px solid rgba(255,255,255,0.06)',
                background: project.status === 'ahead' ? 'rgba(54,198,144,0.05)' : project.status === 'risk' ? 'rgba(248,113,113,0.04)' : 'rgba(255,255,255,0.02)',
                padding: '9px 11px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: '11px', color: '#F3FBFF' }}>{project.title}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '9px', color: 'rgba(169,211,231,0.50)', marginTop: '2px' }}>{project.owner} · {project.eta}</div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '10px', color: 'rgba(169,211,231,0.65)', marginTop: '4px', lineHeight: 1.35 }}>{project.impact}</div>
                </div>
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: '10px', letterSpacing: '0.10em', flexShrink: 0,
                  color: project.status === 'ahead' ? SUCCESS : project.status === 'risk' ? ALERT : AQUA,
                }}>{project.status.toUpperCase()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <PaneSwitcher
      panes={[
        {
          id: 'hq',
          label: 'HQ',
          icon: <Building2Icon size={12} />,
          content: <div style={{ position: 'absolute', inset: 0, padding: '10px', overflowY: 'auto' }}>{hqPane}</div>,
        },
        {
          id: 'dynasty',
          label: 'DYNASTY',
          icon: <CrownIcon size={12} />,
          content: <div style={{ position: 'absolute', inset: 0, padding: '10px', overflowY: 'auto' }}>{dynastyPane}</div>,
        },
      ]}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        style={{
          position: 'absolute', inset: 0,
          display: 'grid', gridTemplateColumns: '300px 1fr',
          gap: '10px', padding: '10px', minHeight: 0, overflow: 'hidden',
        }}
      >
        <div style={{ overflowY: 'auto' }}>{hqPane}</div>
        <div style={{ overflowY: 'auto' }}>{dynastyPane}</div>
      </motion.div>
    </PaneSwitcher>
  )
}
