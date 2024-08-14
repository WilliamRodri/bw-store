import { Mysql } from 'src/configs/db/mysql';

export default async function insertData(table: string, data: object): Promise<number> {
    const mysql = await Mysql();
    try {
        await mysql.beginTransaction();

        // Obter as chaves e valores dos dados
        const columns = Object.keys(data).join(', ');
        const values = Object.values(data);
        const placeholders = values.map(() => '?').join(', ');

        // Construir a query SQL
        const insertQuery = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

        const [result]: any = await mysql.execute(insertQuery, values);

        await mysql.commit();
        return result.insertId;
    } catch (err) {
        await mysql.rollback();
        throw err;
    } finally {
        await mysql.end();
    }
}