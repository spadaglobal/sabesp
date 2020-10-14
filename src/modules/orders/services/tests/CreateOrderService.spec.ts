import FakeOrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import CreateOrderService from '../CreateOrderService';

let fakeOrdersRepository: FakeOrdersRepository;
let fakeCacheProvider: FakeCacheProvider;
let createOrder: CreateOrderService;

describe('CreateOrder', () => {
  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new order', async () => {
    const order = await createOrder.execute({
      description: 'Order Description',
    });

    expect(order).toHaveProperty('id');
  });
});
