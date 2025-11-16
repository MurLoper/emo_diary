require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDatabase } = require('./config/database');
const { connectRedis } = require('./config/redis');
const cacheService = require('./services/cacheService');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// 导入路由
const authRoutes = require('./routes/auth');
const themeRoutes = require('./routes/theme');
const userRoutes = require('./routes/user');
const checkinRoutes = require('./routes/checkin');
const diaryRoutes = require('./routes/diary');
const albumRoutes = require('./routes/albums');
const rechargeRoutes = require('./routes/recharge');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * 中间件配置
 */
app.use(helmet()); // 安全头部
app.use(cors()); // 跨域
app.use(express.json({ limit: '10mb' })); // JSON解析
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // URL编码解析

/**
 * 路由配置
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '心晴日记 API 服务',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/diaries', diaryRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/recharge', rechargeRoutes);

/**
 * 错误处理
 */
app.use(notFound); // 404处理
app.use(errorHandler); // 统一错误处理

/**
 * 启动服务器
 */
const startServer = async () => {
  try {
    let dbConnected = false;
    let redisConnected = false;

    // 尝试连接数据库
    try {
      await connectDatabase();
      dbConnected = true;
    } catch (error) {
      console.warn('⚠️  MongoDB 未连接（演示模式）');
      console.warn('   提示：安装MongoDB后可使用完整功能');
    }

    // 尝试连接Redis
    try {
      const redisClient = await connectRedis();
      if (redisClient) {
        cacheService.init();
        redisConnected = true;
      }
    } catch (error) {
      console.warn('⚠️  Redis 未连接（演示模式）');
      console.warn('   提示：安装Redis后可获得更好性能');
    }

    // 启动HTTP服务器
    app.listen(PORT, () => {
      console.log('========================================');
      console.log('🚀 心晴日记后端服务启动成功！');
      console.log(`📦 环境: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 端口: ${PORT}`);
      console.log(`🔗 访问: http://localhost:${PORT}`);
      console.log('');
      console.log('📊 服务状态:');
      console.log(`   MongoDB: ${dbConnected ? '✅ 已连接' : '⚠️  演示模式'}`);
      console.log(`   Redis:   ${redisConnected ? '✅ 已连接' : '⚠️  演示模式'}`);
      console.log('');
      if (!dbConnected || !redisConnected) {
        console.log('💡 提示：');
        console.log('   当前为演示模式，部分功能受限');
        console.log('   安装MongoDB和Redis后可使用完整功能');
        console.log('   或使用 Docker: docker-compose up -d');
      }
      console.log('========================================');
    });
  } catch (error) {
    console.error('启动服务失败:', error);
    process.exit(1);
  }
};

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，正在关闭服务...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n收到SIGINT信号，正在关闭服务...');
  process.exit(0);
});

// 启动服务
startServer();

module.exports = app;
