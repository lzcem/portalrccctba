import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

/* ─── Tipos de resposta do backend ─────────────────────────── */
interface LoginSuccess {
  token: string;
  isAdmin: boolean;
  isAdminMin: boolean;
}

interface ApiErrorResponse {
  error: string;          // mensagem de erro que o backend devolve
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  try {
    const response = await axios.post<LoginSuccess>('/api/login', { email, senha });
    
    const { token, isAdmin, isAdminMin } = response.data;
    localStorage.setItem('token', token);

    // Redirecionamento após login
    if (isAdmin) {
      navigate('/admin/dashboard'); // Vai para o novo Painel Principal
    } else if (isAdminMin) {
      navigate('/admin/ministerios');
    } else {
      navigate('/');
    }
  } catch (err) {
    const axiosErr = err as AxiosError<ApiErrorResponse>;
    const mensagem = axiosErr.response?.data?.error ?? 'Falha na autenticação';
    setError(mensagem);
  }
};

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
      {error && <div className="text-center text-red-500 p-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        {/* ――― campos e botões originais, preservados ――― */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            id="senha"
            type={showPassword ? 'text' : 'password'}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-2 border rounded-lg text-gray-900 bg-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-9 text-gray-600"
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
