import { z } from 'zod';

const CUserRole = {
  ADMIN: 'admin',
} as const;

const COrderStatus = {
  QUEUE: 'queue',
  FINISHED: 'finished',
  CANCELLED: 'cancelled',
} as const;

export const UserRole = z.enum(CUserRole);
export const OrderStatus = z.enum(COrderStatus);

export type UserRoleType = z.infer<typeof UserRole>;
export type OrderStatusType = z.infer<typeof OrderStatus>;
