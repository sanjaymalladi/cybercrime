import { useEffect, useState } from 'react';
import type { RouteKey } from './types';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ServiceCard } from './components/ui/ServiceCard';
import { Reveal } from './components/ui/Reveal';
import { HeroArt } from './components/ui/HeroArt';
import { ComplaintFlow } from './components/report/ComplaintFlow';
import { TrackPage } from './components/pages/TrackPage';
import { DetectPage } from './components/pages/DetectPage';
import { AwarenessPage } from './components/pages/AwarenessPage';
import { LearnPage } from './components/pages/LearnPage';
import { ResourcesPage } from './components/pages/ResourcesPage';
import { ContactPage } from './components/pages/ContactPage';
import { VoicePage } from './components/pages/VoicePage';
import { useI18n } from './i18n';

const services: [string, string, string, RouteKey, string?][] = [
  ['file-plus', 'Report Cyber Crime', 'File a new complaint online', 'report', undefined],
  ['magnifying-glass', 'Detect Cyber Crime', 'Check links, files or messages', 'detect', 'mint'],
  ['microphone', 'Voice Complaint', 'Lodge your complaint using voice', 'voice', 'violet'],
  ['chart-line-up', 'Track Complaint', 'Check status of your case', 'track', undefined],
  ['graduation-cap', 'Cyber Learning', 'Learn and build your cyber safety skills', 'learn', 'orange'],
  ['shield-check', 'Awareness', 'Tips, guides and latest alerts', 'awareness', undefined],
];

const homeAlerts = [
  { tag: 'Financial', tone: 'tone-warning', title: 'OTP fraud — never share the code sent to your phone', date: '27 Aug 2026' },
  { tag: 'Phishing', tone: 'tone-info', title: 'Fake delivery SMS with malware links on the rise', date: '26 Aug 2026' },
  { tag: 'Investment', tone: 'tone-success', title: 'Crypto "doubling" schemes targeting seniors', date: '24 Aug 2026' },
  { tag: 'Impersonation', tone: 'tone-warning', title: 'Fraudsters posing as cybercrime officials', date: '21 Aug 2026' },
];

const ROUTES: RouteKey[] = ['home', 'report', 'voice', 'detect', 'track', 'learn', 'awareness', 'resources', 'contact'];
const PAGE_TITLES = {
  home: 'Cyber Crime India — Report. Detect. Track.',
  report: 'Report a Cyber Crime — Cyber Crime India',
  voice: 'Voice Complaint — Cyber Crime India',
  detect: 'Check Before You Click — Cyber Crime India',
  track: 'Track Your Complaint — Cyber Crime India',
  learn: 'Cyber Safety Learning — Cyber Crime India',
  awareness: 'Cyber Crime Awareness — Cyber Crime India',
  resources: 'Cyber Safety Resources — Cyber Crime India',
  contact: 'Contact Support — Cyber Crime India',
} satisfies Record<RouteKey, string>;

function parseRoute(hash: string): RouteKey {
  const r = hash.replace(/^#/, '');
  // SAFETY: r is guaranteed to be a member of ROUTES by the includes check below.
  return (ROUTES as readonly string[]).includes(r) ? (r as RouteKey) : 'home';
}

function Stat({ icon, value, label, tone = '' }: { icon: string; value: string; label: string; tone?: string }) {
  return (
    <div className={`stat ${tone}`}>
      <i className={`ph ph-${icon}`} aria-hidden="true" />
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Home({ go }: { go: (r: RouteKey) => void }) {
  const { t } = useI18n();
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>
              {t('home.hero.title')}
            </h1>
            <p className="lede">
              {t('home.hero.description')}
            </p>
            <div className="actions">
              <button className="btn btn-primary btn-lg" onClick={() => go('report')}>
                <i className="ph ph-file-plus" /> {t('home.hero.report')}
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => go('detect')}>
                <i className="ph ph-magnifying-glass" /> {t('home.hero.detect')}
              </button>
            </div>
            <div className="hero-trust">
              <span><i className="ph ph-phone-call" /> {t('home.helpline')} <strong>1930</strong></span>
              <span className="hero-dot" />
              <span>{t('home.official')}</span>
            </div>
          </div>
          <div className="hero-art">
            <HeroArt />
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="kicker">Advisories</span>
              <h2 style={{ marginTop: 'var(--sp-2)' }}>Latest alerts & trending scams</h2>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => go('awareness')}>
              View all alerts <i className="ph ph-arrow-up-right" />
            </button>
          </div>
          <div className="alerts-preview">
            {homeAlerts.map((a) => (
              <button className="alert-row" key={a.title} onClick={() => go('awareness')}>
                <span className={`chip ${a.tone}`}>{a.tag}</span>
                <span className="alert-title">{a.title}</span>
                <span className="alert-date">{a.date}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="kicker">Citizen services</span>
              <h2 style={{ marginTop: 'var(--sp-2)' }}>How can we help you today?</h2>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => go('resources')}>
              View all resources <i className="ph ph-arrow-up-right" />
            </button>
          </div>
          <div className="service-grid">
            {services.map(([icon, title, description, route, tone]) => (
              <ServiceCard key={route} icon={icon} title={title} description={description} route={route} tone={tone} onNavigate={go} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container stats-layout">
          <Reveal>
            <span className="kicker">Public dashboard</span>
            <h2 style={{ marginTop: 'var(--sp-2)' }}>Cyber crime at a glance</h2>
            <p className="muted" style={{ maxWidth: '48ch' }}>
              Example statistics that help citizens understand how reports move through the system.
            </p>
          </Reveal>
          <div className="stats-grid" style={{ marginTop: 'var(--sp-5)' }}>
            <Stat icon="files" value="8,45,231" label="Total complaints" />
            <Stat icon="hourglass-medium" value="1,25,721" label="Cases in progress" tone="tone-warning" />
            <Stat icon="check-circle" value="6,98,321" label="Cases resolved" tone="tone-success" />
            <Stat icon="phone-call" value="1930" label="24×7 helpline" tone="tone-info" />
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="alert alert-info emergency">
            <div>
              <i className="ph ph-phone-call" />
              <div>
                <strong>Need urgent help? Call 1930.</strong>
                <span>For financial cyber fraud, contact the National Cyber Crime Helpline anytime.</span>
              </div>
            </div>
            <a className="btn btn-danger" href="tel:1930">
              Call 1930
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>Need to report a cyber crime?</h2>
              <p className="muted">It only takes a few minutes. Keep your details and any evidence ready.</p>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => go('report')}>
              <i className="ph ph-file-plus" /> Start your complaint
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export function App() {
  const { locale } = useI18n();
  const [route, setRoute] = useState<RouteKey>(parseRoute(location.hash));
  useEffect(() => {
    const onHash = () => setRoute(parseRoute(location.hash));
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    document.title = locale === 'hi' ? `साइबर अपराध भारत — ${route === 'home' ? 'शिकायत · जाँच · स्थिति' : 'नागरिक पोर्टल'}` : PAGE_TITLES[route];
  }, [locale, route]);
  const go = (next: RouteKey) => {
    location.hash = next;
  };

  return (
    <>
      <Header route={route} onNavigate={go} />
      <main id="main-content">
        <div className="page-enter" key={route}>
          {route === 'home' ? (
            <Home go={go} />
          ) : route === 'report' ? (
            <ComplaintFlow />
          ) : route === 'track' ? (
            <TrackPage go={go} />
          ) : route === 'detect' ? (
            <DetectPage go={go} />
          ) : route === 'awareness' ? (
            <AwarenessPage go={go} />
          ) : route === 'learn' ? (
            <LearnPage go={go} />
          ) : route === 'resources' ? (
            <ResourcesPage go={go} />
          ) : route === 'contact' ? (
            <ContactPage />
          ) : route === 'voice' ? (
            <VoicePage go={go} />
          ) : (
            <Home go={go} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
