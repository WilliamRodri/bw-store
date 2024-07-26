import type { NextApiRequest, NextApiResponse } from 'next/types';
import { getCollection } from 'src/configs/db/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Verifica se o ID é válido
  if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid or missing ID' });
    return;
  }

  try {
    const collection = await getCollection('pedidos');
    const data = await collection.findOne({ _id: new ObjectId(id) });

    if (!data) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error connecting to the database or fetching data", error);
    res.status(500).json({ error: 'Database connection or query failed' });
  }
}