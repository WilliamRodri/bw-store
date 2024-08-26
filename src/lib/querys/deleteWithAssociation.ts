import { Mysql } from 'src/configs/db/mysql';

export default async function deleteWithAssociation(req: any, table: string, associatedTable: string | null, columnId: string, id: number | string | any): Promise<void> {
    const mysql = await Mysql(req);

    try {
        await mysql.beginTransaction();

        if (associatedTable !== null) {
            const checkQuery = `SELECT * FROM ${associatedTable} WHERE ${columnId} = ?`;
            const [results]: any = await mysql.execute(checkQuery, [id]);

            if (results.length > 0) {
                const deleteAssociatedQuery = `DELETE FROM ${associatedTable} WHERE ${columnId} = ?`;
                await mysql.execute(deleteAssociatedQuery, [id]);
            }
        }

        const deleteRecordQuery = `DELETE FROM ${table} WHERE id = ?`;
        await mysql.execute(deleteRecordQuery, [id]);

        await mysql.commit();
    } catch (error) {
        console.error("Error during delete operation", error);
        await mysql.rollback();
        throw error;
    } finally {
        await mysql.end();
    }
}