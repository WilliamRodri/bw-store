import type { NextApiRequest, NextApiResponse } from 'next/types';
import selectData from 'src/lib/querys/select';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const clients = await selectData(req, 'clients');
    res.status(200).json({clients});
  } catch (error) {
    console.error("Error connecting to the database or fetching data", error);
    res.status(500).json({ error: 'Database connection or query failed' });
  }
}