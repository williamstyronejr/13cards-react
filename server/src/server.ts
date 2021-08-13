import { createServer } from "http";
import app from "./services/app";
import { setUpSocket, closeSocketServer } from "./services/socket";
import { setupRedis, closeRedis } from "./services/redis";
import logger from "./services/logger";

const { REDIS_HOST, REDIS_PORT } = process.env;

exports.startServer = async (IP: string, PORT: number) => {
  const httpServer = createServer(app);
  setUpSocket(httpServer);
  await setupRedis(REDIS_HOST, REDIS_PORT ? parseInt(REDIS_PORT) : undefined);

  httpServer.listen(PORT, IP, () => {
    logger.info(`Server running on ${IP}:${PORT}`);
  });
};
