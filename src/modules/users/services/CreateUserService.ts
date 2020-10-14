import User from '@modules/users/infra/typeorm/entities/User';
import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  name: string;
  enabled?: boolean;
  role?: string;
  email: string;
  password: string;
  current_user_id?: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    name,
    email,
    password,
    enabled,
    role,
    current_user_id,
  }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used');
    }

    if (current_user_id) {
      const checkAuthUser = await this.usersRepository.findById(
        current_user_id,
      );
      if (checkAuthUser) {
        if (checkAuthUser.role !== 'admin' && role === 'admin') {
          throw new AppError('The user is not an admin');
        }
      }
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      enabled,
      role,
      password: hashedPassword,
    });

    await this.cacheProvider.invalidatePrefix('users-list');

    return user;
  }
}

export default CreateUserService;
