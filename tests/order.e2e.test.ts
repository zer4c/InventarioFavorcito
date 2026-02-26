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

async function createOrder(payload: object) {
  return request(app).post('/order').send(payload);
}

function validOrderPayload(productId: number, stockRequired = 1) {
  return {
    clientName: 'cliente valido',
    address: 'calle falsa 123',
    stockRequired,
    productId,
  };
}

describe('GET /order/:id', () => {
  it('Debe retornar la orden correctamente por ID', async () => {
    const product = await createProduct('teclado');
    await createInventory(product.id, 10);

    const created = await createOrder(validOrderPayload(product.id, 2));
    const orderId = created.body.data.id;

    const res = await request(app).get(`/order/${orderId}`);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.detail).toBe('Order Retrieved');
    expect(res.body.data.id).toBe(orderId);
    expect(res.body.data.productId).toBe(product.id);
    expect(res.body.data).toHaveProperty('state');
    expect(res.body.data).toHaveProperty('clientName');
    expect(res.body.data).toHaveProperty('address');
    expect(res.body.data).toHaveProperty('stockRequired');
  });

  it('Debe retornar 404 si la orden no existe', async () => {
    const res = await request(app).get('/order/9999');

    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
    expect(res.body.detail).toBe('resource not found');
  });
});

describe('POST /order - Casos exitosos', () => {
  it('Debe crear una orden FINISHED cuando hay stock suficiente', async () => {
    const product = await createProduct('monitor');
    await createInventory(product.id, 10);

    const res = await createOrder(validOrderPayload(product.id, 3));

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.detail).toBe('Order Created');
    expect(res.body.data.state).toBe(OrderStatus.enum.FINISHED);
    expect(res.body.data.productId).toBe(product.id);
    expect(res.body.data.stockRequired).toBe(3);
  });

  it('Debe descontar el stock correctamente al crear una orden FINISHED', async () => {
    const product = await createProduct('auriculares');
    await createInventory(product.id, 10);

    await createOrder(validOrderPayload(product.id, 4));

    const inventoryRes = await request(app).get(
      `/product/${product.id}/inventory`,
    );
    expect(inventoryRes.body.data.stock).toBe(6);
  });

  it('Debe crear una orden usando exactamente todo el stock disponible', async () => {
    const product = await createProduct('mouse');
    await createInventory(product.id, 5);

    const res = await createOrder(validOrderPayload(product.id, 5));

    expect(res.status).toBe(201);
    expect(res.body.data.state).toBe(OrderStatus.enum.FINISHED);

    const inventoryRes = await request(app).get(
      `/product/${product.id}/inventory`,
    );
    expect(inventoryRes.body.data.stock).toBe(0);
  });

  it('Debe normalizar clientName y address a minúsculas y sin espacios', async () => {
    const product = await createProduct('webcam');
    await createInventory(product.id, 5);

    const res = await createOrder({
      clientName: '  JUAN PEREZ  ',
      address: '  AV. SIEMPRE VIVA  ',
      stockRequired: 1,
      productId: product.id,
    });

    expect(res.status).toBe(201);
    expect(res.body.data.clientName).toBe('juan perez');
    expect(res.body.data.address).toBe('av. siempre viva');
  });

  it('Debe registrar en historial de inventario con isOut=true al crear orden exitosa', async () => {
    const product = await createProduct('silla');
    await createInventory(product.id, 10);

    const orderRes = await createOrder(validOrderPayload(product.id, 3));
    const orderId = orderRes.body.data.id;

    const historyRes = await request(app).get(
      `/product/${product.id}/inventory/history`,
    );

    const outEntry = historyRes.body.data.find((h: any) => h.isOut === true);
    expect(outEntry).toBeDefined();
    expect(outEntry.orderId).toBe(orderId);
    expect(outEntry.stock).toBe(3);
  });
});

describe('POST /order - Control de stock negativo', () => {
  it('Debe crear una orden CANCELLED cuando el stock es insuficiente', async () => {
    const product = await createProduct('impresora');
    await createInventory(product.id, 2);

    const res = await createOrder(validOrderPayload(product.id, 10));

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.detail).toBe('Order created but rejected');
    expect(res.body.data.state).toBe(OrderStatus.enum.CANCELLED);
  });

  it('El stock NO debe cambiar cuando la orden es CANCELLED', async () => {
    const product = await createProduct('escaner');
    await createInventory(product.id, 3);

    await createOrder(validOrderPayload(product.id, 99));

    const inventoryRes = await request(app).get(
      `/product/${product.id}/inventory`,
    );
    expect(inventoryRes.body.data.stock).toBe(3);
  });

  it('Debe crear orden CANCELLED si el inventario tiene stock 0', async () => {
    const product = await createProduct('router');
    await createInventory(product.id, 0);

    const res = await createOrder(validOrderPayload(product.id, 1));

    expect(res.status).toBe(201);
    expect(res.body.data.state).toBe(OrderStatus.enum.CANCELLED);
  });

  it('No debe registrar movimiento isOut en historial cuando la orden es CANCELLED', async () => {
    const product = await createProduct('switch');
    await createInventory(product.id, 2);

    await createOrder(validOrderPayload(product.id, 50));

    const historyRes = await request(app).get(
      `/product/${product.id}/inventory/history`,
    );

    const outEntries = historyRes.body.data.filter(
      (h: any) => h.isOut === true,
    );
    expect(outEntries).toHaveLength(0);
  });

  it('Debe poder crear una orden exitosa después de una orden CANCELLED', async () => {
    const product = await createProduct('cable hdmi');
    await createInventory(product.id, 5);

    await createOrder(validOrderPayload(product.id, 99));

    const res = await createOrder(validOrderPayload(product.id, 3));

    expect(res.status).toBe(201);
    expect(res.body.data.state).toBe(OrderStatus.enum.FINISHED);

    const inventoryRes = await request(app).get(
      `/product/${product.id}/inventory`,
    );
    expect(inventoryRes.body.data.stock).toBe(2);
  });
});

describe('POST /order - Validaciones', () => {
  it('Debe retornar 400 si clientName tiene menos de 5 caracteres', async () => {
    const product = await createProduct('cable vga');
    const res = await createOrder({
      clientName: 'Ana',
      address: 'calle falsa 123',
      stockRequired: 1,
      productId: product.id,
    });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si address tiene menos de 5 caracteres', async () => {
    const product = await createProduct('cable dvi');
    const res = await createOrder({
      clientName: 'cliente valido',
      address: 'av',
      stockRequired: 1,
      productId: product.id,
    });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si stockRequired es 0 (min(1))', async () => {
    const product = await createProduct('disco duro');
    const res = await createOrder({
      ...validOrderPayload(product.id),
      stockRequired: 0,
    });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si stockRequired es negativo', async () => {
    const product = await createProduct('memoria ram');
    const res = await createOrder({
      ...validOrderPayload(product.id),
      stockRequired: -5,
    });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si stockRequired no es entero', async () => {
    const product = await createProduct('procesador');
    const res = await createOrder({
      ...validOrderPayload(product.id),
      stockRequired: 1.5,
    });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si el body está vacío', async () => {
    const res = await createOrder({});
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si se envían campos extra (strictObject)', async () => {
    const product = await createProduct('tarjeta grafica');
    const res = await createOrder({
      ...validOrderPayload(product.id),
      state: OrderStatus.enum.FINISHED,
    });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si clientName supera 50 caracteres', async () => {
    const product = await createProduct('fuente poder');
    const res = await createOrder({
      ...validOrderPayload(product.id),
      clientName: 'a'.repeat(51),
    });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });
});
