const client = require ('../config/redisConfig');

const cacheMiddleware = async (req, res, next) => {
  const {id} = req.params;
  const redisKey = `data:${id}`;
  try {
    const cachedData = await client.get (redisKey);
    if (cachedData) {
      return res.json (JSON.parse (cachedData));
    }
    next ();
  } catch (err) {
    console.error ('Redis Error:', err);
    next ();
  }
};
module.exports = cacheMiddleware;
