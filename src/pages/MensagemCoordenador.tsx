import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart, FaShareAlt } from 'react-icons/fa';

interface Mensagem {
  id: number;
  fotoCoord: string;
  textoMensagem: string;
  tituloMensagem: string;
  resumoMensagem: string;
  data_inicio: string;
  data_fim: string | null;
  foto_mensagem: string;
  nome_coordenador: string;
}

const MensagemCoordenador = () => {
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [userLiked, setUserLiked] = useState<boolean>(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchMensagem = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/mensagens-coordenacao`);
        if (!response.ok) throw new Error('Erro ao buscar mensagem');

        const data: any[] = await response.json();
        const now = new Date();

        const mensagemVigente = data
          .map((m) => ({
            id: m.id,
            fotoCoord: m.foto_coord,
            textoMensagem: m.texto_mensagem,
            tituloMensagem: m.titulo_mensagem,
            resumoMensagem: m.resumo_mensagem,
            data_inicio: m.data_inicio,
            data_fim: m.data_fim,
            foto_mensagem: m.foto_mensagem,
            nome_coordenador: m.nome_coordenador,
          }))
          .find((m) => {
            const start = new Date(m.data_inicio);
            const end = m.data_fim ? new Date(m.data_fim) : null;
            return start <= now && (!end || end >= now);
          });

        if (mensagemVigente) {
          setMensagem(mensagemVigente);

          const likeRes = await fetch(`${API_BASE_URL}/api/likes?page=mensagem_${mensagemVigente.id}`);
          const likeData = await likeRes.json();
          setLikes(likeData.likes || 0);
        } else {
          setMensagem(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      }
    };

    fetchMensagem();
  }, []);





  ///Curtidas e Compartilhamentos

  fetch(`${API_BASE_URL}/api/likes?page=mensagem_coordenacao`)
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
        body: JSON.stringify({ page: 'mensagem_coordenacao', userId, action: 'like' }),
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
      title: mensagem?.tituloMensagem,
      text: mensagem?.resumoMensagem,
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


  const getImageUrl = (
    imagePath: string | null,
    folder: string,
    fallback: string
  ) => {
    if (!imagePath) return fallback;
    if (imagePath.startsWith('http')) return imagePath;
    const clean = imagePath.replace(/^\/+/, '');
    return clean.toLowerCase().startsWith(folder.toLowerCase() + '/')
      ? `${API_BASE_URL}/${clean}`
      : `${API_BASE_URL}/${folder}/${clean}`;
  };

  if (error)
    return <div className="text-center text-red-500 p-4">Erro: {error}</div>;

  if (!mensagem)
    return <div className="text-center text-gray-300 p-4">Carregando...</div>;

  return (
    <div className="flex justify-center bg-gray-900 min-h-screen px-2 py-6 text-white">
      <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center tracking-tight border-b border-teal-500 pb-2">
          {mensagem.tituloMensagem}
        </h1>

        <img
          src={getImageUrl(mensagem.foto_mensagem, 'ImgMensagens', '/ImgMensagens/default-mensagem.jpg')}
          alt={mensagem.tituloMensagem}
          className="w-full mx-auto mb-6 rounded-xl shadow-lg"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = '/ImgMensagens/default-mensagem.jpg';
          }}
        />

        <div
          className="text-xl leading-relaxed mb-8 text-justify italic border-l-4 border-teal-400 pl-4 text-gray-200"
          dangerouslySetInnerHTML={{ __html: mensagem.resumoMensagem }}
        />

        <div className="prose prose-invert prose-lg max-w-none leading-relaxed text-justify">
          <div
            className="[&>p:first-of-type::first-letter]:text-5xl 
                        [&>p:first-of-type::first-letter]:font-bold 
                        [&>p:first-of-type::first-letter]:float-left 
                        [&>p:first-of-type::first-letter]:leading-none 
                        [&>p:first-of-type::first-letter]:pr-2 
                        [&>p:first-of-type::first-letter]:text-teal-300"
            dangerouslySetInnerHTML={{ __html: mensagem.textoMensagem }}
          />
        </div>

        {/* Ações Curtir / Compartilhar */}
        <div className="mt-8 flex gap-4 items-center justify-center">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded text-white shadow transition ${userLiked ? 'bg-red-600' : 'bg-blue-600'
              }`}
          >
            {userLiked ? <FaHeart /> : <FaRegHeart />} Curtir ({likes})
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded shadow"
          >
            <FaShareAlt /> Compartilhar
          </button>
        </div>

        <div className="mt-10 text-right text-sm text-gray-400 italic border-t border-gray-600 pt-3">
          Publicado em:{' '}
          <span className="font-semibold">
            {new Date(mensagem.data_inicio).toLocaleDateString('pt-BR')}
          </span>
          <div className="flex items-center justify-end mt-2">
            <img
              src={getImageUrl(mensagem.fotoCoord, 'ImgCoordenadores', '/ImgCoordenadores/default-coordenador.jpg')}
              alt={`${mensagem.nome_coordenador} - Coordenador`}
              className="w-12 h-12 object-cover rounded-full border-2 border-teal-400 mr-2"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = '/ImgCoordenadores/default-coordenador.jpg';
              }}
            />
            <span className="text-base font-medium">
              Por <strong>{mensagem.nome_coordenador}</strong><br></br>
              Coord. Arquidiocesana <br></br>RCC Curitiba
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MensagemCoordenador;
