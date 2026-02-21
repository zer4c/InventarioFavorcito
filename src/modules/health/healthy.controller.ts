import { Request, Response } from 'express';

export function getHealthStatus(_req: Request, res: Response) {
  return res.status(200).json({
    health: 'estoy vivo',
    status: 200,
    message: 'ok',
  });
}
