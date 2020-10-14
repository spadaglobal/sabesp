import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import AppError from '@shared/errors/AppError';

import FindUserService from '../FindUserService';

let fakeUsersRepository: FakeUsersRepository;
let findUser: FindUserService;

describe('FindUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    findUser = new FindUserService(fakeUsersRepository);
  });
  it('should be able return the user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John',
      email: 'john@gmail.com',
      password: 'john123',
    });

    const findedUser = await findUser.execute({
      user_id: user.id,
    });

    expect(findedUser.id).toEqual(user.id);
  });
  it('should not be able to return a user', async () => {
    await expect(
      findUser.execute({
        user_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
