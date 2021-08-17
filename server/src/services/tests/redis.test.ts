import { RedisClient } from 'redis';
import {
  setupRedis,
  closeRedis,
  createLobby,
  deleteLobby,
  addPlayerToLobby,
  setPlayerReadyState,
} from '../redis';
import { generateString } from '../../utils/utils';

const { REDIS_HOST, REDIS_IP } = process.env;
let redisClient: RedisClient;

beforeAll(async () => {
  redisClient = await setupRedis(
    REDIS_HOST,
    REDIS_IP ? parseInt(REDIS_IP, 10) : undefined,
  );
});

afterAll((done) => {
  redisClient.flushall(() => {
    closeRedis();
    done();
  });
});

describe('Game Lobbies', () => {
  test('Creating game lobby', async () => {
    const lobbyName = generateString(8);
    const owner = 'player2';
    const result = await createLobby(lobbyName, owner);

    expect(result).toBeTruthy();
  });

  test('Creating a lobby with the same name should return false', async () => {
    const lobbyName = generateString(8);
    const owner = 'player1';

    await createLobby(lobbyName, owner);
    const result = await createLobby(lobbyName, owner);

    expect(result).toBeFalsy();
  });

  test('Deleting a existing lobby should return true', async () => {
    const lobbyName = generateString(8);
    const owner = 'test';

    await createLobby(lobbyName, owner);
    const result = await deleteLobby(lobbyName);

    expect(result).toBeTruthy();
  });

  test('Deleting a non-existing lobby should return false', async () => {
    const lobbyName = generateString(8);
    const result = await deleteLobby(lobbyName);

    expect(result).toBeFalsy();
  });

  test('Adding player to a existing lobby should return true', async () => {
    const lobbyName = generateString(8);
    const playerName1 = generateString(4);
    const playerName2 = generateString(4);

    await createLobby(lobbyName, playerName1);
    const results = await addPlayerToLobby(lobbyName, playerName2);

    expect(results).toBeTruthy();
  });

  test('Adding a player to a lobby they are already in should return false', async () => {
    const lobbyName = generateString(8);
    const playerName = 'test';

    await createLobby(lobbyName, playerName);
    const results = await addPlayerToLobby(lobbyName, playerName);

    expect(results).toBeFalsy();
  });

  test('Adding a player to a full lobby (4) should return false', async () => {
    const lobbyName = generateString(8);
    const playerNames = [
      generateString(8),
      generateString(8),
      generateString(8),
      generateString(8),
      generateString(8),
      generateString(8),
      generateString(8),
      generateString(8),
      generateString(8),
    ];

    await createLobby(lobbyName, playerNames[0]);
    playerNames.shift();

    // Add enough players to be full
    for (let i = 0; i < 3; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const result = await addPlayerToLobby(lobbyName, playerNames[i]);
      expect(result).toBeTruthy();
    }

    await expect(
      addPlayerToLobby(lobbyName, playerNames[playerNames.length - 1]),
    ).rejects.toEqual(new Error('Full'));
  });

  test('Updating ready state of non existing player should return false', async () => {
    const lobbyName = generateString(8);
    const playerName1 = generateString(8);
    const playerName2 = generateString(8);

    await createLobby(lobbyName, playerName1);

    const result = await setPlayerReadyState(lobbyName, playerName2, true);
    expect(result).toBeFalsy();
  });

  test('Updating ready state of a player should return true', async () => {
    const lobbyName = generateString(8);
    const playerName = generateString(8);
    await createLobby(lobbyName, playerName);

    const result = await setPlayerReadyState(lobbyName, playerName, true);
    expect(result).toBeTruthy();
  });
});
