import { useRef, useState, type FormEvent } from 'react';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';

type Step = { title: string; caption: string };
const steps: Step[] = [
  { title: 'Complaint details', caption: 'What happened' },
  { title: 'Incident details', caption: 'How it happened' },
  { title: 'Evidence', caption: 'What you have' },
  { title: 'Review & submit', caption: 'Confirm' },
];

const categories = [
  { label: 'Financial fraud', value: 'financial-fraud' },
  { label: 'Phishing / smishing', value: 'phishing' },
  { label: 'Online harassment', value: 'harassment' },
  { label: 'Identity theft', value: 'identity-theft' },
  { label: 'Ransomware / hacking', value: 'hacking' },
];
const subcategories = [
  { label: 'UPI / payment fraud', value: 'upi' },
  { label: 'Account takeover', value: 'account' },
  { label: 'Fake website or app', value: 'fake-site' },
  { label: 'Impersonation / OTP fraud', value: 'otp' },
];

type FormState = {
  category: string;
  subcategory: string;
  incidentDate: string;
  contact: string;
  description: string;
  amount: string;
  suspect: string;
  consent: boolean;
};

const empty: FormState = {
  category: '',
  subcategory: '',
  incidentDate: '',
  contact: '',
  description: '',
  amount: '',
  suspect: '',
  consent: false,
};

export function ComplaintFlow() {
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [files, setFiles] = useState<string[]>([]);
  const update = (key: keyof FormState, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) setStep((s) => s + 1);
    else setSubmitted(true);
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  if (submitted) {
    return (
      <section className="section">
        <div className="container-narrow">
          <div className="card card-pad" style={{ textAlign: 'center' }}>
            <span className="badge badge-success" style={{ marginInline: 'auto' }}>
              <i className="ph ph-check-circle" /> Complaint submitted
            </span>
            <h2 style={{ marginTop: 'var(--sp-4)' }}>We&rsquo;ve received your report</h2>
            <p className="lede" style={{ margin: 'var(--sp-3) auto 0' }}>
              Keep your reference number to track status. A confirmation has been sent to your registered contact.
            </p>
            <div
              className="case-id"
              style={{
                fontSize: '1.6rem',
                margin: 'var(--sp-5) auto',
                padding: 'var(--sp-4)',
                border: '1px dashed var(--line-strong)',
                borderRadius: 'var(--r)',
                maxWidth: 360,
              }}
            >
              CCIN/2026/004281
            </div>
            <div className="cluster" style={{ justifyContent: 'center' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigator.clipboard?.writeText('CCIN/2026/004281')}
              >
                <i className="ph ph-copy" /> Copy reference
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setSubmitted(false);
                  setStep(0);
                  setForm(empty);
                  setFiles([]);
                }}
              >
                File another complaint
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeaderInner />
      <section className="section-tight">
        <div className="container" style={{ maxWidth: 920 }}>
          {/* Mode picker */}
          <div className="card card-pad" style={{ padding: 'var(--sp-4)', display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
            <ModeChoice active={mode === 'text'} icon="note-pencil" title="Type your complaint" sub="Use the guided form" onClick={() => setMode('text')} />
            <ModeChoice active={mode === 'voice'} icon="microphone" title="Speak your complaint" sub="English or Hindi voice input" onClick={() => setMode('voice')} />
          </div>

          {mode === 'voice' ? (
            <VoicePane />
          ) : (
            <form className="card card-pad" style={{ marginTop: 'var(--sp-5)' }} onSubmit={next}>
              <div className="stepper">
                {steps.map((s, i) => (
                  <div key={s.title} className="step-wrap" style={{ display: 'contents' }}>
                    <div className={`step ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
                      <span className="num">{i < step ? <i className="ph ph-check" /> : i + 1}</span>
                      <span className="meta">
                        <b>{s.title}</b>
                        <small>{s.caption}</small>
                      </span>
                    </div>
                    {i < steps.length - 1 && <span className="bar" />}
                  </div>
                ))}
              </div>

              {step === 0 && (
                <div className="field-grid">
                  <Select label="Category of crime" required value={form.category} options={categories} onChange={(v) => update('category', v)} placeholder="Select category" />
                  <Select label="Sub category" required value={form.subcategory} options={subcategories} onChange={(v) => update('subcategory', v)} placeholder="Select sub category" />
                  <div className="field">
                    <span className="label">Incident date *</span>
                    <DatePicker value={form.incidentDate} onChange={(v) => update('incidentDate', v)} placeholder="Select incident date" />
                  </div>
                  <div className="field">
                    <span className="label">Your email or mobile</span>
                    <input className="input" placeholder="For complaint updates" value={form.contact} onChange={(e) => update('contact', e.target.value)} />
                  </div>
                  <div className="field full">
                    <span className="label">Complaint description *</span>
                    <textarea className="textarea" placeholder="Please describe the incident in detail (minimum 200 characters)…" required value={form.description} onChange={(e) => update('description', e.target.value)} />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="field-grid">
                  <div className="field full">
                    <span className="label">How did this incident happen?</span>
                    <textarea className="textarea" placeholder="Tell us what you noticed, in your own words…" />
                  </div>
                  <div className="field">
                    <span className="label">Approximate amount involved (₹)</span>
                    <input className="input" placeholder="0.00" value={form.amount} onChange={(e) => update('amount', e.target.value)} />
                  </div>
                  <div className="field">
                    <span className="label">Suspect phone, email or account</span>
                    <input className="input" placeholder="Optional" value={form.suspect} onChange={(e) => update('suspect', e.target.value)} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="field">
                  <span className="label">Supporting evidence</span>
                  <label className="dropzone">
                    <i className="ph ph-upload-simple" />
                    <span>
                      <strong>Drop screenshots, chats or receipts</strong>
                      <br />
                      PNG, JPG or PDF · up to 10 MB each
                    </span>
                    <input
                      type="file"
                      multiple
                      hidden
                      onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))}
                    />
                  </label>
                  {files.length > 0 && (
                    <ul className="source-chips" style={{ marginTop: 'var(--sp-3)' }}>
                      {files.map((f) => (
                        <li key={f} className="chip">
                          <i className="ph ph-paperclip" /> {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <label className="checkbox" style={{ marginTop: 'var(--sp-5)' }}>
                    <input type="checkbox" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} />
                    <span>I confirm the information provided is accurate and understand that false complaints may attract penal action.</span>
                  </label>
                </div>
              )}

              {step === 3 && (
                <div className="field">
                  <span className="label">Review your complaint</span>
                  <div className="feature-list">
                    <ReviewRow label="Category" value={categories.find((c) => c.value === form.category)?.label || '—'} />
                    <ReviewRow label="Sub category" value={subcategories.find((c) => c.value === form.subcategory)?.label || '—'} />
                    <ReviewRow label="Incident date" value={form.incidentDate || '—'} />
                    <ReviewRow label="Contact" value={form.contact || '—'} />
                    <ReviewRow label="Amount involved" value={form.amount ? `₹ ${form.amount}` : '—'} />
                    <ReviewRow label="Evidence files" value={files.length ? `${files.length} attached` : 'None'} />
                  </div>
                </div>
              )}

              <div className="cluster" style={{ marginTop: 'var(--sp-6)', justifyContent: 'space-between' }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={back} disabled={step === 0}>
                  <i className="ph ph-arrow-left" /> Back
                </button>
                <button type="submit" className="btn btn-primary">
                  {step === steps.length - 1 ? 'Submit complaint' : 'Save & continue'}
                  <span className="btn-ico">
                    <i className="ph ph-arrow-right" />
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function PageHeaderInner() {
  return (
    <section className="page-header">
      <div className="container">
        <span className="eyebrow" style={{ display: 'inline-flex', marginBottom: 'var(--sp-4)' }}>
          Secure complaint
        </span>
        <h1>Report a cyber crime</h1>
        <p className="lede">Tell us what happened. One guided flow — for text or voice — replaces the old separate wizards.</p>
      </div>
    </section>
  );
}

function ModeChoice({ active, icon, title, sub, onClick }: { active: boolean; icon: string; title: string; sub: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card"
      style={{
        flex: 1,
        minWidth: 240,
        display: 'flex',
        gap: 'var(--sp-3)',
        alignItems: 'center',
        padding: 'var(--sp-4) var(--sp-5)',
        textAlign: 'left',
        borderColor: active ? 'var(--accent)' : 'var(--line)',
        background: active ? 'var(--accent-soft)' : 'var(--surface)',
      }}
    >
      <span className="mode-icon" style={{ color: active ? 'var(--accent)' : 'var(--muted)' }}>
        <i className={`ph ph-${icon}`} />
      </span>
      <span>
        <strong style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>{title}</strong>
        <small style={{ color: 'var(--muted)' }}>{sub}</small>
      </span>
    </button>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="item" style={{ alignItems: 'baseline' }}>
      <i className="ph ph-dot" style={{ color: 'var(--line-strong)' }} />
      <strong style={{ width: 150, color: 'var(--muted)', fontWeight: 500, fontSize: '0.88rem' }}>{label}</strong>
      <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function VoicePane() {
  const [rec, setRec] = useState(false);
  const [secs, setSecs] = useState(0);
  const timer = useRef<number | null>(null);
  const toggle = () => {
    if (rec) {
      setRec(false);
      if (timer.current) window.clearInterval(timer.current);
    } else {
      setRec(true);
      timer.current = window.setInterval(() => setSecs((s) => s + 1), 1000);
    }
  };
  return (
    <div className="card card-pad voice-stage">
      <span className="eyebrow" style={{ display: 'inline-flex' }}>Voice-assisted reporting</span>
      <div className={`voice-orb ${rec ? 'recording' : ''}`}>
        <i className="ph ph-microphone" />
      </div>
      <h3>{rec ? `Listening… ${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}` : 'Tap to start speaking'}</h3>
      <p className="muted" style={{ maxWidth: '42ch' }}>
        Speak naturally in English or Hindi. Sarvam converts your voice to text for review before submission.
      </p>
      <button className={`btn ${rec ? 'btn-danger' : 'btn-primary'}`} onClick={toggle}>
        <i className={`ph ${rec ? 'ph-stop' : 'ph-microphone'}`} /> {rec ? 'Stop recording' : 'Start recording'}
      </button>
      <div className="transcript" style={{ width: '100%', maxWidth: 560, textAlign: 'left' }}>
        <span className="placeholder">Your transcribed complaint will appear here for review…</span>
      </div>
      <small className="muted">
        <i className="ph ph-lock-key" /> Processed securely on-device. You can edit before submitting.
      </small>
    </div>
  );
}
