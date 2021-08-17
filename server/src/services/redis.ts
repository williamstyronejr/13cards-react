import redis, { RedisClient } from 'redis';
import logger from './logger';

let redisClient: RedisClient;

/**
 * Creates a lobby as a hash only if the lobby doesn't already exist.
 * @param lobbyName Name of lobby
 * @param creator Name of user creating the lobby
 * @return {Promise<Boolean>} Returns a promise to resolve with bool indicating
 *  if the lobby was created.
 */
export function createLobby(
  lobbyName: string,
  creator: string,
): Promise<Boolean> {
  return new Promise((res: Function, rej: Function) => {
    redisClient.hlen(`${lobbyName}-lobby`, (err, count) => {
      if (err) return rej(err);
      if (count > 0) return res(false);

      redisClient.hset(
        `${lobbyName}-lobby`,
        creator,
        'false',
        (setErr, result) => {
          if (setErr) return rej(setErr);
          res(result === 1);
        },
      );
    });
  });
}

/**
 * Deletes a lobby.
 * @param lobbyName {String} Name of lobby to delete
 * @return {Promise<Boolean>} Returns a promise to resolve with bool indicating
 *  if the lobby was deleted.
 */
export function deleteLobby(lobbyName: string): Promise<Boolean> {
  return new Promise((res: Function, rej: Function) => {
    redisClient.del(`${lobbyName}-lobby`, (err, delCount) => {
      if (err) return rej(err);
      res(delCount === 1);
    });
  });
}

/**
 * Adds a player to lobby only if the lobby isn't full (4 players max).
 * @param {String} lobbyName Name of lobby
 * @param {String} playerName Name of player to add to lobby
 * @returns {Promise<Boolean>} Returns a promise to resolve with a bool
 *  indicating if player was added to lobby.
 */
export function addPlayerToLobby(
  lobbyName: string,
  playerName: string,
): Promise<Boolean> {
  return new Promise((res, rej) => {
    redisClient.watch(`${lobbyName}-lobby`, (watchErr) => {
      if (watchErr) return rej(watchErr);

      redisClient.hlen(`${lobbyName}-lobby`, (lenErr, reply) => {
        if (lenErr) return rej(lenErr);
        if (reply >= 4) return rej(new Error('Full'));

        redisClient
          .multi()
          .hset(`${lobbyName}-lobby`, playerName, 'false')
          .exec((err, result) => {
            if (err) return rej(err);
            if (result === null) return rej(new Error('Aborted'));

            res(result[0] === 1);
          });
      });
    });
  });
}

/**
 * Removes a player from the player list of a lobby by deleting their key value
 *  pair.
 * @param lobbyName Name of lobby player is in
 * @param playerName Name of player to be removed
 * @returns {Promise<Boolean>} Returns a promise to resolve with
 */
export function removePlayerFromLobby(
  lobbyName: string,
  playerName: string,
): Promise<Boolean> {
  return new Promise((res, rej) => {
    redisClient.hdel(`${lobbyName}-lobby`, playerName, (err, delCount) => {
      if (err) return rej(err);

      res(delCount === 1);
    });
  });
}

/**
 * Changes a player's ready status in the lobby.
 * @param {String} lobbyName Name of lobby
 * @param {String} playerName Name of player changing ready status
 * @param {Boolean} ready Bool indicating if player is ready or not ready
 * @return {Promise<Boolean>} Returns a promise to resolve with a boolean
 *  indicating ready state was changed.
 */
export function setPlayerReadyState(
  lobbyName: string,
  playerName: string,
  ready: boolean,
): Promise<Boolean> {
  return new Promise((res, rej) => {
    redisClient.watch(`${lobbyName}-lobby`, (watchErr) => {
      if (watchErr) return rej(watchErr);

      redisClient.hexists(`${lobbyName}-lobby`, playerName, (err, reply) => {
        if (err) return rej(err);
        if (reply === 0) return res(false);

        redisClient
          .multi()
          .hset(`${lobbyName}-lobby`, playerName, ready ? 'true' : 'false')
          .exec((execErr, results) => {
            if (execErr) return rej(execErr);
            if (results === null) return rej(new Error('Abort'));

            // Key that is updated doesn't count towards count
            res(results[0] === 0);
          });
      });
    });
  });
}

/**
 * Creates a connection to redis server.
 * @param IP Redis IP
 * @param PORT Redis port
 * @param URL URL for redis connection
 * @returns {Promise<Object>} Returns a promise to resolve with redis client
 *  when the client is ready.
 */
export function setupRedis(
  IP: string | undefined = 'localhost',
  PORT: number | undefined = 6379,
  URL: string | null = null,
): Promise<RedisClient> {
  redisClient = URL ? redis.createClient(URL) : redis.createClient(PORT, IP);

  return new Promise((res, rej) => {
    redisClient.on('ready', () => {
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
