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
    .where('product.isDeleted = false')
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

async function createProduct(product: ProductCreateType) {
  const newProduct = await AppDataSource.getRepository(Product).save(product);
  return ProductResponse.parse(newProduct);
}

async function patchProduct(id: number, product: ProductPatchType) {
  await getById(id);
  const patchedProduct = await AppDataSource.getRepository(Product).save({
    id,
    ...product,
  });

  await createProductHistory(id, product);
  return ProductResponse.parse(patchedProduct);
}

async function deleteProduct(id: number) {
  await getById(id);
  await AppDataSource.createQueryBuilder()
    .update(Product)
    .set({ isDeleted: true })
    .where('id = :id ', { id })
    .execute();
  await createProductHistory(id);
}

async function createProductHistory(id: number, product?: ProductPatchType) {
  const productHistory = new ProductHistory();
  if (!product) {
    productHistory.IsActiveChanged = false;
    productHistory.NameChanged = false;
    productHistory.isDeletedChange = true;
  } else {
    productHistory.IsActiveChanged = !!product.isActive;
    productHistory.NameChanged = !!product.name;
  }
  productHistory.productId = id;

  await AppDataSource.getRepository(ProductHistory).save(productHistory);
}

export default {
  getById,
  getProducts,
  createProduct,
  patchProduct,
  deleteProduct,
};
