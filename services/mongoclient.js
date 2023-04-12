import { MongoClient } from "mongodb";

let cachedDb = null;
export default async function connectToDatabase(uri, database) {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db(database);
  cachedDb = db;
  return db;
}
