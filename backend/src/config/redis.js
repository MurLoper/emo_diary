const redis = require('redis');

let client = null;

const connectRedis = async () => {
  try {
    const options = {
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        reconnectStrategy: false, // 禁用自动重连
      }
    };

    if (process.env.REDIS_PASSWORD) {
      options.password = process.env.REDIS_PASSWORD;
    }

    client = redis.createClient(options);

    // 静默处理错误，避免控制台刷屏
    client.on('error', () => {
      // 错误已在 catch 块中处理，这里静默
    });

    client.on('connect', () => {
      console.log('✓ Redis 连接成功');
    });

    await client.connect();

    return client;
  } catch (error) {
    console.warn('✗ Redis 连接失败，将以演示模式运行');
    // Redis 失败不影响主服务启动
    return null;
  }
};

const getRedisClient = () => {
  return client;
};

module.exports = { connectRedis, getRedisClient };
