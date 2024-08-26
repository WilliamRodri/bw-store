import { Mysql } from 'src/configs/db/mysql';

export default async function selectData(req: any, table: string): Promise<any> {
    const mysql = await Mysql(req);
    try {
        let query: string;

        if (table === 'products') {
            query = `
                SELECT products.*, categories.name AS category_name
                FROM products
                INNER JOIN categories ON products.category_id = categories.id 
                WHERE products.status = 'visible'
                ORDER BY products.created_at DESC
            `;
        } else {
            query = `SELECT * FROM ${table} ORDER BY created_at DESC`;
        }

        const [rows]: any = await mysql.execute(query);

        return rows;
    } catch (error) {
        console.error("Error connecting to the database or fetching data", error);
        throw error;
    } finally {
        await mysql.end();
    }
}