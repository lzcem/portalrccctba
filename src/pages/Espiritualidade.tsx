import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaThumbsUp, FaShareAlt } from "react-icons/fa";


interface FormacaoEspiritual {
  id: string;
  titulo: string;
  resumo: string;
  materia: string;
  imagem: string;
  data_publicacao: string;
}

export default function Espiritualidade() {
  const { id } = useParams<{ id: string }>();
  const [formacao, setFormacao] = useState<FormacaoEspiritual | null>(null);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const [likes, setLikes] = useState<number>(0);
  const [userLiked, setUserLiked] = useState<boolean>(false);

  useEffect(() => {
    const fetchFormacao = async () => {
      try {
        const endpoint = id ? `${API_BASE_URL}/api/espiritualidade/${id}` : `${API_BASE_URL}/api/espiritualidade/mes`;
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Erro ao buscar formação');
        const data = await res.json();
        // Garantir que a imagem seja uma URL válida
        if (data.imagem && !data.imagem.startsWith('http')) {
          data.imagem = `${API_BASE_URL}${data.imagem}`;
        }
        setFormacao(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      }
    };
    fetchFormacao();
  }, [id]);



  ///Curtidas e Compartilhamentos

  fetch(`${API_BASE_URL}/api/likes?page=espiritualidade`)
    .then((res) => res.json())
    .then((data) => setLikes(data.likes || 0))
    .catch((err) => console.error('Erro ao carregar curtidas:', err));

  const handleLike = async () => {
    const userId = localStorage.getItem('userId') || crypto.randomUUID();
    localStorage.setItem('userId', userId);

    try {
      const response = await fetch(`${API_BASE_URL}/api/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'espiritualidade', userId, action: 'like' }),
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
        title: formacao?.titulo,
        text: formacao?.resumo,
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
  if (!formacao) return <div className="text-center text-gray-300 p-4">Carregando...</div>;

  return (
    <div className="flex justify-center bg-gray-900 min-h-screen px-2 py-6 text-white">
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center tracking-tight border-b border-teal-500 pb-2">
          {formacao.titulo}
        </h1>

        <img
          src={formacao.imagem || `${API_BASE_URL}/assets/placeholder-400x300.jpg`} // Caminho absoluto
          alt={formacao.titulo}
          className="w-full mx-auto mb-6 rounded-xl shadow-lg"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== `${API_BASE_URL}/assets/placeholder-400x300.jpg`) {
              target.src = `${API_BASE_URL}/assets/placeholder-400x300.jpg`; // Evita loop
            }
          }}
        />

        <div
          className="text-xl leading-relaxed mb-8 text-justify italic border-l-4 border-teal-400 pl-4 text-gray-200"
          dangerouslySetInnerHTML={{ __html: formacao.resumo }}
        />

        <div className="prose prose-invert prose-lg max-w-none leading-relaxed text-justify">
          <div
            className="[&>p:first-of-type::first-letter]:text-5xl 
                        [&>p:first-of-type::first-letter]:font-bold 
                        [&>p:first-of-type::first-letter]:float-left 
                        [&>p:first-of-type::first-letter]:leading-none 
                        [&>p:first-of-type::first-letter]:pr-2 
                        [&>p:first-of-type::first-letter]:text-teal-300"
            dangerouslySetInnerHTML={{ __html: formacao.materia }}
          />
        </div>

        <div className="mt-10 flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-400 italic border-t border-gray-600 pt-3 gap-4">
          <div>
            Publicado em: <span className="font-semibold">{new Date(formacao.data_publicacao).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
            >
              <FaThumbsUp /> {likes} Curtir
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
            >
              <FaShareAlt /> Compartilhar
            </button>
          </div>
        </div>

      </div>
    </div>


  );
}