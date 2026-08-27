// Official awareness creatives published by the Indian Cyber Crime
// Coordination Centre on https://cybercrime.gov.in (the real source site).
// Displayed in the "Images 3" section, credited to I4C.
const BASE = 'https://cybercrime.gov.in/images/awareness/';

export type GovImage = { file: string; title: string };

export const govImages: GovImage[] = [
  { file: 'cautious-fakeapps.jpg', title: 'Be cautious of fake apps' },
  { file: 'cautious-fakeapps-Hindi.jpg', title: 'सावधान रहें नकली ऐप्स से' },
  { file: 'OTP-fraud.jpg', title: 'Never share your OTP' },
  { file: 'change-password.jpg', title: 'Change your passwords regularly' },
  { file: 'sextortion-b.jpg', title: 'Beware of sextortion scams' },
  { file: 'Video-call-Alart.jpg', title: 'Video-call extortion alert' },
  { file: 'post01.jpg', title: 'Stay alert, stay safe' },
  { file: 'post02.jpg', title: 'Report cyber crime promptly' },
  { file: 'post03.jpg', title: 'Think before you click' },
];

export const govImageUrl = (file: string) => `${BASE}${file}`;
