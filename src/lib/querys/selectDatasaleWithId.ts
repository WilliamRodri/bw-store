import { Mysql } from 'src/configs/db/mysql';

export default async function selectDatasaleWithId(id: any): Promise<any> {
    const mysql = await Mysql();

    try {
        const querySales = `SELECT * FROM sales WHERE id = ?`;
        const queryClients = `SELECT * FROM clients WHERE id = ?`;
        const queryPaymentMethod = `SELECT * FROM payment_methods WHERE id = ?`;
        const querySaleProducts = `
            SELECT sp.*, p.name AS product_name, p.price AS unit_price 
            FROM sale_products sp 
            JOIN products p ON sp.product_id = p.id 
            WHERE sp.sale_id = ?
        `;

        // Obter os dados da venda
        const [saleResults]: any = await mysql.execute(querySales, [id]);
        if (saleResults.length === 0) {
            return null;
        }

        const sale = saleResults[0];

        // Obter os dados do cliente
        const [clientResults]: any = await mysql.execute(queryClients, [sale.client_id]);
        const client = clientResults[0];

        // Obter os dados do método de pagamento
        const [paymentMethodResults]: any = await mysql.execute(queryPaymentMethod, [sale.payment_method_id]);
        const paymentMethod = paymentMethodResults[0];

        // Obter os produtos da venda
        const [saleProductsResults]: any = await mysql.execute(querySaleProducts, [id]);

        return {
            sale,
            client,
            paymentMethod,
            saleProducts: saleProductsResults
        };
    } catch (error) {
        console.error("Error selecting sale data with ID", error);
        throw error;
    } finally {
        await mysql.end();
    }
}