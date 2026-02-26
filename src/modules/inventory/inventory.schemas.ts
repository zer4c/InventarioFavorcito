import { z } from 'zod';

const InventoryBase = z.strictObject({
  stock: z.int().min(0),
});

export const InventoryCreate = InventoryBase.extend({});
export const InventoryResponse = z.object({
  ...InventoryCreate.shape,
  id: z.int(),
  productId: z.int().min(0),
});

export const InventoryPatch = z.object({
  stock: z.int().min(1),
});

export type InventoryCreateType = z.infer<typeof InventoryCreate>;
export type InventoryResponseType = z.infer<typeof InventoryResponse>;
export type InventoryPatchType = z.infer<typeof InventoryPatch>;
