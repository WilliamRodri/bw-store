import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function withAuth(Component: React.ComponentType<any>) {
  const AuthenticatedComponent: React.FC = (props) => {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          // const res = await fetch('/api/me');
          // if (!res.ok) {
          //   router.push('/login');
          // }
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