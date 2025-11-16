const { getRedisClient } = require('../config/redis');

/**
 * 缓存服务
 */
class CacheService {
  constructor() {
    this.client = null;
  }

  /**
   * 初始化Redis客户端
   */
  init() {
    this.client = getRedisClient();
  }

  /**
   * 获取缓存
   */
  async get(key) {
    if (!this.client) return null;

    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  /**
   * 设置缓存
   */
  async set(key, value, ttl = 3600) {
    if (!this.client) return false;

    try {
      await this.client.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }

  /**
   * 删除缓存
   */
  async del(pattern) {
    if (!this.client) return false;

    try {
      if (pattern.includes('*')) {
        // 模糊匹配删除
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(keys);
        }
      } else {
        await this.client.del(pattern);
      }
      return true;
    } catch (error) {
      console.error('Redis del error:', error);
      return false;
    }
  }

  /**
   * 批量获取
   */
  async mget(keys) {
    if (!this.client) return [];

    try {
      const values = await this.client.mGet(keys);
      return values.map(v => v ? JSON.parse(v) : null);
    } catch (error) {
      console.error('Redis mget error:', error);
      return [];
    }
  }

  /**
   * 检查键是否存在
   */
  async exists(key) {
    if (!this.client) return false;

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
      return false;
    }
  }

  /**
   * 设置过期时间
   */
  async expire(key, ttl) {
    if (!this.client) return false;

    try {
      await this.client.expire(key, ttl);
      return true;
    } catch (error) {
      console.error('Redis expire error:', error);
      return false;
    }
  }
}

module.exports = new CacheService();
