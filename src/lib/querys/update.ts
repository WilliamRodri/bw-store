import { Mysql } from 'src/configs/db/mysql';

export default async function updateData(table: string, data: object, id: number): Promise<any> {
    const mysql = await Mysql();

    try {
        // Obter as chaves e valores dos dados
        const columns = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        
        // Adicionar o ID ao final dos valores
        values.push(id);

        // Construir a query SQL
        const updateQuery = `UPDATE ${table} SET ${columns} WHERE id = ?`;

        // Executar a query
        const [result]: any = await mysql.execute(updateQuery, values);

        return result;
    } catch (error) {
        console.error("Error connecting to the database or updating data", error);
        throw error;
    } finally {
        await mysql.end();
    }
}