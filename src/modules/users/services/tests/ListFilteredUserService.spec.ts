import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePaginationProvider from '@shared/container/providers/PaginationProvider/fakes/FakePaginationProvider';

import ListFilteredUserService from '../ListFilteredUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakePaginationProvider: FakePaginationProvider;
let fakeCacheProvider: FakeCacheProvider;

let listUser: ListFilteredUserService;

describe('ListFilteredUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePaginationProvider = new FakePaginationProvider();
    fakeCacheProvider = new FakeCacheProvider();
    listUser = new ListFilteredUserService(
      fakeUsersRepository,
      fakePaginationProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to get the cache instead of the database list', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await fakeUsersRepository.create({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
    });

    await listUser.execute({
      options: { page: 1, limit: 100 },
      entity: 'User',
      exclude: false,
      name: 'John',
    });

    const cachedList = await listUser.execute({
      options: { page: 1, limit: 100 },
      entity: 'User',
      exclude: false,
      name: 'John',
    });

    await fakeUsersRepository.create({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
    });

    const cached2List = await listUser.execute({
      options: { page: 1, limit: 100 },
      entity: 'User',
      exclude: false,
      name: 'John',
    });

    expect(cached2List).toEqual(cachedList);
    expect(pagination).toBeCalled();
  });
  it('should be able to get all users', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listUser.execute({
      options: { page: 1, limit: 100 },
      entity: 'User',
      exclude: false,
      name: 'John',
    });

    expect(pagination).toBeCalled();
  });

  it('should be able to get non-disabled users', async () => {
    const pagination = jest.spyOn(fakePaginationProvider, 'pagination');

    await listUser.execute({
      options: { page: 1, limit: 100 },
      entity: 'User',
      exclude: true,
      name: 'John',
    });

    expect(pagination).toBeCalled();
  });
});
