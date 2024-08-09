import { Mysql } from 'src/configs/db/mysql';

export default async function selectDataWithCondition(table: string, column: string, value: any): Promise<any> {
    const mysql = await Mysql();

    try {
        const query = `SELECT * FROM ${table} WHERE ${column} = ?`;
        const [results]: any = await mysql.execute(query, [value]);

        return results;
    } catch (error) {
        console.error("Error selecting data with condition", error);
        throw error;
    } finally {
        await mysql.end();
    }
}