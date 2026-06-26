import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting. connection object will not be empty if we have connection
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    // Attempt to connect to the database
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    // Graceful exit in case of a connection error
    process.exit(1);
  }
}

export default dbConnect;

//Nextjs runs on edge runtime. So there can be a connection to db or may not be, like lambda funtions in AWS. The app is not always
//up and running. Inshort, we have to check if there is a connection, if yes, then simply return, otherwise connect.  For each
// API call, we will be calling this connect method, so this fucntion will simply return if there is a connection, otherwise will connect
//to the database.
