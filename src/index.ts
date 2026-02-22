import Server from './config/server.config';
import { sequelize } from './config/database.config';
import { SERVER_PORT } from './config/env.config';

async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database Connected');
  } catch (error) {
    console.error(error);
    setTimeout(connectDatabase, 5000);
  }
}

async function startServer() {
  try {
    await connectDatabase();

    Server.listen(SERVER_PORT, () => {
      console.info(`server is running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    console.error('Error Staring Server', error);
  }
}

startServer();
