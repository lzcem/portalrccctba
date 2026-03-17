// src/pages/Home.tsx
import { Link } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from '../components/ErrorBoundary';
import { v4 as uuidv4 } from 'uuid';
import ReactPlayer from 'react-player';
import { io } from 'socket.io-client';
import {
  FaPlay,
  FaBroadcastTower,
  FaMapMarkerAlt,
  FaUsers,
  FaTimes,
  FaHeart,
  FaEye,
  FaComment,
  FaNewspaper,
  FaYoutube,
  FaPlayCircle,
  FaInfoCircle,
  FaBook,
  FaStop,
  FaCalendarAlt,
  FaDove,
  FaFire,
  FaVideo,
  FaBookOpen,
  FaLightbulb,
  FaComments
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import WebRadio from '../components/WebRadio';
import CenaculoDiario from '../components/CenaculoDiario';
import TercoEspiritoSanto from '../components/TercoEspiritoSanto';
import NewsletterPaoDiario from '../components/NewsletterPaoDiario';
import PaoDiarioCard from '../components/PaoDiarioCard';
import FacebookFeed from '../components/FacebookFeed';


// Ícone bíblico do Font Awesome 6
import { FaBookBible, FaHandsPraying } from 'react-icons/fa6';


// Interfaces
interface Grupo {
  id: number;
  nome: string | null;
  endereco: string | null;
  lat: string | null;
  lng: string | null;
  horario: string | null;
  paroquia: string | null;
  id_paroquia: number;
}
interface MensagemCoord {
  id: string;
  tituloMensagem: string;
  resumoMensagem: string;
  foto_mensagem: string;
  data_inicio: string;
  data_fim: string | null;
  foto_coord: string;
  nome_coordenador: string;
}

interface Noticia {
  id: string;
  manchete: string;
  foto: string | null;
  resumo: string;
  conteudo: string;
  categoria: string | null;
  topicos: string[];
  data_publicacao: string;
  autor: string | null;
  status: string;
  data_inicio: string;
  data_fim: string | null;
}

interface Publicacao {
  id: string;
  titulo: string;
  descricao: string;
  imagem: string | null;
  data_publicacao: string;
  responsavel: string;
  status: 'rascunho' | 'publicada';
  categoria: 'Evento' | 'Formação' | 'Outras';
}

interface PedidoOracao {
  id: number;
  nome: string;
  email: string;
  cidade: string;
  mensagem: string;
  moderacao: 'pendente' | 'aprovado' | 'rejeitado';
  data_envio: string;
}

interface NoticiaRSS { title: string; date: string; link: string; }

interface Metrics {
  noticias: number;
  visualizacoes: number;
  curtidas: number;
  comentarios: number;
}

interface Metrics {
  noticias: number;
  visualizacoes: number;
  curtidas: number;
  comentarios: number;
}

interface Comment {
  id: number;
  userId: string;
  comment: string;
  name: string;
  city: string;
  created_at: string;
}

interface FormacaoEspiritual {
  id: string;
  titulo: string;
  resumo: string;
  imagem: string;
  data_publicacao: string;
}

interface GrupoOracao {
  id: string;
  title: string;
  content: string;
  image_path: string;
  updated_at: string;
}

interface MilAmigos {
  id: string;
  title: string;
  content: string;
  image_path: string;
  updated_at: string;
}

interface AmoRcc {
  id: string;
  title: string;
  content: string;
  image_path: string;
  updated_at: string;
}

interface VideoNoticia {
  id: number;
  titulo: string;
  descricao: string;
  video_url: string;
  thumbnail_url: string | null;
  uploaded_at: string;
  views: number;
  is_featured?: boolean;
}

// --- COMPONENTES INTERNOS ---

const QuickRadioLink = () => {
  const scrollToRadio = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('webradio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.button
      onClick={scrollToRadio}
      className="lg:hidden w-full flex items-center justify-center gap-2 bg-blue-600/20 backdrop-blur-md border border-blue-400/30 text-blue-300 py-2.5 px-4 rounded-xl text-xs font-black mb-6 shadow-lg"
      whileTap={{ scale: 0.95 }}
    >
      <FaBroadcastTower className="animate-pulse text-sm" /> ABRIR WEB RÁDIO
    </motion.button>
  );
};

const YoutubeLiveWatcher = () => {
  const [showPlayer, setShowPlayer] = useState(false);
  const playlistId = "UUrj3AbOF1fj9dUwM_IBQP6g";
  const embedUrl = `https://www.youtube.com/embed?listType=playlist&list=${playlistId}&autoplay=1`;

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full mb-6">
      <div className="bg-gradient-to-r from-gray-900 via-red-950/20 to-gray-900 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
        <div className="p-3 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </div>
              <h3 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                <FaYoutube className="text-red-600 text-lg" /> Transmissão
              </h3>
            </div>
            <div className="h-px w-8 bg-white/10 hidden sm:block" />
            <p className="text-[10px] sm:text-xs text-gray-400 italic leading-tight text-center sm:text-left max-w-[250px]">
              Acompanhe a nossa <span className="text-red-400 font-medium">transmissão ao vivo</span> ou o conteúdo mais recente.
            </p>
          </div>
          <button
            onClick={() => setShowPlayer(!showPlayer)}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-full font-black text-[10px] transition-all flex items-center justify-center gap-2 ${showPlayer ? 'bg-gray-800 text-white' : 'bg-red-600 text-white shadow-lg'}`}
          >
            {showPlayer ? <><FaTimes /> FECHAR</> : <><FaPlay /> ASSISTIR AGORA</>}
          </button>
        </div>
        <AnimatePresence>
          {showPlayer && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              <div className="aspect-video bg-black">
                <iframe width="100%" height="100%" src={embedUrl} title="YouTube" frameBorder="0" allowFullScreen></iframe>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};




// Componente Comentarios
const Comentarios = ({ comments }: { comments: Comment[] }) => {
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const sortedComments = [...comments].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <section className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-4">
      <div className="text-center mb-8">
        <h2 className="inline-flex items-center gap-4 text-2xl sm:text-3xl font-bold text-green-100 mb-4">
          <FaComments className="text-white-500 animate-pulse text-4xl" />
          Comentários
        </h2>
        {/* Linha divisória com largura total */}
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent mb-6" />
      </div>


      <Link to="/comentar" className="inline-block mb-3 sm:mb-4 bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors duration-300 shadow-md">
        Deixar um Comentário
      </Link>
      {sortedComments.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ maxHeight: '50rem', overflowY: 'auto' }}
        >
          {sortedComments.map((comment) => (
            <motion.div
              key={comment.id}
              onClick={() => setSelectedComment(comment)}
              className="relative bg-white/90 p-2 sm:p-3 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition duration-300 cursor-pointer"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              title="Clique para ver o comentário completo"
            >
              <p className="text-gray-800 text-sm sm:text-base leading-relaxed mb-1 sm:mb-2">
                {comment.comment}
              </p>
              <div className="flex items-center justify-between text-gray-600 text-xs sm:text-sm">
                <span>Por {comment.name} ({comment.city})</span>
                <span>{new Date(comment.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-center text-gray-500 text-base sm:text-lg py-4">
          Nenhum comentário disponível no momento.
        </p>
      )}
      {selectedComment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedComment(null)}
        >
          <div
            className="bg-white p-4 sm:p-6 rounded-lg max-w-md sm:max-w-lg w-full mx-2 sm:mx-4 shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-600 hover:text-white-500 text-lg sm:text-xl font-bold"
              onClick={() => setSelectedComment(null)}
              aria-label="Fechar"
            >
              ×
            </button>
            <p className="text-gray-800 text-sm sm:text-base leading-relaxed mb-2 sm:mb-3 whitespace-pre-wrap">
              {selectedComment.comment}
            </p>
            <div className="text-gray-600 text-xs sm:text-sm">
              <p>Por: {selectedComment.name}</p>
              <p>Cidade: {selectedComment.city}</p>
              <p>Data: {new Date(selectedComment.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// Promoção Gabaon
function GabaonPromoSection() {
  return (
    <div className="relative h-40 sm:h-52 bg-gradient-to-r from-purple-800 to-fuchsia-900 rounded-xl overflow-hidden shadow-lg flex flex-col sm:flex-row items-center justify-between p-2 sm:p-4 gap-2 sm:gap-4 text-white">
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Confetti seria aqui se você tivesse o componente */}
      </div>
      <div className="z-10 max-w-xs sm:max-w-md space-y-1 sm:space-y-2 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300">🎉 Conheça o GABAON!</h2>
        <p className="text-sm sm:text-base md:text-lg">
          Um Carnaval com propósito: fé, alegria, música, oração e unção. Venha com a família!
        </p>
      </div>
      <Link
        to="/gabaon"
        className="z-10 px-3 sm:px-4 py-1 sm:py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-full shadow-md transition-all text-sm sm:text-base text-center"
      >
        Saiba Mais
      </Link>
    </div>
  );
}

const Home = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [pedidosOracao, setPedidosOracao] = useState<PedidoOracao[]>([]);
  const [modalAberto, setModalAberto] = useState(false); // Controle da penumbra
  const [selectedVideo, setSelectedVideo] = useState<VideoNoticia | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prayerIndex, setPrayerIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [isLikeLoading, setIsLikeLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [formacao, setFormacao] = useState<FormacaoEspiritual | null>(null);
  const [hasFetchedViews, setHasFetchedViews] = useState(false);
  const [mensagemPreview, setMensagemPreview] = useState<MensagemCoord | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [thanksContent, setThanksContent] = useState({ title: '', message: '', type: 'news' as 'news' | 'comment' }); const [formattedNoticiasRSS, setFormattedNoticiasRSS] = useState<{ title: string; date: string; link: string }[]>([]);
  const [grupoOracao, setGrupoOracao] = useState<GrupoOracao[] | null>(null);
  const [gruposHoje, setGruposHoje] = useState<Grupo[]>([]);
  const [milAmigos, setMilAmigos] = useState<MilAmigos[] | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '', image: null as File | null });
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormType, setEditFormType] = useState<'grupo-oracao' | 'mil-amigos' | 'amo-rcc' | null>(null);
  const [amoRcc, setAmoRcc] = useState<AmoRcc[] | null>(null);
  const [noticiasVideos, setNoticiasVideos] = useState<VideoNoticia[]>([]);
  const [noticiasVideoPage, setNoticiasVideoPage] = useState(1);
  const [hasMoreNoticiasVideos, setHasMoreNoticiasVideos] = useState(true);
  const [noticiasOrderBy, setNoticiasOrderBy] = useState<'data' | 'views'>('data');
  const [onlineCount, setOnlineCount] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';
  const GRUPOS_API_URL = 'https://www.rcccuritiba.online/Api/mapa_grupos.php';

  // Fetch de todos os dados
  // Fetch de todos os dados e Gerenciamento de Socket
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fetches = [
          // [0] Publicações
          fetch(`${API_BASE_URL}/api/publicacoes`).then(async res => {
            if (!res.ok) return [];
            return res.json() as Promise<Publicacao[]>;
          }),

          // [1] Notícias
          fetch(`${API_BASE_URL}/api/noticias_portal`).then(async res => {
            if (!res.ok) return [];
            return res.json() as Promise<Noticia[]>;
          }),

          // [2] Pedidos de Oração
          fetch(`${API_BASE_URL}/api/pedidos-oracao/aprovados`).then(async res => {
            if (!res.ok) return [];
            return res.json() as Promise<PedidoOracao[]>;
          }),

          // [3] Notícias RSS (Vaticano)
          fetch(`${API_BASE_URL}/api/noticias-rss`).then(async res => {
            if (!res.ok) return [];
            return res.json() as Promise<NoticiaRSS[]>;
          }),

          // [4] Métricas
          fetch(`${API_BASE_URL}/api/portal-metrics`).then(async res => {
            if (!res.ok) return { noticias: 0, visualizacoes: 0, curtidas: 0, comentarios: 0 };
            return res.json() as Promise<Metrics>;
          }),

          // [5] Comentários
          fetch(`${API_BASE_URL}/api/comments/approved`).then(async res => {
            if (!res.ok) return [];
            return res.json() as Promise<Comment[]>;
          }),

          // [6] Formação do Mês
          fetch(`${API_BASE_URL}/api/espiritualidade/mes`).then(async res => {
            if (!res.ok) return null;
            return res.json() as Promise<FormacaoEspiritual | null>;
          }),

          // [7] Mensagens da Coordenação
          fetch(`${API_BASE_URL}/api/mensagens-coordenacao`).then(async res => {
            if (!res.ok) return [];
            return res.json();
          }),

          // [8] Bloco Grupo de Oração (Destaque)
          fetch(`${API_BASE_URL}/api/grupo-oracao`).then(async res => {
            if (!res.ok) return null;
            return res.json();
          }),

          // [9] Bloco Mil Amigos
          fetch(`${API_BASE_URL}/api/mil-amigos-home`).then(async res => {
            if (!res.ok) return null;
            return res.json();
          }),

          // [10] Bloco Amo RCC
          fetch(`${API_BASE_URL}/api/amo-rcc-home`).then(async res => {
            if (!res.ok) return null;
            return res.json();
          }),

          // [11] Grupos de Hoje (Mapa)
          fetch(GRUPOS_API_URL).then(async res => {
            if (!res.ok) return [];
            const text = await res.text();
            try {
              return JSON.parse(text) as Grupo[];
            } catch (err) {
              return [];
            }
          }),
        ];

        const results = await Promise.all(fetches);

        // Atribuição seguindo os índices do array fetches
        setPublicacoes(Array.isArray(results[0]) ? results[0] : []);
        setNoticias(Array.isArray(results[1]) ? results[1].slice(0, 4) : []);
        setPedidosOracao(Array.isArray(results[2]) ? results[2] : []);
        setFormattedNoticiasRSS(Array.isArray(results[3]) ? results[3] : []);
        setMetrics(results[4] || { noticias: 0, visualizacoes: 0, curtidas: 0, comentarios: 0 });
        setComments(Array.isArray(results[5]) ? results[5] : []);
        setFormacao(results[6] || null);

        // Lógica de Mensagem Vigente
        const mensagensArray = Array.isArray(results[7]) ? results[7] : [];
        const now = new Date();
        const vigente = mensagensArray.find((m: any) => {
          if (!m?.data_inicio) return false;
          const ini = new Date(m.data_inicio);
          const fim = m.data_fim ? new Date(m.data_fim) : null;
          return ini <= now && (!fim || fim >= now);
        });
        setMensagemPreview(vigente || null);

        setGrupoOracao(results[8] ? [results[8]] : null);
        setMilAmigos(results[9] ? [results[9]] : null);
        setAmoRcc(results[10] ? [results[10]] : null);

        // Lógica de Grupos que se reúnem hoje
        const gruposMapa = Array.isArray(results[11]) ? results[11] : [];
        const diasSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        const diaAtual = diasSemana[now.getDay()].toLowerCase();
        const filtradosHoje = gruposMapa.filter((g: Grupo) =>
          g.horario?.toLowerCase().includes(diaAtual)
        ).slice(0, 3);
        setGruposHoje(filtradosHoje);

        setIsAdmin(localStorage.getItem('userRole') === 'admin');

      } catch (err) {
        console.error('Erro geral no fetchData:', err);
        setError('Falha ao carregar conteúdos. Tente recarregar a página.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Configuração do Socket.io para usuários online
    // Em produção, o io deve conectar na raiz do domínio
    const socket = io("https://www.rcccuritiba.com.br", {
      path: '/socket.io/',
      transports: ['websocket', 'polling']
    });

    socket.on('updateUserCount', (count: number) => {
      setOnlineCount(count);
    });

    return () => {
      socket.disconnect();
    };

  }, [API_BASE_URL]);

  // Remova um dos useEffect duplicados — deixe só este
  useEffect(() => {
    if (publicacoes.length === 0) return;

    // Resetar índice se estiver fora do range (proteção)
    if (currentIndex >= publicacoes.length) {
      setCurrentIndex(0);
    }
    // Loop do Carrossel e Orações
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex(prev => (prev + 1) % (publicacoes.length || 1));
        setPrayerIndex(prev => (prev + 1) % (pedidosOracao.length || 1));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [publicacoes.length, isPaused]); // Dependência só no length evita loops desnecessários


  const openVideoModal = (video: VideoNoticia) => { setSelectedVideo(video); setModalAberto(true); };
  const closeVideoModal = () => { setSelectedVideo(null); setModalAberto(false); }

  useEffect(() => {
    if (!selectedVideo) return;

    const registerView = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/videos/${selectedVideo.id}/view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
          const { views } = await res.json(); // se o backend retornar o novo total

          // Atualiza o estado local para refletir o novo número
          setNoticiasVideos(prev =>
            prev.map(v =>
              v.id === selectedVideo.id ? { ...v, views } : v
            )
          );
        }
      } catch (err) {
        console.error('Erro ao registrar/atualizar view:', err);
      }
    };

    // Registra após 2 segundos (evita contar views falsas)
    const timer = setTimeout(registerView, 2000);

    // Limpa o timer se fechar o modal antes dos 2s
    return () => clearTimeout(timer);
  }, [selectedVideo, API_BASE_URL]); // Dependências corretas


  // Debug amoRcc state
  useEffect(() => {
    // vazio - apenas para depuração se necessário
  }, [amoRcc, API_BASE_URL]);

  // Debug milAmigos state
  useEffect(() => {
    if (milAmigos && milAmigos.length > 0) {
      const imageUrl = `${API_BASE_URL}${milAmigos[0].image_path.replace(/^https?:\/\/[^/]+/, '')}?t=${Date.now()}`;
      console.log('Imagem URL gerada para Mil Amigos:', imageUrl);
    }
  }, [milAmigos, API_BASE_URL]);

  useEffect(() => {
    if (pedidosOracao.length === 0) return;
    const interval = setInterval(() => {
      if (!isPaused) {
        setPrayerIndex(prev => (prev + 2) % pedidosOracao.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [pedidosOracao, isPaused]);



  // Novo useEffect só para notícias-vídeos
  useEffect(() => {
    const fetchNoticiasVideos = async () => {
      try {
        const url = `${API_BASE_URL}/api/noticias-videos?page=${noticiasVideoPage}&orderBy=${noticiasOrderBy === 'views' ? 'views' : 'uploaded_at'}`;
        // console.log('Buscando notícias-vídeos em:', url); // ← Debug 1

        const res = await fetch(url);

        // console.log('Status da resposta:', res.status); // ← Debug 2

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Erro ${res.status}: ${errText}`);
        }

        const data = await res.json();
        //console.log('Dados recebidos:', data); // ← Debug importante!

        setNoticiasVideos((prev: VideoNoticia[]) => {
          const novos = data.filter(
            (v: VideoNoticia) => !prev.some((p: VideoNoticia) => p.id === v.id)
          );
          //  console.log('Novos vídeos adicionados:', novos); // ← Debug 3
          return [...prev, ...novos];
        });

        setHasMoreNoticiasVideos(data.length === 6);
      } catch (err) {
        console.error('Erro completo ao carregar notícias-vídeos:', err);
      }
    };

    fetchNoticiasVideos();
  }, [API_BASE_URL, noticiasVideoPage, noticiasOrderBy]);





  // Novo useEffect só para notícias-vídeos
  useEffect(() => {
    const fetchNoticiasVideos = async () => {
      try {
        const url = `${API_BASE_URL}/api/noticias-videos?page=${noticiasVideoPage}&orderBy=${noticiasOrderBy === 'views' ? 'views' : 'uploaded_at'}`;
        // console.log('Buscando notícias-vídeos em:', url); // ← Debug 1

        const res = await fetch(url);

        // console.log('Status da resposta:', res.status); // ← Debug 2

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Erro ${res.status}: ${errText}`);
        }

        const data = await res.json();
        //console.log('Dados recebidos:', data); // ← Debug importante!

        setNoticiasVideos((prev: VideoNoticia[]) => {
          const novos = data.filter(
            (v: VideoNoticia) => !prev.some((p: VideoNoticia) => p.id === v.id)
          );
          //  console.log('Novos vídeos adicionados:', novos); // ← Debug 3
          return [...prev, ...novos];
        });

        setHasMoreNoticiasVideos(data.length === 6);
      } catch (err) {
        console.error('Erro completo ao carregar notícias-vídeos:', err);
      }
    };

    fetchNoticiasVideos();
  }, [API_BASE_URL, noticiasVideoPage, noticiasOrderBy]);

  // Funções auxiliares
  const loadMoreNoticiasVideos = () => setNoticiasVideoPage(prev => prev + 1);

  const toggleNoticiasOrder = () => {
    setNoticiasOrderBy(prev => prev === 'data' ? 'views' : 'data');
    setNoticiasVideos([]);
    setNoticiasVideoPage(1);
  };

  useEffect(() => {
    let userId = '';
    if (typeof window !== 'undefined' && window.localStorage && !hasFetchedViews) {
      userId = localStorage.getItem('userId') || uuidv4();
      localStorage.setItem('userId', userId);
      const lastView = localStorage.getItem(`lastView_${userId}`);
      const now = new Date().getTime();
      const fourHours = 4 * 60 * 60 * 1000;
      if (!lastView || (now - Number(lastView) > fourHours)) {
        fetch(`${API_BASE_URL}/api/portal-metrics/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'view', userId }),
        })
          .then(res => res.json())
          .then(data => setMetrics(prev => prev ? { ...prev, visualizacoes: data.visualizacoes } : data))
          .catch(err => console.error('Erro ao atualizar visualizações:', err));
        localStorage.setItem(`lastView_${userId}`, now.toString());
        setHasFetchedViews(true);
      }
    }
    setIsLikeLoading(true);
    fetch(`${API_BASE_URL}/api/portal-metrics/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like', userId: userId || (localStorage.getItem('userId') || uuidv4()), checkOnly: true }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const [likeRows] = data.userLikes || [];
        const isLikedState = !!likeRows;
        setIsLiked(isLikedState);
        localStorage.setItem(`liked_${userId}`, JSON.stringify(isLikedState));
      })
      .catch(err => {
        console.error('Erro ao verificar curtida:', err);
        const storedLiked = localStorage.getItem(`liked_${userId}`);
        if (storedLiked !== null) {
          setIsLiked(JSON.parse(storedLiked));
        } else {
          setIsLiked(false);
        }
      })
      .finally(() => setIsLikeLoading(false));
  }, [hasFetchedViews]);




  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleLike = () => {
    if (!metrics || isLiked === null || isLikeLoading || !(typeof window !== 'undefined' && window.localStorage)) return;
    const userId = localStorage.getItem('userId') || uuidv4();
    const undoLike = isLiked;
    setIsLiked(!undoLike);
    setIsLikeLoading(true);

    fetch(`${API_BASE_URL}/api/portal-metrics/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like', userId, undoLike }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setMetrics(prev => prev ? { ...prev, curtidas: data.curtidas } : data);
        localStorage.setItem(`liked_${userId}`, JSON.stringify(!undoLike));
      })
      .catch(err => {
        console.error('Erro ao atualizar curtidas:', err);
        setIsLiked(undoLike); // Reverte o estado visual em caso de erro
      })
      .finally(() => setIsLikeLoading(false));
  };
  const metricItems = [
    { id: 'm_noticias', label: 'notícias', value: metrics?.noticias ?? 0, icon: <FaNewspaper /> },
    { id: 'm_vistas', label: 'vistas', value: metrics?.visualizacoes ?? 0, icon: <FaEye /> },
    {
      id: 'm_likes',
      label: 'curtidas',
      value: metrics?.curtidas ?? 0,
      icon: <FaHeart className={isLiked ? 'text-red-500 scale-110 transition-transform' : 'transition-transform'} />,
      onClick: handleLike
    },
    {
      id: 'm_coments',
      label: 'comentários',
      value: metrics?.comentarios ?? 0,
      icon: <FaComment />,
      onClick: () => setShowPopup(true)
    },
    {
      id: 'm_online',
      label: 'online',
      value: onlineCount,
      icon: <span className="relative flex h-2 w-2 mr-1">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
    },
  ];


  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newName.trim() || !newCity.trim()) return;

    const userId = localStorage.getItem('userId') || uuidv4();
    fetch(`${API_BASE_URL}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, comment: newComment, name: newName, city: newCity }),
    })
      .then(res => res.json())
      .then(() => {
        setNewComment('');
        setNewName('');
        setNewCity('');
        setShowPopup(false);

        // CONFIGURA O CONTEÚDO PARA COMENTÁRIO
        setThanksContent({
          title: 'Mensagem Enviada!',
          message: 'Obrigado por partilhar conosco. Seu comentário passará por uma breve moderação e logo estará visível para todos.',
          type: 'comment'
        });
        setShowThanks(true);
      })
      .catch(err => console.error('Erro ao enviar comentário:', err));
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.title.trim() || !editForm.content.trim() || !editForm.image || !editFormType) return;
    const formData = new FormData();
    formData.append('title', editForm.title);
    formData.append('content', editForm.content);
    formData.append('image', editForm.image);
    const endpoint = editFormType === 'grupo-oracao' ? 'grupo-oracao' : editFormType === 'mil-amigos' ? 'mil-amigos-home' : 'amo-rcc-home';
    const id =
      editFormType === 'grupo-oracao' && grupoOracao && grupoOracao.length > 0 ? grupoOracao[0].id
        : editFormType === 'mil-amigos' && milAmigos && milAmigos.length > 0 ? milAmigos[0].id
          : editFormType === 'amo-rcc' && amoRcc && amoRcc.length > 0 ? amoRcc[0].id
            : '';
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/${endpoint}${id ? `/${id}` : ''}`, {
        method: id ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        body: formData,
      });
      if (!response.ok) throw new Error(`Erro ao salvar ${editFormType}: HTTP ${response.status}`);
      const updatedData = await response.json();
      if (editFormType === 'grupo-oracao') {
        setGrupoOracao([updatedData]);
      } else if (editFormType === 'mil-amigos') {
        setMilAmigos([updatedData]);
      } else if (editFormType === 'amo-rcc') {
        setAmoRcc([updatedData]);
      }
      setEditForm({ title: '', content: '', image: null });
      setShowEditForm(false);
      setEditFormType(null);
    } catch (err) {
      console.error(`Erro ao atualizar ${editFormType}:`, err);
      setError(`Erro ao salvar alterações de ${editFormType}. Tente novamente.`);
    }
  };

  const openEditForm = (type: 'grupo-oracao' | 'mil-amigos' | 'amo-rcc', data?: GrupoOracao | MilAmigos | AmoRcc) => {
    setEditFormType(type);
    if (data) {
      setEditForm({
        title: data.title || '',
        content: data.content || '',
        image: null,
      });
    } else {
      setEditForm({ title: '', content: '', image: null });
    }
    setShowEditForm(true);
  };





  if (isLoading || isLikeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-blue-950 to-green-900">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="h-6 sm:h-8 w-6 sm:w-8 border-4 border-t-green-300 border-white rounded-full animate-spin"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 bg-gradient-to-br from-blue-950 to-green-900">
        <p>Erro: {error}</p>
        <Link to="/login" className="ml-2 sm:ml-4 text-white underline text-sm sm:text-base">Ir para Login</Link>
      </div>
    );
  }


  return (
    <>
      {modalAberto && <div className="fixed inset-0 bg-black/75 z-[10] sm:hidden pointer-events-none" />}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen w-full bg-transparent">

        {/* Ajuste de Margem Superior:
          1. Removido 'py-6' do container pai.
          2. Adicionado '-mt-4 (telas pequenas) sm:-mt-8' (telas grandes) para subir o conteúdo em direção ao header fixo.
      */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 sm:px-8 -mt-16 sm:mt-4">

          {/* CONTEÚDO CENTRAL */}
          <main className="order-1 lg:order-2 lg:col-span-6 space-y-6 sm:-mt-16">


            <section className="text-center pt-2">
              <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-3xl font-serif font-bold text-white tracking-tight mb-2">
                Portal <span className="text-green-400">RCC Curitiba</span>
              </motion.h1>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl mb-8 flex justify-around items-center">
                {metricItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    disabled={item.id === 'm_likes' && isLikeLoading}
                    className={`flex flex-col items-center justify-center flex-1 px-1 transition-all ${item.onClick ? 'hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-default'
                      }`}
                  >
                    <div className={`text-sm mb-1 ${item.id === 'm_likes' && isLiked ? 'text-white-500' : 'text-gray-400'}`}>
                      {item.icon}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">{item.label}</div>
                    <span className="text-base font-black text-white tracking-tighter">
                      {item.value >= 1000 ? `${(item.value / 1000).toFixed(1)}k` : item.value}
                    </span>
                  </button>
                ))}
              </div>

              <QuickRadioLink />

              <YoutubeLiveWatcher />


            </section>


            {/* Carrossel de publicações (continua abaixo...) */}

            {/* Carrossel de publicações */}
            {publicacoes.length > 0 && (
              <div
                className="relative w-full aspect-video sm:aspect-[16/6] max-h-[40vh] sm:max-h-[50vh] min-h-[20rem] rounded-xl overflow-hidden mb-4 sm:mb-6 shadow-2xl border-2 border-green-300/30"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Indicador visual de pausa no topo do carrossel */}
                {isPaused && (
                  <div className="absolute top-2 left-2 z-30 bg-black/50 p-1 rounded-full text-white">
                    <FaStop className="text-[10px]" />
                  </div>
                )}
                <motion.div
                  key={publicacoes[currentIndex].id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link to={`/publicacoes/${publicacoes[currentIndex].id}`}>

                    <img
                      src={publicacoes[currentIndex].imagem ? `${API_BASE_URL}${publicacoes[currentIndex].imagem}` : `${API_BASE_URL}/assets/placeholder-400x300.jpg`}
                      alt={publicacoes[currentIndex].titulo}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => { e.currentTarget.src = `${API_BASE_URL}/assets/placeholder-400x300.jpg`; }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-950/80 p-1 sm:p-2 rounded-b-xl z-10">
                      <h3 className="text-xs sm:text-sm md:text-base font-semibold text-white text-shadow-md">{publicacoes[currentIndex].titulo}</h3>
                      <p className="text-xs sm:text-sm text-gray-300 text-shadow-sm">{publicacoes[currentIndex].categoria} | {publicacoes[currentIndex].responsavel}</p>
                    </div>
                  </Link>
                  <Link to="/comentar" onClick={(e) => e.stopPropagation()} aria-label="Comentar publicação" className="absolute top-1 sm:top-2 right-1 sm:right-2 z-20 p-0.5 sm:p-1 bg-white/80 rounded-full hover:bg-white transition">
                    <svg className="h-3 sm:h-4 w-3 sm:w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 2H4a2 2 0 00-2 2v16l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
                    </svg>
                  </Link>
                </motion.div>
                <div className="absolute bottom-1 sm:bottom-2 left-0 right-0 flex justify-center space-x-0.5 sm:space-x-1">
                  {publicacoes.map((publicacao, index) => (
                    <button
                      key={publicacao.id}
                      onClick={() => handleDotClick(index)}
                      className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${index === currentIndex ? 'bg-green-300' : 'bg-gray-300/50'}`}
                      aria-label={`Ir para slide ${index + 1}`}
                    ></button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentIndex((currentIndex - 1 + publicacoes.length) % publicacoes.length)}
                  className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 text-white bg-blue-500/50 rounded-md p-0.5 sm:p-1 hover:bg-blue-600/60 transition shadow-md"
                  aria-label="Slide anterior"
                >
                  <svg className="h-3 sm:h-4 w-3 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentIndex((currentIndex + 1) % publicacoes.length)}
                  className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 text-white bg-blue-500/50 rounded-md p-0.5 sm:p-1 hover:bg-blue-600/60 transition shadow-md"
                  aria-label="Próximo slide"
                >
                  <svg className="h-3 sm:h-4 w-3 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* ############################################################ */}
            {/* NOVA SEÇÃO: PÃO DIÁRIO E CENÁCULO LADO A LADO */}
            {/* ############################################################ */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Coluna do Pão Diário */}
              <div className="flex flex-col">
                <div className="text-center mb-4">
                  <h2 className="inline-flex items-center gap-3 text-xl sm:text-2xl font-bold text-green-100 uppercase tracking-tighter">
                    <FaFire className="text-orange-500 animate-pulse text-2xl" />
                    Pão Diário
                  </h2>
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent mt-2" />
                </div>
                <div className="flex-grow">
                  <PaoDiarioCard />
                </div>
              </div>

              {/* Coluna do Cenáculo Diário */}
              <div className="flex flex-col">
                <div className="text-center mb-4">
                  <h2 className="inline-flex items-center gap-3 text-xl sm:text-2xl font-bold text-green-100 uppercase tracking-tighter">
                    <FaFire className="text-orange-500 animate-pulse text-2xl" />
                    Cenáculo Diário
                  </h2>
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent mt-2" />
                </div>
                <div className="flex-grow">
                  <CenaculoDiario />
                </div>
              </div>
            </section>
            {/* ############################################################ */}
            <br></br>
            <div className="text-center mb-8">
              <h2 className="inline-flex items-center gap-4 text-2xl sm:text-3xl font-bold text-green-100 mb-4">
                <FaDove className="text-white-500 animate-pulse text-4xl" />
                Terço ao Espírito Santo
              </h2>
              {/* Linha divisória com largura total */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent mb-6" />
            </div>

            <TercoEspiritoSanto />

            <br></br>
            {/* Notícias da RCC Curitiba */}
            <section className="mb-4 sm:mb-6 max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="inline-flex items-center gap-4 text-2xl sm:text-3xl font-bold text-green-100 mb-4">
                  <FaNewspaper className="text-white-500 animate-pulse text-4xl" />
                  Notícias da RCC Curitiba
                </h2>
                {/* Linha divisória com largura total */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent mb-6" />
              </div>

              <ErrorBoundary>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
                  {noticias.length > 0 ? (
                    <>
                      {/* Notícia Principal (Destaque) */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        className="col-span-1 sm:col-span-2 row-span-2 relative group flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-green-300/30 bg-gray-900"
                      >
                        {/* Tag de Categoria Dinâmica para o Destaque */}
                        {noticias[0].categoria && (
                          <div className="absolute top-4 left-4 z-20 shadow-lg">
                            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white ${noticias[0].categoria === 'Formação' ? 'bg-purple-600' :
                              noticias[0].categoria === 'Evento' ? 'bg-yellow-600' : 'bg-green-600'
                              }`}>
                              {noticias[0].categoria}
                            </span>
                          </div>
                        )}

                        <NewsCard
                          id={noticias[0].id}
                          title={noticias[0].manchete || 'Sem título'}
                          image={noticias[0].foto ? `${API_BASE_URL}${noticias[0].foto}` : `${API_BASE_URL}/placeholder-400x300.jpg`}
                          description={noticias[0].resumo || 'Sem descrição'}
                          date={noticias[0].data_inicio}
                          author={noticias[0].autor}
                          size="large"
                        />
                      </motion.div>

                      {/* Notícias Secundárias (Cards Menores) */}
                      {noticias.slice(1, 4).map((noticia) => (
                        <motion.div
                          key={noticia.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ y: -5 }}
                          className="relative flex flex-col rounded-xl shadow-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm"
                        >
                          {/* Tag de Categoria para as Notícias Menores */}
                          {noticia.categoria && (
                            <div className="absolute top-2 left-2 z-20">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase text-white ${noticia.categoria === 'Formação' ? 'bg-purple-500/80' :
                                noticia.categoria === 'Evento' ? 'bg-yellow-500/80' : 'bg-green-500/80'
                                }`}>
                                {noticia.categoria}
                              </span>
                            </div>
                          )}

                          <NewsCard
                            id={noticia.id}
                            title={noticia.manchete || 'Sem título'}
                            image={noticia.foto ? `${API_BASE_URL}${noticia.foto}` : `${API_BASE_URL}/placeholder-400x300.jpg`}
                            description={noticia.resumo || 'Sem descrição'}
                            date={noticia.data_inicio}
                            author={noticia.autor}
                            size="small"
                          />
                        </motion.div>
                      ))}
                    </>


                  ) : (
                    <div className="flex flex-col items-center justify-center text-center w-full max-w-xs sm:max-w-md md:max-w-2xl p-2 sm:p-4 bg-white/10 rounded-lg shadow-inner border border-green-300/30 h-full col-span-full" aria-live="polite">
                      <FaInfoCircle className="text-2xl sm:text-3xl md:text-4xl text-green-300 mb-2 sm:mb-3" />
                      <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-2 sm:mb-3">
                        Nenhuma notícia disponível no momento.
                      </p>
                      <p className="text-xs sm:text-sm md:text-base text-gray-300">
                        Confira a página de notícias para atualizações.
                      </p>
                      <Link
                        to="/noticias"
                        className="mt-2 sm:mt-3 bg-white/90 text-blue-900 hover:bg-green-300 px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-md font-medium transition text-xs sm:text-sm md:text-base"
                        aria-label="Ver notícias"
                      >
                        Ver Notícias
                      </Link>
                    </div>
                  )}
                </div>
              </ErrorBoundary>
            </section>
            <br></br>

            <aside className="w-full block lg:hidden space-y-6 lg:col-span-3">
              {/*} <aside className="lg:col-span-3  lg:block sticky top-6 h-fit space-y-6"> {*/}

              {/* Widget de Eventos - Versão Smartphone Otimizada */}
              <div className="bg-white rounded-[2.5rem] p-5 border border-slate-100 shadow-lg relative overflow-hidden">
                {/* Detalhe estético lateral (melhor para scroll vertical no mobile) */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-orange-500 to-amber-500" />

                <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-wider ml-2">
                  <div className="p-2.5 bg-orange-50 rounded-2xl">
                    <FaCalendarAlt className="text-orange-600 text-lg" />
                  </div>
                  Próximos Eventos
                </h3>

                <div className="space-y-4">
                  {(() => {
                    const eventosPublicados = publicacoes.filter(pub =>
                      pub.status === 'publicada' && (pub.categoria === 'Evento')
                    );

                    if (eventosPublicados.length === 0) {
                      return (
                        <div className="bg-slate-50 rounded-[2rem] p-8 text-center border border-dashed border-slate-200 mx-2">
                          <p className="text-xs text-slate-400 font-bold italic">
                            Nenhum evento agendado para esta semana.
                          </p>
                        </div>
                      );
                    }

                    return eventosPublicados.slice(0, 3).map(evento => (
                      <Link
                        key={evento.id}
                        to={`/publicacoes/${evento.id}`}
                        className="block bg-slate-50 active:bg-orange-50 active:scale-[0.98] p-5 rounded-[2rem] transition-all border border-transparent border-l-0 ml-2"
                      >
                        <div className="flex flex-col">
                          <div className="flex justify-between items-center mb-3">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${evento.categoria === 'Formação'
                                ? 'bg-purple-100 text-purple-600'
                                : 'bg-orange-100 text-orange-700'
                              }`}>
                              {evento.categoria}
                            </span>
                            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter">
                              Ver agora →
                            </span>
                          </div>

                          <h4 className="text-[15px] font-extrabold text-slate-800 line-clamp-2 leading-tight">
                            {evento.titulo}
                          </h4>
                        </div>
                      </Link>
                    ));
                  })()}
                </div>

                <Link
                  to="/agenda"
                  className="flex items-center justify-center gap-3 w-full mt-8 text-[12px] font-black text-white py-4 bg-slate-900 rounded-[1.5rem] uppercase tracking-[0.2em] shadow-md active:scale-95 transition-all"
                >
                  <FaCalendarAlt size={14} />
                  Agenda Completa
                </Link>
              </div>
            </aside>
            <br></br>
            <div className="block lg:hidden text-center mb-8">
              <h2 className="inline-flex items-center gap-4 text-2xl sm:text-3xl font-bold text-green-100 mb-4">
                <FaBroadcastTower className="animate-pulse text-white-500 text-4xl" />WEB Rádio RCC
              </h2>
              {/* Linha divisória com largura total */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent mb-6" />
            </div>

            {/* ID essencial para a âncora funcionar */}
            <div id="webradio" className="block lg:hidden scroll-mt-24">
              <WebRadio /> {/* <--- USANDO O COMPONENTE AQUI */}
            </div>

            <br></br>
            <section className="mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Cabeçalho com título e linha divisória em largura total */}
              <div className="text-center mb-8">
                <h2 className="inline-flex items-center gap-4 text-2xl sm:text-3xl font-bold text-green-100 mb-4">
                  <FaVideo className="text-white-500 animate-pulse text-4xl" />
                  Vídeos RCC Curitiba
                </h2>
                {/* Linha divisória com largura total */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent mb-6" />
              </div>

              {/* Botão de ordenação centralizado */}
              <div className="flex justify-center mb-10">
                <button
                  onClick={toggleNoticiasOrder}
                  className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition flex items-center gap-3 shadow-md hover:shadow-lg"
                >
                  <span className="font-medium">
                    Ordenar por: {noticiasOrderBy === 'data' ? 'Mais recentes' : 'Mais vistos'}
                  </span>
                </button>
              </div>

              {/* Debug visual (opcional - pode remover depois) */}
              <div className="text-center mb-6 text-yellow-300 font-medium">
                {noticiasVideos.length} vídeo(s) carregado(s) | Página {noticiasVideoPage}
              </div>

              {noticiasVideos.length === 0 ? (
                <p className="text-center text-gray-400 text-lg py-12">
                  Nenhuma notícia em vídeo publicada no momento.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {noticiasVideos.map(video => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className={`bg-gray-900/90 rounded-2xl overflow-hidden shadow-2xl border ${video.is_featured ? 'border-yellow-500 border-2' : 'border-green-700/40'
                          } hover:border-green-500 transition-all group cursor-pointer backdrop-blur-sm relative`}
                        onClick={() => openVideoModal(video)}
                      >
                        {video.is_featured && (
                          <div className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                            Destaque
                          </div>
                        )}

                        <div className="relative aspect-video group-hover:brightness-110 transition">
                          <img
                            src={video.thumbnail_url || '/assets/placeholder-video.jpg'}
                            alt={video.titulo}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-70 group-hover:opacity-90 transition-opacity">
                            <FaPlayCircle className="text-red-600 text-7xl drop-shadow-2xl" />
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                            {video.titulo}
                          </h3>
                          <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                            {video.descricao}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span>{new Date(video.uploaded_at).toLocaleDateString('pt-BR')}</span>
                            <span className="flex items-center gap-1">
                              <FaEye className="text-green-400" /> {video.views}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {hasMoreNoticiasVideos && (
                    <div className="text-center mt-12">
                      <button
                        onClick={loadMoreNoticiasVideos}
                        className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                      >
                        Ver Mais Notícias em Vídeo
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>

            {/* Modal de vídeo */}
            <AnimatePresence>
              {selectedVideo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[1000] p-4 overflow-hidden" // ← z-[1000] alto + overflow-hidden
                  onClick={() => setSelectedVideo(null)}
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="bg-gray-900 rounded-xl overflow-hidden max-w-5xl w-full relative max-h-[90vh] flex flex-col" // ← max-h-[90vh] evita ultrapassar tela
                    onClick={e => e.stopPropagation()}
                  >

                    <br></br>  <br></br>
                    {/* Player com padding-top para não ficar sob navbar */}
                    <div
                      className="w-full bg-black relative"
                      style={{
                        aspectRatio: '16/9',
                        height: 'clamp(35vh, 45vh, 55vh)', // menor em mobile (35vh), cresce até 55vh em desktop
                        minHeight: '220px',                // mínimo absoluto para não sumir
                        maxHeight: '65vh'
                      }}
                    >
                      <ReactPlayer
                        url={selectedVideo.video_url}
                        controls={true}
                        width="100%"
                        height="100%"
                        playing={true}
                        muted={false}
                        playsinline={true}
                        pip={true}
                        style={{ position: 'absolute', top: 0, left: 0 }}
                        config={{
                          file: {
                            attributes: { controlsList: 'nodownload', disablePictureInPicture: false },
                          },
                        }}
                        onError={(e) => console.error('ReactPlayer error:', e)}
                        onReady={() => console.log('Player ready - MP4 local')}
                        onPlay={() => console.log('Reprodução iniciada')}
                      />
                    </div>

                    {/* Área inferior - visível logo abaixo */}
                    <div className="p-5 sm:p-6 bg-gray-900">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 line-clamp-2">
                            {selectedVideo.titulo}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {new Date(selectedVideo.uploaded_at).toLocaleDateString('pt-BR', { dateStyle: 'long' })} • {selectedVideo.views} visualizações
                          </p>
                        </div>
                        <button
                          onClick={closeVideoModal}
                          className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-medium rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-105 min-w-[140px]"
                        >
                          <FaTimes className="text-xl" />
                          Fechar
                        </button>
                      </div>
                      <div className="overflow-y-auto max-h-[35vh] pr-2 scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-800">
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                          {selectedVideo.descricao}
                        </p>
                      </div>
                    </div>

                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>


            {/* Profecias RCC */}
            <br /><br />
            <section className="mb-4 sm:mb-6 max-w-7xl mx-auto">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-100 text-center mb-4 sm:mb-6 pb-2 flex items-center justify-center gap-3">
                <FaBookBible className="text-3xl sm:text-4xl text-purple-400 animate-pulse drop-shadow-lg" />
                Profecias para a RCC Brasil
              </h2>
              {/* Linha divisória com largura total */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent mb-6" />
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative bg-gradient-to-br from-purple-900/80 via-indigo-900/70 to-blue-900/80 rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border border-purple-400/40 overflow-hidden min-h-[20rem] sm:min-h-[24rem] flex flex-col lg:flex-row items-center lg:items-stretch gap-6 lg:gap-8 hover:shadow-3xl transition-all duration-500"
              >
                {/* Efeito de luz espiritual */}
                <motion.div
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 via-blue-400/10 to-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-indigo-400/20 via-purple-400/15 to-blue-500/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
                </motion.div>

                {/* Ícone principal */}
                <motion.div
                  className="flex-shrink-0 flex flex-col items-center lg:items-start z-10 text-center lg:text-left"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.div
                    className="relative mb-4 sm:mb-6"
                    animate={{
                      rotate: [-5, 5, -5],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <FaBookBible className="text-6xl sm:text-7xl md:text-8xl text-purple-300 drop-shadow-2xl" />
                    <div className="absolute -top-2 -right-2 text-amber-400 text-4xl sm:text-5xl animate-ping">
                      ✨
                    </div>
                  </motion.div>
                  <div className="space-y-2 sm:space-y-3 max-w-md">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold bg-gradient-to-r from-purple-200 via-white to-indigo-200 bg-clip-text text-transparent drop-shadow-lg">
                      Palavras do Senhor
                    </h3>
                    <p className="text-purple-100 text-sm sm:text-base md:text-lg leading-relaxed font-light drop-shadow-md max-w-lg">
                      Consulte e estude as profecias direcionadas à Renovação Carismática Católica do Brasil nos últimos anos. Um arquivo sagrado de orientação divina.
                    </p>
                  </div>
                </motion.div>

                {/* Card preview */}
                <motion.div
                  className="flex-1 flex flex-col justify-center lg:ml-8 z-10"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-serif font-bold text-white">📜</span>
                      </div>
                      <div>
                        <p className="text-purple-200 font-medium text-sm sm:text-base">Atualizado recentemente</p>
                        <p className="text-indigo-300 text-xs sm:text-sm font-light">+50 profecias catalogadas</p>
                      </div>
                    </div>
                    <div className="space-y-4 mb-8">
                      <blockquote className="text-lg sm:text-xl md:text-2xl font-serif italic text-white/90 border-l-4 border-purple-400 pl-6 py-4 bg-purple-500/10 rounded-r-xl">
                        "Filhos meus, eu vos chamo a uma <strong>nova efusão do Espírito</strong>."
                      </blockquote>
                      <p className="text-xs sm:text-sm text-purple-300 italic text-center">
                        — Profecia 2025 | Encontro Nacional RCC Brasil
                      </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        to="/profecias-rcc"
                        className="w-full block bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-2xl text-lg sm:text-xl shadow-2xl hover:shadow-3xl text-center transition-all duration-300 border-2 border-purple-400/50 hover:border-purple-300/70 flex items-center justify-center gap-3 group"
                        aria-label="Acessar todas as profecias RCC"
                      >
                        <span>📖 Acessar Profecias</span>
                        <FaBookBible className="text-xl group-hover:animate-bounce" />
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <Link
                        to="/profecias-rcc"
                        className="inline-flex items-center gap-2 text-purple-200 hover:text-white text-sm sm:text-base font-medium transition-colors duration-300 group hover:underline underline-offset-2"
                      >
                        <span>Ver todas as profecias →</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.section>
            </section>

            {/* Canal YouTube e Gabaon */}
            <br /><br />
            <section className="mb-4 sm:mb-6 max-w-7xl mx-auto px-2 sm:px-4">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 items-stretch">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-100 text-center mb-4 sm:mb-6 pb-2 flex items-center justify-center gap-2">
                    <FaYoutube className="text-white-600 animate-pulse" /> Nossa Play List no YouTube
                  </h2>
                  {/* Linha divisória com largura total */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent mb-6" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="flex justify-center sm:h-36 md:h-52 items-center gap-2 sm:gap-4 p-2 sm:p-4 bg-gradient-to-br from-red-900/40 via-gray-800/30 to-gray-500/50 rounded-xl shadow-xl border border-red-400/30 hover:shadow-2xl transition-all duration-300"
                  >
                    <FaPlayCircle className="text-white-500 text-2xl sm:text-3xl md:text-4xl animate-bounce" />
                    <Link
                      to="/canal-youtube"
                      className="text-white text-base sm:text-lg md:text-xl font-semibold bg-red-600 hover:bg-red-700 px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-3 rounded-full flex items-center gap-1 sm:gap-2 transition-colors duration-300"
                    >
                      Acesse Agora <FaYoutube className="text-white" />
                    </Link>
                  </motion.div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-100 text-center mb-4 sm:mb-6 pb-2 flex items-center justify-center gap-2">
                    <FaUsers className="text-white-600 animate-pulse" />  Gabaon
                  </h2>
                  {/* Linha divisória com largura total */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent mb-6" />

                  <GabaonPromoSection />
                </div>
              </div>
            </section>

            {/* Formação */}
            <br /><br />
            <div className="text-center mb-8">
              <h2 className="inline-flex items-center gap-4 text-2xl sm:text-3xl font-bold text-green-100 mb-4">
                <FaBookOpen className="text-white-500 animate-pulse text-4xl" />
                Formação
              </h2>
              {/* Linha divisória com largura total */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent mb-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 max-w-7xl mx-auto">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="bg-gradient-to-br from-gray-800 via-indigo-900 to-gray-900 rounded-xl p-4 sm:p-6 shadow-2xl h-auto min-h-[15rem] sm:min-h-[20rem] flex flex-col justify-center items-center border border-indigo-200/50 relative overflow-hidden"
              >
                <motion.div
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                >
                  <div className="absolute bottom-10 right-10 text-indigo-200/30 text-4xl">🕯</div>
                </motion.div>
                <h2 className="text-xl sm:text-2xl md:text-2.5xl font-semibold mb-3 sm:mb-4 text-center text-gray-100 z-10">
                  Formação do Mês - Espiritualidade
                </h2>
                {formacao ? (
                  <>
                    <motion.img
                      src={formacao.imagem}
                      alt={formacao.titulo}
                      className="w-full max-w-xs sm:max-w-md h-36 sm:h-44 md:h-52 object-cover rounded-lg mb-3 sm:mb-4 z-10"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      onError={(e) => { e.currentTarget.src = `${API_BASE_URL}/placeholder-400x300.jpg`; }}
                    />
                    <motion.p
                      className="text-sm sm:text-base md:text-lg text-center max-w-xs sm:max-w-md md:max-w-2xl mb-3 sm:mb-4 text-gray-200 z-10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      dangerouslySetInnerHTML={{ __html: formacao.resumo }}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="relative z-20"
                    >
                      <Link
                        to="/espiritualidade"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-200 border border-indigo-300 shadow-sm outline-none focus:ring-2 focus:ring-indigo-400 z-20 text-sm sm:text-base text-center"
                        aria-label="Saiba mais sobre a formação do mês"
                      >
                        Saiba Mais
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    className="flex flex-col items-center justify-center text-center max-w-xs sm:max-w-md md:max-w-2xl p-4 sm:p-6 bg-gray-800/20 rounded-lg shadow-inner border border-indigo-200/30 z-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    aria-live="polite"
                  >
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}>
                      <FaInfoCircle className="text-2xl sm:text-3xl md:text-4xl text-indigo-400 mb-2 sm:mb-3" />
                    </motion.div>
                    <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-2 sm:mb-3">
                      Nenhuma formação disponível para este mês.
                    </p>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300">
                      Visite nossa página de espiritualidade para mais conteúdos e recursos.
                    </p>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="relative z-20">
                      <Link
                        to="/espiritualidade"
                        className="mt-3 bg-indigo-600 hover:bg-indigo-500 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-200 border border-indigo-300 shadow-sm outline-none focus:ring-2 focus:ring-indigo-400 z-20 text-sm sm:text-base text-center"
                        aria-label="Explorar conteúdos de espiritualidade"
                      >
                        Explorar Espiritualidade
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </motion.section>

              {/* Mensagem do Coordenador */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative max-w-5xl mx-auto p-6 sm:p-10 bg-gradient-to-br from-blue-900/90 via-green-800/80 to-blue-800/80 rounded-2xl shadow-xl border border-green-400/40 min-h-[18rem] sm:min-h-[22rem] flex flex-col sm:flex-row items-stretch"
              >
                {mensagemPreview?.tituloMensagem && mensagemPreview.tituloMensagem !== 'Sem título' ? (
                  <div className="flex flex-col sm:flex-row gap-8 w-full">
                    <Link to="/mensagem-coordenacao" className="flex-shrink-0 w-full sm:w-[18rem] md:w-[20rem] self-center sm:self-start relative z-0">
                      <div className="relative w-full rounded-xl overflow-hidden shadow-lg group border border-green-400/40 bg-black">
                        <motion.img
                          src={mensagemPreview?.foto_mensagem ? `${API_BASE_URL}${mensagemPreview.foto_mensagem}` : 'https://via.placeholder.com/400x300'}
                          alt={mensagemPreview.tituloMensagem}
                          className="w-full h-auto object-contain transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-110"
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>
                    </Link>
                    <div className="flex flex-col justify-between flex-1 space-y-4 relative z-10">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-white leading-snug drop-shadow-md">
                        {mensagemPreview.tituloMensagem}
                      </h3>
                      <div
                        className="text-base sm:text-lg text-gray-200 leading-relaxed font-light prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: mensagemPreview.resumoMensagem }}
                      />
                      <div>
                        <Link
                          to="/mensagem-coordenacao"
                          className="inline-block bg-gradient-to-r from-green-600 to-teal-600 hover:brightness-110 text-white px-6 py-3 rounded-lg font-medium text-base sm:text-sm shadow-md hover:shadow-xl focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition-all duration-300"
                          aria-label="Ler mensagem do coordenador"
                        >
                          Ler a Mensagem
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center w-full p-8 rounded-lg relative z-10">
                    <FaInfoCircle className="text-4xl sm:text-5xl text-green-400 mb-4" />
                    <p className="text-lg sm:text-xl text-white font-serif font-medium mb-2">
                      Nenhuma mensagem da coordenação disponível no momento.
                    </p>
                    <p className="text-sm sm:text-base text-gray-200 mb-6">
                      Em breve a mensagem do mês será publicada.
                    </p>
                    <Link
                      to="/mensagem-coordenacao"
                      className="bg-gradient-to-r from-green-600 to-teal-600 hover:brightness-110 text-white px-6 py-3 rounded-lg font-medium text-base sm:text-lg shadow-md hover:shadow-xl focus:ring-2 focus:ring-offset-2 focus:ring-green-400 transition-all duration-300"
                      aria-label="Ver atualizações de coordenação"
                    >
                      Ver Coordenação
                    </Link>
                  </div>
                )}
              </motion.section>
            </div>

            {/* Outras seções */}
            <div>
              <section className="my-16 max-w-7xl mx-auto px-4 sm:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-yellow-200/70 via-orange-100/60 to-red-400/70 rounded-2xl shadow-lg p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl transition-all backdrop-blur-sm"
                >
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
                  >
                    <div className="w-full h-full bg-gradient-radial from-yellow-100/10 via-red-100/5 to-transparent rounded-full"></div>
                  </motion.div>
                  <motion.div
                    className="flex-shrink-0 text-7xl sm:text-8xl md:text-9xl text-yellow-100 z-10"
                    animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <FaBook className="text-yellow-100 drop-shadow-lg" />
                  </motion.div>
                  <div className="flex-1 text-center md:text-left z-10">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
                      Conheça a Identidade da RCC
                    </h2>
                    <p className="text-yellow-100 text-base sm:text-lg md:text-xl mb-6 leading-relaxed drop-shadow-sm">
                      Descubra a missão, valores e espiritualidade da Renovação Carismática Católica. Venha se aprofundar na fé, experimentar a ação do Espírito Santo e viver a espiritualidade carismática intensamente.
                    </p>
                    <Link
                      to="/identidade-rcc"
                      className="inline-block bg-yellow-400 hover:bg-yellow-300 text-red-900 font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      Explore Agora
                    </Link>
                  </div>
                  <motion.div
                    className="absolute bottom-0 right-10 w-40 h-40 rounded-full bg-gradient-to-t from-red-500 via-orange-400 to-transparent opacity-50 blur-3xl animate-pulse z-0"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <motion.div
                    className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-gradient-to-t from-yellow-400 via-red-500 to-transparent opacity-40 blur-2xl animate-pulse z-0"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                  />
                </motion.div>
              </section>

              <div className="text-center mb-8">
                <h2 className="inline-flex items-center gap-4 text-2xl sm:text-3xl font-bold text-green-100 mb-4">
                  <FaHandsPraying className="text-white-500 animate-pulse text-4xl" />
                  Espiritualidade
                </h2>
                {/* Linha divisória com largura total */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent mb-6" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 rounded-xl p-4 sm:p-6 shadow-2xl h-auto min-h-[15rem] sm:min-h-[20rem] flex flex-col justify-center items-center border border-amber-300/50 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  >
                    <div className="absolute top-10 left-10 text-amber-200/30 text-4xl">🎶</div>
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl md:text-2.5xl font-semibold mb-3 sm:mb-4 text-center text-amber-900 z-10">
                    {grupoOracao && grupoOracao.length > 0 ? grupoOracao[0].title : 'Participe de um Grupo de Oração!'}
                  </h2>
                  {isAdmin && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      onClick={() => openEditForm('grupo-oracao', grupoOracao && grupoOracao.length > 0 ? grupoOracao[0] : undefined)}
                      className="mb-3 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm outline-none focus:ring-2 focus:ring-amber-400 z-20"
                    >
                      Editar
                    </motion.button>
                  )}
                  <motion.img
                    src={
                      grupoOracao && grupoOracao.length > 0
                        ? `${API_BASE_URL}${grupoOracao[0].image_path.replace(/^https?:\/\/[^/]+/, '')}?t=${Date.now()}`
                        : `${API_BASE_URL}/ImgGrupos/grupo-de-oracao.png`
                    }
                    alt="Grupo de Oração"
                    className="w-full max-w-xs sm:max-w-md h-40 sm:h-56 md:h-72 object-cover rounded-lg mb-3 sm:mb-4 z-10"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    onError={(e) => {
                      console.error('Erro ao carregar imagem:', grupoOracao && grupoOracao.length > 0 ? grupoOracao[0].image_path : '/ImgGrupos/grupo-de-oracao.png');
                      e.currentTarget.src = `${API_BASE_URL}/ImgGrupos/grupo-de-oracao.png`;
                    }}
                  />
                  <motion.p
                    className="text-sm sm:text-base md:text-lg text-center max-w-xs sm:max-w-md md:max-w-2xl mb-3 sm:mb-4 text-amber-800 z-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    dangerouslySetInnerHTML={{
                      __html: grupoOracao && grupoOracao.length > 0
                        ? grupoOracao[0].content
                        : '<b>Venha participar de um Grupo de Oração da RCC!</b><br></br> Aqui você encontrará paz, esperança e libertação! Somos uma verdadeira família em Cristo e estamos de braços abertos para acolher você. Seja bem-vindo a essa linda caminhada de fé, amor e renovação no Espírito Santo!'
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="relative z-20"
                  >
                    <Link
                      to="/mapa-grupos"
                      className="bg-amber-600 hover:bg-amber-500 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-200 border border-amber-300 shadow-sm outline-none focus:ring-2 focus:ring-amber-400 z-20 text-sm sm:text-base text-center"
                      aria-label="Encontre seu Grupo de Oração"
                    >
                      Encontre seu Grupo de Oração
                    </Link>
                  </motion.div>
                </motion.section>

                {/* Grupos de Hoje */}
                <div className="block lg:hidden bg-gradient-to-br from-teal-600/20 to-blue-600/20 rounded-2xl p-5 border border-teal-400/30 shadow-lg backdrop-blur-sm">
                  <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2 uppercase tracking-tighter">
                    <FaUsers className="text-teal-300" /> Grupos de Hoje
                  </h3>

                  <div className="space-y-4">
                    {gruposHoje.length > 0 ? gruposHoje.map(grupo => (
                      <div key={grupo.id} className="border-l-2 border-teal-400/60 pl-3">
                        <h4 className="text-[11px] font-bold text-white line-clamp-1">
                          {grupo.nome}
                        </h4>

                        <p className="text-[9px] text-gray-300 flex items-center gap-1 mt-0.5">
                          <FaMapMarkerAlt className="text-teal-400" /> {grupo.paroquia}
                        </p>

                        <p className="text-[10px] text-teal-200 font-medium mt-1">
                          {grupo.horario}
                        </p>
                      </div>
                    )) : (
                      <p className="text-[10px] text-gray-400 italic text-center">
                        Nenhum grupo hoje.
                      </p>
                    )}
                  </div>

                  <Link
                    to="/grupos-hoje"
                    className="block w-full mt-4 text-center text-[10px] font-black text-teal-300 hover:text-white uppercase"
                  >
                    Ver Todos
                  </Link>
                </div>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="oracao-fundo w-full max-w-[750px] mx-auto min-h-[40rem] flex flex-col overflow-hidden"
                >
                  <div className="flex-shrink-0 space-y-3 pb-3 border-b border-indigo-100 bg-gradient-to-b from-indigo-50/80 to-transparent backdrop-blur-sm z-10 sticky top-0">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-indigo-900 text-center">
                      🕊️ Orações da Comunidade
                    </h3>
                    <div className="text-center">
                      <Link
                        to="/pedidos-oracao"
                        className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors duration-300 shadow-md focus:ring-2 focus:ring-indigo-300"
                      >
                        Enviar um Pedido de Oração
                      </Link>
                    </div>
                    <p className="text-indigo-800 text-sm sm:text-base md:text-lg font-light text-center italic">
                      Participe de nossa corrente de oração.<br />
                      <span className="text-indigo-900 font-medium">Sua intercessão</span> fortalece nossa fé e promove milagres.
                    </p>
                  </div>
                  <div className="flex-1 overflow-y-auto overflow-x-hidden mt-3 pr-1">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={prayerIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 gap-4"
                      >
                        {pedidosOracao.slice(prayerIndex, prayerIndex + 2).map((pedido) => (
                          <motion.div
                            key={pedido.id}
                            className="bg-white/70 p-4 rounded-lg shadow-md border border-indigo-100 hover:bg-white/90 transition-colors duration-300"
                            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                          >
                            <div className="flex items-center mb-2">
                              <svg
                                className="w-5 sm:w-4 h-5 sm:h-6 text-indigo-500 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                              </svg>
                              <h4 className="text-sm sm:text-base font-medium text-indigo-900 truncate">
                                {pedido.nome} - {pedido.cidade}
                              </h4>
                            </div>
                            <p className="text-indigo-700 text-sm sm:text-base leading-relaxed line-clamp-3">
                              {pedido.mensagem}
                            </p>
                            <p className="text-indigo-500 text-xs sm:text-sm italic mt-1">
                              Enviado em: {new Date(pedido.data_envio).toLocaleDateString('pt-BR')}
                            </p>
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.section>
              </div>

              <br /><br />
              <div className="text-center mb-8">
                <h2 className="inline-flex items-center gap-4 text-2xl sm:text-3xl font-bold text-green-100 mb-4">
                  <FaLightbulb className="text-white-500 animate-pulse text-4xl" />
                  Projetos
                </h2>
                {/* Linha divisória com largura total */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent mb-6" />
              </div>

              <section className="mb-4 sm:mb-6 w-full mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 px-1 sm:px-2">
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full bg-gradient-to-br from-green-800/70 via-teal-800/50 to-blue-900/70 rounded-2xl p-2 sm:p-4 shadow-xl flex flex-col items-center text-white min-h-[15rem] sm:min-h-[20rem]"
                  >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-center text-white/95 drop-shadow-md">
                      {milAmigos && milAmigos.length > 0 ? milAmigos[0].title : 'Projeto Mil Amigos'}
                    </h2>
                    {isAdmin && (
                      <button
                        onClick={() => openEditForm('mil-amigos', milAmigos && milAmigos.length > 0 ? milAmigos[0] : undefined)}
                        className="mb-2 bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Editar
                      </button>
                    )}
                    <img
                      src={
                        milAmigos && milAmigos.length > 0
                          ? `${API_BASE_URL}${milAmigos[0].image_path.replace(/^https?:\/\/[^/]+/, '')}?t=${Date.now()}`
                          : `${API_BASE_URL}/ImgAmigos/amigoDefault.png`
                      }
                      alt="Projeto Mil Amigos"
                      className="w-full max-w-xs sm:max-w-md h-32 sm:h-48 md:h-64 object-cover rounded-xl mb-2 sm:mb-3 shadow-lg"
                      onError={(e) => {
                        console.error('Erro ao carregar imagem:', milAmigos && milAmigos.length > 0 ? milAmigos[0].image_path : 'ImgAmigos/amigoDefault.png');
                        e.currentTarget.src = `${API_BASE_URL}/ImgAmigos/amigoDefault.png`;
                      }}
                    />
                    <p
                      className="text-sm sm:text-base md:text-lg text-center max-w-xs sm:max-w-md md:max-w-xl mb-2 sm:mb-3 text-gray-100 font-light leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: milAmigos && milAmigos.length > 0
                          ? milAmigos[0].content
                          : 'Junte-se ao Projeto Mil Amigos! <br></br>Sua participação é essencial para apoiar as ações missionárias da RCC Curitiba.'
                      }}
                    />
                    <Link
                      to="/mil-amigos"
                      className="bg-teal-600 hover:bg-emerald-500 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-xl font-semibold text-sm sm:text-base shadow-md transition-all duration-300 border border-white/30 hover:shadow-lg"
                    >
                      Saiba Mais e Participe
                    </Link>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-full sm:max-w-md md:max-w-xl bg-gradient-to-br from-green-800/70 via-teal-800/50 to-blue-900/70 rounded-2xl p-3 sm:p-5 shadow-xl flex flex-col items-center text-white min-h-[16rem] sm:min-h-[22rem]"
                  >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center text-white/95 drop-shadow-md">
                      {amoRcc && amoRcc.length > 0 ? amoRcc[0].title : 'Projeto Eu Amo a RCC'}
                    </h2>
                    {isAdmin && amoRcc && amoRcc.length > 0 && (
                      <Link
                        to={`/admin/amo-rcc-home/${amoRcc[0].id}`}
                        className="mb-3 bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 shadow-md"
                      >
                        Editar
                      </Link>
                    )}
                    <div className="relative w-full max-w-[90%] aspect-[4/3] mb-3 sm:mb-4">

                      <img
                        src={
                          amoRcc && amoRcc.length > 0
                            ? `${API_BASE_URL}${amoRcc[0].image_path.replace(/^https?:\/\/[^/]+/, '')}?t=${Date.now()}`
                            : `${API_BASE_URL}/ImgAmoRcc/amigoDefault.png`
                        }
                        alt="Projeto Eu Amo a RCC"
                        className="w-full h-full object-cover rounded-xl shadow-2xl border-2 border-white/40 hover:border-white/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.7)] transition-all duration-300 ease-in-out"
                        onError={(e) => {
                          console.error('Erro ao carregar imagem:', amoRcc && amoRcc.length > 0 ? amoRcc[0].image_path : 'ImgAmigos/amigoDefault.png');
                          e.currentTarget.src = `${API_BASE_URL}/ImgAmoRcc/amigoDefault.png`;
                        }}
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <p
                      className="text-sm sm:text-base md:text-lg text-center max-w-[90%] mb-3 sm:mb-4 text-gray-100 font-light leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: amoRcc && amoRcc.length > 0
                          ? amoRcc[0].content
                          : 'Fortaleça a unidade e pertencimento à RCC em Curitiba. Participe e viva o amor de Deus!'
                      }}
                    />
                    <Link
                      to="/amo-rcc"
                      className="bg-teal-600 hover:bg-emerald-500 text-white px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-xl font-semibold text-sm sm:text-base shadow-md transition-all duration-300 border border-white/40 hover:border-white/60 hover:shadow-lg"
                    >
                      Saiba Mais
                    </Link>
                  </motion.section>


                </div>
              </section>
              <br /><br />
              <section className="mb-8 sm:mb-12 max-w-7xl mx-auto px-2 sm:px-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-100 pb-2 flex items-center justify-center gap-3">
                    <FaBroadcastTower className="text-white-500 animate-pulse text-2xl" />
                    Notícias Católicas
                  </h2>
                  {/* Linha divisória com largura total */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-200/50 to-transparent mt-2" />
                </div>

                {formattedNoticiasRSS.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[12rem] sm:min-h-[15rem]">
                    {formattedNoticiasRSS.map((noticia) => (
                      <motion.li
                        key={uuidv4()}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="h-full"
                      >
                        <a
                          href={noticia.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block h-full bg-gradient-to-br from-blue-900/40 to-green-900/40 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shadow-lg hover:shadow-green-500/20 hover:border-green-500/40 transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-green-300 transition-colors line-clamp-2 leading-snug">
                              {noticia.title || 'Sem título'}
                            </h3>
                            <p className="text-xs text-gray-300 line-clamp-3 font-light leading-relaxed">
                              {/* Aqui geralmente o RSS traz o resumo no próprio title ou em field separado */}
                              {noticia.title}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] uppercase tracking-widest font-medium text-gray-400">
                            <span className="flex items-center gap-1.5 group-hover:text-gray-200 transition-colors">
                              <FaCalendarAlt className="text-blue-400 text-[11px]" />
                              {noticia.date}
                            </span>
                            <span className="text-blue-400 font-black group-hover:translate-x-1 transition-transform">
                              LER →
                            </span>
                          </div>
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-400 h-32 flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-white/5 italic"
                  >
                    <FaInfoCircle className="mb-2 text-xl opacity-20" />
                    Nenhuma notícia católica encontrada no momento.
                  </motion.div>
                )}
              </section>
            </div>

            {/* SEÇÃO DE COMENTÁRIOS - CHAMADA AQUI */}
            <div className="mt-20 border-t border-white/10 pt-12">
              <Comentarios comments={comments} />
            </div>

          </main>


          {/* LATERAL ESQUERDA (2 colunas no grid original) */}
          <aside className="order-2 lg:order-1 lg:col-span-2 space-y-6 lg:pt-16 lg:pr-4">

            {/* Widget Mil Amigos */}
            <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 rounded-2xl p-5 border border-green-700/30 shadow-xl backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><FaHeart className="text-white-500" /> Apoie-nos</h3>
              <p className="text-gray-300 text-[11px] mb-4 leading-relaxed">Ajude a manter as missões da RCC Curitiba.</p>
              <Link to="/mil-amigos" className="block w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-xl text-center text-xs">Saber Mais</Link>
            </div>

            {/* Widget Grupos de Hoje */}
            <div className="hidden lg:block bg-gradient-to-br from-teal-900/40 to-blue-900/40 rounded-2xl p-5 border border-teal-700/30 shadow-xl backdrop-blur-sm">
              <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2 uppercase tracking-tighter">
                <FaUsers className="text-teal-400" /> Grupos de Hoje
              </h3>
              <div className="space-y-4">
                {gruposHoje.length > 0 ? gruposHoje.map(grupo => (
                  <div key={grupo.id} className="border-l-2 border-teal-500/50 pl-3">
                    <h4 className="text-[11px] font-bold text-white line-clamp-1">{grupo.nome}</h4>
                    <p className="text-[9px] text-gray-400 flex items-center gap-1 mt-0.5"><FaMapMarkerAlt className="text-teal-500" /> {grupo.paroquia}</p>
                    <p className="text-[10px] text-teal-300 font-medium mt-1">{grupo.horario}</p>
                  </div>
                )) : <p className="text-[10px] text-gray-500 italic text-center">Nenhum grupo hoje.</p>}
              </div>
              <Link to="/grupos-hoje" className="block w-full mt-4 text-center text-[10px] font-black text-teal-400 hover:text-white uppercase">Ver Todos</Link>
            </div>

            {/* NOVO COMPONENTE: Newsletter Pão Diário */}
            <NewsletterPaoDiario
              onSuccess={() => {
                setThanksContent({
                  title: 'Inscrição Confirmada!',
                  message: 'Agora você faz parte da nossa rede! Prepare o coração para receber o Pão Diário e as notícias diretamente no seu e-mail.',
                  type: 'news'
                });
                setShowThanks(true);
              }}
            />

            {/* Agenda Próxima */}
            {/* Widget de Eventos e Formações - Ajustado para acompanhar a nova largura */}
            <aside className="hidden lg:block sticky top-6 h-fit space-y-6">
              <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                {/* Detalhe sutil de cor no topo */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400" />

                <h3 className="text-sm font-black text-slate-800 mb-6 flex items-center gap-3 uppercase tracking-wider">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FaPlayCircle className="text-blue-500 text-lg" />
                  </div>
                  Próximos Eventos
                </h3>

                <div className="space-y-3">
                  {(() => {
                    const eventosPublicados = publicacoes.filter(pub =>
                      pub.status === 'publicada' && pub.categoria === 'Evento'
                    );

                    if (eventosPublicados.length === 0) {
                      return (
                        <div className="bg-slate-50 rounded-2xl p-6 text-center border border-dashed border-slate-200">
                          <p className="text-[11px] text-slate-400 font-medium italic">
                            Nenhum retiro ou formação agendado para este mês.
                          </p>
                        </div>
                      );
                    }

                    return eventosPublicados.slice(0, 3).map(evento => (
                      <Link
                        key={evento.id}
                        to={`/publicacoes/${evento.id}`}
                        className="group block bg-slate-50 hover:bg-white p-4 rounded-2xl transition-all border border-transparent hover:border-blue-100 hover:shadow-md hover:-translate-y-1"
                      >
                        <div className="flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-black uppercase tracking-[0.15em] px-2 py-1 bg-blue-100 text-blue-600 rounded-md">
                              {evento.categoria}
                            </span>
                            <FaEye className="text-slate-300 group-hover:text-blue-400 transition-colors text-[10px]" />
                          </div>

                          <h4 className="text-[13px] font-bold text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                            {evento.titulo}
                          </h4>

                          <div className="mt-3 flex items-center text-[10px] font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 uppercase tracking-tighter">
                            Ver detalhes <span className="ml-1">→</span>
                          </div>
                        </div>
                      </Link>
                    ));
                  })()}
                </div>

                <Link
                  to="/agenda"
                  className="group flex items-center justify-center gap-2 w-full mt-6 text-[11px] font-black text-slate-500 hover:text-white transition-all py-3.5 bg-slate-100 hover:bg-blue-600 rounded-xl uppercase tracking-[0.2em]"
                >
                  Ver Agenda Completa
                </Link>
              </div>
            </aside>


            <br />
          </aside>


          {/* ########################## */}
          {/* 3. LATERAL DIREITA - Ajustada de col-span-3 para col-span-2 */}
          {/* ########################## */}
          <aside className="order-3 lg:order-3 lg:col-span-2 space-y-6 lg:pt-16 lg:pr-4">

            {/* WEB RÁDIO EM TELAS GRANDES */}
            <div id="webradio" className="hidden lg:block scroll-mt-24">
              <WebRadio /> {/* <--- USANDO O COMPONENTE AQUI */}
            </div>

            {/* Seção Institucional de Pedidos de Oração - Ajuste de padding para a nova largura */}
            <motion.div
              whileHover={{ y: -8 }}
              className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-blue-900 rounded-[2.5rem] p-px border border-white/10 shadow-2xl group"
            >
              {/* Elementos Decorativos de Fundo */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-colors duration-700" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-colors duration-700" />

              <div className="relative z-10 bg-black/20 backdrop-blur-xl rounded-[2.4rem] p-8 text-center space-y-6">

                {/* Cabeçalho com Ícone Estilizado */}
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-indigo-400/20 blur-2xl rounded-full animate-pulse" />
                  <div className="relative bg-white/5 p-5 rounded-full border border-white/10 shadow-inner">
                    <FaBookBible className="text-4xl text-indigo-300" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-white tracking-tight">Rede de Intercessão</h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent mx-auto rounded-full" />
                  <p className="text-indigo-200/80 text-xs font-light leading-relaxed max-w-[200px] mx-auto">
                    "Pedi e se vos dará." Unimo-nos em oração por suas intenções.
                  </p>
                </div>

                {/* Área do Pedido com Efeito de Card Flutuante */}
                <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[140px] flex flex-col items-center justify-center shadow-2xl backdrop-brightness-125 overflow-hidden">
                  {/* Detalhe sutil de aspas */}
                  <span className="absolute top-2 left-4 text-4xl text-white/5 font-serif">“</span>

                  <AnimatePresence mode="wait">
                    {pedidosOracao.length > 0 ? (
                      <motion.div
                        key={prayerIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 space-y-3"
                      >
                        <p className="text-gray-100 text-[13px] leading-relaxed italic font-light line-clamp-3">
                          {pedidosOracao[prayerIndex].mensagem.slice(0, 110)}...
                        </p>
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <div className="h-px w-4 bg-indigo-400/50" />
                          <span className="text-indigo-400 font-bold text-[10px] uppercase tracking-widest">
                            {pedidosOracao[prayerIndex].nome}
                          </span>
                          <div className="h-px w-4 bg-indigo-400/50" />
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-indigo-300/50 text-xs italic">Aguardando intenções...</div>
                    )}
                  </AnimatePresence>

                  <span className="absolute bottom-2 right-4 text-4xl text-white/5 font-serif rotate-180">“</span>
                </div>

                {/* Botão com Chamada à Ação Forte */}
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/pedidos-oracao"
                    className="group/btn relative flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.25em] shadow-xl shadow-indigo-950/50 transition-all duration-300"
                  >
                    <span className="relative z-10">Enviar meu Pedido</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out" />
                  </Link>
                </motion.div>

              </div>
            </motion.div>


            {/* Mensagens Recentes - Ajuste de densidade */}
            <div className="hidden lg:block bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Recentes</h3>
              <div className="space-y-5">
                {comments.slice(0, 3).map(c => (
                  <div key={c.id} className="border-l-2 border-green-500/30 pl-3">
                    <p className="text-[11px] text-gray-300 italic line-clamp-3 leading-relaxed">"{c.comment}"</p>
                    <p className="text-[9px] text-gray-500 font-bold mt-2 uppercase tracking-tighter">{c.name} • {c.city}</p>
                  </div>
                ))}
              </div>
            </div>
            <br></br><br></br>

            <div className="text-center mb-8">
              <h2 className="inline-flex items-center gap-4 text-2xl sm:text-2xl font-bold text-green-100 mb-4">
                FACEBOOK RCC CURITIBA
              </h2>
              {/* Linha divisória com largura total */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-200 to-transparent mb-6" />
            </div>

            <section className="max-w-8xl mx-auto px-1 py-1">
              {/* O gap-12 dá um respiro de 3rem entre as colunas */}
              <div className="grid grid-cols-1 lg:grid-cols-1 items-start">

                {/* Coluna da Esquerda (Notícias) */}
                <div className="lg:col-span-7 xl:col-span-8 overflow-hidden">
                  {/* Conteúdo das notícias */}
                </div>

                {/* Coluna da Direita (Facebook) */}
                <aside className="lg:col-span-5 xl:col-span-4 w-full overflow-hidden">
                  <div className="w-full flex flex-col">
                    <FacebookFeed />
                  </div>
                </aside>

              </div>
            </section>
          </aside>

          {/* Popup de agradecimento após comentário */}
          <AnimatePresence>
            {showThanks && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center z-[100] bg-blue-950/40 backdrop-blur-md px-4"
                onClick={() => setShowThanks(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 20, opacity: 0 }}
                  className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full overflow-hidden border border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Cabeçalho Dinâmico */}
                  <div className={`p-8 text-center relative ${thanksContent.type === 'comment' ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-green-500 to-teal-600'
                    }`}>
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
                      className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm"
                    >
                      {thanksContent.type === 'comment' ?
                        <FaComment className="text-white text-4xl" /> :
                        <FaDove className="text-white text-4xl" />
                      }
                    </motion.div>
                    <h3 className="text-white text-2xl font-black uppercase tracking-tighter">{thanksContent.title}</h3>
                  </div>

                  <div className="p-8 text-center">
                    <p className="text-gray-600 font-medium leading-relaxed mb-8">
                      {thanksContent.message}
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setShowThanks(false)}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      Entendido <FaTimes className="opacity-30" />
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Popup/Modal de deixar comentário */}
          <AnimatePresence>
            {showPopup && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                onClick={() => setShowPopup(false)}
              >
                <motion.div
                  initial={{ scale: 0.8, y: 50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.8, y: 50 }}
                  className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full relative"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
                    onClick={() => setShowPopup(false)}
                  >
                    ×
                  </button>

                  <h2 className="text-2xl font-bold text-center mb-6 text-green-800">
                    Deixe seu Comentário
                  </h2>

                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-800"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Sua cidade"
                      value={newCity}
                      onChange={e => setNewCity(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-green-800"
                      required
                    />
                    <textarea
                      placeholder="Seu comentário..."
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-green-500 text-green-800"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
                    >
                      Enviar Comentário
                    </button>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Formulário de edição (quando showEditForm for true) */}
          <AnimatePresence>
            {showEditForm && editFormType && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto"
                onClick={() => {
                  setShowEditForm(false);
                  setEditFormType(null);
                }}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full relative"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-3xl"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditFormType(null);
                    }}
                  >
                    ×
                  </button>

                  <h2 className="text-2xl font-bold text-center mb-6 text-green-800">
                    Editar {editFormType.replace('-', ' ').toUpperCase()}
                  </h2>

                  <form onSubmit={handleContentSubmit} className="space-y-5">
                    <input
                      type="text"
                      placeholder="Título"
                      value={editForm.title}
                      onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />

                    <textarea
                      placeholder="Conteúdo"
                      value={editForm.content}
                      onChange={e => setEditForm({ ...editForm, content: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imagem (opcional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => setEditForm({ ...editForm, image: e.target.files?.[0] || null })}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
                    >
                      Salvar Alterações
                    </button>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </>
  );
};

export default Home;