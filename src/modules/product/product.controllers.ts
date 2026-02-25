import { NextFunction, Request, Response } from 'express';
import ProductService from './product.services';

async function getAll(_req: Request, res: Response, next: NextFunction) {
  try {
    const products = await ProductService.getProducts();
    return res.status(200).send({
      detail: 'products retrieved',
      ok: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await ProductService.getById(+req.params.id);
    return res.status(200).send({
      detail: 'product retrieved',
      ok: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const bodyData = req.body;
    const product = await ProductService.createProduct(bodyData);

    return res.status(201).send({
      detail: 'product created',
      ok: true,
      data: product,
    });
  } catch (error) {
    // TODO: console
    console.error(error);
    next(error);
  }
}

async function patchProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const prodId = +req.params.id;
    const bodyData = req.body;
    const product = await ProductService.patchProduct(prodId, bodyData);

    return res.status(200).send({
      detail: 'product updated',
      ok: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const prodId = +req.params.id;
    await ProductService.deleteProduct(prodId);
    return res.status(204)
  } catch (error) {
    next(error);
  }
}

export default {
  getAll,
  getById,
  createProduct,
  patchProduct,
  deleteProduct,
};
