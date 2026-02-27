import { z } from 'zod';

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

export type InventoryCreateType = z.infer<typeof InventoryCreate>;
export type InventoryResponseType = z.infer<typeof InventoryResponse>;
export type InventoryPatchType = z.infer<typeof InventoryPatch>;
