import mongoose from 'mongoose';

export async function connectMongo() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/iron-aesthetic';

  mongoose.connection.on('error', (err) => {
    console.error('[mongo] connection error:', err.message);
  });

  await mongoose.connect(uri);
  console.log(`[mongo] connected -> ${uri}`);
}
