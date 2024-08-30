import type { NextApiRequest, NextApiResponse } from 'next/types';
import selectData from 'src/lib/querys/select';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        const totalProducts = await selectData(req, 'products');
        const totalClients = await selectData(req, 'clients');
        const totalSales = await selectData(req, 'sales');
        const orders = await selectData(req, 'orders');

        const productsLength = totalProducts.length;
        const clientsLength = totalClients.length;
        const salesLength = totalSales.length;
        let orderLength = 0;

        for (const order of orders) {
            if (order.status == "PENDENTE") {
                orderLength++
            }
        }

        res.status(200).json({
            productsLength,
            clientsLength,
            salesLength,
            orderLength
        })
    } catch (error) {
        console.error("Error connecting to the database or fetching data", error);
        res.status(500).json({ error: 'Database connection or query failed' });
    }
}