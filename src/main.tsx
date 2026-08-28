import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import '@phosphor-icons/web/regular';
import '@phosphor-icons/web/fill';
import './styles/tokens.css';
import './styles/app.css';
import './styles/pages.css';
import { App } from './App';
import { I18nProvider } from './i18n';

const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;
const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null;

function Root() {
  const app = (
    <StrictMode>
      <App />
    </StrictMode>
  );
  return convexClient ? <ConvexProvider client={convexClient}><I18nProvider>{app}</I18nProvider></ConvexProvider> : app;
}

createRoot(document.getElementById('root')!).render(<Root />);
