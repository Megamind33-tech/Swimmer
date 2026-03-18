import React, { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { BrowserToolkit } from './BrowserToolkit'
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

export function GameShell() {
  const [activeTab, setActiveTab] = useState<MainTab>('home')
  const [utilityPage, setUtilityPage] = useState<UtilityPage | null>(null)

  const openTab = (tab: string) => {
    setUtilityPage(null)
    setActiveTab(tab as MainTab)
  }

  const renderPage = (): { key: string; node: React.ReactNode } => {
    if (utilityPage) {
      switch (utilityPage) {
        case 'friends':
          return { key: 'friends', node: <FriendsPage /> }
        case 'inbox':
          return { key: 'inbox', node: <InboxPage /> }
        case 'settings':
          return { key: 'settings', node: <SettingsPage /> }
        case 'training':
          return { key: 'training', node: <TrainingPage /> }
        case 'events':
          return { key: 'events', node: <EventsPage /> }
        case 'rewards':
          return { key: 'rewards', node: <RewardsPage /> }
        case 'pass':
          return { key: 'pass', node: <StarPassPage /> }
        case 'bonus':
          return { key: 'bonus', node: <BonusMissionsPage /> }
        default:
          return { key: 'home', node: <HomePage onSideMenuSelect={(id) => setUtilityPage(id as UtilityPage)} /> }
      }
    }

    switch (activeTab) {
      case 'home':
        return { key: 'home', node: <HomePage onSideMenuSelect={(id) => setUtilityPage(id as UtilityPage)} /> }
      case 'career':
        return { key: 'career', node: <CareerMode /> }
      case 'club':
        return { key: 'club', node: <ClubManagement /> }
      case 'scouts':
        return { key: 'scouts', node: <Scouts /> }
      case 'market':
        return { key: 'market', node: <TransferMarket /> }
      case 'champs':
        return { key: 'champs', node: <Championships /> }
      default:
        return { key: 'home', node: <HomePage onSideMenuSelect={(id) => setUtilityPage(id as UtilityPage)} /> }
    }
  }

  const currentPage = renderPage()

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
      <BottomNav activeTab={activeTab} onChange={openTab} />
    </div>
  )
}
