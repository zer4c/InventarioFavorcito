import express from 'express';
import bodyParser from 'body-parser';
import appRoutes from './server.routes';
const app = express();
app.use(bodyParser.json());
app.use(appRoutes);

export default app;
