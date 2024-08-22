import type { NextApiRequest, NextApiResponse } from 'next/types';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    try {
        const user = { _id: 'wdowjdowjdw', username: 'root', password: 'root' };

        if (!user || user.password !== password || username != user.username) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Gera o token JWT
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '10d' });

        // Serializa o token JWT em um cookie seguro
        const serialized = serialize('auth', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 10 * 24 * 60 * 60,
            path: '/'
        });

        // Define o cookie no cabeçalho da resposta
        res.setHeader('Set-Cookie', serialized);
        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login process:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}