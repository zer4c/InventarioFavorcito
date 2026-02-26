import { QueryRunner } from 'typeorm';
import { AppDataSource } from '../../config/database.config';
import { Product, ProductHistory } from './product.entities';
import {
  ProductCreateType,
  ProductPatchType,
  ProductResponse,
} from './product.schemas';

async function getById(id: number) {
  const product = await AppDataSource.getRepository(Product)
    .createQueryBuilder('product')
    .where('product.id = :id', { id })
    .andWhere('product.isDeleted = false')
    .getOneOrFail();
  return ProductResponse.parse(product);
}

async function getProducts() {
  const products = await AppDataSource.getRepository(Product)
    .createQueryBuilder('product')
    .where('product.isDeleted = false')
    .getMany();
  return products.map((product) => ProductResponse.parse(product));
}

async function createProduct(
  queryRunner: QueryRunner,
  product: ProductCreateType,
) {
  const newProduct = await queryRunner.manager.save(Product, product);
  return ProductResponse.parse(newProduct);
}

async function patchProduct(
  queryRunner: QueryRunner,
  id: number,
  product: ProductPatchType,
) {
  await queryRunner.manager.findOneByOrFail(Product, { id, isDeleted: false });

  const result = await queryRunner.manager
    .createQueryBuilder()
    .update(Product)
    .set(product)
    .where('id = :id', { id })
    .returning('*')
    .execute();

  await createProductHistory(queryRunner, id, product);
  return ProductResponse.parse(result.raw[0]);
}

async function deleteProduct(queryRunner: QueryRunner, id: number) {
  await queryRunner.manager.findOneByOrFail(Product, { id, isDeleted: false });

  await queryRunner.manager
    .createQueryBuilder()
    .update(Product)
    .set({ isDeleted: true })
    .where('id = :id', { id })
    .execute();

  await createProductHistory(queryRunner, id);
}

async function createProductHistory(
  queryRunner: QueryRunner,
  id: number,
  product?: ProductPatchType,
) {
  const productHistory = new ProductHistory();
  if (!product) {
    productHistory.IsActiveChanged = false;
    productHistory.NameChanged = false;
    productHistory.isDeletedChange = true;
  } else {
    productHistory.IsActiveChanged = !!product.isActive;
    productHistory.NameChanged = !!product.name;
    productHistory.isDeletedChange = false;
  }
  productHistory.productId = id;
  await queryRunner.manager.save(ProductHistory, productHistory);
}

export default {
  getById,
  getProducts,
  createProduct,
  patchProduct,
  deleteProduct,
};
