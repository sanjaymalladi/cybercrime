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

const profileTones = ['var(--navy-2)', '#0f3b34'];
const IG_BASE = 'https://www.instagram.com';

// Route Instagram media through our same-origin proxy so the browser never
// hotlinks fbcdn directly (which Instagram blocks). No local download — the
// server streams the bytes back from our own origin.
function proxy(u?: string) {
  return u ? `/api/ig-media?u=${encodeURIComponent(u)}` : '';
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
    />
  );
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
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
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
              <video className="reel-media reel-video" src={proxy(item.video)} poster={proxy(item.thumb)} controls autoPlay onEnded={() => onNav(1)} />
            ) : (
              <img className="reel-media reel-img" src={proxy(item.image)} alt={item.title} />
            )
          ) : (
            <IgEmbed kind={data.kind} code={item.code} title={item.title} />
          )}
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
          <p className="ig-lightbox__cap">{item.title}</p>
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
    : <IgEmbed kind={kind} code={media.code} title={media.title} />;

  const clickable = kind === 'post' || desktop;

  return (
    <figure className={`reel-card-embed reel-card-embed--${kind}`}>
      {clickable ? (
        <button type="button" className={`reel-frame reel-frame--${kind}`} onClick={onOpen} aria-label={`Open ${media.title}`}>
          {inner}
          {desktop && live && kind === 'reel' && (
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

  const profiles = live ?? igProfiles;
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
                  <div key={t.rank} className="trend-item">
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
                  </div>
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
    </>
  );
}
