import Server from './config/server.config';
import { SERVER_PORT } from './config/env.config';

async function startServer() {
  try {
    Server.listen(SERVER_PORT, () => {
      console.info(`server is running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    console.error('Error Staring Server', error);
  }
}

startServer();
