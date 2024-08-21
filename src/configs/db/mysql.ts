import mysql from "mysql2/promise";

export async function Mysql() {
    try {
        const connection = await mysql.createConnection({
            host: 'pdv-basic.mysql.uhserver.com',
            port: 3306,
            user: 'bwroot',
            database: 'pdv_basic',
            password: '@BW09@'
        });
        console.log('Conexão com o banco de dados bem-sucedida!');
        return connection;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error;
    }
}