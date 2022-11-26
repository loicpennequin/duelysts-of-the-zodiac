import type { CreateUserDto } from '@dotz/shared';
import { userMapper } from '../userMapper';
import { createUser } from '../userService';

export const createUserHandler = async (dto: CreateUserDto) => {
  const user = await createUser(dto);

  return userMapper.toDto(user);
};
