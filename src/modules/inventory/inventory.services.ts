import { QueryRunner } from 'typeorm';
import { AppDataSource } from '../../config/database.config';
import { Inventory, InventoryHistory } from './inventory.entities';
import { InventoryCreateType, InventoryResponse } from './inventory.schemas';

async function getByProductId(productId: number) {
  const inventory = await AppDataSource.getRepository(Inventory)
    .createQueryBuilder('inventory')
    .where('inventory.productId = :productId', {productId })
    .getOneOrFail();
  return InventoryResponse.parse(inventory);
}

async function changeStock(
  queryRunner: QueryRunner,
  productId: number,
  inventory: InventoryCreateType,
) {
  const oldInventory = await queryRunner.manager.findOneByOrFail(Inventory, {
    productId: productId,
  });
  oldInventory.stock = oldInventory.stock + inventory.stock;
  const inventoryUpdated = await queryRunner.manager.save(oldInventory);
  return InventoryResponse.parse(inventoryUpdated);
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
  await addHistoryStock(queryRunner, productId, inventory.stock);
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

export default {
  getByProductId,
  changeStock,
  createInventory,
  addHistoryStock
};
