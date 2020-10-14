import FakeOrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';

import AppError from '@shared/errors/AppError';

import FindOrderService from '../FindOrderService';

let fakeOrdersRepository: FakeOrdersRepository;
let findOrder: FindOrderService;

describe('FindOrder', () => {
  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    findOrder = new FindOrderService(fakeOrdersRepository);
  });
  it('should be able to return the order', async () => {
    const order = await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    const findedOrder = await findOrder.execute({
      order_id: order.id,
    });

    expect(findedOrder.id).toEqual(order.id);
  });
  it('should not be able to return a non-exists order', async () => {
    await expect(
      findOrder.execute({
        order_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
