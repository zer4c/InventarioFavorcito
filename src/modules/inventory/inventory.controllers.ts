import { NextFunction, Request, Response } from 'express';
import { QueryRunner } from 'typeorm';
import InventoryService from './inventory.services';

async function addStock(req: Request, res: Response, next: NextFunction) {
  try {
    const queryRunner = res.locals.queryRunner as QueryRunner;
    const InventoryStock = InventoryService.addStock(
      queryRunner,
      +req.params.id,
      req.body,
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

async function getByIdProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const InventoryStock = InventoryService.getByIdProduct(+req.params.id);
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
    const InventoryStock = InventoryService.createInventory(
      queryRunner,
      +req.params.id,
      req.body,
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

export default {
  addStock,
  getByIdProduct,
  createInventory,
};
