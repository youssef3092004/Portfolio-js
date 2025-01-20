const redis = require ('redis');

const PORT_REDIS = process.env.PORT_REDIS || 6379;
const client = redis.createClient ({url: `redis://localhost:${PORT_REDIS}`});

client.connect ().catch (err => console.error ('Redis Client Error', err));

client.on ('connect', () => {
  console.log ('Connected to Redis...');
});

module.exports = client;
