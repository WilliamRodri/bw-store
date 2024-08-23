import { serialize } from 'cookie';

export default function handler(req: any, res: any) {
  const serialized = serialize('auth', '', {
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
    expires: new Date(0),
    path: '/'
  });

  const serializedClientData = serialize('clientData', '', {
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
    maxAge: 10 * 24 * 60 * 60,
    path: '/'
});

  res.setHeader('Set-Cookie', serialized, serializedClientData);
  res.writeHead(302, { Location: '/' });
  res.end();
}