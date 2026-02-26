import { z } from 'zod';

const ProductBase = z.strictObject({
  name: z.string(),
});

export const ProductCreate = ProductBase.extend({});

export const ProductResponse = z.object({
  ...ProductCreate.shape,
  id: z.int(),
  isActive: z.boolean(),
  createdAt: z.date(),
});

export const ProductPatch = z
  .strictObject({
    name: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0);

export const HistoryProductBase = z.object({
  id: z.int(),
  nameChanged: z.boolean(),
  isActiveChanged: z.boolean(),
  isDeletedChanged: z.boolean(),
  createAt: z.date(),
});

export const ProductHistoryResponse = z.object({
  ...ProductResponse.shape,
  history: z.array(HistoryProductBase),
});

export type ProductCreateType = z.infer<typeof ProductCreate>;
export type ProductResponseType = z.infer<typeof ProductResponse>;
export type ProductPatchType = z.infer<typeof ProductPatch>;
