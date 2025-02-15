import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ALLOW_NO_PERMISSION } from '../decorator/permission.decorator';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { pathToRegexp } from 'path-to-regexp';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private readonly reflector: Reflector;

  @Inject(UserService)
  private readonly userService: UserService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowNoPermission = this.reflector.getAllAndOverride(
      ALLOW_NO_PERMISSION,
      [context.getClass(), context.getHandler()],
    );
    if (allowNoPermission) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('权限问题，拒绝访问');
    }

    const permissions = await this.userService.findPermissionsByUser(user);

    // 判断是否有权限
    const permission = permissions.find((p) => {
      return (
        p.apiMethod === request.method.toLocaleLowerCase() &&
        pathToRegexp(p.apiUrl).regexp.test(request.url)
      );
    });
    if (!permission) {
      throw new ForbiddenException('权限不足，拒绝访问');
    }
    return true;
  }
}
