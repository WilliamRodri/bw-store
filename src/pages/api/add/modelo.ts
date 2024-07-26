// Importe o Express e outras dependências necessárias
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { getCollection } from 'src/configs/db/mongodb';

// Função para lidar com a requisição POST para adicionar um novo Modelo
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const collection = await getCollection('custo_modelos');
      const numeroAleatorio = Math.floor(Math.random() * 100000);

      // Verifique se req.body não é null e se contém as propriedades esperadas
      const formData = req.body;
      if (!formData || !formData.nome_modelo || !formData.valorImposto || !formData.valorPrecoVenda || !formData.materia_prima || !formData.aviamentos || !formData.embalagem_outros || !formData.mao_de_obra) {
        return res.status(400).json({ error: 'Campos obrigatórios não foram fornecidos.' });
      }

      // Exemplo: conectar ao banco de dados e salvar os dados recebidos
      const { nome_modelo, valorImposto, valorPrecoVenda, materia_prima, aviamentos, embalagem_outros, mao_de_obra } = formData;

      // Estruturar os dados para salvar no banco de dados
      const newData = {
        id: numeroAleatorio,
        nome_modelo,
        valorImposto,
        valorPrecoVenda,
        materia_prima: materia_prima.map((item: any) => ({
          mater_prima_aviamentos: item.materia_prima_aviamentos,
          un_medida: item.un_medida,
          consumo_p_peca: item.consumo_p_peca,
          preco_unit: parseFloat(item.price),
          frete_fob: 0,
          preco_total: parseFloat(item.price_total),
          fornecedor: item.fornecedor || ''
        })),
        aviamentos: aviamentos.map((item: any) => ({
          mater_prima_aviamentos: item.materia_prima_aviamentos,
          un_medida: item.un_medida,
          consumo_p_peca: item.consumo_p_peca,
          preco_unit: parseFloat(item.price),
          frete_fob: 0,
          preco_total: parseFloat(item.price_total),
          fornecedor: item.fornecedor || ''
        })),
        embalagem_outros: embalagem_outros.map((item: any) => ({
          mater_prima_aviamentos: item.materia_prima_aviamentos,
          un_medida: item.un_medida,
          consumo_p_peca: item.consumo_p_peca,
          preco_unit: parseFloat(item.price),
          frete_fob: 0,
          preco_total: parseFloat(item.price_total),
          fornecedor: item.fornecedor || ''
        })),
        mao_de_obra: mao_de_obra.map((item: any) => ({
          mater_prima_aviamentos: item.materia_prima_aviamentos,
          un_medida: item.un_medida,
          consumo_p_peca: item.consumo_p_peca,
          preco_unit: parseFloat(item.price),
          frete_fob: 0,
          preco_total: parseFloat(item.price_total),
          fornecedor: item.fornecedor || ''
        }))
      };
      // Salvar os dados no banco de dados
      const result = await collection.insertOne(newData);

      if (result) {
        res.status(201).json({ message: 'Modelo adicionado com sucesso.' });
      } else {
        res.status(500).json({ error: 'Falha ao adicionar o Modelo.' });
      }

    } catch (error) {
      console.error('Erro ao adicionar Modelo:', error);
      res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Método ${req.method} não permitido.` });
  }
}