import { SetMetadata } from '@nestjs/common';

export const ALLOW_NO_TOKEN = 'allow_no_token';

export const AllowNoToken = () => SetMetadata(ALLOW_NO_TOKEN, true);
