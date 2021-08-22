import { Server, Socket } from 'socket.io';
import logger from './logger';

let io: Server | null;

/**
 * Initializes socket server can sets up event handlers.
 * @param {Object} httpServer Http server to attach socket server to
 */
export function setUpSocket(httpServer: Object) {
  io = new Server(httpServer);
  logger.info('Socket server initialized');

  io.on('connection', (client) => {});
}

/**
 * Closes socket server.
 */
export function closeSocketServer() {
  if (io) io.close();
}
