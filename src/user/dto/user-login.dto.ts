import { IsNotEmpty, Length } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @Length(3, 30)
  username: string;

  @IsNotEmpty()
  @Length(1, 20)
  password: string;
}
