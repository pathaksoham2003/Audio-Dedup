export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  databaseUrl: process.env.DATABASE_URL,
  audioServiceUrl: process.env.AUDIO_SERVICE_URL || 'http://audio-service:8000',
  thresholds: {
    fingerprint: parseFloat(process.env.FINGERPRINT_SIMILARITY_THRESHOLD || '0.85'),
    embedding: parseFloat(process.env.EMBEDDING_SIMILARITY_THRESHOLD || '0.92'),
    suspicious: parseFloat(process.env.SUSPICIOUS_SIMILARITY_THRESHOLD || '0.75'),
  },
});
