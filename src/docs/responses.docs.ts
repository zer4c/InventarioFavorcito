import { z } from 'zod';

export const ErrorResponseDoc = z
  .object({
    ok: z.literal(false),
    detail: z.string(),
  })
  .openapi('ErrorResponse');
