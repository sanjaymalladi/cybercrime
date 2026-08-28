import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '../ui/PageHeader';
import { Reveal } from '../ui/Reveal';
import type { RouteKey } from '../../types';
import { igProfiles, type IgMedia, type LiveProfile } from '../../data/igProfiles';
import { govImages, govImageUrl } from '../../data/govAwareness';

const trending = [
  { rank: 1, tag: 'UPI', title: 'Fake “payment failed” UPI collect requests', time: '2h ago', delta: '+38%', dir: 'up' },
  { rank: 2, tag: 'KYC', title: '“Your KYC expired” SMS with malicious link', time: '5h ago', delta: '+21%', dir: 'up' },
  { rank: 3, tag: 'Job', title: 'Work-from-home task scams on Telegram', time: '9h ago', delta: '+14%', dir: 'up' },
  { rank: 4, tag: 'Bank', title: 'Impersonation of SBI / HDFC helplines', time: '1d ago', delta: '-6%', dir: 'down' },
  { rank: 5, tag: 'OTP', title: '“RBI refund” OTP harvesting calls', time: '1d ago', delta: '+9%', dir: 'up' },
];

type ScamStep = { label: string; title: string; text: string; icon: string };
type ScamCase = { title: string; subtitle: string; brand: string; amount: string; steps: ScamStep[] };

const scamCases = {
  1: {
    title: 'Fake UPI Collect request', subtitle: 'Follow the trail. The red flag is easy to miss.', brand: 'UPI', amount: '₹2,499', steps: [
  {
    label: 'The bait',
    title: 'A payment “failed” message arrives',
    text: 'The scammer says your payment failed and promises a refund. They may call pretending to be support or a seller.',
    icon: 'ph-chat-circle-dots',
  },
  {
    label: 'The request',
    title: 'A UPI Collect request appears',
    text: 'Instead of receiving money, you get a request to pay. It can be dressed up as a refund, reversal, or verification.',
    icon: 'ph-bell-ringing',
  },
  {
    label: 'The trick',
    title: '“Approve” actually means “pay”',
    text: 'A UPI Collect request takes money from your account when you approve it. You never need to approve a request to receive a refund.',
    icon: 'ph-warning-octagon',
  },
  {
    label: 'The pressure',
    title: 'Urgency keeps you from checking',
    text: 'They may say the request expires soon or ask for your UPI PIN. Pause. No genuine support agent needs your PIN or OTP.',
    icon: 'ph-timer',
  },
  {
    label: 'Your move',
    title: 'Decline, block, and report',
    text: 'Decline the request. Do not share your PIN or OTP. Block the number and report financial fraud immediately on 1930.',
    icon: 'ph-shield-check',
  },
  ] },
  2: {
    title: 'KYC expiry link scam', subtitle: 'A fake deadline is designed to make you tap first.', brand: 'KYC', amount: 'VERIFY', steps: [
      { label: 'The bait', title: 'An urgent KYC SMS arrives', text: 'The message says your account or SIM will be blocked unless you update KYC immediately.', icon: 'ph-chat-circle-dots' },
      { label: 'The link', title: 'The link leads to a fake page', text: 'The website copies a bank or wallet brand, but the address is unfamiliar or slightly misspelled.', icon: 'ph-link' },
      { label: 'The ask', title: 'It asks for private details', text: 'The page asks for your login, card number, OTP, or other information that a genuine KYC notice will not collect this way.', icon: 'ph-identification-card' },
      { label: 'The pressure', title: 'The countdown is the trick', text: 'Do not let a threat of immediate suspension rush you. Close the page and verify through your bank’s official app or website.', icon: 'ph-timer' },
      { label: 'Your move', title: 'Delete, block, and report', text: 'Do not open the link or share details. Report the SMS as spam and notify your bank using its official number.', icon: 'ph-shield-check' },
    ],
  },
  3: {
    title: 'Telegram task-job scam', subtitle: 'Easy money becomes a demand for your money.', brand: 'JOB', amount: '₹5,000', steps: [
      { label: 'The offer', title: 'A stranger promises easy work', text: 'A message offers quick earnings for liking videos, rating products, or completing simple tasks.', icon: 'ph-briefcase' },
      { label: 'The hook', title: 'Small rewards build trust', text: 'The group may pay a tiny amount first and show screenshots of other “workers” earning money.', icon: 'ph-coins' },
      { label: 'The fee', title: 'You must pay to unlock more', text: 'The scam changes when you are asked for a deposit, recharge, membership fee, or tax before withdrawing your earnings.', icon: 'ph-warning-octagon' },
      { label: 'The trap', title: 'More fees keep the cycle going', text: 'A fake support agent promises the next payment will release your balance, but every payment creates another excuse.', icon: 'ph-arrow-u-up-left' },
      { label: 'Your move', title: 'Stop paying and preserve evidence', text: 'Leave the group, block the accounts, save chats and payment receipts, then report the fraud. Never pay to get paid.', icon: 'ph-shield-check' },
    ],
  },
  4: {
    title: 'Fake bank helpline scam', subtitle: 'A convincing voice can still be the wrong number.', brand: 'BANK', amount: 'CALL', steps: [
      { label: 'The contact', title: 'A “bank helpline” calls back', text: 'The caller claims to be from SBI, HDFC, or another bank after you search for help online or post a complaint.', icon: 'ph-phone-call' },
      { label: 'The setup', title: 'They sound like real support', text: 'A professional tone, a fake ticket number, and details from your public profile are used to build confidence.', icon: 'ph-identification-card' },
      { label: 'The access', title: 'They ask you to install an app', text: 'Remote-access apps can let a stranger see your screen or control your device. Never install one at a caller’s request.', icon: 'ph-download-simple' },
      { label: 'The ask', title: 'They request OTP or PIN', text: 'A real bank employee will never ask for your OTP, UPI PIN, password, or full card details over a call.', icon: 'ph-key' },
      { label: 'Your move', title: 'Hang up and call back safely', text: 'End the call and use the number on your bank card or official website. If money moved, call 1930 immediately.', icon: 'ph-shield-check' },
    ],
  },
  5: {
    title: 'Fake RBI refund call', subtitle: 'A refund promise is used to harvest one-time passwords.', brand: 'RBI', amount: 'OTP', steps: [
      { label: 'The promise', title: 'A caller offers an RBI refund', text: 'The caller says a refund, subsidy, or unclaimed amount is waiting for you and needs “verification”.', icon: 'ph-phone-call' },
      { label: 'The setup', title: 'They send a payment link', text: 'You may receive a link or a small test transaction designed to make the story feel official.', icon: 'ph-link' },
      { label: 'The OTP', title: 'An OTP arrives on your phone', text: 'The OTP is for a transaction started by the scammer. It is not a code for receiving money.', icon: 'ph-key' },
      { label: 'The harvest', title: 'They ask you to read it aloud', text: 'Sharing the code can approve a payment or give access to your account. No legitimate refund process needs your OTP.', icon: 'ph-warning-octagon' },
      { label: 'Your move', title: 'Refuse, hang up, and report', text: 'Do not share the OTP. Contact your bank through its official channel and call 1930 quickly if you lose money.', icon: 'ph-shield-check' },
    ],
  },
} satisfies Record<number, ScamCase>;

function ScamLearningBoard({ scamCase, onClose }: { scamCase: ScamCase; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const current = scamCase.steps[step];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') setStep((value) => Math.min(value + 1, scamCase.steps.length - 1));
      if (event.key === 'ArrowLeft') setStep((value) => Math.max(value - 1, 0));
    };
    const previousOverflow = document.body.style.overflow;
    document.body.classList.add('lightbox-open');
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove('lightbox-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, scamCase.steps.length]);

  return (
    <div className="scam-board-backdrop" role="dialog" aria-modal="true" aria-labelledby="scam-board-title" onClick={onClose}>
      <div className="scam-board" onClick={(event) => event.stopPropagation()}>
        <header className="scam-board-head">
          <div>
            <span className="eyebrow"><i className="ph ph-graduation-cap" /> Scam breakdown</span>
            <h2 id="scam-board-title">{scamCase.title}</h2>
            <p>{scamCase.subtitle}</p>
          </div>
          <button className="scam-board-close" type="button" onClick={onClose} aria-label="Close scam breakdown"><i className="ph ph-x" /></button>
        </header>

        <div className="scam-board-progress" aria-label={`Step ${step + 1} of ${scamCase.steps.length}`}>
          {scamCase.steps.map((item, index) => (
            <button key={item.label} type="button" className={`scam-step-dot${index === step ? ' is-active' : ''}${index < step ? ' is-done' : ''}`} onClick={() => setStep(index)} aria-label={`Go to step ${index + 1}: ${item.label}`}>
              <span>{index + 1}</span>
            </button>
          ))}
        </div>

        <div className="scam-board-content" key={step}>
          <div className="scam-board-visual" aria-hidden="true">
            <div className="upi-phone">
              <div className="upi-phone-top"><span>9:41</span><i className="ph ph-wifi-high" /></div>
              <div className="upi-brand"><span className="upi-mark">{scamCase.brand.slice(0, 1)}</span><b>{scamCase.brand}</b></div>
              <div className={`upi-request ${step >= 2 ? 'is-danger' : ''}`}>
                <span className="upi-request-icon"><i className={`ph ${current.icon}`} /></span>
                <small>{step === 0 ? 'Message' : step === 1 ? 'New request' : step >= 4 ? 'Action needed' : 'Caller says'}</small>
                <strong>{step === 0 ? 'Payment failed' : step === 1 ? 'Refund request' : step >= 4 ? 'Decline request' : 'Approve to continue'}</strong>
                <span className="upi-amount">{scamCase.amount}</span>
              </div>
              <div className="upi-pin-line"><i className="ph ph-lock-key" /> Your UPI PIN stays private</div>
            </div>
          </div>
          <div className="scam-board-copy">
            <span className="scam-board-kicker">Step {step + 1} <span>/ {scamCase.steps.length}</span></span>
            <h3>{current.title}</h3>
            <p>{current.text}</p>
            <div className="scam-board-tip"><i className="ph ph-lightbulb" /><span><b>Remember</b> Receiving money never requires your UPI PIN.</span></div>
          </div>
        </div>

        <footer className="scam-board-foot">
          <button type="button" className="btn btn-ghost" onClick={() => setStep((value) => Math.max(value - 1, 0))} disabled={step === 0}><i className="ph ph-arrow-left" /> Back</button>
          <span className="scam-board-hint">Use ← → to navigate</span>
          {step === scamCase.steps.length - 1 ? (
            <button type="button" className="btn btn-primary" onClick={onClose}>Got it <i className="ph ph-check" /></button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => setStep((value) => Math.min(value + 1, scamCase.steps.length - 1))}>Next <i className="ph ph-arrow-right" /></button>
          )}
        </footer>
      </div>
    </div>
  );
}

const profileTones = ['var(--navy-2)', '#0f3b34'];
const IG_BASE = 'https://www.instagram.com';

// Route Instagram media through our same-origin proxy so the browser never
// hotlinks fbcdn directly (which Instagram blocks). Official I4C images are
// safe to load from their source host and must bypass the local-only proxy on Vercel.
function proxy(u?: string) {
  if (!u) return '';
  if (u.startsWith('https://cybercrime.gov.in/')) return u;
  return `/api/ig-media?u=${encodeURIComponent(u)}`;
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (min-width: 761px)');
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    window.addEventListener('resize', update);
    return () => {
      mq.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return desktop;
}

// Fallback (when the live proxy is unavailable): embed without popups.
function igSrc(kind: 'post' | 'reel', code: string) {
  return kind === 'reel'
    ? `${IG_BASE}/reel/${code}/embed/?cr=1`
    : `${IG_BASE}/p/${code}/embed/`;
}

function IgEmbed({ kind, code, title }: { kind: 'post' | 'reel'; code: string; title: string }) {
  return (
    <iframe
      className="reel-embed"
      src={igSrc(kind, code)}
      title={title}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      sandbox="allow-scripts allow-same-origin"
      allow="autoplay; encrypted-media; picture-in-picture"
    />
  );
}

function MediaUnavailable({ kind }: { kind: 'post' | 'reel' }) {
  return <div className="media-unavailable"><i className={`ph ${kind === 'reel' ? 'ph-play-circle' : 'ph-image-square'}`} /><span>{kind === 'reel' ? 'Video preview unavailable' : 'Image preview unavailable'}</span></div>;
}

function Avatar({ name, src, tone }: { name: string; src: string; tone: string }) {
  const [err, setErr] = useState(false);
  const ini = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  if (err || !src) return <span className="reel-avatar" style={{ background: tone }}>{ini}</span>;
  return <img className="reel-avatar-img" src={proxy(src)} alt={name} onError={() => setErr(true)} />;
}

// Autoplaying reel for the mobile vertical feed: plays when ≥60% visible,
// pauses when scrolled away, and scrolls to the next one when it ends.
function ReelVideo({ media, onEnded }: { media: IgMedia; onEnded?: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.6) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: [0, 0.6, 1] }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className="reel-media reel-video"
      src={proxy(media.video)}
      poster={proxy(media.thumb)}
      muted
      playsInline
      preload="metadata"
      onEnded={onEnded}
    />
  );
}

type Lightbox = { name: string; handle?: string; kind: 'post' | 'reel'; list: IgMedia[]; idx: number; meta?: { label: string; url: string } };

function IgLightbox({ data, onClose, onNav }: { data: Lightbox; onClose: () => void; onNav: (dir: -1 | 1) => void }) {
  const item = data.list[data.idx];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNav(1);
      else if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.classList.add('lightbox-open');
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('lightbox-open');
      document.body.style.overflow = prev;
    };
  }, [onClose, onNav]);

  const live = !!item.video || !!item.image;
  return (
    <div className="ig-lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="ig-lightbox__dialog" onClick={(e) => e.stopPropagation()}>
        <button className="ig-lightbox__close" onClick={onClose} aria-label="Close">
          <i className="ph ph-x" />
        </button>
        {data.list.length > 1 && (
          <>
            <button className="ig-lightbox__nav ig-lightbox__nav--prev" onClick={() => onNav(-1)} aria-label="Previous">
              <i className="ph ph-caret-left" />
            </button>
            <button className="ig-lightbox__nav ig-lightbox__nav--next" onClick={() => onNav(1)} aria-label="Next">
              <i className="ph ph-caret-right" />
            </button>
          </>
        )}

        <div className={`ig-lightbox__stage ig-lightbox__stage--${data.kind}${data.meta ? ' ig-lightbox__stage--official' : ''}`}>
          {live ? (
            item.video ? (
              <video className="reel-media reel-video" src={proxy(item.video)} poster={proxy(item.thumb)} controls autoPlay muted playsInline onEnded={() => onNav(1)} />
            ) : (
              <img className="reel-media reel-img" src={proxy(item.image)} alt={item.title} />
            )
          ) : <MediaUnavailable kind={data.kind} />}
        </div>

        <div className="ig-lightbox__meta">
          <b>{data.name}</b>
          {data.meta ? (
            <span className="reel-handle">
              <a href={data.meta.url} target="_blank" rel="noreferrer">
                {data.meta.label}
              </a>
            </span>
          ) : (
            <span className="reel-handle">
              {data.handle} ·{' '}
              <a href={`${IG_BASE}/${data.handle?.replace('@', '')}`} target="_blank" rel="noreferrer">
                View on Instagram
              </a>
            </span>
          )}
          <span className="ig-lightbox__count">
            {data.idx + 1} / {data.list.length}
          </span>
        </div>
      </div>
    </div>
  );
}

function MediaCard({
  kind,
  media,
  desktop,
  onOpen,
  onEnded,
}: {
  kind: 'post' | 'reel';
  media: IgMedia;
  desktop: boolean;
  onOpen: () => void;
  onEnded?: () => void;
}) {
  const live = !!media.video || !!media.image;
  const inner = live
    ? kind === 'reel'
      ? desktop
        ? <video className="reel-media reel-video" src={proxy(media.video)} poster={proxy(media.thumb)} muted playsInline preload="metadata" />
        : <ReelVideo media={media} onEnded={onEnded} />
      : <img className="reel-media reel-img" src={proxy(media.image)} alt={media.title} loading="lazy" />
    : <MediaUnavailable kind={kind} />;

  const clickable = true;

  return (
    <figure className={`reel-card-embed reel-card-embed--${kind}`}>
      {clickable ? (
        <button type="button" className={`reel-frame reel-frame--${kind}`} onClick={onOpen} aria-label={`Open ${media.title}`}>
          {inner}
          {live && kind === 'reel' && (
            <span className="reel-play">
              <i className="ph ph-play" />
            </span>
          )}
        </button>
      ) : (
        <div className={`reel-frame reel-frame--${kind}`}>{inner}</div>
      )}
      <Caption text={media.title} />
    </figure>
  );
}

function Caption({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = text.length > 110 || text.includes('\n');
  return (
    <figcaption className={`reel-cap${expanded ? ' reel-cap--expanded' : ''}`}>
      <span>{text}</span>
      {hasMore && (
        <button type="button" className="reel-read-more" onClick={() => setExpanded((value) => !value)}>
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </figcaption>
  );
}

function scrollNext(profileIndex: number, idx: number) {
  const feed = document.getElementById(`reelfeed-${profileIndex}`);
  // SAFETY: feed children are always HTMLElements (rendered <figure> cards).
  const next = feed?.children[idx + 1] as HTMLElement | undefined;
  next?.scrollIntoView({ behavior: 'smooth' });
}

export function AwarenessPage({ go }: { go: (r: RouteKey) => void }) {
  const desktop = useIsDesktop();
  const [live, setLive] = useState<LiveProfile[] | null>(null);
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);
  const [selectedScam, setSelectedScam] = useState<ScamCase | null>(null);

  useEffect(() => {
    let ok = true;
    fetch('/api/ig')
      .then((r) => r.json())
      .then((d) => {
        if (ok && d?.profiles?.length) setLive(d.profiles);
      })
      .catch(() => {});
    return () => {
      ok = false;
    };
  }, []);

  const vigilFallback = igProfiles.find((profile) => profile.handle.toLowerCase().includes('vigil'));
  const profiles = (live ?? igProfiles).map((profile) => {
    if (!profile.handle.toLowerCase().includes('vigil')) return profile;
    // Keep the known fallback reels when the live proxy returns only a partial
    // timeline. The Map prevents duplicate cards when both sources overlap.
    const reels = new Map((vigilFallback?.reels ?? []).concat(profile.reels).map((reel) => [reel.code, reel]));
    return { ...profile, images: [], reels: [...reels.values()] };
  });
  const govList: IgMedia[] = govImages.map((g, i) => ({ code: `gov${i}`, title: g.title, image: govImageUrl(g.file) }));
  const open = (p: { name: string; handle: string }, kind: 'post' | 'reel', list: IgMedia[], idx: number) =>
    setLightbox({ name: p.name, handle: p.handle, kind, list, idx });
  const openGov = (idx: number) =>
    setLightbox({
      name: 'I4C Awareness',
      kind: 'post',
      list: govList,
      idx,
      meta: { label: 'Source: cybercrime.gov.in', url: 'https://cybercrime.gov.in/Webform/CyberAware.aspx' },
    });
  const nav = (dir: -1 | 1) =>
    setLightbox((lb) => (lb ? { ...lb, idx: (lb.idx + dir + lb.list.length) % lb.list.length } : lb));

  return (
    <>
      <PageHeader
        eyebrow="Awareness"
        title="What's trending in cyber crime"
        description="A live pulse from reported complaints — not a static image wall. Spot the patterns before they reach you."
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => go('detect')}>
            <i className="ph ph-shield-check" /> Check a link
          </button>
        }
      />
      <section className="section-tight">
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="awareness-grid">
            <Reveal>
              <span className="eyebrow" style={{ display: 'inline-flex', marginBottom: 'var(--sp-4)' }}>
                Trending complaints · last 24h
              </span>
              <div className="trending">
                {trending.map((t) => (
                  <button type="button" key={t.rank} className="trend-item trend-item--interactive" onClick={() => {
                    // SAFETY: trending ranks are the five literal keys defined in scamCases.
                    setSelectedScam(scamCases[t.rank as keyof typeof scamCases]);
                  }} aria-label={`Learn how ${t.title} works`}>
                    <span className="trend-rank">{t.rank}</span>
                    <div className="trend-body">
                      <b>{t.title}</b>
                      <small>Category · {t.tag}</small>
                    </div>
                    <div className="trend-meta">
                      <span className="trend-delta" style={t.dir === 'down' ? { color: 'var(--success)' } : undefined}>
                        {t.delta}
                      </span>
                      <br />
                      <small className="muted">{t.time}</small>
                    </div>
                    <i className="ph ph-arrow-up-right trend-open-icon" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </Reveal>

            <Reveal delay={80} className="card card-pad side-card" style={{ background: 'var(--navy)', color: '#fff' }}>
              <h4 style={{ color: '#fff' }}>This week's pulse</h4>
              <div className="stats-grid" style={{ marginTop: 'var(--sp-4)', gridTemplateColumns: '1fr 1fr' }}>
                <div className="stat" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'transparent' }}>
                  <i className="ph ph-chart-line-up" style={{ color: '#F0B48A' }} />
                  <strong style={{ color: '#fff' }}>8.4L</strong>
                  <span style={{ color: '#9fb0c6' }}>reports this week</span>
                </div>
                <div className="stat" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'transparent' }}>
                  <i className="ph ph-lightning" style={{ color: '#F0B48A' }} />
                  <strong style={{ color: '#fff' }}>₹312cr</strong>
                  <span style={{ color: '#9fb0c6' }}>flagged for recovery</span>
                </div>
              </div>
              <p className="small" style={{ color: '#9fb0c6', marginTop: 'var(--sp-4)' }}>
                Aggregated, anonymised signals from citizen reports. Updated hourly.
              </p>
            </Reveal>
          </div>

          <hr className="divider" />

          <div className="section-head" style={{ marginBottom: 'var(--sp-5)' }}>
            <span className="eyebrow" style={{ display: 'inline-flex' }}>
              <i className="ph ph-instagram-logo" /> Reels &amp; explainers
            </span>
            <h2 style={{ marginTop: 'var(--sp-3)' }}>Learn in 60 seconds</h2>
            <p className="lede">Real, creator-credited awareness content — played right here, no popups. Tap a reel to expand.</p>
          </div>

          <div className="reel-profiles">
            {profiles.map((p, i) => (
              <div className="reel-profile" key={i}>
                <div className="reel-profile-head">
                  <Avatar name={p.name} src={p.avatar} tone={profileTones[i % profileTones.length]} />
                  <div>
                    <a
                      className="reel-name"
                      href={`${IG_BASE}/${'username' in p ? p.username : p.handle.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {p.name}
                    </a>
                    <span className="reel-handle">
                      <a href={`${IG_BASE}/${'username' in p ? p.username : p.handle.replace('@', '')}`} target="_blank" rel="noreferrer">
                        {p.handle}
                      </a>{' '}
                      · View profile
                    </span>
                  </div>
                </div>

                {p.images.length > 0 && (
                  <>
                    <h4 className="reel-subhead">Images</h4>
                    <div className="reel-strip">
                      {p.images.map((m, idx) => (
                        <MediaCard
                          key={m.code}
                          kind="post"
                          media={m}
                          desktop={desktop}
                          onOpen={() => open(p, 'post', p.images, idx)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {p.reels.length > 0 && (
                  <>
                    <h4 className="reel-subhead">Reels</h4>
                    <div className={`reel-feed reel-feed--${desktop ? 'row' : 'col'}`} id={`reelfeed-${i}`}>
                      {p.reels.map((m, idx) => (
                        <MediaCard
                          key={m.code}
                          kind="reel"
                          media={m}
                          desktop={desktop}
                          onOpen={() => open(p, 'reel', p.reels, idx)}
                          onEnded={desktop ? undefined : () => scrollNext(i, idx)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <hr className="divider" />

          <div className="section-head gov-section-head" style={{ marginBottom: 'var(--sp-5)' }}>
            <span className="eyebrow" style={{ display: 'inline-flex' }}>
              <i className="ph ph-images" /> Images 3
            </span>
            <h2 style={{ marginTop: 'var(--sp-3)' }}>Official I4C awareness</h2>
            <p className="lede">Creatives published by the Indian Cyber Crime Coordination Centre on cybercrime.gov.in.</p>
          </div>

          <div className="gov-grid">
            {govImages.map((g, i) => (
              <figure className="gov-card" key={g.file}>
                <button type="button" className="gov-frame" onClick={() => openGov(i)} aria-label={`Open ${g.title}`}>
                  <img className="gov-img" src={proxy(govImageUrl(g.file))} alt={g.title} loading="lazy" />
                </button>
                <figcaption className="gov-cap">{g.title}</figcaption>
              </figure>
            ))}
          </div>

          {!live && (
            <p className="small muted" style={{ marginTop: 'var(--sp-5)' }}>
              Showing cached embeds — live media feed unavailable.
            </p>
          )}
        </div>
      </section>

      {lightbox && <IgLightbox data={lightbox} onClose={() => setLightbox(null)} onNav={nav} />}
      {selectedScam && <ScamLearningBoard scamCase={selectedScam} onClose={() => setSelectedScam(null)} />}
    </>
  );
}
