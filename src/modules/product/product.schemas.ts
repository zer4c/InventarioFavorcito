import { z } from 'zod';

const ProductBase = z.strictObject({
  name: z.string(),
});

export const ProductCreate = ProductBase.extend({
  isActive: z.boolean().default(true),
});

export const ProductResponse = z.object({
  ...ProductCreate.shape,
  id: z.int(),
  createdAt: z.date(),
});

export const ProductPatch = ProductCreate.partial().refine(
  (data) => Object.keys(data).length > 0
);

export type ProductCreateType = z.infer<typeof ProductCreate>;
export type ProductResponseType = z.infer<typeof ProductResponse>;
export type ProductPatchType = z.infer<typeof ProductPatch>;

