import FakeOrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import CreateOrderService from '../CreateOrderService';
import UpdateOrderService from '../UpdateOrderService';

let fakeOrdersRepository: FakeOrdersRepository;
let fakeCacheProvider: FakeCacheProvider;
let createOrder: CreateOrderService;
let updateOrder: UpdateOrderService;

describe('UpdateOrder', () => {
  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateOrder = new UpdateOrderService(
      fakeOrdersRepository,
      fakeCacheProvider,
    );
    createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to update the order', async () => {
    const order = await createOrder.execute({
      description: 'Order Description',
    });

    const updatedOrder = await updateOrder.execute({
      order_id: order.id,
      description: 'Order Description Updated',
    });

    expect(updatedOrder.description).toBe('Order Description Updated');
  });
  it('should not be able to update a non-exists order', async () => {
    await expect(
      updateOrder.execute({
        order_id: 'non-exists-id',
        description: 'Order Description',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
