/**
 * ProfileBadge — compact player profile chip for the TopUtilityBar
 *
 * Shows: avatar circle (level number) + username + XP progress bar
 * Fits cleanly inside a 48px-tall top bar.
 */

import React from 'react';
import { lobby } from '../theme/tokens';
import { USER_DATA } from '../utils/gameData';

export const ProfileBadge: React.FC = () => {
  const xpPct = Math.min(100, Math.round((USER_DATA.xp / USER_DATA.maxXp) * 100));

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: 0,
        flexShrink: 0,
      }}
    >
      {/* Avatar circle — aqua gradient, displays level number */}
      <div
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-volt) 0%, var(--color-primary-dim) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: '12px',
          color: lobby.bgDeep,
          flexShrink: 0,
          boxShadow: 'none',
        }}
      >
        {USER_DATA.level}
      </div>

      {/* Name + XP bar */}
      <div style={{ minWidth: 0 }}>
        {/* Username */}
        <div
          style={{
            fontFamily: "'Rajdhani', 'Segoe UI', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: lobby.textPrimary,
            lineHeight: 1,
            marginBottom: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '88px',
          }}
        >
          {USER_DATA.username}
        </div>

        {/* XP bar */}
        <div
          style={{
            width: '76px',
            height: '3px',
            borderRadius: '2px',
            background: 'rgba(255,255,255,0.1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${xpPct}%`,
              height: '100%',
              borderRadius: '2px',
              background: 'linear-gradient(90deg, var(--color-volt) 0%, var(--color-primary-dim) 100%)',
              boxShadow: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
};
