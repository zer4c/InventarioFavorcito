import { z } from 'zod';

const COrderStatus = {
  QUEUE: 'queue',
  FINISHED: 'finished',
  CANCELLED: 'cancelled',
} as const;

export const OrderStatus = z.enum(COrderStatus).openapi('OrderStatusEnum');

export type OrderStatusType = z.infer<typeof OrderStatus>;
