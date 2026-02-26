import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database.config';

export async function withTransaction(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const queryRunner = await createQueryRunner();
  res.locals.queryRunner = queryRunner;

  const cleanup = async () => {
    try {
      if (!queryRunner.isReleased) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          await queryRunner.commitTransaction();
        } else {
          await queryRunner.rollbackTransaction();
        }
        await queryRunner.release();
      }
    } catch (error) {
      if (!queryRunner.isReleased) {
        try {
          await queryRunner.release();
        } catch (_) {}
      }
    }
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

async function createQueryRunner() {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  return queryRunner;
}
