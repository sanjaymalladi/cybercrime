export function Footer() {
  return (
    <footer className="footer theme-navy">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginInlineEnd: 0, color: '#fff' }}>
              <span className="brand-mark">
                <i className="ph ph-bank" aria-hidden="true" />
              </span>
              <span>
                Cyber Crime India
                <small>National Cyber Crime Reporting</small>
              </span>
            </div>
            <p className="small" style={{ color: '#97A2B5', marginTop: 'var(--sp-4)', maxWidth: '34ch' }}>
              A citizen-first portal to report, detect and track cyber crime — built for the Build What Moves India hackathon.
            </p>
            <p className="footer-note" style={{ marginTop: 'var(--sp-5)' }}>
              <i className="ph ph-phone-call" aria-hidden="true" /> For financial fraud, call <strong>1930</strong>
            </p>
          </div>

          <div>
            <h4>Services</h4>
            <a href="#report">Report a crime</a>
            <a href="#detect">Detect a threat</a>
            <a href="#track">Track a complaint</a>
            <a href="#learn">Cyber learning</a>
          </div>

          <div>
            <h4>More</h4>
            <a href="#awareness">Awareness &amp; trends</a>
            <a href="#resources">Resources</a>
            <a href="#contact">Contact support</a>
            <a href="/research/">Research notes</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Cyber Crime India · Demo build. Not affiliated with the Government of India.</span>
          <span>Built with React · Vite · Codex</span>
        </div>
      </div>
    </footer>
  );
}
