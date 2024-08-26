import type { NextApiRequest, NextApiResponse } from 'next/types';
import selectData from 'src/lib/querys/select';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [sales, clients, salesProducts, paymentMethod] = await Promise.all([
      selectData(req, 'sales'),
      selectData(req, 'clients'),
      selectData(req, 'sale_products'),
      selectData(req, 'payment_methods')
    ]);
    const products = await selectData(req, 'products');
    res.status(200).json({sales, clients, salesProducts, paymentMethod, products});
  } catch (error) {
    console.error("Error connecting to the database or fetching data", error);
    res.status(500).json({ error: 'Database connection or query failed' });
  }
}