import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Permission } from 'src/user/entities/permission.entity';

@Injectable()
export class RedisService {
  @Inject('REDIS_ClIENT')
  private readonly redisClient: Redis;

  async listGet(key: string) {
    return await this.redisClient.lrange(key, 0, -1);
  }

  // default
  async listSet0(key: string, list: Permission[], tts?: number) {
    const permissions = list.map((item) => JSON.stringify(item));

    await this.redisClient.lpush(key, ...permissions);
    if (tts) {
      await this.redisClient.expire(key, tts);
    }
  }

  // pipeline
  async listSet(key: string, list: Permission[], tts?: number) {
    const pipeline = this.redisClient.pipeline();
    pipeline.lpush(key, ...list.map((item) => JSON.stringify(item)));

    if (tts) {
      pipeline.expire(key, tts);
    }
    await pipeline.exec();
  }
}
