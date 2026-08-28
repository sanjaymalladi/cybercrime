import { useState } from 'react';
import type { RouteKey } from '../../types';
import { LanguageModal, languageName } from '../report/ComplaintFlow';

const links: { route: RouteKey; label: string }[] = [
  { route: 'report', label: 'Report' },
  { route: 'detect', label: 'Detect' },
  { route: 'track', label: 'Track' },
  { route: 'awareness', label: 'Awareness' },
  { route: 'contact', label: 'Contact' },
];

export function Header({ route, onNavigate }: { route: RouteKey; onNavigate: (route: RouteKey) => void }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('en-IN');
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
              {languageName(lang)} <i className="ph ph-caret-down" aria-hidden="true" />
            </button>
            {langOpen && <LanguageModal value={lang} onChange={(next) => { setLang(next); setLangOpen(false); }} onClose={() => setLangOpen(false)} />}
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
