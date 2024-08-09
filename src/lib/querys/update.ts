import { Mysql } from 'src/configs/db/mysql';

export default async function updateData(table: string, data: object, id: number): Promise<any> {
    const mysql = await Mysql();

    try {
        const updateQuery = `UPDATE ${table} SET ? WHERE id = ?`;
        const [result]: any = await mysql.execute(updateQuery, [data, id]);

        return result;
    } catch (error) {
        console.error("Error connecting to the database or updating data", error);
        throw error;
    } finally {
        await mysql.end();
    }
}