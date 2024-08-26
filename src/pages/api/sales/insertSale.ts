import type { NextApiRequest, NextApiResponse } from 'next/types';
import { Mysql } from 'src/configs/db/mysql';
import insertData from 'src/lib/querys/insert';
import selectDataWithCondition from 'src/lib/querys/selectDataWithCondition';
import updateData from 'src/lib/querys/update';

export default async function insertSale(req: NextApiRequest, res: NextApiResponse) {
    const mysql = await Mysql(req);

    if (req.method === "POST") {
        try {
            const data = req.body;
            const items = data.items;

            const subtotal = parseFloat(data.subtotal);
    
            const saleId = await insertData(req, 'sales', {
                total: subtotal,
                discount: parseFloat(data.discountSale),
                client_id: data.client,
                sale_date: data.date,
                payment_method_id: data.paymentMethod,
            });
    
            for (const item of items) {
                await insertData(req, 'sale_products', {
                    sale_id: saleId,
                    product_id: item.product_id,
                    quantity: parseInt(item.quantity),
                    discountProduct: parseFloat(item.discountProduct) || 0
                });
    
                const product = await selectDataWithCondition(req, 'products', 'id', item.product_id);
                const newStock = product[0].stock - parseInt(item.quantity);
                await updateData(req, 'products', { stock: newStock }, item.product_id);
            }
    
            return res.status(200).json({ id: saleId });
        } catch (error) {
            console.error("Error generate sale: ", error);
            return res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            await mysql.end();
        }
    } else {
        res.status(405).json({ error: `Método ${req.method} não permitido.` });
    }
}