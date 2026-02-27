import { registry } from '../../config/swagger.config';
import { z } from 'zod';
import { OrderResponse } from '../../modules/Order/order.schemas';
import { ErrorResponseDoc } from '../responses.docs';
import ExampleErrorDoc from '../examples.docs';

registry.registerPath({
  method: 'get',
  path: '/order/{id}',
  summary: 'Obtener una Orden',
  tags: ['Order'],
  request: {
    params: z.object({ id: z.string().openapi({ example: '1' }) }),
  },
  responses: {
    200: {
      description: 'Orden obtenida',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.literal(true),
            detail: z.literal('Order Retrieved'),
            data: OrderResponse,
          }),
        },
      },
    },
    404: {
      description: 'Orden no encontrada',
      content: {
        'application/json': {
          schema: ErrorResponseDoc,
          example: ExampleErrorDoc.EntityNotFound,
        },
      },
    },

    500: {
      description: 'Error de servidor',
      content: {
        'application/json': {
          schema: ErrorResponseDoc,
          example: ExampleErrorDoc.ServerError,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/order/',
  summary: 'Crear una Orden',
  description:
    'Crear una orden, este entra en un estado inical de QUEUE (si no hay error antes), luego dependiendo del stock requerido, se termina cambiando a un estado \"FINISHED\" o \"CANCELLED\". En caso que sea \"FINISHED\" se guardara el registro de cambio de stock en InventoryHistory',
  tags: ['Order'],
  responses: {
    201: {
      description: 'Orden creada, solo cambia el estado',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.literal(true),
            detail: z.literal('Order created but rejected'),
            data: OrderResponse,
          }),
        },
      },
    },
    404: {
      description: 'Producto no encontrado',
      content: {
        'application/json': {
          schema: ErrorResponseDoc,
          example: ExampleErrorDoc.ServerError,
        },
      },
    },
    500: {
      description: 'Error de servidor',
      content: {
        'application/json': {
          schema: ErrorResponseDoc,
          example: ExampleErrorDoc.ServerError,
        },
      },
    },
  },
});
