import { resolve } from 'node:path';
import { Readable } from 'node:stream';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Server-side Instagram proxy. Instagram's public JSON has no CORS headers, so
// the browser cannot fetch it directly. We fetch fresh media server-side and
// hand the page hotlinkable URLs (avatars, image files, .mp4 reels) — nothing
// is downloaded or stored locally. URLs are re-fetched per request window so
// signed fbcdn links stay valid for the session.
function instagramProxy() {
  const HANDLES = ['vforvigilaunty', 'cyberdosti4c'];
  const HEADERS = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    'X-IG-App-ID': '936619743392459',
    Accept: '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-User': '?1',
    Origin: 'https://www.instagram.com',
    Referer: 'https://www.instagram.com/',
    'X-Requested-With': 'XMLHttpRequest',
  } satisfies Record<string, string>;

  async function getProfile(username: string) {
    const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`ig ${res.status} for ${username}`);
    // SAFETY: Instagram's documented profile response is accessed through guarded optional fields below.
    const j = (await res.json()) as any;
    const u = (j.graphql || j.data)?.user;
    if (!u) throw new Error('no user in response');
    const captionOf = (n: any) => n.edge_media_to_caption?.edges?.[0]?.node?.text ?? '';
    const felixReels = (u.edge_felix_video_timeline?.edges ?? []).map((e: any) => {
      const n = e.node;
      return { code: n.shortcode, title: captionOf(n), video: n.video_url, thumb: n.display_url, t: 0 };
    });
    const timelineVideos = (u.edge_owner_to_timeline_media?.edges ?? [])
      .filter((e: any) => e.node.is_video)
      .map((e: any) => {
        const n = e.node;
        return { code: n.shortcode, title: captionOf(n), video: n.video_url, thumb: n.display_url, t: n.taken_at_timestamp || 0 };
      });
    const reelMap = new Map<string, any>();
    for (const r of [...felixReels, ...timelineVideos]) {
      if (r.video && !reelMap.has(r.code)) reelMap.set(r.code, r);
    }
    const reels = [...reelMap.values()].sort((a, b) => (b.t || 0) - (a.t || 0));
    const images =
      username === 'vforvigilaunty'
        ? []
        : (u.edge_owner_to_timeline_media?.edges ?? [])
            .filter((e: any) => !e.node.is_video)
            .map((e: any) => ({ code: e.node.shortcode, title: captionOf(e.node), image: e.node.display_url }));
    return {
      name: u.full_name || u.username,
      handle: `@${u.username}`,
      username: u.username,
      avatar: u.profile_pic_url_hd || u.profile_pic_url,
      reels,
      images,
    };
  }

  const cache = new Map<string, { at: number; data: any }>();
  const TTL = 10 * 60 * 1000;

  async function handler(req: any, res: any, next: any) {
    // SAFETY: Vite's Connect request always supplies a string URL for middleware handlers.
    const url = req.url as string;
    if (!url || url.split('?')[0] !== '/api/ig') return next();
    try {
      const key = 'profiles';
      const hit = cache.get(key);
      if (hit && Date.now() - hit.at < TTL) {
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(hit.data));
      }
      const profiles = await Promise.all(HANDLES.map(getProfile));
      const data = { profiles };
      cache.set(key, { at: Date.now(), data });
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    } catch (e) {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: String(e) }));
    }
  }

  // Same-origin media proxy. Instagram's CDN (fbcdn) blocks cross-origin
  // browser hotlinks (referer / signed `oh` checks), so the browser cannot
  // load the avatars / images / .mp4 reels directly. We fetch them
  // server-side (where the public endpoints work) and stream them back from
  // our own origin — nothing is written to disk, and the browser only ever
  // talks to localhost, so CSP / hotlink rules no longer apply.
  const MEDIA_HOST_RE = /(^|\.)(instagram\.com|fbcdn\.net|cdninstagram\.com|cybercrime\.gov\.in)$/;
  async function mediaHandler(req: any, res: any, next: any) {
    // SAFETY: Vite's Connect request always supplies a string URL for middleware handlers.
    const url = req.url as string;
    if (!url || !url.startsWith('/api/ig-media')) return next();
    let target: URL;
    try {
      const u = new URL(url, 'http://localhost');
      const targetRaw = u.searchParams.get('u');
      if (!targetRaw) return next();
      target = new URL(targetRaw);
    } catch {
      res.statusCode = 400;
      return res.end();
    }
    if (!MEDIA_HOST_RE.test(target.hostname)) {
      res.statusCode = 403;
      return res.end();
    }
    try {
      const upstream = await fetch(target.toString(), {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
          Referer: 'https://www.instagram.com/',
          Origin: 'https://www.instagram.com',
          Range: req.headers['range'] || 'bytes=0-',
        },
      });
      res.statusCode = upstream.status;
      const pass = (k: string) => {
        const v = upstream.headers.get(k);
        if (v) res.setHeader(k, v);
      };
      pass('content-type');
      pass('content-length');
      pass('content-range');
      pass('accept-ranges');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      if (upstream.body) {
        // SAFETY: the Fetch body is a Web ReadableStream, which Node's adapter accepts here.
        Readable.fromWeb(upstream.body as any).pipe(res);
      } else {
        res.end();
      }
    } catch (e) {
      res.statusCode = 502;
      res.end(String(e));
    }
  }

  return {
    name: 'instagram-proxy',
    configureServer(server: any) {
      server.middlewares.use(handler);
      server.middlewares.use(mediaHandler);
    },
    configurePreviewServer(server: any) {
      server.middlewares.use(handler);
      server.middlewares.use(mediaHandler);
    },
  };
}

export default defineConfig({
  plugins: [react(), instagramProxy()],
  build: {
    rollupOptions: {
      input: {
        app: resolve(process.cwd(), 'index.html'),
        research: resolve(process.cwd(), 'research/index.html'),
      },
    },
  },
});
