// Importe o Express e outras dependências necessárias
import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { getCollection } from 'src/configs/db/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Acessando o parâmetro id da rota

  if (req.method === 'DELETE') {
    try {
      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'ID inválido.' });
      }

      const collection = await getCollection('materiais');
      const objectId = new ObjectId(id);

      const result = await collection.deleteOne({ _id: objectId });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Material deletado com sucesso.' });
      } else {
        res.status(404).json({ error: 'Material não encontrado.' });
      }

    } catch (error) {
      console.error('Erro ao deletar material:', error);
      res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ error: `Método ${req.method} não permitido.` });
  }
}