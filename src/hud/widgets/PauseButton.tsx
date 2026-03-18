/**
 * PauseButton — top-right tap-to-pause control
 *
 * 38×38px minimum tap target (WCAG 2.5.5 adjacent to radar panel).
 * Uses the standard HUD panel style with a pause icon.
 * Scales on press for tactile feedback.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Pause } from 'lucide-react';
import { HUD_PANEL, HUD_COLOR } from '../hudTokens';

interface PauseButtonProps {
  onPause: () => void;
}

export const PauseButton: React.FC<PauseButtonProps> = ({ onPause }) => (
  <motion.button
    whileTap={{ scale: 0.88 }}
    whileHover={{ scale: 1.06 }}
    onClick={onPause}
    aria-label="Pause race"
    style={{
      ...HUD_PANEL,
      width:          '38px',
      height:         '38px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      cursor:         'pointer',
      color:          HUD_COLOR.textSecondary,
      userSelect:     'none',
      WebkitUserSelect: 'none',
      flexShrink:     0,
    }}
  >
    <Pause size={16} />
  </motion.button>
);
