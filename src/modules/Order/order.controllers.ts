import { Request, Response, NextFunction } from 'express';
import OrderService from './order.services';
import inventoryServices from '../inventory/inventory.services';
import { InventoryCreate } from '../inventory/inventory.schemas';

async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await OrderService.getById(+req.params.id);
    return res.status(200).send({
      detail: 'Order Retrieved',
      ok: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

async function createOrder(req: Request, res: Response, next: NextFunction) {
  const queryRunner = res.locals.queryRunner;
  try {
    const order = await OrderService.createOrder(queryRunner, req.body);
    const inventory = InventoryCreate.parse({ stock: req.body.stockRequired });
    await inventoryServices.changeStock(
      queryRunner,
      req.body.productId,
      inventory,
    );
    await inventoryServices.addHistoryStock(
      queryRunner,
      req.body.productId,
      req.body.stockRequired,
      order.id,
    );
    const orderSuccess = await OrderService.confirmOrder(queryRunner, order.id);
    return res.status(200).send({
      detail: 'Order Created',
      ok: true,
      data: orderSuccess,
    });
  } catch (error) {
    // TODO: const orderFailed = await OrderService.rejectOrder(queryRunner);
    next(error);
  }
}

export default {
  getById,
  createOrder,
};
