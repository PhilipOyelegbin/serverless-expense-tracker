import { Db, MongoClient } from "mongodb";

let cachedClient: MongoClient;
let cachedDb: Db;

const connectToDatabase = async (): Promise<{
  client: MongoClient;
  db: Db;
}> => {
  console.time("DB Connection");
  if (cachedClient && cachedDb) {
    console.timeEnd("DB Connection");
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(process.env.MONGO_URI!);
  const db = client.db("expense-tracker");

  cachedClient = client;
  cachedDb = db;

  console.timeEnd("DB Connection");
  return { client, db };
};

export { connectToDatabase };
