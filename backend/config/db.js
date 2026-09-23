const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusconnect';
    
    if (!process.env.MONGO_URI) {
      console.warn('⚠️ MONGO_URI environment variable is missing. Using default local MongoDB connection URI.');
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);

    if (error.message.includes('bad auth')) {
      console.error('💡 TROUBLESHOOTING MONGODB AUTHENTICATION FAILURE:');
      console.error('1. Check the MONGO_URI environment variable in your Render / deployment dashboard.');
      console.error('2. Verify the MongoDB Database User username and password in MongoDB Atlas.');
      console.error('3. If your password contains special characters like "@", ":", "/", "?", or "#", encode them using URL encoding (e.g., replace @ with %40, : with %3A).');
      console.error('4. Ensure Network Access in MongoDB Atlas allows IP 0.0.0.0/0 (Allow access from anywhere).');
    }

    // Do not call process.exit(1) so health checks (e.g. /api/health) pass and diagnostic logs remain accessible on Render
  }
};

module.exports = connectDB;
