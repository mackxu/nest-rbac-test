import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { AllowNoToken } from 'src/common/decorator/token.decorator';
import { AllowNoPermission } from 'src/common/decorator/permission.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('init')
  @AllowNoToken()
  @AllowNoPermission()
  async init() {
    await this.userService.init();
    return 'init success';
  }

  @Post('login')
  @AllowNoToken()
  @AllowNoPermission()
  async login(@Body() input: UserLoginDto) {
    const user = await this.userService.login(input);
    const token = await this.jwtService.signAsync({
      user: {
        sub: user.id,
        username: user.username,
        roles: user.roles,
      },
    });
    return { token };
  }
}
