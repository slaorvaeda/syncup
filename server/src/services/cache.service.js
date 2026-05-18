const { getRedis } = require("../config/redis");

const CACHE_PREFIX = () => process.env.FEED_CACHE_KEY || "feed";
const CACHE_TTL = () => Number(process.env.FEED_CACHE_TTL) || 60;

const buildCacheKey = (page, limit) =>
  `${CACHE_PREFIX()}:page:${page}:limit:${limit}`;

const getFeedCache = async (page, limit) => {
  const data = await getRedis().get(buildCacheKey(page, limit));
  return data ? JSON.parse(data) : null;
};

const setFeedCache = async (page, limit, payload) => {
  await getRedis().set(
    buildCacheKey(page, limit),
    JSON.stringify(payload),
    "EX",
    CACHE_TTL()
  );
  return true;
};

const clearFeedCache = async () => {
  const redis = getRedis();
  const pattern = `${CACHE_PREFIX()}:page:*`;
  const keys = await redis.keys(pattern);

  if (keys.length > 0) {
    await redis.del(...keys);
  }

  // remove legacy single-key cache if it exists
  await redis.del(CACHE_PREFIX());
  return true;
};

module.exports = {
  getFeedCache,
  setFeedCache,
  clearFeedCache,
  buildCacheKey,
};
