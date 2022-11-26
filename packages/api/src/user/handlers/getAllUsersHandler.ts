import { userMapper } from '../userMapper';
import { findAllUsers } from '../userService';

export const getAllUsersHandler = async () => {
  const users = await findAllUsers();

  return users.map(userMapper.toDto);
};
