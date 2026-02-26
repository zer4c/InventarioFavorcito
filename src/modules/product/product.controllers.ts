import { NextFunction, Request, Response } from 'express';
import { QueryRunner } from 'typeorm';
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
    const queryRunner = res.locals.queryRunner as QueryRunner;
    const product = await ProductService.createProduct(queryRunner, req.body);
    return res.status(201).send({
      detail: 'product created',
      ok: true,
      data: product,
    });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).send({
        detail: 'product name already exist',
        ok: false,
      });
    }
    next(error);
  }
}

async function patchProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const queryRunner = res.locals.queryRunner as QueryRunner;
    const product = await ProductService.patchProduct(
      queryRunner,
      +req.params.id,
      req.body,
    );
    return res.status(200).send({
      detail: 'product updated',
      ok: true,
      data: product,
    });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).send({
        detail: 'product name already exist',
        ok: false,
      });
    }
    next(error);
  }
}

async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const queryRunner = res.locals.queryRunner as QueryRunner;
    await ProductService.deleteProduct(queryRunner, +req.params.id);
    return res.status(204).send();
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
