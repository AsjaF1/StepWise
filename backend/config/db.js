const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.warn('MongoDB not connected — DB routes will fail, AI routes still work.');
  }
}

module.exports = connectDB;
