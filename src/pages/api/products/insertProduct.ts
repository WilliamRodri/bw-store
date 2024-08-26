import type { NextApiRequest, NextApiResponse } from 'next/types';
import { Mysql } from 'src/configs/db/mysql';
import insertData from 'src/lib/querys/insert';

export default async function insertProduct(req: NextApiRequest, res: NextApiResponse) {
    const mysql = await Mysql(req);

    if (req.method === "POST") {
        try {
            const data = req.body;
    
            await insertData(req, 'products', data);
    
            return res.status(200).json({ message: 'Success' });
        } catch (error) {
            console.error("Error generate product: ", error);
            return res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            await mysql.end();
        }
    } else {
        res.status(405).json({ error: `Método ${req.method} não permitido.` });
    }
}