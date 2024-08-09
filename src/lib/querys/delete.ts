import { Mysql } from 'src/configs/db/mysql';

export default async function deleteData(table: string, associatedTable: string | null, columnId: string, id: number): Promise<void> {
    const mysql = await Mysql();

    try {
        await mysql.beginTransaction();

        if (associatedTable !== null) {
            const checkQuery = `SELECT * FROM ${associatedTable} WHERE ${columnId} = ?`;
            const [rows]: any = await mysql.execute(checkQuery, [id]);

            if (rows.length > 0) {
                const updateQuery = `UPDATE ${associatedTable} SET ${columnId} = NULL WHERE ${columnId} = ?`;
                await mysql.execute(updateQuery, [id]);
            }

            await deleteRecord(mysql, table, id);
        } else {
            await deleteRecord(mysql, table, id);
        }

        await mysql.commit();
    } catch (error) {
        await mysql.rollback();
        console.error("Error executing delete operation", error);
        throw error;
    } finally {
        await mysql.end();
    }
}

async function deleteRecord(mysql: any, table: string, id: number): Promise<void> {
    const deleteQuery = `DELETE FROM ${table} WHERE id = ?`;
    await mysql.execute(deleteQuery, [id]);
}