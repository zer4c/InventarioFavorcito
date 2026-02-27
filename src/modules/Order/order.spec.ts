import { OrderResponse } from './order.schemas';
import { OrderStatus } from '../../core/enums';

describe('Caja Blanca - OrderResponse Schema (estados)', () => {
  const validResponse = {
    id: 1,
    clientName: 'cliente valido',
    address: 'calle falsa 123',
    stockRequired: 2,
    productId: 1,
    state: OrderStatus.enum.FINISHED,
  };

  it('Debe aceptar state finished', () => {
    const result = OrderResponse.safeParse({
      ...validResponse,
      state: OrderStatus.enum.FINISHED,
    });
    expect(result.success).toBe(true);
  });

  it('Debe aceptar state cancelled', () => {
    const result = OrderResponse.safeParse({
      ...validResponse,
      state: OrderStatus.enum.CANCELLED,
    });
    expect(result.success).toBe(true);
  });

  it('Debe aceptar state queue', () => {
    const result = OrderResponse.safeParse({
      ...validResponse,
      state: OrderStatus.enum.QUEUE,
    });
    expect(result.success).toBe(true);
  });

  it('Debe fallar con un estado en mayúsculas (no pertenece al enum)', () => {
    const result = OrderResponse.safeParse({
      ...validResponse,
      state: 'FINISHED',
    });
    expect(result.success).toBe(false);
  });

  it('Debe fallar con un estado no definido en el enum', () => {
    const result = OrderResponse.safeParse({
      ...validResponse,
      state: 'pending',
    });
    expect(result.success).toBe(false);
  });

  it('Debe fallar si falta el campo state', () => {
    const { state, ...noState } = validResponse;
    const result = OrderResponse.safeParse(noState);
    expect(result.success).toBe(false);
  });

  it('Debe fallar si falta el campo id', () => {
    const { id, ...noId } = validResponse;
    const result = OrderResponse.safeParse(noId);
    expect(result.success).toBe(false);
  });
});
