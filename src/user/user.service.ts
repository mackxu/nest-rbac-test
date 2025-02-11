import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  async init() {
    const user1 = new User();
    user1.username = 'zhangsan';
    user1.password = '111111';
    const user2 = new User();
    user2.username = 'lisi';
    user2.password = '222222';
    const user3 = new User();
    user3.username = 'wangwu';
    user3.password = '333333';

    const aaaRole = new Role();
    aaaRole.name = 'aaa';
    const bbbRole = new Role();
    bbbRole.name = 'bbb';

    const permission1 = new Permission();
    permission1.name = 'aaa:add';
    permission1.desc = '增加 aaa';
    const permission2 = new Permission();
    permission2.name = 'aaa:delete';
    const permission3 = new Permission();
    permission3.name = 'aaa:update';
    const permission4 = new Permission();
    permission4.name = 'aaa:query';
    const permission5 = new Permission();
    permission5.name = 'bbb:add';
    const permission6 = new Permission();
    permission6.name = 'bbb:delete';
    const permission7 = new Permission();
    permission7.name = 'bbb:update';
    const permission8 = new Permission();
    permission8.name = 'bbb:query';

    user1.roles = [aaaRole, bbbRole];
    user2.roles = [aaaRole];
    user3.roles = [bbbRole];

    aaaRole.permissions = [permission1, permission2, permission3, permission4];
    bbbRole.permissions = [permission5, permission6, permission7, permission8];

    await this.entityManager.save(Permission, [
      permission1,
      permission2,
      permission3,
      permission4,
      permission5,
      permission6,
      permission7,
      permission8,
    ]);

    await this.entityManager.save(Role, [aaaRole, bbbRole]);

    await this.entityManager.save(User, [user1, user2, user3]);
  }
}
