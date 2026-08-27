import { query } from './_generated/server';
import { v } from 'convex/values';

export const getComplaint = query({
  args: { reference: v.string() },
  returns: v.union(
    v.object({
      _id: v.id('complaints'),
      _creationTime: v.number(),
      reference: v.string(),
      category: v.string(),
      summary: v.string(),
      status: v.union(v.literal('registered'), v.literal('investigating'), v.literal('resolved')),
      reportedAt: v.string(),
      lastUpdated: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => ctx.db.query('complaints').withIndex('by_reference', (q) => q.eq('reference', args.reference)).unique(),
});

export const listTrendSignals = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id('trendSignals'),
    _creationTime: v.number(),
    rank: v.number(),
    tag: v.string(),
    title: v.string(),
    timeLabel: v.string(),
    delta: v.string(),
    direction: v.union(v.literal('up'), v.literal('down')),
  })),
  handler: async (ctx) => ctx.db.query('trendSignals').withIndex('by_rank').order('asc').take(10),
});

export const listResources = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id('resources'),
    _creationTime: v.number(),
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    kind: v.union(v.literal('guide'), v.literal('checklist'), v.literal('helpline')),
    href: v.string(),
  })),
  handler: async (ctx) => ctx.db.query('resources').withIndex('by_slug').order('asc').take(30),
});
