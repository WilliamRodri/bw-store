import type { NextApiRequest, NextApiResponse } from 'next/types';
import { getCollection } from 'src/configs/db/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const collection = await getCollection('usuarios');
    const data = await collection.find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error connecting to the database or fetching data", error);
    res.status(500).json({ error: 'Database connection or query failed' });
  }
}