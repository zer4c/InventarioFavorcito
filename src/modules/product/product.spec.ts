import {
  ProductCreate,
  ProductPatch,
  ProductResponse,
  ProductHistoryResponse,
} from './product.schemas';

describe('ProductCreate Schema', () => {
  it('Debe aceptar un nombre válido', () => {
    const result = ProductCreate.safeParse({ name: 'teclado' });
    expect(result.success).toBe(true);
  });

  it('Debe normalizar el nombre: trim y toLowerCase', () => {
    const result = ProductCreate.safeParse({ name: '  MONITOR  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('monitor');
    }
  });

  it('Debe fallar si el nombre está vacío', () => {
    const result = ProductCreate.safeParse({ name: '' });
    expect(result.success).toBe(false);
  });

  it('Debe fallar si el nombre es solo espacios (trim + min(1))', () => {
    const result = ProductCreate.safeParse({ name: '   ' });
    expect(result.success).toBe(false);
  });

  it('Debe fallar si el nombre no es string', () => {
    const result = ProductCreate.safeParse({ name: 123 });
    expect(result.success).toBe(false);
  });

  it('Debe fallar si el body está vacío', () => {
    const result = ProductCreate.safeParse({});
    expect(result.success).toBe(false);
  });

  it('Debe fallar con campos extra (strictObject)', () => {
    const result = ProductCreate.safeParse({ name: 'valido', isActive: true });
    expect(result.success).toBe(false);
  });
});

describe('ProductPatch Schema', () => {
  it('Debe aceptar solo el campo name', () => {
    const result = ProductPatch.safeParse({ name: 'nuevo nombre' });
    expect(result.success).toBe(true);
  });

  it('Debe aceptar solo el campo isActive', () => {
    const result = ProductPatch.safeParse({ isActive: false });
    expect(result.success).toBe(true);
  });

  it('Debe aceptar ambos campos juntos', () => {
    const result = ProductPatch.safeParse({ name: 'nuevo', isActive: true });
    expect(result.success).toBe(true);
  });

  it('Debe fallar si el body está vacío (refine: al menos un campo)', () => {
    const result = ProductPatch.safeParse({});
    expect(result.success).toBe(false);
  });

  it('Debe fallar con campos extra (strictObject)', () => {
    const result = ProductPatch.safeParse({ name: 'valido', isDeleted: false });
    expect(result.success).toBe(false);
  });

  it('Debe fallar si el name es string vacío', () => {
    const result = ProductPatch.safeParse({ name: '' });
    expect(result.success).toBe(false);
  });

  it('Debe fallar si isActive no es boolean', () => {
    const result = ProductPatch.safeParse({ isActive: 'true' });
    expect(result.success).toBe(false);
  });

  it('Debe normalizar el name: trim y toLowerCase', () => {
    const result = ProductPatch.safeParse({ name: '  NUEVO  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('nuevo');
    }
  });
});

describe('ProductResponse Schema', () => {
  const validProduct = {
    id: 1,
    name: 'teclado',
    isActive: true,
    createdAt: new Date(),
  };

  it('Debe parsear correctamente un producto válido', () => {
    const result = ProductResponse.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it('Debe fallar si falta el campo id', () => {
    const { id, ...noId } = validProduct;
    const result = ProductResponse.safeParse(noId);
    expect(result.success).toBe(false);
  });

  it('Debe fallar si id no es un entero', () => {
    const result = ProductResponse.safeParse({ ...validProduct, id: 1.5 });
    expect(result.success).toBe(false);
  });

  it('Debe fallar si isActive no es boolean', () => {
    const result = ProductResponse.safeParse({
      ...validProduct,
      isActive: 'yes',
    });
    expect(result.success).toBe(false);
  });

  it('Debe fallar si falta el campo createdAt', () => {
    const { createdAt, ...noDate } = validProduct;
    const result = ProductResponse.safeParse(noDate);
    expect(result.success).toBe(false);
  });
});

describe('ProductHistoryResponse Schema', () => {
  const validEntry = {
    id: 1,
    name: 'teclado',
    isActive: true,
    createdAt: new Date(),
    history: [
      {
        id: 1,
        nameChanged: true,
        isActiveChanged: false,
        isDeletedChanged: false,
        createAt: new Date(),
      },
    ],
  };

  it('Debe parsear correctamente un historial válido', () => {
    const result = ProductHistoryResponse.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  it('Debe aceptar historial vacío', () => {
    const result = ProductHistoryResponse.safeParse({
      ...validEntry,
      history: [],
    });
    expect(result.success).toBe(true);
  });

  it('Debe fallar si un ítem del historial no tiene nameChanged', () => {
    const badHistory = { ...validEntry.history[0] };
    delete (badHistory as any).nameChanged;
    const result = ProductHistoryResponse.safeParse({
      ...validEntry,
      history: [badHistory],
    });
    expect(result.success).toBe(false);
  });

  it('Debe fallar si history no es un array', () => {
    const result = ProductHistoryResponse.safeParse({
      ...validEntry,
      history: 'no-array',
    });
    expect(result.success).toBe(false);
  });
});
