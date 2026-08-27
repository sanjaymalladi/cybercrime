import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const submitComplaint = mutation({
  args: { category: v.string(), summary: v.string() },
  returns: v.string(),
  handler: async (ctx, args) => {
    const reference = `NCRP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();
    await ctx.db.insert('complaints', {
      reference,
      category: args.category,
      summary: args.summary,
      status: 'registered',
      reportedAt: now,
      lastUpdated: now,
    });
    return reference;
  },
});
