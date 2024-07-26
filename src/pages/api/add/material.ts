// Importe o Express e outras dependências necessárias
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { getCollection } from 'src/configs/db/mongodb';

// Função para lidar com a requisição POST para adicionar um novo material
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
        const collection = await getCollection('materiais');
        const numeroAleatorio = Math.floor(Math.random() * 100000);
      // Verifique se req.body não é null e se contém as propriedades esperadas
      if (!req.body || !req.body.mater_prima_aviamentos || !req.body.un_medida) {
        return res.status(400).json({ error: 'Campos obrigatórios não foram fornecidos.' });
      }

      // Exemplo: conectar ao banco de dados e salvar os dados recebidos
      const { mater_prima_aviamentos, un_medida, preco_unit_s_frete, frete_fob, preco_unit_c_frete, fornecedor } = req.body;

      // Exemplo: salvar os dados no banco de dados
      const newData = {
        id: numeroAleatorio,
        mater_prima_aviamentos,
        un_medida,
        preco_unit_s_frete: parseFloat(preco_unit_s_frete),
        frete_fob: parseFloat(frete_fob),
        preco_unit_c_frete: parseFloat(preco_unit_c_frete),
        fornecedor: fornecedor || ''
      };

      const result = await collection.insertOne(newData);
      
      if (result) {
        res.status(201).json({ message: 'Material adicionado com sucesso.' });
      } else {
        res.status(500).json({ error: 'Falha ao adicionar o material.' });
      }

    } catch (error) {
      console.error('Erro ao adicionar material:', error);
      res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Método ${req.method} não permitido.` });
  }
}