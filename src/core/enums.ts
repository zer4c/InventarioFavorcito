import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const COrderStatus = {
  QUEUE: 'queue',
  FINISHED: 'finished',
  CANCELLED: 'cancelled',
} as const;

export const OrderStatus = z.enum(COrderStatus).openapi('OrderStatusEnum');

export type OrderStatusType = z.infer<typeof OrderStatus>;
