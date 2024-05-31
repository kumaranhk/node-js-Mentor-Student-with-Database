import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbUserName = process.env.DB_USER_NAME;
const dbPassword = process.env.DB_PASSWORD;
const dbCluster = process.env.DB_CLUSTER;
const dbName = process.env.DB_NAME;

// const localUri = "mongodb://127.0.0.1:27017/sample";
const cloudUri = `mongodb+srv://${dbUserName}:${dbPassword}@${dbCluster}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

const mongooseConnect = async () => {
  try {
    await mongoose.connect(cloudUri);
    console.log("Mongoose Connection established");
  } catch (e) {
    console.log("Mongoose Connection error: " + e.message);
    // process.exit(1);
  }
};

export default mongooseConnect;
