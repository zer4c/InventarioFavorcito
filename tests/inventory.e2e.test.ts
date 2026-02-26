import request from 'supertest';
import app from '../src/config/server.config';




async function createProduct(name: string) {
  const res = await request(app).post('/product').send({ name });
  return res.body.data as { id: number; name: string };
}

async function createInventory(productId: number, stock: number) {
  return request(app)
    .post(`/product/${productId}/inventory`)
    .send({ stock });
}

async function patchStock(productId: number, stock: number) {
  return request(app)
    .patch(`/product/${productId}/inventory`)
    .send({ stock });
}




describe('GET /product/:id/inventory', () => {
  it('Debe retornar el inventario de un producto existente', async () => {
    const product = await createProduct('teclado');
    await createInventory(product.id, 10);

    const res = await request(app).get(`/product/${product.id}/inventory`);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.detail).toBe('stock product retrieved');
    expect(res.body.data.productId).toBe(product.id);
    expect(res.body.data.stock).toBe(10);
    expect(res.body.data).toHaveProperty('id');
  });

  it('Debe retornar 404 si el producto no tiene inventario creado', async () => {
    const product = await createProduct('monitor');

    const res = await request(app).get(`/product/${product.id}/inventory`);

    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
    expect(res.body.detail).toBe('resource not found');
  });

  it('Debe retornar 404 si el productId no existe', async () => {
    const res = await request(app).get('/product/9999/inventory');

    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
  });
});




describe('GET /product/:id/inventory/history', () => {
  it('Debe retornar historial vacío si no hubo movimientos', async () => {
    const product = await createProduct('silla');

    const res = await request(app).get(`/product/${product.id}/inventory/history`);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.detail).toBe('inventory history retrieved');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });

  it('Debe registrar historial al crear inventario (POST)', async () => {
    const product = await createProduct('mesa');
    await createInventory(product.id, 20);

    const res = await request(app).get(`/product/${product.id}/inventory/history`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].stock).toBe(20);
    expect(res.body.data[0].isOut).toBe(false);
    expect(res.body.data[0].productId).toBe(product.id);
  });

  it('Debe registrar historial al agregar stock (PATCH)', async () => {
    const product = await createProduct('lampara');
    await createInventory(product.id, 5);
    await patchStock(product.id, 3);

    const res = await request(app).get(`/product/${product.id}/inventory/history`);

    expect(res.body.data).toHaveLength(2);
    
    expect(res.body.data[1].stock).toBe(3);
    expect(res.body.data[1].isOut).toBe(false);
  });

  it('Debe acumular múltiples entradas de historial', async () => {
    const product = await createProduct('monitor');
    await createInventory(product.id, 10);
    await patchStock(product.id, 5);
    await patchStock(product.id, 2);

    const res = await request(app).get(`/product/${product.id}/inventory/history`);

    expect(res.body.data).toHaveLength(3);
  });
});




describe('POST /product/:id/inventory', () => {
  it('Debe crear inventario correctamente con stock válido', async () => {
    const product = await createProduct('auriculares');

    const res = await createInventory(product.id, 15);

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.detail).toBe('stock added');
    expect(res.body.data.stock).toBe(15);
    expect(res.body.data.productId).toBe(product.id);
    expect(res.body.data).toHaveProperty('id');
  });

  it('Debe crear inventario con stock igual a 0', async () => {
    const product = await createProduct('cable');

    const res = await createInventory(product.id, 0);

    expect(res.status).toBe(201);
    expect(res.body.data.stock).toBe(0);
  });

  it('Debe retornar 400 si ya existe inventario para ese producto (unique constraint)', async () => {
    const product = await createProduct('mouse');
    await createInventory(product.id, 10);

    const res = await createInventory(product.id, 5);

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.detail).toBe('id product already exist');
  });

  it('Debe retornar 400 si el stock es negativo', async () => {
    const product = await createProduct('webcam');

    const res = await createInventory(product.id, -1);

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si el stock no es entero', async () => {
    const product = await createProduct('micrófono');

    const res = await createInventory(product.id, 5.5);

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si el body está vacío', async () => {
    const product = await createProduct('hub usb');

    const res = await request(app)
      .post(`/product/${product.id}/inventory`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si se envían campos extra (strictObject)', async () => {
    const product = await createProduct('adaptador');

    const res = await request(app)
      .post(`/product/${product.id}/inventory`)
      .send({ stock: 10, isOut: false });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 500 si el productId no existe en la tabla Product (FK violation)', async () => {
    const res = await createInventory(9999, 10);

    
    expect(res.status).toBe(500);
    expect(res.body.ok).toBe(false);
  });
});




describe('PATCH /product/:id/inventory', () => {
  it('Debe agregar stock correctamente', async () => {
    const product = await createProduct('teclado mecanico');
    await createInventory(product.id, 10);

    const res = await patchStock(product.id, 5);

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.detail).toBe('stock added');
    expect(res.body.data.stock).toBe(15); 
    expect(res.body.data.productId).toBe(product.id);
  });

  it('Debe acumular correctamente múltiples agregados de stock', async () => {
    const product = await createProduct('monitor curvo');
    await createInventory(product.id, 0);

    await patchStock(product.id, 10);
    await patchStock(product.id, 5);
    const res = await patchStock(product.id, 3);

    expect(res.body.data.stock).toBe(18); 
  });

  it('Debe retornar 400 si el stock es 0 (min(1) en InventoryPatch)', async () => {
    const product = await createProduct('silla ergonomica');
    await createInventory(product.id, 10);

    const res = await patchStock(product.id, 0);

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si el stock es negativo', async () => {
    const product = await createProduct('escritorio');
    await createInventory(product.id, 10);

    const res = await patchStock(product.id, -5);

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si el stock no es entero', async () => {
    const product = await createProduct('repisa');
    await createInventory(product.id, 10);

    const res = await patchStock(product.id, 2.5);

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si el body está vacío', async () => {
    const product = await createProduct('cajon');
    await createInventory(product.id, 10);

    const res = await request(app)
      .patch(`/product/${product.id}/inventory`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 404 si el producto no tiene inventario creado', async () => {
    const product = await createProduct('producto sin stock');

    const res = await patchStock(product.id, 5);

    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
    expect(res.body.detail).toBe('resource not found');
  });

  it('Debe retornar 404 si el productId no existe', async () => {
    const res = await patchStock(9999, 5);

    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
  });
});
