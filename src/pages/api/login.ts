import type { NextApiRequest, NextApiResponse } from 'next/types';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    const fetchData = async () => {
        const response = await fetch(`https://api-bwstore.vercel.app/api/784512/data`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            console.error('Failed to get data for login!');
            return null;
        }

        return await response.json();
    }

    try {
        const data = await fetchData();
        if (!data) {
            return res.status(500).json({ message: 'Server error' });
        }

        // Busca o usuário nos dados retornados pela API
        const user = data.find((u: any) => u.access.username === username && u.access.password === password);

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Gera o token JWT
        const token = jwt.sign({ userId: user.nome_cliente }, 'your_jwt_secret', { expiresIn: '10d' });

        // Serializa o token JWT em um cookie seguro
        const serializedToken = serialize('auth', token, {
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
            maxAge: 10 * 24 * 60 * 60,
            path: '/'
        });

        const serializedClientData = serialize('clientData', JSON.stringify({
            nome_cliente: user.nome_cliente,
            empresa: user.empresa,
            instagram: user.instagram,
            endereco: user.endereco,
            telefone: user.telefone,
            db: user.db
        }), {
            httpOnly: false, // Permite leitura pelo JavaScript no cliente, apenas para teste
            secure: process.env.NODE_ENV === 'production', // Define como true apenas em produção
            sameSite: 'lax', // Ajuste conforme necessário
            maxAge: 10 * 24 * 60 * 60,
            path: '/'
        });        

        // Define os cookies no cabeçalho da resposta
        res.setHeader('Set-Cookie', [serializedToken, serializedClientData]);
        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login process:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}