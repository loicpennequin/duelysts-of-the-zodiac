import type { UserDto } from '@dotz/shared';
import type { User as PrismaUser } from '@prisma/client';

export class UserMapper {
  toDto(user: PrismaUser): UserDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;

    return rest;
  }
}
