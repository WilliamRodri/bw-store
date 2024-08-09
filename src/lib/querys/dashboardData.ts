import { Mysql } from 'src/configs/db/mysql';

const queryDatabase = async (query: any, params: string[] = []) => {
    const mysql = await Mysql();
    try {
        await mysql.beginTransaction();

        const [result]: any = await mysql.execute(query, params);

        await mysql.commit();
        return result;
    } catch (err) {
        await mysql.rollback();
        throw err;
    } finally {
        await mysql.end();
    }

};

// Funções de seleção de vendas
const selectSales = async (startDate: any, endDate: any) => {
    const query = `SELECT SUM(total) AS total_sales FROM sales WHERE sale_date BETWEEN ? AND ?`;
    return queryDatabase(query, [startDate, endDate]);
};

// Funções para calcular margem de lucro
const calculateProfitMargin = async (startDate: any, endDate: any) => {
    const salesQuery = `SELECT * FROM sales WHERE DATE(sale_date) BETWEEN ? AND ?`;
    const sales = await queryDatabase(salesQuery, [startDate, endDate]);

    let totalProfitMargin = 0;
    for (const sale of sales) {
        let totalCost = 0;
        const products = await queryDatabase(`
            SELECT products.*, sale_products.quantity
            FROM products
            INNER JOIN sale_products ON products.id = sale_products.product_id
            WHERE sale_products.sale_id = ?
        `, [sale.id]);

        for (const product of products) {
            totalCost += parseFloat(product.cost) * parseFloat(product.quantity);
        }
        totalProfitMargin += (parseFloat(sale.total) - totalCost);
    }
    return totalProfitMargin;
};

// Funções específicas para períodos
const getTodayDate = () => new Date().toISOString().split('T')[0];
const getYesterdayDate = () => {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    return now.toISOString().split('T')[0];
};
const getStartOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
};
const getStartOfYear = () => new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

const selectSalesToday = () => selectSales(getTodayDate(), getTodayDate());
const selectSalesYesterday = () => selectSales(getYesterdayDate(), getYesterdayDate());
const selectSalesThisMonth = () => selectSales(getStartOfMonth(), getTodayDate());
const selectSalesThisYear = () => selectSales(getStartOfYear(), getTodayDate());

const calculateProfitMarginToday = () => calculateProfitMargin(getTodayDate(), getTodayDate());
const calculateProfitMarginYesterday = () => calculateProfitMargin(getYesterdayDate(), getYesterdayDate());
const calculateProfitMarginThisMonth = () => calculateProfitMargin(getStartOfMonth(), getTodayDate());
const calculateProfitMarginThisYear = () => calculateProfitMargin(getStartOfYear(), getTodayDate());