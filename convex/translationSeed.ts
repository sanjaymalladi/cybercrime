import { internalMutation } from './_generated/server';
import { v } from 'convex/values';

const copy = {
  en: {
    'nav.report': 'Report',
    'nav.detect': 'Detect',
    'nav.track': 'Track',
    'nav.awareness': 'Awareness',
    'nav.contact': 'Contact',
    'nav.call': 'Call 1930',
    'brand.name': 'Cyber Crime India',
    'brand.tagline': 'Report · Detect · Track',
    'home.hero.title': 'Report. Detect. Stay safe.',
    'home.hero.description': 'One citizen-first portal to report cyber crimes, check suspicious links, track your complaint and learn to stay protected. Your safety. Our priority.',
    'home.hero.report': 'Report a cyber crime',
    'home.hero.detect': 'Detect cyber crime',
    'home.helpline': '24×7 helpline',
    'home.official': 'Official citizen portal',
  },
  hi: {
    'nav.report': 'शिकायत दर्ज करें',
    'nav.detect': 'जाँच करें',
    'nav.track': 'स्थिति देखें',
    'nav.awareness': 'जागरूकता',
    'nav.contact': 'संपर्क करें',
    'nav.call': '1930 पर कॉल करें',
    'brand.name': 'साइबर अपराध भारत',
    'brand.tagline': 'शिकायत · जाँच · स्थिति',
    'home.hero.title': 'शिकायत करें। जाँचें। सुरक्षित रहें।',
    'home.hero.description': 'साइबर अपराध की शिकायत दर्ज करने, संदिग्ध लिंक जाँचने, शिकायत की स्थिति देखने और सुरक्षित रहने के लिए नागरिकों का एक पोर्टल। आपकी सुरक्षा हमारी प्राथमिकता है।',
    'home.hero.report': 'साइबर अपराध की शिकायत करें',
    'home.hero.detect': 'साइबर अपराध जाँचें',
    'home.helpline': '24×7 हेल्पलाइन',
    'home.official': 'आधिकारिक नागरिक पोर्टल',
  },
} as const;

export const seed = internalMutation({
  args: {},
  returns: v.object({ inserted: v.number() }),
  handler: async (ctx) => {
    const existing = await ctx.db.query('translations').take(2000);
    await Promise.all(existing.map((row) => ctx.db.delete(row._id)));
    let inserted = 0;
    for (const [locale, entries] of Object.entries(copy)) {
      for (const [key, value] of Object.entries(entries)) {
        await ctx.db.insert('translations', { locale, key, value });
        inserted += 1;
      }
    }
    return { inserted };
  },
});
