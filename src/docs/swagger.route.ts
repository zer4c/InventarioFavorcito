import { Router } from 'express';
import { generateOpenAPIDocument } from '../config/swagger.config';
import SwaggerUI from 'swagger-ui-express';
import './api/products.docs';
import './api/order.docs';

import './responses.docs';

const router = Router();

router.get('/docs/swagger.json', (_req, res) => {
  res.json(generateOpenAPIDocument());
});

router.use(
  '/docs',
  SwaggerUI.serve,
  SwaggerUI.setup(undefined, {
    swaggerOptions: {
      url: '/docs/swagger.json',
    },
  }),
);

export default router;
