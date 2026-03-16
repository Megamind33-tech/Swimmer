/**
 * Utility functions for difficulty-related styling and rendering
 */

export type DifficultyLevel = 'EASY' | 'NORMAL' | 'HARD';

/**
 * Get LED-style color classes for difficulty badges
 */
export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'EASY':
      return 'text-green-200 border-green-400/80 bg-gradient-to-br from-green-400/25 to-green-400/10 shadow-[0_0_12px_rgba(74,222,128,0.6),inset_0_0_8px_rgba(74,222,128,0.2)]';
    case 'NORMAL':
      return 'text-blue-200 border-blue-400/80 bg-gradient-to-br from-blue-400/25 to-blue-400/10 shadow-[0_0_12px_rgba(96,165,250,0.6),inset_0_0_8px_rgba(96,165,250,0.2)]';
    case 'HARD':
      return 'text-red-200 border-red-400/80 bg-gradient-to-br from-red-400/25 to-red-400/10 shadow-[0_0_12px_rgba(248,113,113,0.6),inset_0_0_8px_rgba(248,113,113,0.2)]';
    default:
      return 'text-white/70 border-white/30 bg-white/8';
  }
};

/**
 * Get difficulty badge icon representation
 */
export const getDifficultyBadgeIcon = (difficulty: string) => {
  switch (difficulty) {
    case 'EASY':
      return '◆';
    case 'NORMAL':
      return '◆◆';
    case 'HARD':
      return '◆◆◆';
    default:
      return '◆';
  }
};

/**
 * Get difficulty color for borders/accents (minimal styling)
 */
export const getDifficultyBorderColor = (difficulty: string) => {
  switch (difficulty) {
    case 'EASY':
      return 'border-green-400/60';
    case 'NORMAL':
      return 'border-blue-400/60';
    case 'HARD':
      return 'border-red-400/60';
    default:
      return 'border-white/30';
  }
};

/**
 * Get difficulty text color
 */
export const getDifficultyTextColor = (difficulty: string) => {
  switch (difficulty) {
    case 'EASY':
      return 'text-green-300';
    case 'NORMAL':
      return 'text-blue-300';
    case 'HARD':
      return 'text-red-300';
    default:
      return 'text-white/70';
  }
};

/**
 * Get difficulty background color
 */
export const getDifficultyBackgroundColor = (difficulty: string) => {
  switch (difficulty) {
    case 'EASY':
      return 'bg-green-400/10';
    case 'NORMAL':
      return 'bg-blue-400/10';
    case 'HARD':
      return 'bg-red-400/10';
    default:
      return 'bg-white/5';
  }
};

/**
 * Get difficulty label text
 */
export const getDifficultyLabel = (difficulty: string) => {
  return difficulty.charAt(0) + difficulty.slice(1).toLowerCase();
};

/**
 * Format difficulty with icon for display
 */
export const formatDifficultyDisplay = (difficulty: string) => {
  const icon = getDifficultyBadgeIcon(difficulty);
  const label = getDifficultyLabel(difficulty);
  return `${icon} ${label}`;
};
