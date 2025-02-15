import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { Permission } from 'src/user/entities/permission.entity';

@Injectable()
export class RedisService {
  @Inject('REDIS_ClIENT')
  private readonly redisClient: RedisClientType;

  async listGet(key: string) {
    return await this.redisClient.lRange(key, 0, -1);
  }

  async listSet(key: string, list: Permission[], tts?: number) {
    for (const item of list) {
      await this.redisClient.lPush(key, JSON.stringify(item));
    }
    if (tts) {
      await this.redisClient.expire(key, tts);
    }
  }
}
