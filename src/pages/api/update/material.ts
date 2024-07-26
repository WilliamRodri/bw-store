// Importe o Express e outras dependências necessárias
import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { getCollection } from 'src/configs/db/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const collection = await getCollection('materiais');
      const { _id, mater_prima_aviamentos, un_medida, preco_unit_s_frete, frete_fob, preco_unit_c_frete, fornecedor } = req.body;

      if (!_id || !mater_prima_aviamentos || !un_medida) {
        return res.status(400).json({ error: 'Campos obrigatórios não foram fornecidos.' });
      }

      let objectId: ObjectId | null = null;
      try {
        objectId = new ObjectId(_id);
      } catch (error) {
        console.error('Erro ao criar ObjectId:', error);
        return res.status(400).json({ error: 'ID fornecido não é válido.' });
      }

      const updateData = {
        mater_prima_aviamentos,
        un_medida,
        preco_unit_s_frete: parseFloat(preco_unit_s_frete),
        frete_fob: parseFloat(frete_fob),
        preco_unit_c_frete: parseFloat(preco_unit_c_frete),
        fornecedor: fornecedor || ''
      };

      const result = await collection.updateOne({ _id: objectId }, { $set: updateData });

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: 'Material atualizado com sucesso.' });
      } else {
        res.status(500).json({ error: 'Falha ao atualizar o material.' });
      }

    } catch (error) {
      console.error('Erro ao atualizar material:', error);
      res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Método ${req.method} não permitido.` });
  }
}