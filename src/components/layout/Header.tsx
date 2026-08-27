import { useState } from 'react';
import type { RouteKey } from '../../types';

const links: { route: RouteKey; label: string }[] = [
  { route: 'report', label: 'Report' },
  { route: 'detect', label: 'Detect' },
  { route: 'track', label: 'Track' },
  { route: 'learn', label: 'Learn' },
  { route: 'awareness', label: 'Awareness' },
  { route: 'contact', label: 'Contact' },
];

export function Header({ route, onNavigate }: { route: RouteKey; onNavigate: (route: RouteKey) => void }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [langOpen, setLangOpen] = useState(false);

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
            Cyber Crime India
            <small>Report · Detect · Track</small>
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
              {l.label}
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
              {lang === 'en' ? 'English' : 'हिन्दी'} <i className="ph ph-caret-down" aria-hidden="true" />
            </button>
            {langOpen && (
              <div className="select-panel" style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 160 }}>
                <button aria-selected={lang === 'en'} onClick={() => { setLang('en'); setLangOpen(false); }}>
                  <span>English</span>
                  <i className="ph ph-check" aria-hidden="true" />
                </button>
                <button aria-selected={lang === 'hi'} onClick={() => { setLang('hi'); setLangOpen(false); }}>
                  <span>हिन्दी</span>
                  <i className="ph ph-check" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          <a className="btn btn-danger btn-sm call-btn" href="tel:1930">
            <i className="ph ph-phone" aria-hidden="true" /> Call 1930
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
