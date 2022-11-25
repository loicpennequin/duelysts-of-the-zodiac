import type { Db } from '../db';
import type { CreateUserDto } from './dtos';
import bcrypt from 'bcrypt';

type Args = {
  db: Db;
};

export class UserRepository {
  private SALT_ROUNDS = 10;
  private db: Db;

  constructor({ db }: Args) {
    this.db = db;
  }

  async findAll() {
    return await this.db.user.findMany();
  }

  async create({ password, ...dto }: CreateUserDto) {
    return await this.db.user.create({
      data: {
        ...dto,
        passwordHash: await bcrypt.hash(password, this.SALT_ROUNDS)
      }
    });
  }
}
