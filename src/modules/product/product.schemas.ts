import { number, z } from 'zod';

const ProductBase = z.strictObject({
  name: z.string(),
});

export const ProductCreate = ProductBase.extend({
  isActive: z.boolean(),
});

export const ProductResponse = ProductCreate.extend({
  id: z.number(),
  createdAt: z.date(),
});

export const ProductPatch = ProductCreate.partial();

export type ProductCreateType = z.infer<typeof ProductCreate>;
export type ProductResponseType = z.infer<typeof ProductResponse>;
export type ProductPatchType = z.infer<typeof ProductPatch>;
