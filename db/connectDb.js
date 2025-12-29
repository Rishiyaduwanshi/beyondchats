import mongoose from "mongoose";
import { config } from '../config/index.js'

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI);
    const { host, name } = conn.connection;

    console.log(
      `🟢 Database connected successfully!
      📦 Database : ${name}
      🌐 Host     : ${host}`
    );
  } catch (error) {
    console.error("Database connection error 😢", error);
    process.exit(1);
  }
};

connectDb();

export default connectDb;

