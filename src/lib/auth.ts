import jwtDecode from 'jwt-decode';

// Certifique-se de que a versão instalada é compatível (ex.: ^3.1.2)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface JwtPayload {
  id: string;
  nome: string;
  isAdmin: boolean;
  isAdminMin: boolean;
  exp: number; // Expiration time
}

export const login = async (email: string, senha: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao fazer login');
  }
  const { token } = await response.json();
  localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const logout = (): void => {
  localStorage.removeItem('token');
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = getToken();
  //console.log('Token verificado:', token); // Depuração
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/api/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    //console.log('Verify-token response:', response.status, response.statusText); // Depuração
    if (!response.ok) return false;

    const decoded = decodeToken(token);
    const isExpired = (decoded.exp * 1000) < Date.now(); // Converte exp (em segundos) para milissegundos
    return !isExpired;
  } catch (error) {
    //console.error('Erro ao verificar token:', error); // Depuração
    return false;
  }
};

export const decodeToken = (token: string): JwtPayload => {
  try {
    return jwtDecode(token) as JwtPayload; // Força a tipagem como JwtPayload
  } catch (error) {
    throw new Error('Token inválido');
  }
};