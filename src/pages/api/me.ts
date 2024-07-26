import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
  userId: string;
}

export default function handler(req: any, res: any) {
  const { auth } = req.cookies;

  if (!auth) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(auth, 'your_jwt_secret') as DecodedToken;

    if (!decoded.userId) {
      throw new Error('Invalid token payload');
    }

    return res.status(200).json({ userId: decoded.userId });
  } catch (err) {
    console.error('Error verifying JWT:', err);
    return res.status(401).json({ message: 'Not authenticated' });
  }
}