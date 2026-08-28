import { useEffect, useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { PageHeader } from '../ui/PageHeader';
import { Reveal } from '../ui/Reveal';
import type { RouteKey } from '../../types';

function DemoScreenshotLightbox({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    const previousOverflow = document.body.style.overflow;
    document.body.classList.add('lightbox-open');
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('lightbox-open');
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="demo-image-lightbox" role="dialog" aria-modal="true" aria-labelledby="demo-image-title" onClick={onClose}>
      <div className="demo-image-dialog" onClick={(event) => event.stopPropagation()}>
        <div className="demo-image-head"><div><span className="eyebrow">Demo screenshot</span><h2 id="demo-image-title">Suspicious SBI message</h2></div><button type="button" className="demo-image-close" onClick={onClose} aria-label="Close image preview"><i className="ph ph-x" /></button></div>
        <img src="/demo-scam-screenshot.png" alt="Full-size example suspicious SBI message screenshot" />
      </div>
    </div>
  );
}

function isLikelyUrl(value: string) {
  return /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i.test(value.trim());
}

export function DetectPage({ go }: { go: (r: RouteKey) => void }) {
  if (!import.meta.env.VITE_CONVEX_URL) {
    return (
      <>
        <PageHeader
          eyebrow="Detect"
          title="Check before you click"
          description="The detector is temporarily unavailable because the production scan service is not configured."
        />
        <section className="section-tight">
          <div className="container" style={{ maxWidth: 760 }}>
            <div className="alert alert-warning" role="alert">
              <i className="ph ph-warning" />
              <span>Add <code>VITE_CONVEX_URL</code> to the Vercel project environment variables, then redeploy.</span>
            </div>
            <button className="btn btn-primary" style={{ marginTop: 'var(--sp-5)' }} onClick={() => go('report')}>
              Report a cyber crime <i className="ph ph-arrow-right" />
            </button>
          </div>
        </section>
      </>
    );
  }
  return <DetectPageWithConvex go={go} />;
}

function DetectPageWithConvex({ go }: { go: (r: RouteKey) => void }) {
  const [url, setUrl] = useState('amaz0n-verify-account.com');
  const [scan, setScan] = useState<{ verdict: string; score: number; risk: string; reasons: string[]; providers: Array<{ name: string; status: string }> } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoPreviewOpen, setDemoPreviewOpen] = useState(false);
  const runScan = useAction(api.detection.scan);

  const check = async (input: string, source: 'text' | 'url' | 'image', mimeType?: string) => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await Promise.race([
        runScan({ input, source, mimeType }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Scan timed out')), 25000)),
      ]);
      setScan(response);
    } catch {
      setError('The scan service is unavailable. Make sure `npx convex dev` is running, then try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkTextOrUrl = () => {
    const source = isLikelyUrl(url) ? 'url' : 'text';
    const input = source === 'url' && !/^https?:\/\//i.test(url) ? `https://${url.trim()}` : url;
    void check(input, source);
  };

  const checkDemoScreenshot = async () => {
    const response = await fetch('/demo-scam-screenshot.png');
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onload = () => void check(String(reader.result).split(',')[1] ?? '', 'image', 'image/demo-scam');
    reader.readAsDataURL(blob);
  };

  return (
    <>
      <PageHeader
        eyebrow="Detect"
        title="Check before you click"
        description="Paste a link, message or screenshot. We scan it with VirusTotal + Google Safe Browsing, and pull URLs out of images with a vision model."
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => go('report')}>
            It's a scam? Report it <span className="btn-ico"><i className="ph ph-arrow-right" /></span>
          </button>
        }
      />
      <section className="section-tight">
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="detect-wrap">
            <Reveal className="card card-pad checker">
              <span className="eyebrow" style={{ display: 'inline-flex' }}>URL &amp; message check</span>
              <h3 style={{ marginTop: 'var(--sp-3)' }}>Is this link safe?</h3>
              <div className="checker-input-row" style={{ marginTop: 'var(--sp-5)' }}>
                <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https:// or paste a message" aria-label="URL or message" />
                <button className="btn btn-primary" disabled={loading} onClick={checkTextOrUrl}>
                  {loading ? <><i className="ph ph-spinner-gap scan-spinner" /> Checking…</> : <><i className="ph ph-shield-check" /> Check</>}
                </button>
              </div>

              <div className="checker-or">or upload a screenshot</div>

              <label className="dropzone">
                <i className="ph ph-image-square" />
                <span>
                  <strong>Drop a screenshot</strong>
                  <br />
                  We extract links, numbers &amp; handles with OCR, then scan them
                </span>
              <input type="file" accept="image/*" hidden onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => void check(String(reader.result).split(',')[1] ?? '', 'image', file.type);
                reader.readAsDataURL(file);
              }} />
              </label>
              <button type="button" className="demo-screenshot" onClick={checkDemoScreenshot} disabled={loading}>
                <img src="/demo-scam-screenshot.png" alt="Preview example suspicious SBI message screenshot. Activate to view full size." onClick={(event) => { event.stopPropagation(); setDemoPreviewOpen(true); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); setDemoPreviewOpen(true); } }} role="button" tabIndex={0} />
                <span><strong>Try the demo screenshot</strong><small>Analyze an example SBI phishing message</small></span>
                <i className="ph ph-arrow-right" />
              </button>

              <div className="scan-note">
                <i className="ph ph-lightning" /> Powered by VirusTotal, Google Safe Browsing &amp; a vision-LLM.
              </div>
              {loading && <div className="scan-running" role="status" aria-live="polite"><i className="ph ph-circle-notch scan-spinner" /> Analysing your input securely…</div>}
            </Reveal>

            <Reveal delay={80} className="card card-pad result">
              {error ? (
                <div className="alert alert-danger" role="alert"><i className="ph ph-warning" /> {error}</div>
              ) : loading ? (
                <div className="result-loading" role="status" aria-live="polite">
                  <i className="ph ph-circle-notch scan-spinner" />
                  <b>Checking for known threats…</b>
                  <span className="muted">This can take a few seconds.</span>
                </div>
              ) : !scan ? (
                <>
                  <span className="eyebrow" style={{ display: 'inline-flex' }}>Result</span>
                  <p className="muted" style={{ marginTop: 'var(--sp-4)' }}>
                    Run a check to see a risk score, the signals we found, and where the link has been seen before.
                  </p>
                </>
              ) : (
                <>
                  <div className="risk-head">
                    <div>
                      <span className="eyebrow" style={{ display: 'inline-flex' }}>Risk score</span>
                      <div className="risk-score" style={{ color: scan.risk === 'low' ? 'var(--success)' : scan.risk === 'medium' ? 'var(--warning)' : 'var(--danger)' }}>{scan.score}</div>
                    </div>
                    <span className={`badge badge-${scan.risk === 'low' ? 'success' : scan.risk === 'medium' ? 'warning' : 'danger'}`}>
                      <i className={`ph ${scan.risk === 'low' ? 'ph-check-circle' : 'ph-warning-octagon'}`} /> {scan.risk} risk
                    </span>
                  </div>
                  <div className="risk-bar" aria-hidden="true">
                    <div className="risk-fill" style={{ width: `${scan.score}%` }} />
                  </div>

                  <div className="finding-list">
                    {(scan.reasons.length ? scan.reasons.map((reason) => ({ ok: false, title: 'Risk signal detected', text: reason })) : [{ ok: true, title: 'No known risk signal found', text: 'This does not prove the content is safe. Stay cautious before sharing information or paying.' }]).map((f) => (
                      <div key={f.title} className={`finding ${f.ok ? 'ok' : ''}`}>
                        <i className={`ph ${f.ok ? 'ph-check-circle' : 'ph-warning'}`} />
                        <div>
                          <b>{f.title}</b>
                          <span>{f.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="btn btn-danger btn-block" style={{ marginTop: 'var(--sp-5)' }} onClick={() => go('report')}>
                    Report this as fraud <span className="btn-ico"><i className="ph ph-arrow-right" /></span>
                  </button>
                </>
              )}
            </Reveal>
          </div>
        </div>
      </section>
      {demoPreviewOpen && <DemoScreenshotLightbox onClose={() => setDemoPreviewOpen(false)} />}
    </>
  );
}
