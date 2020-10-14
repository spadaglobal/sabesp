import FakeOrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import CreateOrderService from '../CreateOrderService';
import DeleteOrderService from '../DeleteOrderService';

let fakeOrdersRepository: FakeOrdersRepository;
let fakeCacheProvider: FakeCacheProvider;
let createOrder: CreateOrderService;
let deleteOrder: DeleteOrderService;

describe('DeleteOrder', () => {
  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteOrder = new DeleteOrderService(
      fakeOrdersRepository,
      fakeCacheProvider,
    );
    createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to delete a order', async () => {
    const remove = jest.spyOn(fakeOrdersRepository, 'remove');

    const order = await createOrder.execute({
      description: 'Order Description',
    });

    await deleteOrder.execute({
      order_id: order.id,
    });

    expect(remove).toBeCalledWith(order.id);
  });
  it('should be not able to delete a non-exists order', async () => {
    await expect(
      deleteOrder.execute({
        order_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
