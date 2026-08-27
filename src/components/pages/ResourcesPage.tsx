import { PageHeader } from '../ui/PageHeader';
import { Reveal } from '../ui/Reveal';
import type { RouteKey } from '../../types';

const resources = [
  { icon: 'book', title: 'Citizen manual', desc: 'How the portal works, end to end.', meta: 'PDF · 2.1 MB' },
  { icon: 'shield-check', title: 'Cyber safety tips', desc: 'Everyday practices that keep you safe.', meta: 'PDF · 1.4 MB' },
  { icon: 'newspaper', title: 'Daily digest', desc: 'I4C modus-operandi briefings.', meta: 'Daily · Subscribe' },
  { icon: 'magnifying-glass', title: 'Suspect repository', desc: 'Search reported numbers, URLs & accounts.', meta: 'Tool · Live' },
  { icon: 'phone-call', title: 'Helpline poster', desc: '1930 — share it with someone you know.', meta: 'Image · A4' },
  { icon: 'lifebuoy', title: 'Women & child safety', desc: 'Report and support pathways.', meta: 'Guide · EN / HI' },
];

export function ResourcesPage({ go }: { go: (r: RouteKey) => void }) {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Official support &amp; guides"
        description="Trusted, downloadable material — and the tools that connect you to help faster."
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => go('contact')}>
            <i className="ph ph-headset" /> Contact support
          </button>
        }
      />
      <section className="section-tight">
        <div className="container">
          <div className="resource-grid">
            {resources.map((r, i) => (
              <Reveal key={r.title} delay={i * 40} className="card card-hover resource-card">
                <span className="ic"><i className={`ph ph-${r.icon}`} /></span>
                <h4>{r.title}</h4>
                <p className="muted" style={{ fontSize: '0.92rem' }}>{r.desc}</p>
                <div className="meta"><i className="ph ph-download-simple" /> {r.meta}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
