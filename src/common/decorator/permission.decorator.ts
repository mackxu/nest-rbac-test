import { SetMetadata } from '@nestjs/common';

export const ALLOW_NO_PERMISSION = 'allow_no_permission';

export const AllowNoPermission = () => SetMetadata(ALLOW_NO_PERMISSION, true);
