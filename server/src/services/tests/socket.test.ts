import { createServer } from 'http';
import { io } from 'socket.io-client';
import { setUpSocket, closeSocketServer } from '../socket';

const { IP, PORT } = process.env;
const server = createServer();

beforeAll((done) => {
  setUpSocket(server);
  server.listen(PORT ? +PORT : undefined, IP, () => {
    done();
  });
});

afterAll((done) => {
  closeSocketServer();
  server.close(done());
});

describe('Connecting to socket', () => {
  test('Sucessfully connects to server', (done) => {
    const clientSocket = io(`http://${IP}:${PORT}`, {
      transports: ['websocket'],
    });

    clientSocket.on('connect', () => {
      clientSocket.disconnect();
      done();
    });
  });
});
