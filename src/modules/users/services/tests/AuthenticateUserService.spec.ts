import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeJWTProvider from '@modules/users/providers/JWTProvider/fakes/FakeJWTProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import AuthenticateUserService from '../AuthenticateUserService';
import CreateUserService from '../CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let fakeJWTProvider: FakeJWTProvider;
let authenticateUser: AuthenticateUserService;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeJWTProvider = new FakeJWTProvider();
    fakeCacheProvider = new FakeCacheProvider();
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeJWTProvider,
    );
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to authenticate the user', async () => {
    const signToken = jest.spyOn(fakeJWTProvider, 'signToken');

    const user = await createUser.execute({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
      enabled: true,
      current_user_id: 'non-exists-id',
    });

    const response = await authenticateUser.execute({
      email: 'john@gmail.com',
      password: 'john123',
    });

    expect(signToken).toBeCalledWith(user.id);
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate the user when the user doesnt exists', async () => {
    await createUser.execute({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
      enabled: true,
      current_user_id: 'non-exists-id',
    });

    await expect(
      authenticateUser.execute({
        email: 'john12@gmail.com',
        password: 'john123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate the user when the password doesnt match', async () => {
    await createUser.execute({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
      enabled: true,
      current_user_id: 'non-exists-id',
    });

    await expect(
      authenticateUser.execute({
        email: 'john@gmail.com',
        password: 'john132',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to authenticate a disabled user', async () => {
    await createUser.execute({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
      enabled: false,
      current_user_id: 'non-exists-id',
    });

    await expect(
      authenticateUser.execute({
        email: 'john@gmail.com',
        password: 'john132',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
