import { Request, Response, NextFunction } from 'express';
import { EntityNotFoundError } from 'typeorm';

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof EntityNotFoundError) {
    return res.status(404).send({
      detail: 'resource not found',
      ok: false,
    });
  }
  return res.status(500).send({
    detail: 'internal server error',
    ok: false,
  });
}
