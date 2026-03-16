import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isAuthenticated, getToken, decodeToken } from '../lib/auth';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: 'admin' | 'adminMin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      //console.log('Token atual:', token); // Depuração
      if (!token) {
        //console.log('Nenhum token encontrado, autenticação falhou');
        setIsAuth(false);
        return;
      }
      //console.log('Iniciando verificação de autenticação...');
      const auth = await isAuthenticated();
      //console.log('Resultado isAuthenticated:', auth);

      if (auth) {
        try {
          const decoded = decodeToken(token);
          if (requiredRole) {
            const hasRole = requiredRole === 'admin' ? decoded.isAdmin : decoded.isAdminMin;
            setIsAuth(!!hasRole);
          } else {
            setIsAuth(true);
          }
        } catch (error) {
          //console.error('Erro ao decodificar token:', error);
          setIsAuth(false);
        }
      } else {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, [requiredRole]);

  if (isAuth === null) return <div>Carregando...</div>;
  return !isAuth ? <Navigate to="/login" /> : children;
}