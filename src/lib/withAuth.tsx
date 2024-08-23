import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';

export default function withAuth(Component: React.ComponentType<any>) {
  const AuthenticatedComponent: React.FC = (props) => {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const cookies = parseCookies();
          const token = cookies.auth;

          if (!token) {
            router.push('/login');
          }

        } catch (error) {
          console.error('Error checking authentication:', error);
          router.push('/login');
        }
      };

      checkAuth();
    }, [router]);

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
}