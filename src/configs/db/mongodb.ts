import { MongoClient, Db, Collection, Document } from 'mongodb';

const username = 'wr8476477';
const password = 'EkPCpSnigwgdlVDU';
const uri = process.env.MONGODB_URI || `mongodb+srv://${username}:${password}@custoconfeccao.as00bcv.mongodb.net/?retryWrites=true&w=majority&appName=custoConfeccao`;
// const uri = process.env.MONGODB_URI || `mongodb://localhost:27017`;
const dbName = process.env.MONGODB_DB || 'sistema_custo_confeccao';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db(dbName);
  return cachedDb;
}

export async function getCollection(collectionName: string): Promise<Collection<Document>> {
  const db = await connectToDatabase();
  return db.collection(collectionName);
}