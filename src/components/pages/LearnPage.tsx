import { PageHeader } from '../ui/PageHeader';
import { Reveal } from '../ui/Reveal';
import type { RouteKey } from '../../types';

const learn = [
  { icon: 'envelope-simple-open', tag: 'Email', title: 'Spot a phishing email', desc: 'The tells in sender, links and urgency — with real examples.', meta: '6 min · Article' },
  { icon: 'qr-code', tag: 'UPI', title: 'UPI safety essentials', desc: 'Why you should never accept a collect request. Ever.', meta: '4 min · Reel' },
  { icon: 'bank', tag: 'Banking', title: 'Safe digital banking', desc: 'PINs, OTPs and what your bank will never ask.', meta: '8 min · Guide' },
  { icon: 'device-mobile', tag: 'Privacy', title: 'Lock down social media', desc: 'Settings that stop strangers from scraping you.', meta: '5 min · Checklist' },
  { icon: 'students', tag: 'Family', title: 'Protecting parents online', desc: 'A gentle conversation guide for first-time smartphone users.', meta: '7 min · Article' },
  { icon: 'list-checks', tag: 'Process', title: 'Report in 5 steps', desc: 'Exactly what to keep ready before you file.', meta: '3 min · Walkthrough' },
];

export function LearnPage({ go }: { go: (r: RouteKey) => void }) {
  return (
    <>
      <PageHeader
        eyebrow="Learn"
        title="Build your cyber-safety habits"
        description="Short, practical guides for citizens — no jargon, just what to do."
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => go('detect')}>
            <i className="ph ph-shield-check" /> Try the detector
          </button>
        }
      />
      <section className="section-tight">
        <div className="container">
          <div className="learn-grid">
            {learn.map((l, i) => (
              <Reveal key={l.title} delay={i * 40} className="card card-hover learn-card">
                <span className="ic"><i className={`ph ph-${l.icon}`} /></span>
                <span className="badge badge-accent">{l.tag}</span>
                <h4>{l.title}</h4>
                <p className="muted" style={{ fontSize: '0.92rem' }}>{l.desc}</p>
                <div className="meta"><i className="ph ph-clock" /> {l.meta}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
