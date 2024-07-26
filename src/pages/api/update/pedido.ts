// Importe o Express e outras dependências necessárias
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { getCollection } from 'src/configs/db/mongodb';
import { ObjectId } from 'mongodb';

// Função para lidar com a requisição POST para adicionar um novo Modelo
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const collection = await getCollection('pedidos');

      // Verifique se req.body não é null e se contém as propriedades esperadas
      const formData = req.body;
      if (!formData || !formData._id || !formData.identificacao_pedido || !formData.modelos) {
        return res.status(400).json({ error: 'Campos obrigatórios não foram fornecidos.' });
      }

      // Exemplo: conectar ao banco de dados e salvar os dados recebidos
      const { _id, identificacao_pedido, modelos } = formData;

      let objectId: ObjectId | null = null;
      try {
        objectId = new ObjectId(_id);
      } catch (error) {
        console.error('Erro ao criar ObjectId:', error);
        return res.status(400).json({ error: 'ID fornecido não é válido.' });
      }

      // Estruturar os dados para salvar no banco de dados
      const newData = {
        identificacao_pedido,
        modelos
      };
      // Salvar os dados no banco de dados
      const result = await collection.updateOne({ _id: objectId }, { $set: newData });

      if (result) {
        res.status(201).json({ message: 'Pedido atualizado com sucesso.' });
      } else {
        res.status(500).json({ error: 'Falha ao atualizado o Pedido.' });
      }

    } catch (error) {
      console.error('Erro ao atualizado Pedido:', error);
      res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Método ${req.method} não permitido.` });
  }
}