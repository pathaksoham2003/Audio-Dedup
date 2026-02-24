export const AUDIO_QUEUE_NAME = 'process-audio';

export const ALLOWED_AUDIO_MIME_TYPES = new Set([
  'audio/wav',
  'audio/x-wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/x-m4a',
  'audio/aac',
  'audio/flac',
]);

export const MAX_AUDIO_BYTES = 50 * 1024 * 1024;

