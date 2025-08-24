import { BaseRepository } from './base.repository';

export interface User {
  id: number;
  name: string;
  email: string;
}

class UserRepository extends BaseRepository<User> {
  constructor() {
    super('/users');
  }
}

export const userRepository = new UserRepository();
