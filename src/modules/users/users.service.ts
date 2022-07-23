import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findOne(id: number) {
    return {
      id,
      email: 'test@test.test',
      username: 'Kim',
    };
  }
}
