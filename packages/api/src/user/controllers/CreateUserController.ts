import type { UserDto } from '@dotz/shared';
import type { UseCase } from '../../types';
import type { CreateUserDto } from '../dtos';
import type { UserMapper } from '../UserMapper';
import type { UserRepository } from '../UserRepository';

type Args = {
  userRepo: UserRepository;
  userMapper: UserMapper;
};
export class CreateUserController implements UseCase<CreateUserDto, UserDto> {
  private userRepo: UserRepository;

  private userMapper: UserMapper;

  constructor({ userRepo, userMapper }: Args) {
    this.userRepo = userRepo;
    this.userMapper = userMapper;
  }

  async execute(dto: CreateUserDto) {
    const user = await this.userRepo.create(dto);

    return this.userMapper.toDto(user);
  }
}
