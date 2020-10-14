import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import DisableUserService from '../DisableUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let disableUser: DisableUserService;

describe('DisableUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    disableUser = new DisableUserService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });
  it('should not be able to disable a non-exists user', async () => {
    await expect(
      disableUser.execute({
        user_id: 'id-non-exists',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to disable a user already disabled', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
      enabled: false,
    });

    await expect(
      disableUser.execute({
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to disable a user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
      enabled: true,
    });

    await disableUser.execute({ user_id: user.id });

    expect(user.enabled).toBe(false);
  });
});
