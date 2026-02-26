import {
  InventoryCreate,
  InventoryPatch,
  InventoryResponse,
} from './inventory.schemas';

describe('Caja Blanca - InventoryCreate Schema', () => {
  it('Debe aceptar stock igual a 0 (mínimo permitido)', () => {
    const result = InventoryCreate.safeParse({ stock: 0 });
    expect(result.success).toBe(true);
  });

  it('Debe aceptar stock positivo válido', () => {
    const result = InventoryCreate.safeParse({ stock: 100 });
    expect(result.success).toBe(true);
  });

  it('Debe fallar si el stock es negativo', () => {
    const result = InventoryCreate.safeParse({ stock: -1 });
    expect(result.success).toBe(false);
  });

  it('Debe fallar si el stock no es entero', () => {
    const result = InventoryCreate.safeParse({ stock: 5.5 });
    expect(result.success).toBe(false);
  });

  it('Debe fallar si el stock no es un número', () => {
    const result = InventoryCreate.safeParse({ stock: 'diez' });
    expect(result.success).toBe(false);
  });

  it('Debe fallar si el body está vacío', () => {
    const result = InventoryCreate.safeParse({});
    expect(result.success).toBe(false);
  });

  it('Debe fallar si se envían campos extra (strictObject)', () => {
    const result = InventoryCreate.safeParse({ stock: 10, isOut: false });
    expect(result.success).toBe(false);
  });
});

describe('Caja Blanca - InventoryPatch Schema', () => {
  it('Debe aceptar stock igual a 1 (mínimo permitido para agregar)', () => {
    const result = InventoryPatch.safeParse({ stock: 1 });
    expect(result.success).toBe(true);
  });

  it('Debe fallar si el stock es 0 (no se puede agregar 0)', () => {
    const result = InventoryPatch.safeParse({ stock: 0 });
    expect(result.success).toBe(false);
  });

  it('Debe fallar si el stock es negativo (solo suma positiva vía endpoint)', () => {
    const result = InventoryPatch.safeParse({ stock: -10 });
    expect(result.success).toBe(false);
  });

  it('Debe fallar si el stock no es entero', () => {
    const result = InventoryPatch.safeParse({ stock: 1.9 });
    expect(result.success).toBe(false);
  });
});

describe('Caja Blanca - InventoryResponse Schema', () => {
  const validInventory = { id: 1, stock: 10, productId: 5 };

  it('Debe parsear correctamente un inventario válido', () => {
    const result = InventoryResponse.safeParse(validInventory);
    expect(result.success).toBe(true);
  });

  it('Debe aceptar stock igual a 0', () => {
    const result = InventoryResponse.safeParse({ ...validInventory, stock: 0 });
    expect(result.success).toBe(true);
  });

  it('Debe fallar si el stock es negativo (nunca debe llegar un estado así)', () => {
    const result = InventoryResponse.safeParse({
      ...validInventory,
      stock: -1,
    });
    expect(result.success).toBe(false);
  });

  it('Debe fallar si falta el campo id', () => {
    const { id, ...noId } = validInventory;
    const result = InventoryResponse.safeParse(noId);
    expect(result.success).toBe(false);
  });

  it('Debe fallar si falta el campo productId', () => {
    const { productId, ...noProductId } = validInventory;
    const result = InventoryResponse.safeParse(noProductId);
    expect(result.success).toBe(false);
  });
});
