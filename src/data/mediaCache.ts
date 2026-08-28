const BLOB_BASE = 'https://vpbmetxjyw2h6sws.public.blob.vercel-storage.com/awareness/';

const files: Record<string, string> = {
  'profile:vigil': 'profile-vigil.jpg', 'profile:cyber': 'profile-cyber.jpg',
  Dci2JHytcZc: 'vigil-Dci2JHytcZc.mp4', DcixhRbNDIa: 'vigil-DcixhRbNDIa.mp4', DcgQULAqnB5: 'vigil-DcgQULAqnB5.mp4',
  DcfgCrqSvAg: 'vigil-DcfgCrqSvAg.mp4', DcdyH_WDSh3: 'vigil-DcdyH_WDSh3.mp4', Dcc5tNKBpBi: 'vigil-Dcc5tNKBpBi.mp4',
  DcYeUK1z2H4: 'vigil-DcYeUK1z2H4.mp4', DcYJoEzge0w: 'vigil-DcYJoEzge0w.mp4', DcV9uM3tZ0p: 'vigil-DcV9uM3tZ0p.mp4',
  CmMEDito6in: 'vigil-CmMEDito6in.mp4', ChlwznhD6od: 'vigil-ChlwznhD6od.mp4', ChcppbEA9aT: 'vigil-ChcppbEA9aT.mp4', CfELVNxA2lM: 'vigil-CfELVNxA2lM.mp4',
  DcjRHySSHAC: 'cyber-DcjRHySSHAC.mp4', 'DcjA-J1Nd0c': 'cyber-DcjA-J1Nd0c.mp4', DciZecfNEDt: 'cyber-DciZecfNEDt.mp4', DcgjmhtNb8D: 'cyber-DcgjmhtNb8D.mp4',
  Dcd20k5vLYU: 'cyber-Dcd20k5vLYU.mp4', DcdX0nxOEwc: 'cyber-DcdX0nxOEwc.mp4', Db7fFQ6t0cS: 'cyber-Db7fFQ6t0cS.mp4', CrS0wEQOUon: 'cyber-CrS0wEQOUon.mp4',
  'Ck-RDivjApx': 'cyber-Ck-RDivjApx.mp4', Ckz_rpkDgVz: 'cyber-Ckz_rpkDgVz.mp4', 'CkvKo96j6-e': 'cyber-CkvKo96j6-e.mp4', CkioyMHDqBz: 'cyber-CkioyMHDqBz.mp4',
  CkcuakLD38g: 'cyber-CkcuakLD38g.mp4', CkaFWJejbeL: 'cyber-CkaFWJejbeL.mp4', CkQNPxcjS0l: 'cyber-CkQNPxcjS0l.mp4', 'CkAqmOQDNX-': 'cyber-CkAqmOQDNX-.mp4',
  Cj7UNwWj_1m: 'cyber-Cj7UNwWj_1m.mp4', Cjz6EI5DAS6: 'cyber-Cjz6EI5DAS6.mp4', CjpfXhyjCma: 'cyber-CjpfXhyjCma.mp4',
  'i4c:DckjKkHHXph': 'cyber-DckjKkHHXph.jpg', 'i4c:DcdvUl0N18m': 'cyber-DcdvUl0N18m.jpg', 'i4c:DcdjnGINod5': 'cyber-DcdjnGINod5.jpg', 'i4c:DcdQyphneiZ': 'cyber-DcdQyphneiZ.jpg', 'i4c:Dcc7dDmjoVs': 'cyber-Dcc7dDmjoVs.jpg',
  'i4c:cautious-fakeapps.jpg': 'i4c-cautious-fakeapps.jpg', 'i4c:cautious-fakeapps-Hindi.jpg': 'i4c-cautious-fakeapps-Hindi.jpg', 'i4c:OTP-fraud.jpg': 'i4c-OTP-fraud.jpg',
  'i4c:change-password.jpg': 'i4c-change-password.jpg', 'i4c:sextortion-b.jpg': 'i4c-sextortion-b.jpg', 'i4c:Video-call-Alart.jpg': 'i4c-Video-call-Alart.jpg', 'i4c:post01.jpg': 'i4c-post01.jpg', 'i4c:post02.jpg': 'i4c-post02.jpg', 'i4c:post03.jpg': 'i4c-post03.jpg',
};

export function cachedMediaUrl(key?: string) {
  const file = key ? files[key] : undefined;
  return file ? `${BLOB_BASE}${file}` : undefined;
}
