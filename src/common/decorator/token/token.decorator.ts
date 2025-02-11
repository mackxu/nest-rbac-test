import { SetMetadata } from '@nestjs/common';

export const Token = (...args: string[]) => SetMetadata('token', args);
