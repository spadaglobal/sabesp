import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import CreateUserService from '../CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new user', async () => {
    const authUser = await fakeUsersRepository.create({
      name: 'John',
      email: 'john123@gmail.com',
      password: 'john123',
      role: 'user',
    });

    const user = await createUser.execute({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
      current_user_id: authUser.id,
      role: 'user',
    });

    expect(user).toHaveProperty('id');
  });
  it('should not be able to create a new user with same email from another', async () => {
    await createUser.execute({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
    });

    await expect(
      createUser.execute({
        name: 'John',
        email: 'john@gmail.com',
        password: 'john123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to create a new user without authentication', async () => {
    const user = await createUser.execute({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
      role: 'user',
    });

    expect(user).toHaveProperty('id');
  });
  it('should not be able to create a new admin user if the user is not an admin', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
      role: 'user',
    });

    await expect(
      createUser.execute({
        name: 'John',
        email: 'john12@gmail.com',
        password: 'john123',
        current_user_id: user.id,
        role: 'admin',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
