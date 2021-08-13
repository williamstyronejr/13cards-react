import redis, { RedisClient } from "redis";
import logger from "./logger";

let redisClient: RedisClient;

/**
 * Creates a connection to redis server.
 * @param IP Redis IP
 * @param PORT Redis port
 * @param URL URL for redis connection
 * @returns {Promise<Object>} Returns a promise to resolve with redis client
 *  when the client is ready.
 */
export function setupRedis(
  IP: string | undefined = "localhost",
  PORT: number | undefined = 6379,
  URL: string | null = null
) {
  redisClient = URL ? redis.createClient(URL) : redis.createClient(PORT, IP);

  return new Promise((res, rej) => {
    redisClient.on("ready", () => {
      logger.info(`Redis connection made on ${IP}:${PORT}`);
      return res(redisClient);
    });
  });
}

/**
 * Closes connection to redis.
 */
export function closeRedis() {
  if (redisClient) redisClient.quit();
}
