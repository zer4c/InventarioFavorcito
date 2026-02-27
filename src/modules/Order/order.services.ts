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
  return OrderResponse.parse(newOrder);
}

async function confirmOrder(queryRunner: QueryRunner, idOrder: number) {
  const result = await queryRunner.manager
    .createQueryBuilder()
    .update(Order)
    .set({ state: OrderStatus.enum.FINISHED })
    .where('id = :id', { id: idOrder })
    .returning('*')
    .execute();
  return OrderResponse.parse(result.raw[0]);
}

async function rejectOrder(queryRunner: QueryRunner, idOrder: number) {
  const result = await queryRunner.manager
    .createQueryBuilder()
    .update(Order)
    .set({ state: OrderStatus.enum.CANCELLED })
    .where('id = :id', { id: idOrder })
    .returning('*')
    .execute();
  return OrderResponse.parse(result.raw[0]);
}

export default {
  getById,
  createOrder,
  confirmOrder,
  rejectOrder,
};
