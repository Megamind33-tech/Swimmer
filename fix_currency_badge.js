import fs from 'fs';
let content = fs.readFileSync('src/lobby/TopUtilityBar.tsx', 'utf-8');

// Update CurrencyBadgeProps
content = content.replace(
  /interface CurrencyBadgeProps {\n\s+icon: string;\n\s+value: number;\n\s+color: string;\n\s+onAdd\?: \(\) => void;\n}/,
  `interface CurrencyBadgeProps {
  icon: string;
  value: number;
  color: string;
  onAdd?: () => void;
  'aria-label'?: string;
}`
);

// Update CurrencyBadge component
content = content.replace(
  /const CurrencyBadge: React\.FC<CurrencyBadgeProps> = \({ icon, value, color, onAdd }\) => \(\n  <motion\.div/,
  `const CurrencyBadge: React.FC<CurrencyBadgeProps> = ({ icon, value, color, onAdd, 'aria-label': ariaLabel }) => (
  <motion.div
    aria-label={ariaLabel}`
);

// Update Coins usage
content = content.replace(
  /<CurrencyBadge\n\s+icon="🪙"\n\s+value={USER_DATA\.currencies\.coins}\n\s+color={lobby\.gold}\n\s+\/>/,
  `<CurrencyBadge
      icon="🪙"
      value={USER_DATA.currencies.coins}
      color={lobby.gold}
      aria-label={\`\${USER_DATA.currencies.coins} Coins\`}
    />`
);

// Update Gems usage
content = content.replace(
  /<CurrencyBadge\n\s+icon="💎"\n\s+value={USER_DATA\.currencies\.gems}\n\s+color={lobby\.cyanGlow}\n\s+\/>/,
  `<CurrencyBadge
      icon="💎"
      value={USER_DATA.currencies.gems}
      color={lobby.cyanGlow}
      aria-label={\`\${USER_DATA.currencies.gems} Gems\`}
    />`
);

fs.writeFileSync('src/lobby/TopUtilityBar.tsx', content);
