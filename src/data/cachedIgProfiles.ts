import { igProfiles, type IgProfile } from './igProfiles';

const extraVigil = ['DcfgCrqSvAg', 'DcdyH_WDSh3', 'Dcc5tNKBpBi', 'DcYeUK1z2H4', 'DcYJoEzge0w', 'DcV9uM3tZ0p'];
const extraCyber = ['DcjRHySSHAC', 'DcjA-J1Nd0c', 'DciZecfNEDt', 'DcgjmhtNb8D', 'Dcd20k5vLYU', 'DcdX0nxOEwc', 'Db7fFQ6t0cS', 'CkaFWJejbeL', 'CkQNPxcjS0l', 'CkAqmOQDNX-', 'Cj7UNwWj_1m', 'Cjz6EI5DAS6', 'CjpfXhyjCma'];
const extraCyberImages = ['DckjKkHHXph', 'DcdQyphneiZ', 'Dcc7dDmjoVs'];
const placeholder = (code: string) => ({ code, title: 'Cyber awareness reel' });
const withExtras = (profile: IgProfile): IgProfile => {
  if (profile.handle.includes('vigil')) return { ...profile, reels: [...profile.reels, ...extraVigil.map(placeholder)] };
  const images = profile.images.filter((m) => m.code !== 'Dcd20k5vLYU');
  return { ...profile, reels: [...profile.reels, ...extraCyber.map(placeholder).filter((m) => !profile.reels.some((r) => r.code === m.code))], images: [...images, ...extraCyberImages.map(placeholder).filter((m) => !images.some((i) => i.code === m.code))] };
};

export const cachedIgProfiles = igProfiles.map((profile) => ({ ...withExtras(profile), avatar: '' }));
