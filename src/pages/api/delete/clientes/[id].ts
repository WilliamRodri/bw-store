import type { NextApiRequest, NextApiResponse } from 'next/types';
import deleteData from 'src/lib/querys/delete';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === 'DELETE') {
        try {
            await deleteData(req, 'clients', 'sales', 'client_id', id);
            res.status(200).json({ message: 'Cliente deletada com sucesso.' });
        } catch (error) {
            console.error('Erro ao deletar o cliente:', error);
            res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).json({ error: `Método ${req.method} não permitido.` });
    }
}