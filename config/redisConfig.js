const redis = require ('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const client = redis.createClient({ url: REDIS_URL });

client.connect ().catch (err => console.error ('Redis Client Error', err));

client.on ('connect', () => {
  console.log ('Connected to Redis...');
});

module.exports = client;
