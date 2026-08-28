const MEDIA_HOST_RE = /(^|\.)(instagram\.com|fbcdn\.net|cdninstagram\.com|cybercrime\.gov\.in)$/;

export default async function handler(req: any, res: any) {
  try {
    const raw = Array.isArray(req.query?.u) ? req.query.u[0] : req.query?.u;
    const target = new URL(String(raw || ''));
    if (!MEDIA_HOST_RE.test(target.hostname)) return res.status(403).end();

    const upstream = await fetch(target.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        Referer: 'https://www.instagram.com/',
        Range: req.headers.range || 'bytes=0-',
      },
    });
    res.statusCode = upstream.status;
    for (const header of ['content-type', 'content-length', 'content-range', 'accept-ranges']) {
      const value = upstream.headers.get(header);
      if (value) res.setHeader(header, value);
    }
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.end(Buffer.from(await upstream.arrayBuffer()));
  } catch {
    return res.status(400).end();
  }
}
