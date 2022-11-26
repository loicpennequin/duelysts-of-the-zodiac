import type { CreateUserDto } from '@dotz/shared';
import type { HandlerArgs } from '../../types';
import { userMapper } from '../userMapper';
import { createUser } from '../userService';

export const createUserHandler = async ({
  input
}: HandlerArgs<CreateUserDto>) => {
  const user = await createUser(input);

  return userMapper.toDto(user);
};
