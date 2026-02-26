import { z } from 'zod';

const InventoryBase = z.strictObject({
  stock: z.int().min(0),
  productId: z.int().min(0),
});

export const InventoryCreate = InventoryBase.extend({});
export const InventoryResponse = InventoryCreate.extend({
  id: z.int(),
});

export const InventoryPatch = InventoryCreate.partial().refine(
  (data) => Object.keys(data).length > 0,
);

export type InventoryCreateType = z.infer<typeof InventoryCreate>;
export type InventoryResponseType = z.infer<typeof InventoryResponse>;
export type InventoryPatchType = z.infer<typeof InventoryPatch>;

const InventoryHistoryCreate = InventoryBase.extend({
  isOut: z.boolean(),
  OrderId: z.int().optional(),
});

const InventoryHistoryResponse = InventoryHistoryCreate.extend({
  id: z.int(),
});

export type InventoryHistoryCreateType = z.infer<typeof InventoryHistoryCreate>;
export type InventoryHistoryResponseType = z.infer<
  typeof InventoryHistoryResponse
>;
