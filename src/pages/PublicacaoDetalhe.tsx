import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link
import { motion } from 'framer-motion';
import { FaShareAlt, FaHeart, FaRegHeart } from 'react-icons/fa';

interface Publicacao {
  id: string;
  titulo: string;
  descricao: string;
  imagem: string;
  data_publicacao: string;
  responsavel: string;
  status: 'rascunho' | 'publicada';
  categoria: 'Evento' | 'Formação' | 'Outras';
}

const PublicacaoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const [publicacao, setPublicacao] = useState<Publicacao | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [userLiked, setUserLiked] = useState<boolean>(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!id) return;

    // Buscar publicação
    fetch(`${API_BASE_URL}/api/publicacoes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar publicação');
        return res.json();
      })
      .then((data) => setPublicacao(data))
      .catch((err) => setError(err.message));
  }, [id]);

  // Curtidas e Compartilhamentos
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/likes?page=publicacoes`)
      .then((res) => res.json())
      .then((data) => setLikes(data.likes || 0))
      .catch((err) => console.error('Erro ao carregar curtidas:', err));
  }, []);

  const handleLike = async () => {
    const userId = localStorage.getItem('userId') || crypto.randomUUID();
    localStorage.setItem('userId', userId);

    try {
      const response = await fetch(`${API_BASE_URL}/api/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'publicacoes', userId, action: 'like' }),
      });
      if (!response.ok) throw new Error('Falha ao processar curtida');
      const data = await response.json();
      setLikes(data.likes || likes + (userLiked ? -1 : 1));
      setUserLiked(!userLiked);
    } catch (err) {
      console.error('Erro ao curtir:', err);
      setError('Erro ao registrar curtida. Tente novamente.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: publicacao?.titulo,
        url: window.location.href,
      });
    } else {
      const shareUrl = window.location.href;
      const shareOptions = [
        { name: "WhatsApp", url: `https://wa.me/?text=${encodeURIComponent(`${shareUrl}`)}` },
        { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
        { name: "Twitter", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareUrl}`)}` },
      ];
      alert(`Copie o link ou compartilhe via:\n${shareOptions.map((o) => o.name).join(", ")}\nLink: ${shareUrl}`);
      navigator.clipboard.writeText(shareUrl);
    }
  };

  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!publicacao) return <div className="text-center p-4">Carregando...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 max-w-4xl"
    >
      {/* Link to Publicacoes page */}
      <Link
        to="/publicacoes"
        className="inline-block mb-6 text-teal-300 hover:text-teal-400 text-lg font-semibold transition-colors"
      >
        ← Voltar para Publicações
      </Link>

      <h1 className="text-4xl font-cursive font-bold mb-6 text-gray-100 drop-shadow-md">{publicacao.titulo}</h1>
      <img
        src={`${API_BASE_URL}${publicacao.imagem}`}
        alt={publicacao.titulo}
        className="w-full h-96 object-cover rounded-xl mb-6 shadow-lg"
      />

      <div
        className="[&>p:first-of-type::first-letter]:text-5xl 
                   [&>p:first-of-type::first-letter]:font-bold 
                   [&>p:first-of-type::first-letter]:float-left 
                   [&>p:first-of-type::first-letter]:leading-none 
                   [&>p:first-of-type::first-letter]:pr-2 
                   [&>p:first-of-type::first-letter]:text-teal-300"
        dangerouslySetInnerHTML={{ __html: publicacao.descricao }}
      />

      {/* Ações: Curtir e Compartilhar */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded text-white shadow transition ${userLiked ? 'bg-red-600' : 'bg-blue-600'
            }`}
        >
          {userLiked ? <FaHeart /> : <FaRegHeart />} Curtir ({likes})
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 text-white shadow"
        >
          <FaShareAlt /> Compartilhar
        </button>
      </div>

      <div className="mt-10 text-right text-sm text-gray-400 italic border-t border-gray-600 pt-3">
        Publicado em: <span className="font-semibold">{new Date(publicacao.data_publicacao).toLocaleDateString('pt-BR')}</span>
        <span> | {publicacao.responsavel || 'RCC Curitiba'}</span>
        <span> | {publicacao.categoria}</span>
      </div>
    </motion.div>
  );
};

export default PublicacaoDetalhe;