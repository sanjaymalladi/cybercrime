import { action } from './_generated/server';
import { v } from 'convex/values';

const languages = ['unknown', 'en-IN', 'hi-IN', 'bn-IN', 'ta-IN', 'te-IN', 'kn-IN', 'ml-IN', 'mr-IN', 'gu-IN', 'pa-IN', 'od-IN', 'as-IN', 'ur-IN', 'ne-IN', 'kok-IN', 'ks-IN', 'sd-IN', 'sa-IN', 'sat-IN', 'mni-IN', 'brx-IN', 'mai-IN', 'doi-IN'] as const;

export const transcribe = action({
  args: { audioBase64: v.string(), mimeType: v.string(), languageCode: v.string() },
  returns: v.object({ transcript: v.string(), languageCode: v.string() }),
  handler: async (_ctx, args) => {
    const key = process.env.SARVAM_API_KEY;
    if (!key) throw new Error('SARVAM_API_KEY is not configured');
    if (!(languages as readonly string[]).includes(args.languageCode)) throw new Error('Unsupported speech language');
    const bytes = Uint8Array.from(atob(args.audioBase64), (char) => char.charCodeAt(0));
    const form = new FormData();
    form.append('file', new Blob([bytes], { type: args.mimeType }), 'complaint.webm');
    form.append('model', 'saaras:v4');
    form.append('language_code', args.languageCode);
    form.append('mode', 'transcribe');
    form.append('sample_rate', '16000');
    const response = await fetch('https://api.sarvam.ai/speech-to-text', { method: 'POST', headers: { 'api-subscription-key': key }, body: form, signal: AbortSignal.timeout(30000) });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Sarvam transcription failed (${response.status}): ${detail.slice(0, 240)}`);
    }
    const body = (await response.json()) as { transcript?: string; language_code?: string };
    return { transcript: body.transcript ?? '', languageCode: body.language_code ?? args.languageCode };
  },
});
