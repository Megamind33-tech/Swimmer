/**
 * GameShell — top-level layout and game-flow controller
 *
 * Game phases:
 *   menu          → normal menu/lobby screens (TopBar + BottomNav + pages)
 *   mode-select   → full-screen PlayScreen (game mode picker)
 *   pre-race      → full-screen PreRaceSetupScreen
 *   racing        → full-screen Babylon.js RaceScene + HUD
 *   paused        → RaceScene still mounted, PauseMenu overlaid on top
 *   results       → full-screen RaceResultScreen
 *
 * The Babylon.js canvas is ONLY mounted while phase === 'racing' | 'paused'.
 * All other phases render the menu system without a WebGL context.
 */

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { BrowserToolkit } from './BrowserToolkit'
import { PauseMenu } from './PauseMenu'
import { RaceScene, RaceConfig, RaceResult } from './RaceScene'
import { PlayScreen } from './menu/PlayScreen'
import { PreRaceSetupScreen } from './menu/PreRaceSetupScreen'
import { RaceResultScreen } from './menu/RaceResultScreen'
import { HomePage } from '../pages/HomePage'
import { CareerMode } from '../pages/CareerMode'
import { ClubManagement } from '../pages/ClubManagement'
import { Scouts } from '../pages/Scouts'
import { TransferMarket } from '../pages/TransferMarket'
import { Championships } from '../pages/Championships'
import lockerRoomBackground from '../designs/locker_room_custom/screen.png'
import {
  BonusMissionsPage,
  EventsPage,
  FriendsPage,
  InboxPage,
  RewardsPage,
  SettingsPage,
  StarPassPage,
  TrainingPage,
} from '../pages/UtilityPages'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type MainTab = 'home' | 'career' | 'club' | 'scouts' | 'market' | 'champs'

export type UtilityPage =
  | 'friends'
  | 'inbox'
  | 'settings'
  | 'training'
  | 'events'
  | 'rewards'
  | 'pass'
  | 'bonus'

type GamePhase =
  | 'menu'
  | 'mode-select'
  | 'pre-race'
  | 'racing'
  | 'paused'
  | 'results'

// ─────────────────────────────────────────────────────────────────────────────
// GameShell
// ─────────────────────────────────────────────────────────────────────────────

export function GameShell() {
  // ── Menu navigation state ────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<MainTab>('home')
  const [utilityPage, setUtilityPage] = useState<UtilityPage | null>(null)

  // ── Game flow state ──────────────────────────────────────────────────────
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu')
  const [selectedMode, setSelectedMode] = useState<string>('quick-race')
  const [raceConfig, setRaceConfig] = useState<RaceConfig>({
    distance: '100M',
    stroke: 'FREESTYLE',
    venue: 'olympic',
  })
  const [raceResult, setRaceResult] = useState<RaceResult | null>(null)

  // ── Menu navigation helpers ──────────────────────────────────────────────
  const openTab = (tab: string) => {
    setUtilityPage(null)
    setActiveTab(tab as MainTab)
  }

  const renderMenuPage = (): { key: string; node: React.ReactNode } => {
    if (utilityPage) {
      switch (utilityPage) {
        case 'friends':   return { key: 'friends',   node: <FriendsPage /> }
        case 'inbox':     return { key: 'inbox',     node: <InboxPage /> }
        case 'settings':  return { key: 'settings',  node: <SettingsPage /> }
        case 'training':  return { key: 'training',  node: <TrainingPage /> }
        case 'events':    return { key: 'events',    node: <EventsPage /> }
        case 'rewards':   return { key: 'rewards',   node: <RewardsPage /> }
        case 'pass':      return { key: 'pass',      node: <StarPassPage /> }
        case 'bonus':     return { key: 'bonus',     node: <BonusMissionsPage /> }
        default:          return { key: 'home',      node: <HomePage onSideMenuSelect={(id) => setUtilityPage(id as UtilityPage)} onPlay={enterModeSelect} /> }
      }
    }

    switch (activeTab) {
      case 'home':    return { key: 'home',    node: <HomePage onSideMenuSelect={(id) => setUtilityPage(id as UtilityPage)} onPlay={enterModeSelect} /> }
      case 'career':  return { key: 'career',  node: <CareerMode /> }
      case 'club':    return { key: 'club',    node: <ClubManagement /> }
      case 'scouts':  return { key: 'scouts',  node: <Scouts /> }
      case 'market':  return { key: 'market',  node: <TransferMarket /> }
      case 'champs':  return { key: 'champs',  node: <Championships /> }
      default:        return { key: 'home',    node: <HomePage onSideMenuSelect={(id) => setUtilityPage(id as UtilityPage)} onPlay={enterModeSelect} /> }
    }
  }

  // ── Game flow transitions ────────────────────────────────────────────────

  const enterModeSelect = () => setGamePhase('mode-select')

  const handleModeSelected = (modeId: string) => {
    setSelectedMode(modeId)
    setGamePhase('pre-race')
  }

  const handleConfirmRace = (cfg: RaceConfig) => {
    setRaceConfig(cfg)
    setGamePhase('racing')
  }

  const handleCancelPreRace = () => setGamePhase('mode-select')

  const handlePause = () => setGamePhase('paused')
  const handleResume = () => setGamePhase('racing')

  const handleAbandonRace = () => {
    setGamePhase('menu')
    setRaceResult(null)
  }

  const handleRaceComplete = (result: RaceResult) => {
    setRaceResult(result)
    setGamePhase('results')
  }

  const handleReturnHome = () => {
    setGamePhase('menu')
    setActiveTab('home')
    setRaceResult(null)
  }

  const handleRematch = () => {
    setGamePhase('pre-race')
    setRaceResult(null)
  }

  const handleContinue = () => {
    setGamePhase('menu')
    setActiveTab('career')
    setRaceResult(null)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Full-screen game phases (overlay the entire viewport, no menu chrome)
  // ─────────────────────────────────────────────────────────────────────────

  if (gamePhase === 'mode-select') {
    return (
      <div className="w-full h-full relative overflow-hidden bg-[#050B14]">
        {/* Subtle background for mode-select */}
        <img
          src={lockerRoomBackground}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[#050B14]/70" />

        {/* Back button */}
        <button
          onClick={() => setGamePhase('menu')}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white/70 text-xs font-bold uppercase tracking-wider backdrop-blur-sm hover:bg-black/70 active:scale-95 transition-all"
        >
          ← Back
        </button>

        <div className="relative z-10 h-full overflow-y-auto">
          <PlayScreen onModeSelect={handleModeSelected} />
        </div>
      </div>
    )
  }

  if (gamePhase === 'pre-race') {
    return (
      <div className="w-full h-full relative overflow-hidden bg-[#050B14]">
        <img
          src={lockerRoomBackground}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[#050B14]/80" />
        <div className="relative z-10 h-full overflow-y-auto">
          <PreRaceSetupScreen
            mode={selectedMode.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            onConfirmRace={() =>
              handleConfirmRace(raceConfig)
            }
            onCancel={handleCancelPreRace}
            onConfigChange={(cfg) => setRaceConfig((prev) => ({ ...prev, ...cfg }))}
          />
        </div>
      </div>
    )
  }

  if (gamePhase === 'racing' || gamePhase === 'paused') {
    return (
      <>
        <RaceScene
          config={raceConfig}
          onPause={handlePause}
          onRaceComplete={handleRaceComplete}
        />
        {gamePhase === 'paused' && (
          <PauseMenu onResume={handleResume} onMainMenu={handleAbandonRace} />
        )}
      </>
    )
  }

  if (gamePhase === 'results' && raceResult) {
    return (
      <div className="w-full h-full relative overflow-hidden bg-[#050B14]">
        <img
          src={lockerRoomBackground}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[#050B14]/80" />
        <div className="relative z-10 h-full overflow-y-auto">
          <RaceResultScreen
            playerRank={raceResult.rank}
            playerTime={raceResult.time}
            playerName="You"
            onContinue={handleContinue}
            onRematch={handleRematch}
            onReturnHome={handleReturnHome}
            onWatchReplay={handleReturnHome}
          />
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Default: menu phase — existing lobby/management UI
  // ─────────────────────────────────────────────────────────────────────────

  const currentPage = renderMenuPage()

  return (
    <div className="w-full h-full relative overflow-hidden font-sans select-none">
      <img src={lockerRoomBackground} alt="Locker room backdrop" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[#050B14]/72 pointer-events-none" />

      <TopBar
        onOpenFriends={() => setUtilityPage('friends')}
        onOpenInbox={() => setUtilityPage('inbox')}
        onOpenSettings={() => setUtilityPage('settings')}
      />

      <AnimatePresence mode="wait">
        <React.Fragment key={currentPage.key}>{currentPage.node}</React.Fragment>
      </AnimatePresence>

      <BrowserToolkit
        activeTab={activeTab}
        utilityPage={utilityPage}
        onOpenTab={openTab}
        onOpenUtility={(page) => setUtilityPage(page as UtilityPage)}
        onCloseUtility={() => setUtilityPage(null)}
      />

      <BottomNav activeTab={activeTab} onChange={openTab} onPlay={enterModeSelect} />
    </div>
  )
}
