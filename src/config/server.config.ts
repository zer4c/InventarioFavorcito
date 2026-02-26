import express from 'express';
import bodyParser from 'body-parser';
import appRoutes from './server.routes';
import { errorMiddleware } from '../middleware/errors.middleware';
const app = express();

app.use(bodyParser.json());
app.use(appRoutes);
app.use(errorMiddleware);

export default app;
