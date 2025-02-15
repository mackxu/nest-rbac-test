import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UserLoginDto } from './dto/user-login.dto';
import { Request } from 'express';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  async login(input: UserLoginDto) {
    // console.log(input, 123);
    const entity = await this.entityManager.findOne(User, {
      where: {
        username: input.username,
      },
      relations: {
        roles: true,
      },
    });

    if (!entity) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (entity.password !== input.password) {
      throw new BadRequestException('密码错误');
    }
    return entity;
  }

  findRolesByIds(ids: number[]) {
    // 通过role查找permissions
    return this.entityManager.find(Role, {
      where: {
        id: In(ids),
      },
      relations: {
        permissions: true,
      },
    });
  }

  async findPermissionsByUser(user: Request['user']) {
    // 从redis中获取权限
    const rKey = `rbac_test_${user.username}`;

    const permissions = await this.redisService.listGet(rKey);
    if (permissions.length) {
      return permissions.map((p) => JSON.parse(p));
    }
    // 从数据库中获取权限
    const roleIds = user.roles.map((r) => r.id);
    const roles = await this.entityManager.find(Role, {
      where: {
        id: In(roleIds),
      },
      relations: {
        permissions: true,
      },
    });
    const rolePermissions = roles.reduce<Permission[]>((prev, curr) => {
      prev.push(...curr.permissions);
      return prev;
    }, []);
    await this.redisService.listSet(rKey, rolePermissions, 60);
    return rolePermissions;
  }

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
    permission1.apiMethod = 'get';
    permission1.apiUrl = '/aaa';
    const permission2 = new Permission();
    permission2.apiMethod = 'delete';
    permission2.apiUrl = '/aaa';
    const permission3 = new Permission();
    permission3.apiMethod = 'petch';
    permission3.apiUrl = '/aaa';
    const permission4 = new Permission();
    permission4.apiMethod = 'post';
    permission4.apiUrl = '/aaa';

    const permission5 = new Permission();
    permission5.apiMethod = 'get';
    permission5.apiUrl = '/bbb';
    const permission6 = new Permission();
    permission6.apiUrl = '/bbb';
    permission6.apiMethod = 'post';
    const permission7 = new Permission();
    permission7.apiUrl = '/bbb';
    permission7.apiMethod = 'delete';
    const permission8 = new Permission();
    permission8.apiUrl = '/bbb';
    permission8.apiMethod = 'patch';
    const permission9 = new Permission();
    permission9.apiUrl = '/bbb/:id';
    permission9.apiMethod = 'get';

    user1.roles = [aaaRole, bbbRole];
    user2.roles = [aaaRole];
    user3.roles = [bbbRole];

    aaaRole.permissions = [permission1, permission2, permission3, permission4];
    bbbRole.permissions = [
      permission5,
      permission6,
      permission7,
      permission8,
      permission9,
    ];

    await this.entityManager.save(Permission, [
      permission1,
      permission2,
      permission3,
      permission4,
      permission5,
      permission6,
      permission7,
      permission8,
      permission9,
    ]);

    await this.entityManager.save(Role, [aaaRole, bbbRole]);

    await this.entityManager.save(User, [user1, user2, user3]);
  }
}
