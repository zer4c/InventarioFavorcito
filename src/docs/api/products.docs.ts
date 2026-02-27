import { registry } from '../../config/swagger.config';
import {
  ProductCreate,
  ProductPatch,
  ProductResponse,
  ProductHistoryResponse,
} from '../../modules/product/product.schemas';
import { z } from 'zod';
import { ErrorResponseDoc } from '../responses.docs';
import ExampleErrorDoc from '../examples.docs';

registry.registerPath({
  method: 'get',
  path: '/product',
  summary: 'Obtener todos los productos',
  description: 'Retorna todos los productos que no han sido eliminados',
  tags: ['Product'],
  responses: {
    200: {
      description: 'Lista de productos obtenida',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.literal(true),
            detail: z.literal('products retrieved'),
            data: z.array(ProductResponse),
          }),
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
  path: '/product/{id}',
  summary: 'Obtener producto por ID',
  tags: ['Product'],
  request: {
    params: z.object({ id: z.string().openapi({ example: '1' }) }),
  },
  responses: {
    200: {
      description: 'Producto encontrado',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.literal(true),
            detail: z.literal('product retrieved'),
            data: ProductResponse,
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
  path: '/product',
  summary: 'Crear producto',
  description:
    'Crea un nuevo producto. No permite nombres repetidos, aunque esten eliminados, el stock se añade aparte en [inventory]',
  tags: ['Product'],
  request: {
    body: {
      content: { 'application/json': { schema: ProductCreate } },
      required: true,
    },
  },
  responses: {
    201: {
      description: 'Producto creado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.literal(true),
            detail: z.literal('product created'),
            data: ProductResponse,
          }),
        },
      },
    },
    400: {
      description: 'Nombre repetido o datos malformados',
      content: {
        'application/json': {
          schema: ErrorResponseDoc,
          example: {
            ok: false,
            detail: 'product name already exist',
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/product/{id}',
  summary: 'Actualizar producto',
  description:
    'Actualiza nombre y/o estado activo. Genera un historial de cambios.',
  tags: ['Product'],
  request: {
    params: z.object({ id: z.string().openapi({ example: '1' }) }),
    body: {
      content: { 'application/json': { schema: ProductPatch } },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'Producto actualizado',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.literal(true),
            detail: z.literal('product updated'),
            data: ProductResponse,
          }),
        },
      },
    },
    400: {
      description: 'campos inválidos o nombre duplicado',
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

registry.registerPath({
  method: 'delete',
  path: '/product/{id}',
  summary: 'Eliminar producto',
  description: 'Marca el producto como eliminado. Genera entrada en historial.',
  tags: ['Product'],
  request: {
    params: z.object({ id: z.string().openapi({ example: '1' }) }),
  },
  responses: {
    204: { description: 'Producto eliminado' },
    404: {
      description: 'Producto no encontrado o eliminado',
      content: {
        'application/json': {
          schema: ErrorResponseDoc,
          example: ExampleErrorDoc.ZodError,
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
  path: '/product/{id}/history',
  summary: 'Obtener historial de cambios del producto',
  description:
    'Retorna el producto con todos sus cambios históricos, desde su creacion, tambien si fue eliminado.',
  tags: ['Product'],
  request: {
    params: z.object({ id: z.string().openapi({ example: '1' }) }),
  },
  responses: {
    200: {
      description: 'Historial obtenido',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.literal(true),
            detail: z.literal('changes history retrieved'),
            data: ProductHistoryResponse,
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
