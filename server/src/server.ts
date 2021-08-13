import { createServer } from 'http';
import app from './services/app';
import { setUpSocket } from './services/socket';
import { setupRedis } from './services/redis';
import logger from './services/logger';

const { REDIS_HOST, REDIS_PORT, REDIS_URL } = process.env;

exports.startServer = async (IP: string, PORT: number) => {
  const httpServer = createServer(app);
  setUpSocket(httpServer);
  await setupRedis(
    REDIS_HOST,
    REDIS_PORT ? parseInt(REDIS_PORT, 10) : undefined,
    REDIS_URL,
  );

  httpServer.listen(PORT, IP, () => {
    logger.info(`Server running on ${IP}:${PORT}`);
  });
};
