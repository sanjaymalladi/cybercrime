import { useState } from 'react';
import { PageHeader } from '../ui/PageHeader';
import { Reveal } from '../ui/Reveal';
import type { RouteKey } from '../../types';

const journey = [
  { title: 'Complaint registered', date: '24 May 2024, 10:30 AM', state: 'done' },
  { title: 'Under investigation', date: '25 May 2024, 03:15 PM', state: 'done' },
  { title: 'Information requested', date: 'Pending', state: 'current' },
  { title: 'Resolved', date: 'Pending', state: '' },
] as const;

export function TrackPage({ go }: { go: (r: RouteKey) => void }) {
  const [reference, setReference] = useState('CCIN/2024/001234');
  const [trackedReference, setTrackedReference] = useState('');
  const track = () => { if (reference.trim()) setTrackedReference(reference.trim().toUpperCase()); };
  return (
    <>
      <PageHeader
        eyebrow="Track"
        title="Track your complaint"
        description="Enter your complaint ID to see live status. One unified tracker replaces the old disconnected flow."
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => go('report')}>
            <i className="ph ph-plus" /> New complaint
          </button>
        }
      />
      <section className="section-tight">
        <div className="container" style={{ maxWidth: 1000 }}>
          <div className="card card-pad" style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', marginBottom: 'var(--sp-6)' }}>
            <input className="input" style={{ flex: 1, minWidth: 240 }} placeholder="Complaint ID, e.g. CCIN/2024/001234" value={reference} onChange={(event) => setReference(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') track(); }} />
            <button className="btn btn-primary" onClick={track} disabled={!reference.trim()}>
              Track complaint <span className="btn-ico"><i className="ph ph-arrow-right" /></span>
            </button>
          </div>

          {!trackedReference && <div className="track-empty"><i className="ph ph-magnifying-glass" /><h3>Enter your complaint number to view status</h3><p className="muted">Your case timeline and the next steps will appear here.</p></div>}

          {trackedReference && <div className="track-grid track-result">
            <Reveal className="card card-pad complaint-card">
              <div className="case-row">
                <div>
                  <h3>{trackedReference}</h3>
                  <p className="muted">Financial Fraud · Reported 24 May 2024</p>
                </div>
                <span className="badge badge-warning">
                  <i className="ph ph-circle-notch" /> Under investigation
                </span>
              </div>

              <div className="progress" aria-label="60 percent complete">
                <span style={{ width: '60%' }} />
              </div>
              <small className="muted">60% complete · last update 2 days ago</small>

              <ul className="journey">
                {journey.map((s) => (
                  <li key={s.title} className={`journey-step ${s.state}`}>
                    <span className="dot">
                      {s.state === 'done' ? <i className="ph ph-check" /> : s.state === 'current' ? <i className="ph ph-circle" /> : <i className="ph ph-dot" />}
                    </span>
                    <b>{s.title}</b>
                    <small>{s.date}</small>
                  </li>
                ))}
              </ul>
            </Reveal>

            <aside className="card card-pad side-card">
              <h4>What happens next?</h4>
              <p className="muted" style={{ fontSize: '0.92rem' }}>
                Our team is investigating your complaint. You may be contacted for more information or evidence.
              </p>
              <a className="btn btn-danger btn-sm btn-block" style={{ marginTop: 'var(--sp-4)' }} href="tel:1930">
                <i className="ph ph-phone" /> Need urgent help? Call 1930
              </a>
              <hr className="divider" />
              <h4>Related</h4>
              <a className="badge" href="#report" style={{ marginBottom: 8 }}>
                <i className="ph ph-file-plus" /> Report another incident
              </a>
              <a className="badge" href="#resources">
                <i className="ph ph-lifebuoy" /> Support &amp; guides
              </a>
            </aside>
          </div>}
        </div>
      </section>
    </>
  );
}
