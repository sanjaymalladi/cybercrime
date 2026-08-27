import { useRef, useState } from 'react';
import { PageHeader } from '../ui/PageHeader';
import { Reveal } from '../ui/Reveal';
import type { RouteKey } from '../../types';

export function VoicePage({ go }: { go: (r: RouteKey) => void }) {
  const [rec, setRec] = useState(false);
  const [secs, setSecs] = useState(0);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
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
    <>
      <PageHeader
        eyebrow="Voice"
        title="Lodge a complaint by voice"
        description="The same guided flow as text — just spoken. Powered by Sarvam ASR/TTS in English or Hindi."
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => go('report')}>
            <i className="ph ph-text-indent" /> Switch to typing
          </button>
        }
      />
      <section className="section-tight">
        <div className="container" style={{ maxWidth: 720 }}>
          <Reveal className="card card-pad voice-stage">
            <div className="lang-toggle" role="tablist" aria-label="Language">
              <button className={`btn btn-sm ${lang === 'en' ? 'btn-dark' : 'btn-ghost'}`} onClick={() => setLang('en')}>English</button>
              <button className={`btn btn-sm ${lang === 'hi' ? 'btn-dark' : 'btn-ghost'}`} onClick={() => setLang('hi')}>हिन्दी</button>
            </div>

            <div className={`voice-orb ${rec ? 'recording' : ''}`}>
              <i className="ph ph-microphone" />
            </div>
            <h3>{rec ? `Listening… ${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}` : 'Tap to start speaking'}</h3>
            <p className="muted" style={{ maxWidth: '42ch' }}>
              {lang === 'hi' ? 'अपनी शिकायत हिंदी में बोलें। हम इसे समीक्षा के लिए टेक्स्ट में बदल देंगे।' : 'Speak your complaint in English. We convert it to text for review before submission.'}
            </p>
            <button className={`btn ${rec ? 'btn-danger' : 'btn-primary'} btn-lg`} onClick={toggle}>
              <i className={`ph ${rec ? 'ph-stop' : 'ph-microphone'}`} /> {rec ? 'Stop' : 'Start recording'}
            </button>

            <div className="transcript" style={{ width: '100%' }}>
              <span className="placeholder">Your transcribed complaint will appear here. You can edit it before submitting.</span>
            </div>

            <small className="muted"><i className="ph ph-lock-key" /> Processed securely · you stay in control of the text.</small>
          </Reveal>
        </div>
      </section>
    </>
  );
}
