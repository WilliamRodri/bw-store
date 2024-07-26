// Importe o Express e outras dependências necessárias
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { getCollection } from 'src/configs/db/mongodb';

// Função para lidar com a requisição POST para adicionar um novo material
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
        const collection = await getCollection('usuarios');
        const numeroAleatorio = Math.floor(Math.random() * 100000);
        // Verifique se req.body não é null e se contém as propriedades esperadas
        if (!req.body || !req.body.username || !req.body.password) {
            return res.status(400).json({ error: 'Campos obrigatórios não foram fornecidos.' });
        }

      // Exemplo: conectar ao banco de dados e salvar os dados recebidos
      const { username, password } = req.body;

      // Exemplo: salvar os dados no banco de dados
      const newData = {
        id: numeroAleatorio,
        username,
        password,
      };

      const result = await collection.insertOne(newData);
      
      if (result) {
        res.status(201).json({ message: 'Usuario cadastrado com sucesso.' });
      } else {
        res.status(500).json({ error: 'Falha ao cadastrar o Usuario.' });
      }

    } catch (error) {
      console.error('Erro ao cadastrar o usuario:', error);
      res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Método ${req.method} não permitido.` });
  }
}