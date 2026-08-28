import { useState } from 'react';
import type { RouteKey } from '../../types';
import { LanguageModal } from '../report/ComplaintFlow';
import { useI18n, type Locale } from '../../i18n';

const localeCodes = new Set<Locale>(['en', 'hi', 'bn', 'ta', 'te', 'kn', 'ml', 'mr', 'gu', 'pa', 'or', 'as', 'ur', 'ne', 'kok', 'ks', 'sd', 'sa', 'sat', 'mni', 'brx', 'mai', 'doi']);

function localeFromCode(code: string): Locale {
  if (code === 'unknown') return 'en';
  // SAFETY: localeCodes contains only valid Locale values, so membership proves the union type.
  return localeCodes.has(code as Locale) ? (code as Locale) : 'en';
}

const links: { route: RouteKey; label: string }[] = [
  { route: 'report', label: 'Report' },
  { route: 'detect', label: 'Detect' },
  { route: 'track', label: 'Track' },
  { route: 'awareness', label: 'Awareness' },
  { route: 'contact', label: 'Contact' },
];

export function Header({ route, onNavigate }: { route: RouteKey; onNavigate: (route: RouteKey) => void }) {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();

  const go = (r: RouteKey) => {
    onNavigate(r);
    setOpen(false);
  };

  return (
    <header className={`nav ${open ? 'menu-open' : ''}`}>
      <div className="container nav-inner">
        <button className="brand" type="button" onClick={() => go('home')}>
          <span className="brand-mark">
            <i className="ph ph-bank" aria-hidden="true" />
          </span>
          <span>
            {t('brand.name')}
            <small>{t('brand.tagline')}</small>
          </span>
        </button>

        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.route}
              href={`#${l.route}`}
              className={route === l.route ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                go(l.route);
              }}
            >
              {t(`nav.${l.route}`)}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <div className="lang" style={{ position: 'relative' }}>
            <button
              className="btn btn-ghost btn-sm lang"
              type="button"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              onClick={() => setLangOpen((o) => !o)}
            >
              {locale === 'hi' ? 'हिन्दी' : locale === 'en' ? 'English' : locale.toUpperCase()} <i className="ph ph-caret-down" aria-hidden="true" />
            </button>
            {langOpen && <LanguageModal value={`${locale}-IN`} showAutoDetect={false} onChange={(next) => { setLocale(localeFromCode(next.split('-')[0])); setLangOpen(false); }} onClose={() => setLangOpen(false)} />}
          </div>

          <a className="btn btn-danger btn-sm call-btn" href="tel:1930">
            <i className="ph ph-phone" aria-hidden="true" /> {t('nav.call')}
          </a>

          <button
            className="nav-toggle"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <i className={`ph ${open ? 'ph-x' : 'ph-list'}`} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
