import { query } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  args: { locale: v.string() },
  returns: v.array(v.object({ key: v.string(), value: v.string() })),
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query('translations')
      .withIndex('by_locale', (q) => q.eq('locale', args.locale))
      .take(2000);
    return rows.map(({ key, value }) => ({ key, value }));
  },
});
