import type { NextApiRequest, NextApiResponse } from 'next/types';
import selectData from 'src/lib/querys/select';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [sales, clients, salesProducts, paymentMethod] = await Promise.all([
      selectData('sales'),
      selectData('clients'),
      selectData('sale_products'),
      selectData('payment_methods')
    ]);
    const products = await selectData('products');
    res.status(200).json({sales, clients, salesProducts, paymentMethod, products});
  } catch (error) {
    console.error("Error connecting to the database or fetching data", error);
    res.status(500).json({ error: 'Database connection or query failed' });
  }
}