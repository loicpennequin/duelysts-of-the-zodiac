import type { UseCase } from '../../types';
import type { UserRepository } from '../UserRepository';
import type { UserDto } from '@dotz/shared';
import type { UserMapper } from '../UserMapper';

type Args = {
  userRepo: UserRepository;
  userMapper: UserMapper;
};
export class GetAllUsersController implements UseCase<never, UserDto[]> {
  private userRepo: UserRepository;

  private userMapper: UserMapper;

  constructor({ userRepo, userMapper }: Args) {
    this.userRepo = userRepo;
    this.userMapper = userMapper;
  }

  async execute() {
    const users = await this.userRepo.findAll();

    return users.map(user => this.userMapper.toDto(user));
  }
}
