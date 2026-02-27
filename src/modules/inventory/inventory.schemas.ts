import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const InventoryBase = z.strictObject({
  stock: z.int().min(0).openapi({
    example: 0,
  }),
});

export const InventoryCreate = InventoryBase.extend({}).openapi(
  'InventoryCreate',
);
export const InventoryResponse = z
  .object({
    ...InventoryCreate.shape,
    id: z.int().openapi({
      example: 1,
    }),
    productId: z.int().min(0).openapi({
      example: 1,
    }),
  })
  .openapi('InventoryResponse');

export const InventoryPatch = z
  .object({
    stock: z.int().min(1).openapi({
      example: 1,
    }),
  })
  .openapi('InventoryPatch');

export const InventoryHistoryResponse = z
  .object({
    id: z.int().min(0).openapi({
      example: 1,
    }),
    stock: z.int().min(0).openapi({
      example: 0,
    }),
    isOut: z.boolean().openapi({
      example: true,
    }),
    productId: z.int().openapi({
      example: 1,
    }),
    orderId: z.int().nullable().openapi({
      example: 1,
    }),
  })
  .transform((data) => {
    if (data.orderId === null) {
      const { orderId, ...rest } = data;
      return rest;
    }
    return data;
  })
  .openapi('InventoryHistoryResponse');

export type InventoryCreateType = z.infer<typeof InventoryCreate>;
export type InventoryResponseType = z.infer<typeof InventoryResponse>;
export type InventoryPatchType = z.infer<typeof InventoryPatch>;
export type InventoryHistoryResponseType = z.infer<
  typeof InventoryHistoryResponse
>;
