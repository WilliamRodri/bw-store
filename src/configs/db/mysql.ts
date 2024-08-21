import mysql from "mysql2/promise";

export async function Mysql() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            database: 'pdv_basic',
            password: 'root'
        });
        return connection;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error;
    }
}