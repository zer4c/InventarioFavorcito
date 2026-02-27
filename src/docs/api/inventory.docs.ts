import { registry } from '../../config/swagger.config';
import { z } from 'zod';
import ExampleErrorDoc from '../examples.docs';
import {
  InventoryCreate,
  InventoryHistoryResponse,
  InventoryPatch,
  InventoryResponse,
} from '../../modules/inventory/inventory.schemas';
import { ErrorResponseDoc } from '../responses.docs';

registry.registerPath({
  method: 'get',
  path: '/product/{id}/inventory',
  summary: 'Obtener Stock por ProductId',
  tags: ['inventory'],
  request: {
    params: z.object({ id: z.string().openapi({ example: '1' }) }),
  },
  responses: {
    200: {
      description: 'Stock encontrado',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.literal(true),
            detail: z.literal('stock product retrieved'),
            data: InventoryResponse,
          }),
        },
      },
    },
    404: {
      description: 'Producto no encontrado',
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
  method: 'get',
  path: '/product/{id}/inventory/history',
  summary: 'Obtener Todos lo movimientos de inventario de un producto',
  tags: ['inventory'],
  request: {
    params: z.object({ id: z.string().openapi({ example: '1' }) }),
  },
  responses: {
    200: {
      description: 'Registro de producto encontrado',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.literal(true),
            detail: z.literal('inventory history retrieved'),
            data: z.array(InventoryHistoryResponse),
          }),
        },
      },
    },
    404: {
      description: 'Producto no encontrado',
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
  path: '/product/{id}/inventory',
  summary: 'Crear Registro stock de un producto',
  description:
    'Al crear un stock de un producto tambien crea automaticamente el historial de entradas/salidas de un stock.',
  tags: ['inventory'],
  request: {
    params: z.object({ id: z.string().openapi({ example: '1' }) }),
    body: {
      content: {
        'application/json': { schema: InventoryCreate },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: 'stock añadido',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.literal(true),
            detail: z.literal('stock added'),
            data: InventoryResponse,
          }),
        },
      },
    },
    400: {
      description:
        'ya existe un registro inventario de un producto o nombres invalidos',
      content: {
        'application/json': {
          schema: z.object({
            detail: z.literal('id product already exist'),
            ok: z.literal(false),
          }),
        },
      },
    },
    404: {
      description: 'Producto no encontrado',
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
  method: 'patch',
  path: '/product/{id}/inventory',
  summary: 'añadir stock a un producto',
  description:
    'Esta ruta solo sirve para añadir stock a un producto, para quitar necesita crear un "order"',
  tags: ['inventory'],
  request: {
    params: z.object({ id: z.string().openapi({ example: '1' }) }),
    body: {
      content: { 'application/json': { schema: InventoryPatch } },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'Stock encontrado',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.literal(true),
            detail: z.literal('stock added'),
            data: InventoryResponse,
          }),
        },
      },
    },
    400: {
      description: 'campos inválidos',
      content: {
        'application/json': {
          schema: ErrorResponseDoc,
          example: ExampleErrorDoc.ZodError,
        },
      },
    },
    404: {
      description: 'Producto no encontrado',
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
