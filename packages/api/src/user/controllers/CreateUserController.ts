import type { UseCase } from '../../types';
import type { CreateUserDto } from '../dtos';
import type { UserRepository } from '../UserRepository';
import type { User } from '@prisma/client';

type Args = {
  userRepo: UserRepository;
};
export class CreateUserController implements UseCase<CreateUserDto, User> {
  private userRepo: UserRepository;

  constructor({ userRepo }: Args) {
    this.userRepo = userRepo;
  }

  execute(dto: CreateUserDto) {
    return this.userRepo.create(dto);
  }
}
