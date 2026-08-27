import { internalMutation } from './_generated/server';
import { v } from 'convex/values';

export const seedDemoData = internalMutation({
  args: {},
  returns: v.object({ complaints: v.number(), trends: v.number(), resources: v.number() }),
  handler: async (ctx) => {
    const [complaints, trends, resources] = await Promise.all([
      ctx.db.query('complaints').withIndex('by_reference').take(100),
      ctx.db.query('trendSignals').withIndex('by_rank').take(100),
      ctx.db.query('resources').withIndex('by_slug').take(100),
    ]);
    await Promise.all([...complaints, ...trends, ...resources].map((row) => ctx.db.delete(row._id)));

    const complaintRows = [
      { reference: 'NCRP-2026-482917', category: 'UPI fraud', summary: 'A fake payment-failed request collected money from a UPI account.', status: 'investigating' as const, reportedAt: '2026-08-25T10:30:00.000Z', lastUpdated: '2026-08-26T15:10:00.000Z' },
      { reference: 'NCRP-2026-417208', category: 'Phishing', summary: 'A KYC-expiry SMS linked to a lookalike bank website.', status: 'registered' as const, reportedAt: '2026-08-26T09:15:00.000Z', lastUpdated: '2026-08-26T09:15:00.000Z' },
      { reference: 'NCRP-2026-390144', category: 'Impersonation', summary: 'A caller posed as a bank officer and requested an OTP.', status: 'resolved' as const, reportedAt: '2026-08-12T07:45:00.000Z', lastUpdated: '2026-08-20T11:00:00.000Z' },
    ];
    for (const row of complaintRows) await ctx.db.insert('complaints', row);

    const trendRows = [
      { rank: 1, tag: 'UPI', title: 'Fake “payment failed” UPI collect requests', timeLabel: '2h ago', delta: '+38%', direction: 'up' as const },
      { rank: 2, tag: 'KYC', title: '“Your KYC expired” SMS with malicious link', timeLabel: '5h ago', delta: '+21%', direction: 'up' as const },
      { rank: 3, tag: 'Job', title: 'Work-from-home task scams on Telegram', timeLabel: '9h ago', delta: '+14%', direction: 'up' as const },
      { rank: 4, tag: 'Bank', title: 'Impersonation of SBI / HDFC helplines', timeLabel: '1d ago', delta: '-6%', direction: 'down' as const },
      { rank: 5, tag: 'OTP', title: '“RBI refund” OTP harvesting calls', timeLabel: '1d ago', delta: '+9%', direction: 'up' as const },
    ];
    for (const row of trendRows) await ctx.db.insert('trendSignals', row);

    const resourceRows = [
      { slug: 'report-financial-fraud', title: 'Report financial fraud', description: 'Call 1930 immediately and keep transaction details ready.', kind: 'helpline' as const, href: '#report' },
      { slug: 'spot-phishing', title: 'Spot a phishing message', description: 'A practical checklist for links, urgency, and fake support numbers.', kind: 'checklist' as const, href: '#learn' },
      { slug: 'secure-your-accounts', title: 'Secure your accounts', description: 'Change exposed passwords, enable two-factor authentication, and review sessions.', kind: 'guide' as const, href: '#learn' },
    ];
    for (const row of resourceRows) await ctx.db.insert('resources', row);

    return { complaints: complaintRows.length, trends: trendRows.length, resources: resourceRows.length };
  },
});
