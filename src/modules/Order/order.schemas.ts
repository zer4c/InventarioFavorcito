import { z } from 'zod';
import { OrderStatus } from '../../core/enums';

const OrderBase = z.strictObject({
  clientName: z.string().trim().toLowerCase().min(5).max(50).openapi({
    example: 'Juan Pinto',
  }),
  address: z.string().trim().toLowerCase().min(5).max(50).openapi({
    example: 'av. america',
  }),
  stockRequired: z.int().min(1).openapi({
    example: 30,
  }),
  productId: z.int().min(0).openapi({
    example: 1,
  }),
});

export const OrderCreate = OrderBase.extend({}).openapi('OrderCreate');

export const OrderResponse = z
  .object({
    ...OrderCreate.shape,
    id: z.int().openapi({
      example: 1,
    }),
    state: OrderStatus.openapi({
      example: OrderStatus.enum.CANCELLED,
    }),
  })
  .openapi('OrderResponse');

export type OrderCreateType = z.infer<typeof OrderCreate>;
export type OrderResponseType = z.infer<typeof OrderResponse>;
