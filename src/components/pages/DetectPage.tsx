import { useState } from 'react';
import { PageHeader } from '../ui/PageHeader';
import { Reveal } from '../ui/Reveal';
import type { RouteKey } from '../../types';

const sampleFindings = [
  { ok: false, title: 'Domain registered 3 days ago', text: 'Newly minted domains are a common phishing signal.' },
  { ok: false, title: 'Hosted on a known-abuse ASN', text: 'IP linked to previous scam reports in I4C repository.' },
  { ok: false, title: 'Brand impersonation detected', text: 'Uses Amazon branding without an official domain.' },
  { ok: true, title: 'No malware payload on static scan', text: 'VirusTotal: 0/94 engines flagged the page content.' },
];

export function DetectPage({ go }: { go: (r: RouteKey) => void }) {
  const [url, setUrl] = useState('amaz0n-verify-account.com');
  const [scanned, setScanned] = useState(false);

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
                <button className="btn btn-primary" onClick={() => setScanned(true)}>
                  <i className="ph ph-shield-check" /> Check
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
                <input type="file" accept="image/*" hidden />
              </label>

              <div className="scan-note">
                <i className="ph ph-lightning" /> Powered by VirusTotal, Google Safe Browsing &amp; a vision-LLM.
              </div>
            </Reveal>

            <Reveal delay={80} className="card card-pad result">
              {!scanned ? (
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
                      <div className="risk-score" style={{ color: 'var(--danger)' }}>87</div>
                    </div>
                    <span className="badge badge-danger">
                      <i className="ph ph-warning-octagon" /> High risk
                    </span>
                  </div>
                  <div className="risk-bar" aria-hidden="true">
                    <div className="risk-fill" style={{ width: '87%' }} />
                  </div>

                  <div className="finding-list">
                    {sampleFindings.map((f) => (
                      <div key={f.title} className={`finding ${f.ok ? 'ok' : ''}`}>
                        <i className={`ph ${f.ok ? 'ph-check-circle' : 'ph-warning'}`} />
                        <div>
                          <b>{f.title}</b>
                          <span>{f.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="source-chips">
                    <span className="chip">VirusTotal · 2/94 flag</span>
                    <span className="chip">Safe Browsing · no record</span>
                    <span className="chip">I4C suspect repo · 14 hits</span>
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
    </>
  );
}
