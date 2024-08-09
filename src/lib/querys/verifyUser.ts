import { Mysql } from 'src/configs/db/mysql';

export default async function userVerify(user: string, pass: string): Promise<any> {
    const mysql = await Mysql();

    try {
        const query = "SELECT * FROM admins WHERE username = ? AND password = ?";
        const [results]: any = await mysql.execute(query, [user, pass]);

        if (results.length > 0) {
            return results[0];
        } else {
            throw new Error("Usuário ou senha inválidos");
        }
    } catch (error) {
        console.error("Error during user verification", error);
        throw error;
    } finally {
        await mysql.end();
    }
}