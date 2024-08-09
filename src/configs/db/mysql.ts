import mysql from "mysql2/promise";

export async function Mysql() {
    const connection = await mysql.createConnection({
        host: 'pdv-basic.mysql.uhserver.com',
        port: 3306,
        user: 'bwroot',
        database: 'pdv_basic',
        password: '@BW09@'
    });

    return connection;
}