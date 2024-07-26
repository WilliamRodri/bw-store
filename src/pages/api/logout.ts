import { serialize } from 'cookie';

export default function handler(req: any, res: any) {
  const serialized = serialize('auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/'
  });

  res.setHeader('Set-Cookie', serialized);
  res.writeHead(302, { Location: '/' });
  res.end();
}