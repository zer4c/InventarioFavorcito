import { z } from 'zod';
import { OrderStatus } from '../../core/enums';

const OrderBase = z.strictObject({
  clientName: z.string().trim().toLowerCase().min(5).max(50),
  address: z.string().trim().toLowerCase().min(5).max(50),
  stockRequired: z.int().min(1),
  productId: z.int().min(0),
});

export const OrderCreate = OrderBase.extend({});

export const OrderResponse = z.object({
  ...OrderCreate.shape,
  id: z.int(),
  state: OrderStatus,
});

export type OrderCreateType = z.infer<typeof OrderCreate>;
export type OrderResponseType = z.infer<typeof OrderResponse>;
