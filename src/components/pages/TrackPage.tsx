import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { PageHeader } from '../ui/PageHeader';
import { Reveal } from '../ui/Reveal';
import type { RouteKey } from '../../types';

type ComplaintData = {
  reference: string;
  category: string;
  summary: string;
  status: 'registered' | 'investigating' | 'resolved';
  reportedAt: string;
  lastUpdated: string;
};

const demoComplaint: ComplaintData = {
  reference: 'CCIN/2026/004281', category: 'Financial Fraud',
  summary: 'A fake payment-failed request collected money from a UPI account.',
  status: 'investigating', reportedAt: '2024-05-24T10:30:00.000Z', lastUpdated: '2024-05-27T15:15:00.000Z',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function formatCategory(value: string) {
  return value.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function journeyFor(complaint: ComplaintData) {
  const investigating = complaint.status === 'investigating';
  const resolved = complaint.status === 'resolved';
  return [
    { title: 'Complaint registered', date: formatDate(complaint.reportedAt), state: 'done' },
    { title: 'Under investigation', date: investigating || resolved ? formatDate(complaint.lastUpdated) : 'Pending', state: investigating ? 'current' : resolved ? 'done' : '' },
    { title: 'Information requested', date: 'Pending', state: '' },
    { title: 'Resolved', date: resolved ? formatDate(complaint.lastUpdated) : 'Pending', state: resolved ? 'done' : '' },
  ] as const;
}

function TrackLayout({ go, complaint, loading, trackedReference, setTrackedReference }: { go: (r: RouteKey) => void; complaint: ComplaintData | null; loading: boolean; trackedReference: string; setTrackedReference: (value: string) => void }) {
  const [reference, setReference] = useState(trackedReference || demoComplaint.reference);
  const [searched, setSearched] = useState(false);
  const track = () => {
    const next = reference.trim().toUpperCase();
    if (next) { setTrackedReference(next); setSearched(true); }
  };
  const journey = complaint ? journeyFor(complaint) : [];
  const progress = complaint?.status === 'resolved' ? 100 : complaint?.status === 'investigating' ? 60 : 25;

  return (
    <>
      <PageHeader eyebrow="Track" title="Track your complaint" description="Enter your complaint ID to see live status. One unified tracker replaces the old disconnected flow." actions={<button className="btn btn-primary btn-sm" onClick={() => go('report')}><i className="ph ph-plus" /> New complaint</button>} />
      <section className="section-tight"><div className="container" style={{ maxWidth: 1000 }}>
        <div className="card card-pad" style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', marginBottom: 'var(--sp-6)' }}>
          <input className="input" style={{ flex: 1, minWidth: 240 }} placeholder="Complaint ID, e.g. CCIN/2024/001234" value={reference} onChange={(event) => setReference(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') track(); }} />
          <button className="btn btn-primary" onClick={track} disabled={!reference.trim()}>Track complaint <span className="btn-ico"><i className="ph ph-arrow-right" /></span></button>
        </div>
        {!searched && <div className="track-empty"><i className="ph ph-magnifying-glass" /><h3>Enter your complaint number to view status</h3><p className="muted">Your case timeline and the next steps will appear here.</p></div>}
        {searched && loading && <div className="track-empty"><i className="ph ph-spinner-gap" /><h3>Looking up your complaint</h3><p className="muted">Checking the live complaint register…</p></div>}
        {searched && !loading && !complaint && <div className="track-empty"><i className="ph ph-file-x" /><h3>Complaint not found</h3><p className="muted">Check the reference number and try again.</p></div>}
        {searched && complaint && <div className="track-grid track-result">
          <Reveal className="card card-pad complaint-card"><div className="case-row"><div><h3>{complaint.reference}</h3><p className="muted">{formatCategory(complaint.category)} · Reported {formatDate(complaint.reportedAt)}</p></div><span className={`badge ${complaint.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}><i className={`ph ${complaint.status === 'resolved' ? 'ph-check-circle' : 'ph-circle-notch'}`} /> {complaint.status === 'resolved' ? 'Resolved' : complaint.status === 'investigating' ? 'Under investigation' : 'Registered'}</span></div>
            <p className="muted" style={{ marginTop: 'var(--sp-4)' }}>{complaint.summary}</p><div className="progress" aria-label={`${progress} percent complete`}><span style={{ width: `${progress}%` }} /></div><small className="muted">{progress}% complete · last update {formatDate(complaint.lastUpdated)}</small>
            <ul className="journey">{journey.map((item) => <li key={item.title} className={`journey-step ${item.state}`}><span className="dot">{item.state === 'done' ? <i className="ph ph-check" /> : item.state === 'current' ? <i className="ph ph-circle" /> : <i className="ph ph-dot" />}</span><b>{item.title}</b><small>{item.date}</small></li>)}</ul>
          </Reveal>
          <aside className="card card-pad side-card"><h4>What happens next?</h4><p className="muted" style={{ fontSize: '0.92rem' }}>{complaint.status === 'resolved' ? 'This complaint has been marked resolved. Keep this reference for your records.' : 'Our team is investigating your complaint. You may be contacted for more information or evidence.'}</p><a className="btn btn-danger btn-sm btn-block" style={{ marginTop: 'var(--sp-4)' }} href="tel:1930"><i className="ph ph-phone" /> Need urgent help? Call 1930</a><hr className="divider" /><h4>Related</h4><a className="badge" href="#report" style={{ marginBottom: 8 }}><i className="ph ph-file-plus" /> Report another incident</a><a className="badge" href="#resources"><i className="ph ph-lifebuoy" /> Support &amp; guides</a></aside>
        </div>}
      </div></section>
    </>
  );
}

function LiveTrackPage({ go }: { go: (r: RouteKey) => void }) {
  const [trackedReference, setTrackedReference] = useState('');
  const complaint = useQuery(api.queries.getComplaint, trackedReference ? { reference: trackedReference } : 'skip');
  const resolvedComplaint = trackedReference === demoComplaint.reference && !complaint ? demoComplaint : complaint ?? null;
  return <TrackLayout go={go} complaint={resolvedComplaint} loading={!!trackedReference && trackedReference !== demoComplaint.reference && complaint === undefined} trackedReference={trackedReference} setTrackedReference={setTrackedReference} />;
}

export function TrackPage({ go }: { go: (r: RouteKey) => void }) {
  if (import.meta.env.VITE_CONVEX_URL) return <LiveTrackPage go={go} />;
  const [trackedReference, setTrackedReference] = useState('');
  const complaint = trackedReference === demoComplaint.reference ? demoComplaint : null;
  return <TrackLayout go={go} complaint={complaint} loading={false} trackedReference={trackedReference} setTrackedReference={setTrackedReference} />;
}
