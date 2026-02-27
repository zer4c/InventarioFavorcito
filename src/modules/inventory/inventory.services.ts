import { QueryRunner } from 'typeorm';
import { AppDataSource } from '../../config/database.config';
import { Inventory, InventoryHistory } from './inventory.entities';
import {
  InventoryCreateType,
  InventoryPatchType,
  InventoryResponse,
} from './inventory.schemas';

async function getByProductId(productId: number) {
  const inventory = await AppDataSource.getRepository(Inventory)
    .createQueryBuilder('inventory')
    .where('inventory.productId = :productId', { productId })
    .getOneOrFail();
  return InventoryResponse.parse(inventory);
}

async function changeStock(
  queryRunner: QueryRunner,
  productId: number,
  stock: number,
) {
  await queryRunner.manager.findOneByOrFail(Inventory, { productId });

  const result = await queryRunner.manager
    .createQueryBuilder()
    .update(Inventory)
    .set({ stock: () => `stock + :stock` })
    .where('productId = :productId', { productId })
    .andWhere(`stock + :stock >= 0`, { stock })
    .returning('*')
    .execute();

  if (result.affected === 0) {
    result.raw[0].stock = -1;
  }

  return InventoryResponse.parse(result.raw[0]);
}

async function createInventory(
  queryRunner: QueryRunner,
  productId: number,
  inventory: InventoryCreateType,
) {
  const newInventory = new Inventory();
  newInventory.stock = inventory.stock;
  newInventory.productId = productId;
  const result = await queryRunner.manager.save(newInventory);
  return InventoryResponse.parse(result);
}

async function addHistoryStock(
  queryRunner: QueryRunner,
  productId: number,
  stock: number,
  orderId?: number,
) {
  const newInventoryHistory = new InventoryHistory();
  newInventoryHistory.stock = stock;
  newInventoryHistory.productId = productId;
  if (orderId) {
    newInventoryHistory.orderId = orderId;
    newInventoryHistory.isOut = true;
  } else {
    newInventoryHistory.isOut = false;
  }
  await queryRunner.manager.save(InventoryHistory, newInventoryHistory);
}

async function getHistory(productId: number) {
  const history = await AppDataSource.getRepository(InventoryHistory)
    .createQueryBuilder('inventoryHistory')
    .where('inventoryHistory.productId = :id', { id: productId })
    .getMany();
  return history;
}

export default {
  getByProductId,
  changeStock,
  createInventory,
  addHistoryStock,
  getHistory,
};
