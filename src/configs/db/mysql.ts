import mysql from 'mysql2/promise';
import cookie from 'cookie';

export async function Mysql(req: any) {
    try {
        // Verifique se o objeto req e o cabeçalho de cookies estão presentes
        if (!req || !req.headers || !req.headers.cookie) {
            throw new Error('Requisição ou cookies ausentes.');
        }

        // Obtenha os cookies do request
        const cookies = cookie.parse(req.headers.cookie);

        // Parse os dados do cookie
        let clientData;
        if (cookies.clientData) {
            clientData = JSON.parse(cookies.clientData);
        } else {
            throw new Error('Dados de conexão ausentes nos cookies.');
        }

        // Verifique se os dados estão corretos
        const { host, port, user, database, password } = clientData.db;

        // Estabeleça a conexão com o banco de dados do usuário
        const connection = await mysql.createConnection({
            host,
            port: port || 3306,
            user,
            database,
            password,
        });

        return connection;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error;
    }
}
