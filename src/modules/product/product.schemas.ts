import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const ProductBase = z.strictObject({
  name: z.string().trim().toLowerCase().min(1).openapi({
    example: 'Coca Cola',
  }),
});

export const ProductCreate = ProductBase.extend({}).openapi('ProductCreate');

export const ProductResponse = z
  .object({
    ...ProductCreate.shape,
    id: z.int().openapi({
      example: 1,
    }),
    isActive: z.boolean().openapi({
      example: false,
    }),
    createdAt: z.date().openapi({
      example: '2026-02-28T00:00:00.000Z',
    }),
  })
  .openapi('ProductResponse');

export const ProductPatch = z
  .strictObject({
    name: z.string().trim().toLowerCase().min(1).optional().openapi({
      example: 'Fanta',
    }),
    isActive: z.boolean().optional().openapi({
      example: true,
    }),
  })
  .refine((data) => Object.keys(data).length > 0)
  .openapi('ProductPatch');

export const HistoryProductBase = z
  .object({
    id: z.int().openapi({
      example: 1,
    }),
    nameChanged: z.boolean().openapi({
      example: false,
    }),
    isActiveChanged: z.boolean().openapi({
      example: true,
    }),
    isDeletedChanged: z.boolean().openapi({
      example: false,
    }),
    createAt: z.date().openapi({
      example: '2026-02-28T00:00:00.000Z',
    }),
  })
  .openapi('HistoryProductBase');

export const ProductHistoryResponse = z
  .object({
    ...ProductResponse.shape,
    history: z.array(HistoryProductBase),
  })
  .openapi('ProductHistoryResponse');

export type ProductCreateType = z.infer<typeof ProductCreate>;
export type ProductResponseType = z.infer<typeof ProductResponse>;
export type ProductPatchType = z.infer<typeof ProductPatch>;
