import { Request, Response, NextFunction } from 'express';
import OrderService from './order.services';

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
  try {
    const queryRunner = res.locals.queryRunner;
    const order = await OrderService.getById(
      queryRunner,
      +req.params.id,
      req.body,
    );
    return res.status(200).send({
      detail: 'Order Created',
      ok: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getById,
  createOrder,
};
