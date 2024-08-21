import type { NextApiRequest, NextApiResponse } from 'next/types';
import { Mysql } from 'src/configs/db/mysql';

// Base
// const relatorio = async () => {
//     const mysql = await Mysql();

//     async function totalVendasValor() {}

//     async function totalLucroValor() {}

//     async function totalVendasQtd() {}

//     const totalVendas: any = await totalVendasValor()
//     const totalLucro: any = await totalLucroValor()
//     const qtdVendas: any =  await totalVendasQtd()

//     return {
//         "totalVendas": totalVendas[0].total_sales,
//         "totalLucro": totalLucro,
//         "qtdVendas": qtdVendas[0].total_sales_count
//     }
// }

async function getProductsInSale(saleId: any) {
    const mysql = await Mysql();

    const query = `
        SELECT products.*, sale_products.quantity
        FROM products
        INNER JOIN sale_products ON products.id = sale_products.product_id
        WHERE sale_products.sale_id = ${saleId}
    `;

    const [rows]: any = await mysql.execute(query);
    await mysql.end();
    return rows;
}

const relatorioHoje = async () => {
    const mysql = await Mysql();

    async function totalVendasValor() {
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        const query = `SELECT SUM(total) AS total_sales FROM sales WHERE DATE(sale_date) = "${today}"`;
        const [rows]: any = await mysql.execute(query);
        return rows;
    }

    async function totalLucroValor() {
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        const query = `SELECT * FROM sales WHERE DATE(sale_date) = "${today}"`;
        
        try {
            const [sales]: any = await mysql.execute(query);

            let totalProfitMargin = 0;

            for (const sale of sales) {
                let totalCost = 0;
                let totalSale = sale.total;
                    
                const products = await getProductsInSale(sale.id);
                for (const product of products) {
                    totalCost += parseFloat(product.cost) * parseFloat(product.quantity);
                }

                totalProfitMargin += (totalSale - totalCost);
            }

            return totalProfitMargin;
        } catch (error) {
            throw new Error('[ERROR] Erro ao calcular a margem de lucro: ' + error);
        }
    }

    async function totalVendasQtd() {
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        const query = `
            SELECT COUNT(*) AS total_sales_count
            FROM sales
            WHERE DATE(sale_date) = "${today}"
        `;

        const [rows]: any = await mysql.execute(query);
        return rows;
    }

    try {
        const totalVendas: any = await totalVendasValor()
        const totalLucro: any = await totalLucroValor()
        const qtdVendas: any =  await totalVendasQtd()

        return {
            "totalVendas": totalVendas[0].total_sales,
            "totalLucro": totalLucro,
            "qtdVendas": qtdVendas[0].total_sales_count
        }
    } catch (error) {
        throw new Error(`[error] ao gerar relatorio - ${error}`);
    } finally {
        await mysql.end();
    }
}

const relatorioOntem = async () => {
    const mysql = await Mysql();

    async function totalVendasValor() {
        const now = new Date();
        now.setDate(now.getDate() - 1);
        const yesterday = now.toISOString().split('T')[0];

        const query = `SELECT SUM(total) AS total_sales FROM sales WHERE DATE(sale_date) = "${yesterday}"`;
        const [rows]: any = await mysql.execute(query);
        return rows;
    }

    async function totalLucroValor() {
        const now = new Date();
        now.setDate(now.getDate() - 1);
        const today = now.toISOString().split('T')[0];

        const query = `SELECT * FROM sales WHERE DATE(sale_date) = "${today}"`;
        
        try {
            const [sales]: any = await mysql.execute(query);

            let totalProfitMargin = 0;

            for (const sale of sales) {
                let totalCost = 0;
                let totalSale = sale.total;
                    
                const products = await getProductsInSale(sale.id);
                for (const product of products) {
                    totalCost += parseFloat(product.cost) * parseFloat(product.quantity);
                }

                totalProfitMargin += (totalSale - totalCost);
            }

            return totalProfitMargin;
        } catch (error) {
            throw new Error('[ERROR] Erro ao calcular a margem de lucro: ' + error);
        }
    }

    async function totalVendasQtd() {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const formattedYesterday = yesterday.toISOString().split('T')[0];

        const query = `
            SELECT COUNT(*) AS total_sales_count
            FROM sales
            WHERE DATE(sale_date) = "${formattedYesterday}"
        `;

        const [rows]: any = await mysql.execute(query);
        return rows;
    }

    try {
        const totalVendas: any = await totalVendasValor()
        const totalLucro: any = await totalLucroValor()
        const qtdVendas: any =  await totalVendasQtd()

        return {
            "totalVendas": totalVendas[0].total_sales,
            "totalLucro": totalLucro,
            "qtdVendas": qtdVendas[0].total_sales_count
        }
    } catch (error) {
        throw new Error(`[error] ao gerar relatorio - ${error}`);
    } finally {
        await mysql.end();
    }
}

const relatorio1Semana = async () => {
    const mysql = await Mysql();

    async function totalVendasValor() {
        const now = new Date();
        const endDate = now.toISOString().split('T')[0];

        const startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        const formattedStartDate = startDate.toISOString().split('T')[0];

        const query = `SELECT SUM(total) AS total_sales FROM sales WHERE sale_date BETWEEN "${formattedStartDate}" AND "${endDate}"`;
        
        const [rows]: any = await mysql.execute(query);
        return rows;
    }

    async function totalLucroValor() {
        const now = new Date();
        const lastWeekStart = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
        const lastWeekEnd = new Date(now.getTime());

        const startDate = lastWeekStart.toISOString().split('T')[0];
        const endDate = lastWeekEnd.toISOString().split('T')[0];

        const query = `SELECT * FROM sales WHERE DATE(sale_date) BETWEEN "${startDate}" AND "${endDate}"`;
        
        try {
            const [sales]: any = await mysql.execute(query);

            let totalProfitMargin = 0;

            for (const sale of sales) {
                let totalCost = 0;
                let totalSale = parseFloat(sale.total);

                const products = await getProductsInSale(sale.id);

                for (const product of products) {
                    totalCost += parseFloat(product.cost) * parseFloat(product.quantity);
                }

                totalProfitMargin += (totalSale - totalCost);
            }
            return totalProfitMargin;
        } catch (error) {
            throw new Error('[ERROR] Erro ao calcular a margem de lucro: ' + error);
        }
    }

    async function totalVendasQtd() {
        const now = new Date();
        const lastWeekStart = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
        const lastWeekEnd = new Date(now.getTime());

        const startDate = lastWeekStart.toISOString().split('T')[0];
        const endDate = lastWeekEnd.toISOString().split('T')[0];

        const query = `
            SELECT COUNT(*) AS total_sales_count
            FROM sales
            WHERE DATE(sale_date) BETWEEN "${startDate}" AND "${endDate}"
        `;

        const [rows]: any = await mysql.execute(query);
        return rows;
    }

    try {
        const totalVendas: any = await totalVendasValor()
        const totalLucro: any = await totalLucroValor()
        const qtdVendas: any =  await totalVendasQtd()
    
        return {
            "totalVendas": totalVendas[0].total_sales,
            "totalLucro": totalLucro,
            "qtdVendas": qtdVendas[0].total_sales_count
        }
    } catch (error) {
        throw new Error(`[error] ao gerar relatorio - ${error}`);
    } finally {
        await mysql.end();
    }
}

const relatorioMes = async () => {
    const mysql = await Mysql();

    async function totalVendasValor() {
        const now = new Date();
        const endDate = now.toISOString().split('T')[0];

        // Primeiro dia do mês atual
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const formattedStartDate = startDate.toISOString().split('T')[0];

        const query = `SELECT SUM(total) AS total_sales FROM sales WHERE sale_date BETWEEN "${formattedStartDate}" AND "${endDate}"`;
        const [rows]: any = await mysql.execute(query);

        return rows;
    }

    async function totalLucroValor() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const firstDayOfMonth = new Date(year, month - 1, 1);

        const startDate = firstDayOfMonth.toISOString().split('T')[0];
        const endDate = now.toISOString().split('T')[0];

        const query = `SELECT * FROM sales WHERE DATE(sale_date) BETWEEN "${startDate}" AND "${endDate}"`;
        
        try {
            const [sales]: any = await mysql.execute(query);
            let totalProfitMargin = 0;

            for (const sale of sales) {
                let totalCost = 0;
                let totalSale = sale.total;

                const products = await getProductsInSale(sale.id);

                for (const product of products) {
                    totalCost += parseFloat(product.cost) * parseFloat(product.quantity);
                }

                totalProfitMargin += (totalSale - totalCost);
            }
            return totalProfitMargin;
        } catch (error) {
            throw new Error('[ERROR] Erro ao calcular a margem de lucro: ' + error);
        }
    }

    async function totalVendasQtd() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const query = `
            SELECT COUNT(*) AS total_sales_count
            FROM sales
            WHERE YEAR(sale_date) = "${year}" AND MONTH(sale_date) = "${month}"
        `;

        const [rows]: any = await mysql.execute(query);
        return rows;
    }

    try {
        const totalVendas: any = await totalVendasValor()
        const totalLucro: any = await totalLucroValor()
        const qtdVendas: any =  await totalVendasQtd()
    
        return {
            "totalVendas": totalVendas[0].total_sales,
            "totalLucro": totalLucro,
            "qtdVendas": qtdVendas[0].total_sales_count
        }
    } catch (error) {
        throw new Error(`[error] ao gerar relatorio - ${error}`);
    } finally {
        await mysql.end();
    }
}

const relatorioAnual = async () => {
    const mysql = await Mysql();

    async function totalVendasValor() {
        const now = new Date();
        const endDate = now.toISOString().split('T')[0];

        // Primeiro dia do ano atual
        const startDate = new Date(now.getFullYear(), 0, 1);
        const formattedStartDate = startDate.toISOString().split('T')[0];
        
        const query = `SELECT SUM(total) AS total_sales FROM sales WHERE sale_date BETWEEN "${formattedStartDate}" AND "${endDate}"`;
        const [rows]: any = await mysql.execute(query);
        return rows;
        
    }

    async function totalLucroValor() {
        const now = new Date();
        const year = now.getFullYear();
        const firstDayOfYear = new Date(year, 0, 1);

        const startDate = firstDayOfYear.toISOString().split('T')[0];
        const endDate = now.toISOString().split('T')[0];

        const query = `SELECT * FROM sales WHERE DATE(sale_date) BETWEEN "${startDate}" AND "${endDate}"`;
        
        try {
            const [sales]: any = await mysql.execute(query);
            let totalProfitMargin = 0;

            for (const sale of sales) {
                let totalCost = 0;
                let totalSale = sale.total;

                const products = await getProductsInSale(sale.id);

                for (const product of products) {
                    totalCost += parseFloat(product.cost) * parseFloat(product.quantity);
                }

                totalProfitMargin += (totalSale - totalCost);
            }

            return totalProfitMargin;
        } catch (error) {
            console.log(`[ERROR] - ${error}`)
            throw new Error('[ERROR] Erro ao calcular a margem de lucro: ' + error);
        }
    }

    async function totalVendasQtd() {
        const now = new Date();
        const year = now.getFullYear();
        
        const query = `
            SELECT COUNT(*) AS total_sales_count
            FROM sales
            WHERE YEAR(sale_date) = "${year}"
        `;

        const [rows]: any = await mysql.execute(query);
        return rows;
    }

    try {
        const totalVendas: any = await totalVendasValor()
        const totalLucro: any = await totalLucroValor()
        const qtdVendas: any =  await totalVendasQtd()
    
        return {
            "totalVendas": totalVendas[0].total_sales,
            "totalLucro": totalLucro,
            "qtdVendas": qtdVendas[0].total_sales_count
        }
    } catch (error) {
        throw new Error(`[error] ao gerar relatorio - ${error}`);
    } finally {
        await mysql.end();
    }
}

const relatorioTotal = async () => {
    const mysql = await Mysql();

    async function totalVendasValor() {
        const query = `SELECT SUM(total) AS total_sales FROM sales`;
        const [rows]: any = await mysql.execute(query);
        return rows;
    }

    async function totalLucroValor() {
        const query = `SELECT * FROM sales`;
        
        try {
            const [sales]: any = await mysql.execute(query);
            let totalProfitMargin = 0;

            for (const sale of sales) {
                let totalCost = 0;
                let totalSale = sale.total;

                const products = await getProductsInSale(sale.id);

                for (const product of products) {
                    totalCost += parseFloat(product.cost) * parseFloat(product.quantity);
                }

                totalProfitMargin += (parseFloat(totalSale) - totalCost);
            }
            return totalProfitMargin;
        } catch (error) {
            console.log(`[ERROR] - ${error}`)
            throw new Error('[ERROR] Erro ao calcular a margem de lucro: ' + error);
        }
    }

    async function totalVendasQtd() {
        const query = `SELECT SUM(total) AS total_sales FROM sales`;
        const [rows]: any = await mysql.execute(query);
        return rows;
    }

    try {
        const totalVendas: any = await totalVendasValor()
        const totalLucro: any = await totalLucroValor()
        const qtdVendas: any =  await totalVendasQtd()

        return {
            "totalVendas": totalVendas[0].total_sales,
            "totalLucro": totalLucro,
            "qtdVendas": qtdVendas[0].total_sales
        }
    } catch (error) {
        throw new Error(`[error] ao gerar relatorio - ${error}`);
    } finally {
        await mysql.end();
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    try {
        if (typeof id !== 'string' || id == null || id == "") {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        let resultado;

        switch (id) {
            case "0": 
                resultado = await relatorioHoje();
                break;
            case "1":
                resultado = await relatorioOntem();
                break;
            case "2":
                resultado = await relatorio1Semana();
                break;
            case "3":
                resultado = await relatorioMes();
                break;
            case "4":
                resultado = await relatorioAnual();
                break;
            case "5":
                resultado = await relatorioTotal();
                break;
            default:
                return res.status(400).json({ error: 'ID não reconhecido.' });
        }

        return res.status(200).json(resultado);
    } catch (error) {
        console.error('Erro ao buscar o relatorio:', error);
        res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
    }
}