import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { injectCSSTokens } from './theme/tokens';

// Inject design tokens as CSS custom properties before first render
injectCSSTokens();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
