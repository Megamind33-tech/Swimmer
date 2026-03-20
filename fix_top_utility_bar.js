import fs from 'fs';
const content = fs.readFileSync('src/lobby/TopUtilityBar.tsx', 'utf-8');

const updated = content.replace(/{\/\* Settings button \*\/}\n\s*<motion\.button/, '{/* Settings button */}\n    <motion.button\n      aria-label="Settings"');

fs.writeFileSync('src/lobby/TopUtilityBar.tsx', updated);
