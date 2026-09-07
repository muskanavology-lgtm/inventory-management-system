const mongoose = require('mongoose');
const dns = require('dns');

// DNS issue resolution for MongoDB Atlas (+srv)
dns.setServers(['8.8.8.8', '8.8.4.4']);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;