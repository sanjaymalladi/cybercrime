const HANDLES = ['vforvigilaunty', 'cyberdosti4c'];
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
  'X-IG-App-ID': '936619743392459',
  Accept: '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: 'https://www.instagram.com/',
};

const cache = new Map<string, { at: number; data: unknown }>();
const TTL = 10 * 60 * 1000;

async function getProfile(username: string) {
  const response = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, { headers: HEADERS });
  if (!response.ok) throw new Error(`Instagram returned ${response.status}`);
  const payload = await response.json() as any;
  const user = (payload.graphql || payload.data)?.user;
  if (!user) throw new Error('Instagram profile was not returned');
  const captionOf = (node: any) => node.edge_media_to_caption?.edges?.[0]?.node?.text ?? '';
  const reels = [
    ...(user.edge_felix_video_timeline?.edges ?? []).map((edge: any) => edge.node),
    ...(user.edge_owner_to_timeline_media?.edges ?? [])
      .filter((edge: any) => edge.node.is_video)
      .map((edge: any) => edge.node),
  ].map((node: any) => ({
    code: node.shortcode,
    title: captionOf(node),
    video: node.video_url,
    thumb: node.display_url,
    t: node.taken_at_timestamp || 0,
  })).filter((item: any) => item.code && item.video);

  const uniqueReels = [...new Map(reels.map((item: any) => [item.code, item])).values()]
    .sort((a: any, b: any) => b.t - a.t)
    .map(({ t, ...item }: any) => item);
  const images = username === 'vforvigilaunty'
    ? []
    : (user.edge_owner_to_timeline_media?.edges ?? [])
        .filter((edge: any) => !edge.node.is_video && edge.node.display_url)
        .map((edge: any) => ({ code: edge.node.shortcode, title: captionOf(edge.node), image: edge.node.display_url }));

  return {
    name: user.full_name || user.username,
    handle: `@${user.username}`,
    username: user.username,
    avatar: user.profile_pic_url_hd || user.profile_pic_url,
    reels: uniqueReels,
    images,
  };
}

export default async function handler(_req: any, res: any) {
  try {
    const cached = cache.get('profiles');
    if (cached && Date.now() - cached.at < TTL) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      return res.end(JSON.stringify(cached.data));
    }
    const data = { profiles: await Promise.all(HANDLES.map(getProfile)) };
    cache.set('profiles', { at: Date.now(), data });
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    return res.end(JSON.stringify(data));
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 502;
    return res.end(JSON.stringify({ error: 'Instagram feed unavailable', detail: String(error) }));
  }
}
