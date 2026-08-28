import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';

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
            <ModeChoice active={mode === 'voice'} icon="microphone" title="Speak your complaint" sub="Any supported Indian language" onClick={() => setMode('voice')} />
          </div>

          {mode === 'voice' ? (
            import.meta.env.VITE_CONVEX_URL ? (
              <VoicePane value={form.description} onChange={(value) => update('description', value)} onSubmit={() => setSubmitted(true)} />
            ) : (
              <VoiceUnavailablePane value={form.description} onChange={(value) => update('description', value)} onSubmit={() => setSubmitted(true)} />
            )
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
                    <ReviewRow label="Description" value={form.description || '—'} />
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

function VoiceUnavailablePane({ value, onChange, onSubmit }: { value: string; onChange: (value: string) => void; onSubmit: () => void }) {
  return (
    <div className="card card-pad voice-stage">
      <span className="eyebrow" style={{ display: 'inline-flex' }}>Voice-assisted reporting</span>
      <div className="alert alert-warning" role="alert" style={{ width: '100%', maxWidth: 560 }}>
        <i className="ph ph-warning" />
        <span>Voice transcription is not configured in production. You can type your complaint below.</span>
      </div>
      <textarea className="textarea" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Type your complaint here…" aria-label="Complaint" />
      <button type="button" className="btn btn-primary voice-submit" onClick={onSubmit} disabled={!value.trim()}>
        Submit complaint <span className="btn-ico"><i className="ph ph-arrow-right" /></span>
      </button>
    </div>
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

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

async function toWav16k(blob: Blob) {
  const source = new AudioContext();
  const decoded = await source.decodeAudioData(await blob.arrayBuffer());
  await source.close();
  const frames = Math.ceil(decoded.duration * 16000);
  const offline = new OfflineAudioContext(1, frames, 16000);
  const buffer = offline.createBuffer(1, decoded.length, decoded.sampleRate);
  buffer.copyToChannel(decoded.getChannelData(0), 0);
  const audio = offline.createBufferSource();
  audio.buffer = buffer;
  audio.connect(offline.destination);
  audio.start();
  const rendered = await offline.startRendering();
  const samples = rendered.getChannelData(0);
  const wav = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(wav);
  const write = (offset: number, text: string) => [...text].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
  write(0, 'RIFF'); view.setUint32(4, 36 + samples.length * 2, true); write(8, 'WAVE'); write(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, 16000, true);
  view.setUint32(28, 32000, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); write(36, 'data'); view.setUint32(40, samples.length * 2, true);
  samples.forEach((sample, index) => view.setInt16(44 + index * 2, Math.max(-1, Math.min(1, sample)) * 0x7fff, true));
  return new Blob([wav], { type: 'audio/wav' });
}

function VoicePane({ value, onChange, onSubmit }: { value: string; onChange: (value: string) => void; onSubmit: () => void }) {
  const [rec, setRec] = useState(false);
  const [secs, setSecs] = useState(0);
  const [lang, setLang] = useState('unknown');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [error, setError] = useState('');
  const transcribe = useAction(api.voice.transcribe);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const recognition = useRef<SpeechRecognitionLike | null>(null);
  const startedAt = useRef(0);
  const timer = useRef<number | null>(null);
  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { setError('Audio recording is not supported here. Please use a modern browser or type below.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const instance = new MediaRecorder(stream);
      chunks.current = [];
      instance.ondataavailable = (event) => { if (event.data.size) chunks.current.push(event.data); };
      instance.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setError('Transcribing with Sarvam…');
        try {
          const recording = new Blob(chunks.current, { type: instance.mimeType || 'audio/webm' });
          const blob = await toWav16k(recording);
          const bytes = new Uint8Array(await blob.arrayBuffer());
          let binary = ''; bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
          const response = await transcribe({ audioBase64: btoa(binary), mimeType: blob.type, languageCode: lang });
          onChange(response.transcript); setError('');
        } catch (transcriptionError) { setError(transcriptionError instanceof Error ? transcriptionError.message : 'Transcription failed. Please try again or type below.'); }
      };
      recorder.current = instance; instance.start();
      setError(''); setSecs(0); setRec(true); startedAt.current = Date.now();
      timer.current = window.setInterval(() => setSecs(Math.floor((Date.now() - startedAt.current) / 1000)), 500);
      return;
    } catch { setError('Microphone permission was denied. Please allow microphone access or type below.'); return; }
  };
  const stop = () => { recorder.current?.stop(); recognition.current?.stop(); setRec(false); if (timer.current) window.clearInterval(timer.current); };
  useEffect(() => () => { recognition.current?.stop(); if (timer.current) window.clearInterval(timer.current); }, []);
  return (
    <div className="card card-pad voice-stage">
      <span className="eyebrow" style={{ display: 'inline-flex' }}>Voice-assisted reporting</span>
      <div className="voice-language-wrap">
        <button type="button" className="voice-language-trigger" onClick={() => setLanguageOpen(true)} disabled={rec}>
          <i className="ph ph-globe" /> <span>{languageName(lang)}</span> <i className="ph ph-caret-down" />
        </button>
        {languageOpen && <LanguageModal value={lang} onChange={(next) => { setLang(next); setLanguageOpen(false); }} onClose={() => setLanguageOpen(false)} />}
      </div>
      {/* Language options are kept in the modal below. */}
      {false && <label className="voice-language">
        <span className="sr-only">Voice language</span>
        <select className="input" value={lang} onChange={(event) => setLang(event.target.value)} disabled={rec} aria-label="Voice language">
        <option value="unknown">Auto-detect any language</option>
        {[['en-IN','English'],['hi-IN','हिन्दी'],['bn-IN','বাংলা'],['ta-IN','தமிழ்'],['te-IN','తెలుగు'],['kn-IN','ಕನ್ನಡ'],['ml-IN','മലയാളം'],['mr-IN','मराठी'],['gu-IN','ગુજરાતી'],['pa-IN','ਪੰਜਾਬੀ'],['od-IN','ଓଡ଼ିଆ'],['as-IN','অসমীয়া'],['ur-IN','اردو'],['ne-IN','नेपाली'],['kok-IN','कोंकणी'],['ks-IN','कश्मीरी'],['sd-IN','सिन্ধी'],['sa-IN','संस्कृत'],['sat-IN','संथाली'],['mni-IN','মণিপুরী'],['brx-IN','बोड़ो'],['mai-IN','मैथिली'],['doi-IN','डोगरी']].map(([code, label]) => <option key={code} value={code}>{label}</option>)}
        </select>
        <i className="ph ph-caret-down" aria-hidden="true" />
      </label>}
      {rec && <h3>Listening… {String(Math.floor(secs / 60)).padStart(2, '0')}:{String(secs % 60).padStart(2, '0')}</h3>}
      <button type="button" className={`btn ${rec ? 'btn-danger' : 'btn-primary'}`} onClick={rec ? stop : start}>
        <i className={`ph ${rec ? 'ph-stop' : 'ph-microphone'}`} /> {rec ? 'Stop recording' : 'Start recording'}
      </button>
      <div className="transcript" style={{ width: '100%', maxWidth: 560, textAlign: 'left' }}>
        <textarea className="textarea" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Your transcribed complaint will appear here for review…" aria-label="Voice complaint transcript" />
      </div>
      <button type="button" className="btn btn-primary voice-submit" onClick={onSubmit} disabled={!value.trim() || rec}>
        Submit complaint <span className="btn-ico"><i className="ph ph-arrow-right" /></span>
      </button>
      {error && <p className="error-text" role="alert">{error}</p>}
      <small className="muted">
        <i className="ph ph-lock-key" /> Processed securely by Sarvam AI. You can edit before submitting.
      </small>
    </div>
  );
}

const voiceLanguages = [['unknown', 'Auto-detect any language'], ['en-IN', 'English'], ['hi-IN', 'हिन्दी'], ['bn-IN', 'বাংলা'], ['ta-IN', 'தமிழ்'], ['te-IN', 'తెలుగు'], ['kn-IN', 'ಕನ್ನಡ'], ['ml-IN', 'മലയാളം'], ['mr-IN', 'मराठी'], ['gu-IN', 'ગુજરાતી'], ['pa-IN', 'ਪੰਜਾਬੀ'], ['od-IN', 'ଓଡ଼ିଆ'], ['as-IN', 'অসমীয়া'], ['ur-IN', 'اردو'], ['ne-IN', 'नेपाली'], ['kok-IN', 'कोंकणी'], ['ks-IN', 'कश्मೀरी'], ['sd-IN', 'सиндھی'], ['sa-IN', 'संस्कृत'], ['sat-IN', 'संथाली'], ['mni-IN', 'মণিপুরী'], ['brx-IN', 'बोड़ो'], ['mai-IN', 'मैथिली'], ['doi-IN', 'डोगरी']];

export function languageName(code: string) { return voiceLanguages.find(([value]) => value === code)?.[1] ?? 'Auto-detect any language'; }

export function LanguageModal({ value, onChange, onClose, showAutoDetect = true }: { value: string; onChange: (value: string) => void; onClose: () => void; showAutoDetect?: boolean }) {
  const languages = showAutoDetect ? voiceLanguages : voiceLanguages.filter(([code]) => code !== 'unknown');
  const columns = [languages.slice(0, 8), languages.slice(8, 16), languages.slice(16)];
  return createPortal(<div className="language-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="language-modal" role="dialog" aria-modal="true" aria-labelledby="language-title">
      <header><div><i className="ph ph-globe" /><div><h3 id="language-title">Select language</h3><p>Choose your preferred complaint language</p></div></div><button type="button" className="language-close" onClick={onClose} aria-label="Close language selector"><i className="ph ph-x" /></button></header>
      <div className="language-columns">{columns.map((column, index) => <div className="language-column" key={index}>{column.map(([code, label]) => <button type="button" key={code} className={`language-row ${value === code ? 'selected' : ''}`} onClick={() => onChange(code)}><span>{label}</span>{value === code && <i className="ph ph-check" />}</button>)}</div>)}</div>
    </section>
  </div>, document.body);
}
