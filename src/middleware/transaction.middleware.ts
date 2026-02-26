import { Request, Response, NextFunction } from 'express';
import { createQueryRunner } from '../config/database.config';

export async function withTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const queryRunner = await createQueryRunner();
  res.locals.queryRunner = queryRunner;

  const cleanup = async () => {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      await queryRunner.commitTransaction();
    } else {
      await queryRunner.rollbackTransaction();
    }
    await queryRunner.release();
  };

  res.on('finish', cleanup);

  res.on('close', async () => {
    if (!res.writableFinished) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
    }
  });

  next();
}
