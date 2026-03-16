import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ThumbsUp, Share2 } from 'lucide-react';

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
  const [likes, setLikes] = useState<number>(0);
  const [userLiked, setUserLiked] = useState<boolean>(false);


  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const fallbackImage = `${API_BASE_URL}/assets/placeholder-400x300.jpg`;

  useEffect(() => {
    const fetchFormacao = async () => {
      try {
        const endpoint = id
          ? `${API_BASE_URL}/api/espiritualidade/${id}`
          : `${API_BASE_URL}/api/espiritualidade/mes`;

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Erro ao buscar formação');

        const data = await res.json();

        // Garante que o caminho da imagem seja absoluto
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

  if (error) {
    return (
      <div className="text-center text-red-500 p-6 font-semibold">
        Erro: {error}
      </div>
    );
  }

  if (!formacao) {
    return (
      <div className="text-center text-gray-400 p-6 animate-pulse">
        Carregando conteúdo de espiritualidade...
      </div>
    );
  }

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
    const shareUrl = `${window.location.origin}/espiritualidade/${id}`;
    const shareData = {
      title: formacao?.titulo,
      text: formacao?.resumo.replace(/<[^>]+>/g, '').slice(0, 100),
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copiado para a área de transferência!');
      } catch (err) {
        alert('Não foi possível copiar o link.');
      }
    }
  };


  return (
    <div className="flex justify-center bg-gray-900 min-h-screen px-4 py-8 text-white">
      <article className="w-full max-w-3xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight border-b-2 border-teal-500 pb-3">
            {formacao.titulo}
          </h1>
        </header>

        <figure className="mb-6">
          <img
            src={formacao.imagem || fallbackImage}
            alt={formacao.titulo}
            className="w-full rounded-xl shadow-lg object-cover max-h-[500px]"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== fallbackImage) {
                target.src = fallbackImage;
              }
            }}
          />
        </figure>

        <section className="mb-8">
          <blockquote className="italic text-xl text-gray-200 border-l-4 border-teal-400 pl-4">
            <div dangerouslySetInnerHTML={{ __html: formacao.resumo }} />
          </blockquote>
        </section>

        <section className="prose prose-invert prose-lg max-w-none leading-relaxed text-justify">
          <div
            className="[&>p:first-of-type::first-letter]:text-5xl 
                        [&>p:first-of-type::first-letter]:font-bold 
                        [&>p:first-of-type::first-letter]:float-left 
                        [&>p:first-of-type::first-letter]:leading-none 
                        [&>p:first-of-type::first-letter]:pr-2 
                        [&>p:first-of-type::first-letter]:text-teal-400"
            dangerouslySetInnerHTML={{ __html: formacao.materia }}
          />
        </section>

        <footer className="mt-10 border-t border-gray-600 pt-4 text-sm text-right text-gray-400 italic">
          Publicado em:{' '}
          <span className="font-semibold">
            {new Date(formacao.data_publicacao).toLocaleDateString('pt-BR')}
          </span>

          <section className="flex flex-col sm:flex-row justify-start gap-4 mt-8">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors shadow-md font-medium text-white focus:outline-none ${userLiked ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'
                }`}
            >
              <ThumbsUp className="w-5 h-5" />
              Curtir ({likes})
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 hover:bg-green-500 transition-colors shadow-md text-white font-medium focus:outline-none"
            >
              <Share2 className="w-5 h-5" />
              Compartilhar
            </button>
          </section>


        </footer>
      </article>
    </div>
  );
}
