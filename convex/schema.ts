import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  complaints: defineTable({
    reference: v.string(),
    category: v.string(),
    summary: v.string(),
    status: v.union(v.literal('registered'), v.literal('investigating'), v.literal('resolved')),
    reportedAt: v.string(),
    lastUpdated: v.string(),
  }).index('by_reference', ['reference']).index('by_status', ['status']),

  trendSignals: defineTable({
    rank: v.number(),
    tag: v.string(),
    title: v.string(),
    timeLabel: v.string(),
    delta: v.string(),
    direction: v.union(v.literal('up'), v.literal('down')),
  }).index('by_rank', ['rank']),

  resources: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    kind: v.union(v.literal('guide'), v.literal('checklist'), v.literal('helpline')),
    href: v.string(),
  }).index('by_slug', ['slug']),

  scanResults: defineTable({
    source: v.union(v.literal('text'), v.literal('url'), v.literal('image')),
    inputPreview: v.string(),
    verdict: v.string(),
    score: v.number(),
    risk: v.string(),
    reasons: v.array(v.string()),
    extractedText: v.optional(v.string()),
    createdAt: v.string(),
  }).index('by_created_at', ['createdAt']),

  translations: defineTable({
    locale: v.string(),
    key: v.string(),
    value: v.string(),
  }).index('by_locale_and_key', ['locale', 'key']).index('by_locale', ['locale']),
});
