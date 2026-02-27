import request from 'supertest';
import app from '../src/config/server.config';

const BASE_URL = '/product';

async function createProduct(name: string) {
  return request(app).post(BASE_URL).send({ name });
}

describe('GET /product', () => {
  it('Debe retornar una lista vacía cuando no hay productos', async () => {
    const res = await request(app).get(BASE_URL);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.detail).toBe('products retrieved');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });

  it('Debe retornar la lista con los productos creados', async () => {
    await createProduct('teclado');
    await createProduct('monitor');

    const res = await request(app).get(BASE_URL);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it('No debe retornar productos eliminados (isDeleted: true)', async () => {
    const created = await createProduct('mouse');
    const id = created.body.data.id;

    await request(app).delete(`${BASE_URL}/${id}`);

    const res = await request(app).get(BASE_URL);
    expect(res.body.data).toHaveLength(0);
  });
});

describe('GET /product/:id', () => {
  it('Debe retornar el producto correcto por ID', async () => {
    const created = await createProduct('monitor');
    const id = created.body.data.id;

    const res = await request(app).get(`${BASE_URL}/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.detail).toBe('product retrieved');
    expect(res.body.data.id).toBe(id);
    expect(res.body.data.name).toBe('monitor');
    expect(res.body.data).toHaveProperty('isActive');
    expect(res.body.data).toHaveProperty('createdAt');

    expect(res.body.data).not.toHaveProperty('isDeleted');
  });

  it('Debe retornar 404 si el producto no existe', async () => {
    const res = await request(app).get(`${BASE_URL}/9999`);

    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
    expect(res.body.detail).toBe('resource not found');
  });

  it('Debe retornar 404 si el producto fue eliminado (soft delete)', async () => {
    const created = await createProduct('audifonos');
    const id = created.body.data.id;

    await request(app).delete(`${BASE_URL}/${id}`);

    const res = await request(app).get(`${BASE_URL}/${id}`);
    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
  });
});

describe('GET /product/:id/history', () => {
  it('Debe retornar el producto con historial vacío si no fue modificado', async () => {
    const created = await createProduct('silla');
    const id = created.body.data.id;

    const res = await request(app).get(`${BASE_URL}/${id}/history`);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.detail).toBe('changes history retrieved');
    expect(res.body.data.id).toBe(id);
    expect(Array.isArray(res.body.data.history)).toBe(true);
    expect(res.body.data.history).toHaveLength(0);
  });

  it('Debe registrar historial al hacer PATCH (nombre cambiado)', async () => {
    const created = await createProduct('silla');
    const id = created.body.data.id;

    await request(app).patch(`${BASE_URL}/${id}`).send({ name: 'silla gamer' });

    const res = await request(app).get(`${BASE_URL}/${id}/history`);

    expect(res.status).toBe(200);
    expect(res.body.data.history).toHaveLength(1);
    expect(res.body.data.history[0].nameChanged).toBe(true);
    expect(res.body.data.history[0].isActiveChanged).toBe(false);
    expect(res.body.data.history[0].isDeletedChanged).toBe(false);
  });

  it('Debe registrar historial al hacer PATCH (isActive cambiado)', async () => {
    const created = await createProduct('lampara');
    const id = created.body.data.id;

    await request(app).patch(`${BASE_URL}/${id}`).send({ isActive: false });

    const res = await request(app).get(`${BASE_URL}/${id}/history`);

    expect(res.body.data.history).toHaveLength(1);
    expect(res.body.data.history[0].isActiveChanged).toBe(true);
    expect(res.body.data.history[0].nameChanged).toBe(false);
  });

  it('Debe registrar historial al hacer DELETE (isDeleted cambiado)', async () => {
    const created = await createProduct('escritorio');
    const id = created.body.data.id;

    await request(app).delete(`${BASE_URL}/${id}`);

    const res = await request(app).get(`${BASE_URL}/${id}/history`);

    expect(res.status).toBe(200);
    expect(res.body.data.history).toHaveLength(1);
    expect(res.body.data.history[0].isDeletedChanged).toBe(true);
    expect(res.body.data.history[0].nameChanged).toBe(false);
    expect(res.body.data.history[0].isActiveChanged).toBe(false);
  });

  it('Debe retornar 404 si el producto no existe', async () => {
    const res = await request(app).get(`${BASE_URL}/9999/history`);

    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
  });

  it('Debe acumular múltiples entradas en el historial', async () => {
    const created = await createProduct('mesa');
    const id = created.body.data.id;

    await request(app)
      .patch(`${BASE_URL}/${id}`)
      .send({ name: 'mesa de vidrio' });
    await request(app).patch(`${BASE_URL}/${id}`).send({ isActive: false });

    const res = await request(app).get(`${BASE_URL}/${id}/history`);

    expect(res.body.data.history).toHaveLength(2);
  });
});

describe('POST /product', () => {
  it('Debe crear un producto correctamente', async () => {
    const res = await createProduct('teclado');

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.detail).toBe('product created');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.name).toBe('teclado');
    expect(res.body.data.isActive).toBe(true);
    expect(res.body.data).toHaveProperty('createdAt');
  });

  it('Debe normalizar el nombre a minúsculas y sin espacios extremos', async () => {
    const res = await createProduct('  MONITOR  ');

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('monitor');
  });

  it('Debe retornar 400 si el nombre ya existe (unique constraint)', async () => {
    await createProduct('mouse');
    const res = await createProduct('mouse');

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.detail).toBe('product name already exist');
  });

  it('Debe retornar 400 si el body está vacío', async () => {
    const res = await request(app).post(BASE_URL).send({});

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si el nombre es un string vacío', async () => {
    const res = await createProduct('');

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si el nombre es solo espacios (validación trim + min(1))', async () => {
    const res = await createProduct('   ');

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si se envían campos no permitidos (strictObject)', async () => {
    const res = await request(app)
      .post(BASE_URL)
      .send({ name: 'valido', isActive: true });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si el nombre no es un string', async () => {
    const res = await request(app).post(BASE_URL).send({ name: 123 });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });
});

describe('PATCH /product/:id', () => {
  it('Debe actualizar el nombre del producto', async () => {
    const created = await createProduct('teclado viejo');
    const id = created.body.data.id;

    const res = await request(app)
      .patch(`${BASE_URL}/${id}`)
      .send({ name: 'teclado nuevo' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.detail).toBe('product updated');
    expect(res.body.data.name).toBe('teclado nuevo');
    expect(res.body.data.id).toBe(id);
  });

  it('Debe actualizar el campo isActive del producto', async () => {
    const created = await createProduct('lampara');
    const id = created.body.data.id;

    const res = await request(app)
      .patch(`${BASE_URL}/${id}`)
      .send({ isActive: false });

    expect(res.status).toBe(200);
    expect(res.body.data.isActive).toBe(false);
  });

  it('Debe retornar 404 si el producto no existe', async () => {
    const res = await request(app)
      .patch(`${BASE_URL}/9999`)
      .send({ name: 'fantasma' });

    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
    expect(res.body.detail).toBe('resource not found');
  });

  it('Debe retornar 400 si el body está vacío (refine: al menos un campo)', async () => {
    const created = await createProduct('silla');
    const id = created.body.data.id;

    const res = await request(app).patch(`${BASE_URL}/${id}`).send({});

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 400 si el nombre actualizado ya existe en otro producto', async () => {
    await createProduct('producto-a');
    const b = await createProduct('producto-b');
    const idB = b.body.data.id;

    const res = await request(app)
      .patch(`${BASE_URL}/${idB}`)
      .send({ name: 'producto-a' });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.detail).toBe('product name already exist');
  });

  it('Debe retornar 400 si se envían campos no permitidos (strictObject)', async () => {
    const created = await createProduct('escritorio');
    const id = created.body.data.id;

    const res = await request(app)
      .patch(`${BASE_URL}/${id}`)
      .send({ name: 'valido', isDeleted: false });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('Debe retornar 404 si el producto fue eliminado previamente', async () => {
    const created = await createProduct('producto temporal');
    const id = created.body.data.id;

    await request(app).delete(`${BASE_URL}/${id}`);

    const res = await request(app)
      .patch(`${BASE_URL}/${id}`)
      .send({ name: 'nuevo nombre' });

    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
  });
});

describe('DELETE /product/:id', () => {
  it('Debe eliminar (soft delete) el producto correctamente', async () => {
    const created = await createProduct('producto a eliminar');
    const id = created.body.data.id;

    const res = await request(app).delete(`${BASE_URL}/${id}`);

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  it('El producto eliminado no debe aparecer en GET /product', async () => {
    const created = await createProduct('producto efimero');
    const id = created.body.data.id;

    await request(app).delete(`${BASE_URL}/${id}`);

    const res = await request(app).get(BASE_URL);
    const ids = res.body.data.map((p: any) => p.id);

    expect(ids).not.toContain(id);
  });

  it('Debe retornar 404 si el producto no existe', async () => {
    const res = await request(app).delete(`${BASE_URL}/9999`);

    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
    expect(res.body.detail).toBe('resource not found');
  });

  it('Debe retornar 404 si se intenta eliminar un producto ya eliminado', async () => {
    const created = await createProduct('producto doble delete');
    const id = created.body.data.id;

    await request(app).delete(`${BASE_URL}/${id}`);
    const res = await request(app).delete(`${BASE_URL}/${id}`);

    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
  });
});
