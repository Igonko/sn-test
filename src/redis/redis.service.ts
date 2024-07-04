import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  public async get(key: string) {
    console.log('get cached value', key);
    return await this.cache.get(key);
  }

  public async set(key: string, value: unknown) {
    console.log('set cached value', key);
    await this.cache.set(key, value);
  }

  public async del(key: string) {
    await this.cache.del(key);
  }
}
