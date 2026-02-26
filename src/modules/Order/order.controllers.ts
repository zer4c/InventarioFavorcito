import { Request, Response, NextFunction } from 'express';
import OrderService from './order.services';
import inventoryServices from '../inventory/inventory.services';
import { OrderResponseType } from './order.schemas';
import { QueryRunner } from 'typeorm';

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
  const queryRunner = res.locals.queryRunner as QueryRunner;
  let order: OrderResponseType | undefined;

  try {
    order = await OrderService.createOrder(queryRunner, req.body);

    await queryRunner.query('SAVEPOINT after_order');

    try {
      const stock = req.body.stockRequired * -1;
      await inventoryServices.changeStock(
        queryRunner,
        req.body.productId,
        stock,
      );
      await inventoryServices.addHistoryStock(
        queryRunner,
        req.body.productId,
        req.body.stockRequired,
        order.id,
      );

      const orderSuccess = await OrderService.confirmOrder(
        queryRunner,
        order.id,
      );

      await queryRunner.query('RELEASE SAVEPOINT after_order');

      return res.status(201).send({
        detail: 'Order Created',
        ok: true,
        data: orderSuccess,
      });
    } catch (errorBeetwen) {
      await queryRunner.query('ROLLBACK TO SAVEPOINT after_order');

      const orderFailed = await OrderService.rejectOrder(queryRunner, order.id);

      return res.status(201).send({
        detail: 'Order created but rejected',
        ok: true,
        data: orderFailed,
      });
    }
  } catch (error) {
    next(error);
  }
}

export default {
  getById,
  createOrder,
};
