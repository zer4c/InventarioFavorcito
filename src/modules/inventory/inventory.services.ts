import { QueryRunner } from 'typeorm';
import { AppDataSource } from '../../config/database.config';
import { Inventory, InventoryHistory } from './inventory.entities';
import { InventoryCreateType, InventoryResponse } from './inventory.schemas';

async function getByIdProduct(idProduct: number) {
  const inventory = await AppDataSource.getRepository(Inventory)
    .createQueryBuilder('inventory')
    .where('inventory.productId = :id', { idProduct })
    .getOneOrFail();
  return InventoryResponse.parse(inventory);
}

async function addStock(
  queryRunner: QueryRunner,
  idProduct: number,
  inventory: InventoryCreateType,
) {
  const oldInventory = await queryRunner.manager.findOneByOrFail(Inventory, {
    productId: idProduct,
  });
  oldInventory.stock = oldInventory.stock + inventory.stock;
  const inventoryUpdated = await queryRunner.manager.save(oldInventory);
  await addHistoryStock(queryRunner, idProduct, inventory.stock);
  return InventoryResponse.parse(inventoryUpdated);
}

async function createInventory(
  queryRunner: QueryRunner,
  idProduct: number,
  inventory: InventoryCreateType,
) {
  const newInventory = new Inventory();
  newInventory.stock = inventory.stock;
  newInventory.productId = idProduct;
  const result = await queryRunner.manager.save(newInventory);
  await addHistoryStock(queryRunner, idProduct, inventory.stock);
  return InventoryResponse.parse(result);
}

async function addHistoryStock(
  queryRunner: QueryRunner,
  idProduct: number,
  stock: number,
  orderId?: number,
) {
  const newInventoryHistory = new InventoryHistory();
  newInventoryHistory.stock = stock;
  newInventoryHistory.productId = idProduct;
  if (orderId) {
    newInventoryHistory.orderId = orderId;
    newInventoryHistory.isOut = true;
  } else {
    newInventoryHistory.isOut = false;
  }
  await queryRunner.manager.save(InventoryHistory, newInventoryHistory);
}

export default {
  getByIdProduct,
  addStock,
  createInventory,
};
