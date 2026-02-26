import request from 'supertest';
import app from '../src/config/server.config';
import { OrderStatus } from '../src/core/enums';

async function createProduct(name: string) {
  const res = await request(app).post('/product').send({ name });
  return res.body.data as { id: number };
}

async function createInventory(productId: number, stock: number) {
  return request(app).post(`/product/${productId}/inventory`).send({ stock });
}

async function createOrder(productId: number, stockRequired: number) {
  return request(app).post('/order').send({
    clientName: 'cliente test',
    address: 'direccion test',
    stockRequired,
    productId,
  });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Concurrencia - POST /product', () => {
  it('Solo debe crearse uno cuando dos requests crean el mismo producto simultáneamente', async () => {
    const [res1, res2] = await Promise.all([
      request(app).post('/product').send({ name: 'producto-concurrente' }),
      request(app).post('/product').send({ name: 'producto-concurrente' }),
    ]);

    const statuses = [res1.status, res2.status].sort();

    expect(statuses).toEqual([201, 400]);

    const listRes = await request(app).get('/product');
    const matches = listRes.body.data.filter(
      (p: any) => p.name === 'producto-concurrente',
    );
    expect(matches).toHaveLength(1);
  });

  it('Debe crear correctamente N productos distintos en simultáneo', async () => {
    const requests = Array.from({ length: 5 }, (_, i) =>
      request(app)
        .post('/product')
        .send({ name: `producto-paralelo-${i}` }),
    );

    const results = await Promise.all(requests);

    results.forEach((res) => expect(res.status).toBe(201));

    const listRes = await request(app).get('/product');
    expect(listRes.body.data).toHaveLength(5);
  });
});

describe('Concurrencia - PATCH /product/:id/inventory', () => {
  it('Debe sumar correctamente el stock con múltiples PATCH simultáneos', async () => {
    const product = await createProduct('teclado-concurrente');
    await createInventory(product.id, 0);

    const patches = Array.from({ length: 5 }, () =>
      request(app)
        .patch(`/product/${product.id}/inventory`)
        .send({ stock: 10 }),
    );

    const results = await Promise.all(patches);

    results.forEach((res) => expect(res.status).toBe(201));

    const inventoryRes = await request(app).get(
      `/product/${product.id}/inventory`,
    );

    expect(inventoryRes.body.data.stock).toBe(50);
  });

  it('Debe registrar una entrada de historial por cada PATCH simultáneo', async () => {
    const product = await createProduct('monitor-concurrente');
    await createInventory(product.id, 0);

    const patches = Array.from({ length: 3 }, () =>
      request(app).patch(`/product/${product.id}/inventory`).send({ stock: 5 }),
    );

    await Promise.all(patches);

    const historyRes = await request(app).get(
      `/product/${product.id}/inventory/history`,
    );

    expect(historyRes.body.data).toHaveLength(4);
  });
});

describe('Concurrencia - POST /order', () => {
  it('Solo una orden debe ser FINISHED cuando el stock es exactamente 1 y hay dos órdenes simultáneas', async () => {
    const product = await createProduct('stock-uno');
    await createInventory(product.id, 1);

    const [res1, res2] = await Promise.all([
      createOrder(product.id, 1),
      createOrder(product.id, 1),
    ]);

    const states = [res1.body.data.state, res2.body.data.state].sort();

    expect(states).toEqual(
      [OrderStatus.enum.CANCELLED, OrderStatus.enum.FINISHED].sort(),
    );

    const inventoryRes = await request(app).get(
      `/product/${product.id}/inventory`,
    );
    expect(inventoryRes.body.data.stock).toBe(0);
  });

  it('El stock nunca debe quedar negativo con múltiples órdenes simultáneas', async () => {
    const product = await createProduct('stock-limitado');
    await createInventory(product.id, 5);

    const orders = Array.from({ length: 10 }, () => createOrder(product.id, 2));

    const results = await Promise.all(orders);

    results.forEach((res) => expect(res.status).toBe(201));

    const finished = results.filter(
      (r) => r.body.data.state === OrderStatus.enum.FINISHED,
    );
    const cancelled = results.filter(
      (r) => r.body.data.state === OrderStatus.enum.CANCELLED,
    );

    expect(finished).toHaveLength(2);
    expect(cancelled).toHaveLength(8);

    const inventoryRes = await request(app).get(
      `/product/${product.id}/inventory`,
    );
    expect(inventoryRes.body.data.stock).toBe(1);
  });

  it('Con delay escalonado, el stock debe ser consistente', async () => {
    const product = await createProduct('stock-delay');
    await createInventory(product.id, 10);

    const orders = Array.from({ length: 5 }, (_, i) =>
      delay(i * 50).then(() => createOrder(product.id, 2)),
    );

    const results = await Promise.all(orders);

    results.forEach((res) => expect(res.status).toBe(201));

    const inventoryRes = await request(app).get(
      `/product/${product.id}/inventory`,
    );

    const finished = results.filter(
      (r) => r.body.data.state === OrderStatus.enum.FINISHED,
    );
    expect(finished).toHaveLength(5);
    expect(inventoryRes.body.data.stock).toBe(0);
  });

  it('Mezcla de PATCH de stock y órdenes simultáneas no debe romper la consistencia', async () => {
    const product = await createProduct('stock-mixto');
    await createInventory(product.id, 5);

    const [ord1, ord2, ord3, patch1, patch2] = await Promise.all([
      createOrder(product.id, 2),
      createOrder(product.id, 2),
      createOrder(product.id, 2),
      request(app).patch(`/product/${product.id}/inventory`).send({ stock: 3 }),
      request(app).patch(`/product/${product.id}/inventory`).send({ stock: 3 }),
    ]);

    [ord1, ord2, ord3].forEach((res) => expect(res.status).toBe(201));
    [patch1, patch2].forEach((res) => expect(res.status).toBe(201));

    const inventoryRes = await request(app).get(
      `/product/${product.id}/inventory`,
    );
    expect(inventoryRes.body.data.stock).toBeGreaterThanOrEqual(0);
  });
});
