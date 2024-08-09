import { Mysql } from 'src/configs/db/mysql';

export default async function insertData(table: string, data: object): Promise<number> {
    const mysql = await Mysql();
    try {
        await mysql.beginTransaction();
        const insertQuery = `INSERT INTO ${table} SET ?`;

        const [result]: any = await mysql.execute(insertQuery, [data]);

        await mysql.commit();
        return result.insertId;
    } catch (err) {
        await mysql.rollback();
        throw err;
    } finally {
        await mysql.end();
    }
}