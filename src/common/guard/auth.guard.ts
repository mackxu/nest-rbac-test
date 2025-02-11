import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Role } from 'src/user/entities/role.entity';

declare module 'express' {
  interface Request {
    user: {
      username: string;
      roles: Role[];
    };
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 获取authorization参数
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new UnauthorizedException();
    }
    // 解析token
    const token = authorization.split(' ')[1];
    try {
      const result = this.jwtService.verify(token);
      console.log(result, 111);
      request.user = result;
    } catch (error) {
      throw new UnauthorizedException('token 无效, 请重新登录');
    }
    return true;
  }
}
