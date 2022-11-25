import type { UseCase } from '../../types';
import type { UserRepository } from '../UserRepository';
import type { User } from '@prisma/client';

type Args = {
  userRepo: UserRepository;
};
export class GetAllUsersController implements UseCase<never, User[]> {
  private userRepo: UserRepository;

  constructor({ userRepo }: Args) {
    this.userRepo = userRepo;
  }

  execute() {
    return this.userRepo.findAll();
  }
}
