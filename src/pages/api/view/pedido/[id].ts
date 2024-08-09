import type { NextApiRequest, NextApiResponse } from 'next/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    res.status(200).json({id});
  } catch (error) {
    console.error("Error connecting to the database or fetching data", error);
    res.status(500).json({ error: 'Database connection or query failed' });
  }
}