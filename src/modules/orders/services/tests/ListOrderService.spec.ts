import FakeOrdersRepository from '@modules/orders/repositories/fakes/FakeOrdersRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import ListOrderService from '../ListOrderService';

let fakeOrdersRepository: FakeOrdersRepository;
let fakePaginationProvider: FakePaginationProvider;
let fakeCacheProvider: FakeCacheProvider;
let listOrder: ListOrderService;

describe('ListOrder', () => {
  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakePaginationProvider = new FakePaginationProvider();
    fakeCacheProvider = new FakeCacheProvider();
    listOrder = new ListOrderService(
      fakeOrdersRepository,
      fakePaginationProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to get the cache instead of the database list', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');
    await fakeOrdersRepository.create({
      description: 'Order Description',
    });

    await listOrder.execute({
      options: { page: 1, limit: 100 },
      entity: 'Order',
    });

    const cachedList = await listOrder.execute({
      options: { page: 1, limit: 100 },
      entity: 'Order',
    });

    await fakeOrdersRepository.create({
      description: 'Order Description2',
    });

    const cached2List = await listOrder.execute({
      options: { page: 1, limit: 100 },
      entity: 'Order',
    });

    expect(cached2List).toEqual(cachedList);
    expect(pagination).toBeCalled();
  });
});
