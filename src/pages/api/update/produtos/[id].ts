import type { NextApiRequest, NextApiResponse } from 'next/types';
import updateData from 'src/lib/querys/update';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const data = req.body;

    if (req.method === 'POST') {
        try {
            await updateData('products', data, id);
            res.status(200).json({ message: 'Produto atualizado com sucesso.' });
        } catch (error) {
            console.error('Erro ao atualizar o produto:', error);
            res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Método ${req.method} não permitido.` });
    }
}