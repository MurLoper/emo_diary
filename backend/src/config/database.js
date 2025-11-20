const mongoose = require('mongoose');

const connectDatabase = async () => {
  const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  if (process.env.MONGODB_REPLICA_SET) {
    options.replicaSet = process.env.MONGODB_REPLICA_SET;
  }

  await mongoose.connect(process.env.MONGODB_URI, options);

  console.log('✓ MongoDB 连接成功');
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB 连接断开');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB 错误:', error);
});

module.exports = { connectDatabase };
