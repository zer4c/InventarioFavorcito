import express from 'express';
import bodyParser from 'body-parser';
import docRoutes from '../docs/swagger.route';
import appRoutes from './server.routes';
import { errorMiddleware } from '../middleware/errors.middleware';

const app = express();
app.use(bodyParser.json());
app.use(docRoutes);
app.use(appRoutes);
app.use(errorMiddleware);

export default app;
