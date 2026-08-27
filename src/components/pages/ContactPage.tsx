import { PageHeader } from '../ui/PageHeader';
import { Reveal } from '../ui/Reveal';

export function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We're here to help"
        description="For urgent financial fraud, call the national helpline first. For everything else, reach the right cell below."
      />
      <section className="section-tight">
        <div className="container" style={{ maxWidth: 1040 }}>
          <Reveal className="helpline-card" style={{ marginBottom: 'var(--sp-7)' }}>
            <div>
              <span className="eyebrow" style={{ display: 'inline-flex', color: '#F0B48A' }}>24×7 National Helpline</span>
              <div className="h-num" style={{ marginTop: 'var(--sp-3)' }}>
                <a href="tel:1930">1930</a>
              </div>
              <p style={{ color: '#B9C2D2', marginTop: 'var(--sp-2)' }}>
                For financial cyber fraud — speak to an officer any time.
              </p>
            </div>
            <a className="btn btn-danger btn-lg" href="tel:1930">
              <i className="ph ph-phone-call" /> Call now
            </a>
          </Reveal>

          <div className="contact-followup">
            <Reveal className="card card-pad contact-form">
              <h3 style={{ marginBottom: 'var(--sp-4)' }}>Send a message</h3>
              <div className="field-grid">
                <div className="field">
                  <span className="label">Your name</span>
                  <input className="input" placeholder="Full name" />
                </div>
                <div className="field">
                  <span className="label">Email or mobile</span>
                  <input className="input" placeholder="so we can reply" />
                </div>
              </div>
              <div className="field full" style={{ marginTop: 'var(--sp-4)' }}>
                <span className="label">How can we help?</span>
                <textarea className="textarea" placeholder="Describe your concern…" />
              </div>
              <button className="btn btn-primary" style={{ marginTop: 'var(--sp-5)' }}>
                Send message <span className="btn-ico"><i className="ph ph-arrow-right" /></span>
              </button>
            </Reveal>

          </div>
        </div>
      </section>
    </>
  );
}
