const mongoose = require('mongoose');

const connectMongoDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/equipath';
  
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });
};

module.exports = { connectMongoDB };
