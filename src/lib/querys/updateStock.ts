import { Mysql } from 'src/configs/db/mysql';

export default async function updateStock(req: any, table: string, id: number, quantity: number): Promise<any> {
    const mysql = await Mysql(req);

    try {
        const query = `UPDATE ${table} SET stock = stock + ? WHERE id = ?`;
        const [result]: any = await mysql.execute(query, [quantity, id]);

        return result;
    } catch (error) {
        console.error("Error updating stock", error);
        throw error;
    } finally {
        await mysql.end();
    }
}