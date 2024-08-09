import type { NextApiRequest, NextApiResponse } from 'next/types';
import { Mysql } from 'src/configs/db/mysql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    const mysql = await Mysql();

    try {
        const querySales = `SELECT * FROM sales WHERE id = ?`;
        const queryClients = `SELECT * FROM clients WHERE id = ?`;
        const queryPaymentMethod = `SELECT * FROM payment_methods WHERE id = ?`;
        const querySaleProducts = `
            SELECT sp.*, p.name AS product_name, p.price AS unit_price 
            FROM sale_products sp 
            JOIN products p ON sp.product_id = p.id 
            WHERE sp.sale_id = ?
        `;

        const [saleResults]: any = await mysql.execute(querySales, [id]);
        if (saleResults.length === 0) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        const sale = saleResults[0];
        const [clientResults]: any = await mysql.execute(queryClients, [sale.client_id]);
        const client = clientResults[0];
        const [paymentMethodResults]: any = await mysql.execute(queryPaymentMethod, [sale.payment_method_id]);
        const paymentMethod = paymentMethodResults[0];
        const [saleProductsResults]: any = await mysql.execute(querySaleProducts, [id]);

        return res.status(200).json({
            sale,
            client,
            paymentMethod,
            saleProducts: saleProductsResults
        });
    } catch (error) {
        console.error("Error selecting sale data with ID", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await mysql.end();
    }
}