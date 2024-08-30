import type { NextApiRequest, NextApiResponse } from 'next/types';
import { Mysql } from 'src/configs/db/mysql';

const getProductsInSale = async (mysql: any, saleId: any) => {
    const query = `
        SELECT products.*, sale_products.quantity
        FROM products
        INNER JOIN sale_products ON products.id = sale_products.product_id
        WHERE sale_products.sale_id = ?
    `;

    const [rows]: any = await mysql.execute(query, [saleId]);
    return rows;
};

const calculateProfit = async (mysql: any, sales: any[], req: NextApiRequest) => {
    let totalProfitMargin = 0;
    console.log(req);

    for (const sale of sales) {
        let totalCost = 0;
        const totalSale = sale.total;

        const products = await getProductsInSale(mysql, sale.id);
        for (const product of products) {
            totalCost += parseFloat(product.cost) * parseFloat(product.quantity);
        }

        totalProfitMargin += (totalSale - totalCost);
    }

    return totalProfitMargin;
};

const generateReport = async (req: NextApiRequest, filterId: number) => {
    const mysql = await Mysql(req);
    const now = new Date();
    let startDate = now.toISOString().split('T')[0];
    let endDate = startDate;

    if (filterId === 6) { // Personalizado
        startDate = req.query.startDate as string;
        endDate = req.query.endDate as string;
    } else {
        switch (filterId) {
            case 0: // Hoje
                break;
            case 1: // Ontem
                now.setDate(now.getDate() - 1);
                startDate = endDate = now.toISOString().split('T')[0];
                break;
            case 2: // Esta Semana
                now.setDate(now.getDate() - now.getDay());
                startDate = now.toISOString().split('T')[0];
                endDate = new Date().toISOString().split('T')[0];
                break;
            case 3: // Este Mês
                startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                break;
            case 4: // Este Ano
                startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
                break;
            case 5: // Todo Período
                startDate = '1970-01-01';
                break;
            default:
                throw new Error("Filtro inválido");
        }
    }

    try {
        const salesQuery = `
            SELECT * FROM sales WHERE DATE(sale_date) BETWEEN ? AND ?
        `;
        const totalSalesQuery = `
            SELECT SUM(total) AS total_sales FROM sales WHERE DATE(sale_date) BETWEEN ? AND ?
        `;
        const totalSalesCountQuery = `
            SELECT COUNT(*) AS total_sales_count FROM sales WHERE DATE(sale_date) BETWEEN ? AND ?
        `;

        const ordersCountQuery = `
            SELECT COUNT(*) AS total_orders FROM orders WHERE DATE(order_date) BETWEEN ? AND ? AND status = 'FINALIZADO'
        `;
        const ordersProfitQuery = `
            SELECT SUM(price) AS total_profit FROM orders WHERE DATE(order_date) BETWEEN ? AND ? AND status = 'FINALIZADO'
        `;

        const [sales]: any = await mysql.execute(salesQuery, [startDate, endDate]);

        const [totalVendas]: any = await mysql.execute(totalSalesQuery, [startDate, endDate]);
        const [qtdVendas]: any = await mysql.execute(totalSalesCountQuery, [startDate, endDate]);

        const [totalOrdens]: any = await mysql.execute(ordersCountQuery, [startDate, endDate]);
        const [totalLucroOrdens]: any = await mysql.execute(ordersProfitQuery, [startDate, endDate]);

        const totalLucro = await calculateProfit(mysql, sales, req);

        return {
            totalVendas: totalVendas[0]?.total_sales || 0,
            qtdVendas: qtdVendas[0]?.total_sales_count || 0,
            totalLucro: totalLucro,
            totalOrdens: totalOrdens[0].total_orders,
            totalLucroOrdens: totalLucroOrdens[0].total_profit
        };

    } catch (error) {
        console.error("Erro ao gerar relatório:", error);
        throw new Error("Erro ao gerar relatório");
    } finally {
        await mysql.end();
    }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const filterId = parseInt(req.query.id as string);
        const report = await generateReport(req, filterId);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({error});
    }
};