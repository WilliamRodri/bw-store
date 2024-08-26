import type { NextApiRequest, NextApiResponse } from 'next/types';
import updateData from 'src/lib/querys/update';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === 'DELETE') {
        try {
            await updateData(req, 'products', { status: 'hidden' }, id);
            res.status(200).json({ message: 'Produto deletada com sucesso.' });
        } catch (error) {
            console.error('Erro ao deletar o produto:', error);
            res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).json({ error: `Método ${req.method} não permitido.` });
    }
}