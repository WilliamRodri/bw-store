// Importe o Express e outras dependências necessárias
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { getCollection } from 'src/configs/db/mongodb';

// Função para lidar com a requisição POST para adicionar um novo Modelo
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const collection = await getCollection('pedidos');
      const numeroAleatorio = Math.floor(Math.random() * 100000);

      // Verifique se req.body não é null e se contém as propriedades esperadas
      const formData = req.body;
      if (!formData || !formData.identificacao_pedido || !formData.modelos) {
        return res.status(400).json({ error: 'Campos obrigatórios não foram fornecidos.' });
      }

      // Exemplo: conectar ao banco de dados e salvar os dados recebidos
      const { identificacao_pedido, modelos } = formData;

      // Estruturar os dados para salvar no banco de dados
      const newData = {
        id: numeroAleatorio,
        identificacao_pedido,
        modelos
      };
      // Salvar os dados no banco de dados
      const result = await collection.insertOne(newData);

      if (result) {
        res.status(201).json({ message: 'Pedido gerado com sucesso.' });
      } else {
        res.status(500).json({ error: 'Falha ao gerar o Pedido.' });
      }

    } catch (error) {
      console.error('Erro ao gerar o Pedido:', error);
      res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Método ${req.method} não permitido.` });
  }
}