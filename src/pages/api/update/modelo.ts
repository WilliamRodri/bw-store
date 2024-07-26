// Importe o Express e outras dependências necessárias
import type { NextApiRequest, NextApiResponse } from 'next/types';
import { getCollection } from 'src/configs/db/mongodb';
import { ObjectId } from 'mongodb';

// Função para lidar com a requisição POST para adicionar um novo Modelo
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const collection = await getCollection('custo_modelos');

      // Verifique se req.body não é null e se contém as propriedades esperadas
      const formData = req.body;
      if (!formData || !formData.id || !formData.nome_modelo || !formData.valorImposto || !formData.valorPrecoVenda || !formData.materia_prima || !formData.aviamentos || !formData.embalagem_outros || !formData.mao_de_obra) {
        return res.status(400).json({ error: 'Campos obrigatórios não foram fornecidos.' });
      }

      // Exemplo: conectar ao banco de dados e salvar os dados recebidos
      const { id, nome_modelo, valorImposto, valorPrecoVenda, materia_prima, aviamentos, embalagem_outros, mao_de_obra } = formData;

      let objectId: ObjectId | null = null;
      try {
        objectId = new ObjectId(id);
      } catch (error) {
        console.error('Erro ao criar ObjectId:', error);
        return res.status(400).json({ error: 'ID fornecido não é válido.' });
      }

      // Estruturar os dados para salvar no banco de dados
      const newData = {
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
      const result = await collection.updateOne({ _id: objectId }, { $set: newData });

      if (result) {
        res.status(201).json({ message: 'Modelo atualizado com sucesso.' });
      } else {
        res.status(500).json({ error: 'Falha ao atualizado o Modelo.' });
      }

    } catch (error) {
      console.error('Erro ao atualizado Modelo:', error);
      res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Método ${req.method} não permitido.` });
  }
}