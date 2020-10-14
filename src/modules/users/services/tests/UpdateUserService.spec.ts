import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

import UpdateUserService from '../UpdateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let updateUser: UpdateUserService;

describe('UpdateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    updateUser = new UpdateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to update the user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
    });

    await updateUser.execute({
      user_id: user.id,
      name: 'John Amorim',
      email: user.email,
    });

    expect(user.name).toBe('John Amorim');
  });
  it('should be able to update the user role if there is a new one', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
      role: 'admin',
    });

    await updateUser.execute({
      user_id: user.id,
      name: 'John Amorim',
      email: user.email,
      role: 'user',
    });

    expect(user.role).toBe('user');
  });
  it('should be able to update the user status if there is a new one', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
      role: 'admin',
      enabled: false,
    });

    await updateUser.execute({
      user_id: user.id,
      name: 'John Amorim',
      email: user.email,
      role: user.role,
      enabled: true,
    });

    expect(user.enabled).toBe(true);
  });
  it('should not be able to update a non-exists user', async () => {
    expect(
      updateUser.execute({
        user_id: 'undefined',
        name: 'John Amorim',
        email: 'undefined',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update the user if new email already be in use', async () => {
    await fakeUsersRepository.create({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Amorim',
      email: 'john12@gmail.com',
      password: 'john123',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: user.id,
        email: 'john@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the user password if the old password hasnt been informed', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Amorim',
      email: 'john12@gmail.com',
      password: 'john123',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: user.id,
        email: user.email,
        password: user.password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update the user password if the old password is wrong', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Amorim',
      email: 'john12@gmail.com',
      password: 'john123',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: user.id,
        email: user.email,
        password: 'john321',
        old_password: 'wrong-old-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update the user password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Amorim',
      email: 'john12@gmail.com',
      password: 'john123',
    });

    const updatedUser = await updateUser.execute({
      user_id: user.id,
      name: user.id,
      email: user.email,
      password: 'john321',
      old_password: user.password,
    });

    await expect(updatedUser.password).toBe('john321');
  });
});
