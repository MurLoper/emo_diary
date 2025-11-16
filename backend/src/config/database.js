const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    if (process.env.MONGODB_REPLICA_SET) {
      options.replicaSet = process.env.MONGODB_REPLICA_SET;
    }

    await mongoose.connect(process.env.MONGODB_URI, options);

    console.log('✓ MongoDB 连接成功');
  } catch (error) {
    console.error('✗ MongoDB 连接失败:', error.message);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB 连接断开');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB 错误:', error);
});

module.exports = { connectDatabase };
