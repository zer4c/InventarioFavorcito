import { z } from 'zod';
import { OrderStatus } from '../../core/enums';

const OrderBase = z.strictObject({
  clientName: z.string().trim().toLowerCase().min(5).max(50),
  address: z.string().trim().toLowerCase().min(5).max(50),
  stockRequired: z.int().min(1),
  userID: z.int().min(0),
});

export const OrderCreate = OrderBase.extend({
  state: OrderStatus.default('queue'),
});

export const OrderResponse = OrderCreate.extend({
  id: z.int()
});

export const OrderPatch = OrderCreate.partial();

export type OrderCreateType = z.infer<typeof OrderCreate>;
export type OrderResponseType = z.infer<typeof OrderResponse>;
export type OrderPatchType = z.infer<typeof OrderPatch>;
