import type { NextApiRequest, NextApiResponse } from 'next/types';
import deleteWithAssociation from 'src/lib/querys/deleteWithAssociation';
import selectDataWithCondition from 'src/lib/querys/selectDataWithCondition';
import updateStock from 'src/lib/querys/updateStock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const { returnsStock } = req.body;

    if (req.method === 'DELETE') {
        try {
            if (typeof id !== 'string') {
                return res.status(400).json({ error: 'ID inválido.' });
            }

            if (returnsStock === 'on') {
                const saleProducts = await selectDataWithCondition(req, 'sale_products', 'sale_id', id);
                
                await Promise.all(saleProducts.map(async (saleProduct: any) => {
                    const productId = saleProduct.product_id;
                    const quantity = saleProduct.quantity;

                    try {
                        await updateStock(req, 'products', productId, quantity);
                    } catch (err) {
                        console.log(`[ERROR] Error ao atualizar o estoque do produto ${productId}: ${err}`);
                    }
                }));
            }

            await deleteWithAssociation(req, 'sales', 'sale_products', 'sale_id', id);
            res.status(200).json({ message: 'Venda deletada com sucesso.' });
        } catch (error) {
            console.error('Erro ao deletar venda:', error);
            res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).json({ error: `Método ${req.method} não permitido.` });
    }
}