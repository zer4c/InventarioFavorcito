import { QueryRunner } from 'typeorm';
import { AppDataSource } from '../../config/database.config';
import { Order } from './order.entities';
import { OrderCreateType, OrderResponse } from './order.schemas';
import { OrderStatus } from '../../core/enums';

async function getById(id: number) {
  const order = await AppDataSource.getRepository(Order)
    .createQueryBuilder('order')
    .where('order.id = :id', { id })
    .getOneOrFail();
  return OrderResponse.parse(order);
}

async function createOrder(queryRunner: QueryRunner, order: OrderCreateType) {
  const newOrder = await queryRunner.manager.save(Order, {
    ...order,
    state: OrderStatus.enum.QUEUE,
  });
  await queryRunner.commitTransaction();
  return OrderResponse.parse(newOrder);
}

async function confirmOrder(queryRunner: QueryRunner, idOrder: number) {
  const order = await queryRunner.manager.save(Order, {
    id: idOrder,
    state: OrderStatus.enum.FINISHED,
  });
  return OrderResponse.parse(order);
}

async function rejectOrder(queryRunner: QueryRunner, idOrder: number) {
  queryRunner.rollbackTransaction();
  const order = await queryRunner.manager.save(Order, {
    id: idOrder,
    state: OrderStatus.enum.CANCELLED,
  });
  queryRunner.commitTransaction();
  return OrderResponse.parse(order);
}

export default {
  getById,
  createOrder,
  confirmOrder,
  rejectOrder,
};
