import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

export default function Comentar() {
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!comment.trim() || !name.trim() || !city.trim()) {
      setError('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      // garante userId persistente
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem('userId', userId);
      }

      const res = await fetch(`${API_BASE_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, comment, name, city }),
      });

      if (!res.ok) throw new Error('Falha ao enviar comentário');

      setSuccess('Comentário enviado! Aguarde aprovação 🙏');
      setComment('');
      setName('');
      setCity('');

      // opcional: voltar para home após alguns segundos
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro desconhecido. Tente de novo.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 to-green-900">
      <div className="w-full max-w-lg mx-auto bg-white/90 rounded-xl shadow-lg p-8 backdrop-blur">
        <h1 className="text-2xl font-bold text-center text-blue-900 mb-6">
          Deixe seu comentário
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full min-h-[120px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-y text-gray-800"
            placeholder="Sua mensagem..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              placeholder="Sua cidade"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !comment.trim() || !name.trim() || !city.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 rounded-md transition-colors"
          >
            {loading ? 'Enviando...' : 'Enviar Comentário'}
          </button>

          {success && (
            <p className="text-center text-green-700 font-medium">{success}</p>
          )}
          {error && <p className="text-center text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
}
