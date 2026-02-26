import { NextFunction, Request, Response } from 'express';
import { QueryRunner } from 'typeorm';
import InventoryService from './inventory.services';
import { isInstance } from 'class-validator';

async function changeStock(req: Request, res: Response, next: NextFunction) {
  try {
    const queryRunner = res.locals.queryRunner as QueryRunner;
    const InventoryStock = await InventoryService.changeStock(
      queryRunner,
      +req.params.id,
      req.body,
    );
    await InventoryService.addHistoryStock(
      queryRunner,
      +req.params.id,
      req.body.stock,
    );
    return res.status(201).send({
      detail: 'stock added',
      ok: true,
      data: InventoryStock,
    });
  } catch (error) {
    next(error);
  }
}

async function getByProductId(req: Request, res: Response, next: NextFunction) {
  try {
    const InventoryStock = await InventoryService.getByProductId(
      +req.params.id,
    );
    return res.status(200).send({
      detail: 'stock product retrieved',
      ok: true,
      data: InventoryStock,
    });
  } catch (error) {
    next(error);
  }
}

async function createInventory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const queryRunner = res.locals.queryRunner as QueryRunner;
    const InventoryStock = await InventoryService.createInventory(
      queryRunner,
      +req.params.id,
      req.body,
    );
    return res.status(201).send({
      detail: 'stock added',
      ok: true,
      data: InventoryStock,
    });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).send({
        detail: 'id product already exist',
        ok: false,
      });
    }
    next(error);
  }
}

export default {
  changeStock,
  getByProductId,
  createInventory,
};
