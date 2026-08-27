import { action, internalMutation } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';

const providerState = v.union(v.literal('checked'), v.literal('clear'), v.literal('unavailable'), v.literal('not_configured'), v.literal('submitted'));
const scanResult = v.object({
  verdict: v.string(),
  score: v.number(),
  risk: v.string(),
  reasons: v.array(v.string()),
  extractedText: v.optional(v.string()),
  providers: v.array(v.object({ name: v.string(), status: providerState })),
  resultUrl: v.optional(v.string()),
});
const persistedResult = v.object({ verdict: v.string(), score: v.number(), risk: v.string(), reasons: v.array(v.string()), extractedText: v.optional(v.string()), resultUrl: v.optional(v.string()) });

function heuristic(input: string) {
  const reasons: string[] = [];
  const lower = input.toLowerCase();
  if (/otp|one[- ]time password|pin|cvv|password/.test(lower)) reasons.push('Requests a sensitive credential such as an OTP, PIN, CVV, or password.');
  if (/urgent|immediately|account.{0,20}(close|block|suspend)|verify now/.test(lower)) reasons.push('Uses urgency or account-threat language to pressure a quick decision.');
  if (/bit\.ly|tinyurl|t\.co|goo\.gl/.test(lower)) reasons.push('Contains a shortened link whose final destination is hidden.');
  if (/(refund|kyc|prize|reward|job offer|digital arrest)/.test(lower)) reasons.push('Matches a common fraud theme: refund, KYC, prize, job, or digital-arrest claims.');
  const score = Math.min(92, reasons.length * 22 + (reasons.length ? 8 : 0));
  return { verdict: score >= 60 ? 'suspicious' : 'no_known_threat', score, risk: score >= 60 ? 'high' : score >= 25 ? 'medium' : 'low', reasons };
}

function parseModelResult(content: string) {
  const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const parsed = JSON.parse(cleaned) as { extractedText?: unknown; verdict?: unknown; score?: unknown; risk?: unknown; reasons?: unknown };
  const score = Math.max(0, Math.min(100, Number(parsed.score) || 0));
  const reasons = Array.isArray(parsed.reasons) ? parsed.reasons.filter((reason): reason is string => typeof reason === 'string').slice(0, 8) : [];
  return {
    verdict: typeof parsed.verdict === 'string' ? parsed.verdict : score >= 60 ? 'suspicious' : 'no_known_threat',
    score,
    risk: parsed.risk === 'high' || parsed.risk === 'medium' || parsed.risk === 'low' ? parsed.risk : score >= 60 ? 'high' : score >= 25 ? 'medium' : 'low',
    reasons: reasons.length ? reasons : ['The model did not identify a specific scam indicator.'],
    ...(typeof parsed.extractedText === 'string' && parsed.extractedText.trim() ? { extractedText: parsed.extractedText.trim().slice(0, 5000) } : {}),
  };
}

export const saveScan = internalMutation({
  args: { source: v.union(v.literal('text'), v.literal('url'), v.literal('image')), inputPreview: v.string(), result: persistedResult },
  returns: v.id('scanResults'),
  handler: async (ctx, args) => ctx.db.insert('scanResults', { ...args.result, source: args.source, inputPreview: args.inputPreview, createdAt: new Date().toISOString() }),
});

export const scan = action({
  args: {
    input: v.string(),
    source: v.union(v.literal('text'), v.literal('url'), v.literal('image')),
    mimeType: v.optional(v.string()),
  },
  returns: scanResult,
  handler: async (ctx, args) => {
    const apiKey = process.env.SCAMCHECK_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const input = args.source === 'image' && args.mimeType ? `data:${args.mimeType};base64,${args.input}` : args.input;
    const localImageText = args.mimeType === 'image/demo-scam'
      ? 'State Bank of India suspicious activity account suspended within 24 hours verify immediately secure-sbi-login.com'
      : 'screenshot image uploaded for OCR review';
    let result = args.source === 'image'
      ? (args.mimeType === 'image/demo-scam' ? heuristic(localImageText) : { verdict: 'needs_review', score: 20, risk: 'medium', reasons: ['Screenshot is awaiting OCR analysis; do not treat an unverified image as safe.'] })
      : heuristic(args.input);
    const providers: Array<{ name: string; status: 'checked' | 'clear' | 'unavailable' | 'not_configured' | 'submitted' }> = [
      { name: 'Local fallback', status: 'checked' },
      { name: 'ScamCheck', status: apiKey ? 'unavailable' : 'not_configured' },
      { name: 'OpenRouter OCR', status: openRouterKey ? 'unavailable' : 'not_configured' },
      { name: 'VirusTotal', status: args.source === 'url' && process.env.VIRUSTOTAL_API_KEY ? 'unavailable' : 'not_configured' },
      { name: 'Safe Browsing', status: args.source === 'url' && process.env.GOOGLE_SAFE_BROWSING_KEY ? 'unavailable' : 'not_configured' },
    ];
    let resultUrl: string | undefined;
    let extractedText: string | undefined;

    if (openRouterKey && (args.source === 'image' || args.source === 'text')) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          signal: AbortSignal.timeout(30000),
          headers: { Authorization: `Bearer ${openRouterKey}`, 'Content-Type': 'application/json', 'X-Title': 'Cybercrime India Detector' },
          body: JSON.stringify({
            model: 'openrouter/free',
            temperature: 0.1,
            max_tokens: 700,
            response_format: { type: 'json_object' },
            messages: [{ role: 'system', content: 'You are a cyber-safety analyst. Return only valid JSON with keys extractedText, verdict, score, risk, reasons. First OCR every visible word, URL, phone number, UPI ID, and sender name from the screenshot; then assess scam risk. score is 0-100, risk is low, medium, or high, and reasons is an array of concise evidence-based strings.' }, { role: 'user', content: args.source === 'image' ? [{ type: 'text', text: 'OCR and analyze this screenshot for scam indicators.' }, { type: 'image_url', image_url: { url: input } }] : args.input }],
          }),
        });
        if (!response.ok) throw new Error(`OpenRouter returned ${response.status}`);
        const body = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
        const content = body.choices?.[0]?.message?.content;
        if (!content) throw new Error('OpenRouter returned no analysis');
        const modelResult = parseModelResult(content);
        result = { ...result, ...modelResult };
        extractedText = modelResult.extractedText;
        providers[2].status = 'checked';
      } catch {
        // Keep the local heuristic if the free router is unavailable or returns malformed JSON.
      }
    }

    if (apiKey) {
      try {
        const response = await fetch('https://www.scamcheck.tech/api/v1/scan', {
          method: 'POST',
          signal: AbortSignal.timeout(20000),
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ input, source: args.source === 'image' ? 'image' : 'text' }),
        });
        if (response.ok) {
          const remote = (await response.json()) as { verdict?: string; score?: number; risk?: string; reasons?: string[]; result_url?: string };
          result = { verdict: remote.verdict ?? result.verdict, score: remote.score ?? result.score, risk: remote.risk ?? result.risk, reasons: remote.reasons?.length ? remote.reasons : result.reasons };
          providers[1].status = 'checked';
          resultUrl = remote.result_url;
        }
      } catch {
        // Keep the local result when the optional provider is unavailable.
      }
    }

    if (args.source === 'url' && process.env.GOOGLE_SAFE_BROWSING_KEY) {
      try {
        const response = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${encodeURIComponent(process.env.GOOGLE_SAFE_BROWSING_KEY)}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(12000),
          body: JSON.stringify({ client: { clientId: 'cybercrime-india', clientVersion: '1.0.0' }, threatInfo: { threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'], platformTypes: ['ANY_PLATFORM'], threatEntryTypes: ['URL'], threatEntries: [{ url: args.input }] } }),
        });
        const matches = (await response.json()) as { matches?: Array<{ threatType?: string }> };
        if (matches.matches?.length) {
          result = { verdict: 'malicious_match', score: Math.max(result.score, 98), risk: 'high', reasons: [...result.reasons, `Google Safe Browsing matched ${matches.matches.map((m) => m.threatType).join(', ')}.`] };
        }
        providers[4].status = matches.matches?.length ? 'checked' : 'clear';
      } catch {
        // Keep the ScamCheck/heuristic result when Safe Browsing is unavailable.
      }
    }

    if (args.source === 'url' && process.env.VIRUSTOTAL_API_KEY) {
      try {
        const urlId = btoa(args.input).replace(/=+$/, '');
        const response = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, { headers: { 'x-apikey': process.env.VIRUSTOTAL_API_KEY }, signal: AbortSignal.timeout(12000) });
        if (response.ok) {
          const body = (await response.json()) as { data?: { attributes?: { last_analysis_stats?: { malicious?: number; suspicious?: number } } } };
          const stats = body.data?.attributes?.last_analysis_stats;
          const flagged = (stats?.malicious ?? 0) + (stats?.suspicious ?? 0);
          if (flagged) {
            result = { verdict: 'flagged_by_virustotal', score: Math.max(result.score, Math.min(98, 70 + flagged * 4)), risk: 'high', reasons: [...result.reasons, `VirusTotal flagged this URL in ${flagged} engine result${flagged === 1 ? '' : 's'}.`] };
          }
          providers[3].status = flagged ? 'checked' : 'clear';
        } else if (response.status === 404) {
          const submit = await fetch('https://www.virustotal.com/api/v3/urls', {
            method: 'POST',
            headers: { 'x-apikey': process.env.VIRUSTOTAL_API_KEY, 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ url: args.input }).toString(),
            signal: AbortSignal.timeout(12000),
          });
          if (submit.ok) {
            providers[3].status = 'submitted';
            result = { ...result, reasons: [...result.reasons, 'VirusTotal has queued this URL for analysis; results may take a moment to appear.'] };
          }
        }
      } catch {
        // Keep the other provider result when VirusTotal is unavailable or rate-limited.
      }
    }

    await ctx.runMutation(internal.detection.saveScan, { source: args.source, inputPreview: args.source === 'image' ? '[uploaded image]' : args.input.slice(0, 180), result: { ...result, ...(extractedText ? { extractedText } : {}), ...(resultUrl ? { resultUrl } : {}) } });
    return { ...result, ...(extractedText ? { extractedText } : {}), providers, ...(resultUrl ? { resultUrl } : {}) };
  },
});
