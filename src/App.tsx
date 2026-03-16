// src/App.tsx
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, createContext, useRef, ReactNode } from 'react';
import Home from './pages/Home';
import MapaGrupos from './pages/MapaGrupos';
import Noticias from './pages/Noticias';
import NoticiaDetalhe from './pages/NoticiaDetalhe';
import Login from './pages/Login';
import AdminNoticias from './pages/AdminNoticias';
import AdminPublicacoes from './pages/AdminPublicacoes';
import PublicacaoDetalhe from './pages/PublicacaoDetalhe';
import Publicacoes from './pages/Publicacoes';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import PedidoOracao from './pages/PedidoOracao';
import MilAmigos from './pages/MilAmigos';
import MinisterioDetalhe from './pages/MinisterioDetalhe';
import Agenda from './pages/Agenda';
import CanalYoutube from './pages/CanalYoutube';
import ParticipeGrupo from './pages/ParticipeGrupo';
import Comentar from './pages/Comentar';
import Espiritualidade from './pages/Espiritualidade';
import AdminFormacoes from './pages/AdminFormacoes';
import AdminMinisterios from './pages/AdminMinisterios';
import Revista from './pages/Revista';
import MensagemCoordenador from './pages/MensagemCoordenador';
import AdminMensagemCoord from './pages/AdminMensagemCoord';
import AdminGrupo from './pages/AdminGrupo';
import { SearchProvider, useSearch } from './contexts/SearchContext';
import SearchResultsPage from './pages/SearchResults';
import EspiritualidadeDetalhe from './pages/EspiritualidadeDetalhe';
import ErrorBoundary from './components/ErrorBoundary';
import GruposHoje from './pages/GruposHoje';
import SaibaMais from './pages/SaibaMais';
import Gabaon from './pages/Gabaon';
import VideosUpload from './pages/VideosUpload';
import VideoPlayer from './pages/VideoPlayer';
import VideoStandalone from './pages/VideoStandalone';
import AdminAmigos from './pages/AdminAmigos';
import IdentidadeRCC from './pages/FormacaoIdentidadeRCC';
import ProfeciasRcc from './pages/ProfeciasRcc';
import EstudoProfecias from './pages/EstudoProfecias';
import AdminRadio from './pages/AdminRadio';
import AdminCenaculo from './pages/AdminCenaculo';
import TercoPdfView from './pages/TercoPdfView';
import AdminNewsletter from './pages/AdminNewsletter';
import AdminDashboard from './pages/AdminDashboard';
import AdminPaoDiario from './pages/AdminPaoDiario';

import AmoRcc from './pages/AmoRcc';
import AdminAmoRcc from './pages/AdminAmoRcc';





// --- CONTEXTO DA WEB RÁDIO PARA MANTER O ÁUDIO ONLINE ---
interface RadioContextType {
  playing: boolean;
  setPlaying: (p: boolean) => void;
  station: string;
  setStation: (s: any) => void;
  currentTrackIndex: number;
  setCurrentTrackIndex: (i: number) => void;
  dbFiles: any[];
  setDbFiles: (f: any[]) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  API_BASE_URL: string;
}

export const RadioContext = createContext<RadioContextType | null>(null);

export const RadioProvider = ({ children }: { children: ReactNode }) => {
  const [playing, setPlaying] = useState(false);
  const [station, setStation] = useState<'musica' | 'pregacoes' | 'formacoes' | 'vaticano'>('musica');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [dbFiles, setDbFiles] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';

  // Busca inicial dos arquivos do BD para a rádio
  useEffect(() => {
    const fetchRadio = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/radio-files`);
        const data = await res.json();
        setDbFiles(data);
      } catch (err) {
        console.error("Erro ao carregar rádio global", err);
      }
    };
    fetchRadio();
  }, [API_BASE_URL]);

  return (
    <RadioContext.Provider value={{
      playing, setPlaying, station, setStation,
      currentTrackIndex, setCurrentTrackIndex, dbFiles, setDbFiles,
      audioRef, API_BASE_URL
    }}>
      {children}
      {/* O elemento de áudio fica aqui, fora das rotas, para nunca ser destruído */}
      <audio
        ref={audioRef}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
    </RadioContext.Provider>
  );
};

// --- COMPONENTES AUXILIARES ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const NotFound = () => (
  <div className="container mx-auto px-4 pt-16 pb-20 text-center text-white w-full min-h-[calc(100vh)]">
    <h1 className="text-3xl sm:text-4xl font-bold">404 - Página Não Encontrada</h1>
    <p className="text-gray-200 mt-4 text-sm sm:text-base">Desculpe, a página que você está procurando não existe.</p>
    <a href="/" className="text-green-300 hover:text-green-400 mt-6 inline-block text-sm sm:text-base">Voltar para Home</a>
  </div>
);

const FloatingSearchControl = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl">
            <SearchResultsPage onClose={onClose} />
            <button
              onClick={onClose}
              className="mt-4 bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
              aria-label="Fechar resultados de busca"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const SearchSync = () => {
  const { search } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (search && location.pathname !== '/busca') {
      setShowButton(true);
    } else {
      setShowButton(false);
    }

    if (location.pathname === '/busca' && search) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [location.pathname, search]);

  const toggleSearch = () => {
    if (search) {
      setIsOpen(true);
      navigate('/busca');
    }
  };

  const closeSearch = () => {
    setIsOpen(false);
    setShowButton(false);
    navigate('/');
  };

  return (
    <>
      {showButton && (
        <button
          onClick={toggleSearch}
          className="fixed bottom-6 right-6 bg-teal-500 text-white rounded-full p-4 shadow-lg hover:bg-teal-600 focus:outline-none z-50"
          aria-label="Abrir resultados de busca"
        >
          🔍
        </button>
      )}
      <FloatingSearchControl isOpen={isOpen} onClose={closeSearch} />
    </>
  );
};

function AppContent() {
  const location = useLocation();
  const hideLayout = location.pathname === '/video';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-950 to-green-900 text-white w-full overflow-x-hidden">
      {!hideLayout && <Header />}
      <ScrollToTop />
      <main className={`flex-grow ${!hideLayout ? 'pt-16 sm:pt-20' : ''} w-full z-10`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comentar" element={<Comentar />} />
          <Route path="/mapa-grupos" element={<MapaGrupos />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/:id" element={<NoticiaDetalhe />} />
          <Route path="/publicacoes" element={<Publicacoes />} />
          <Route path="/publicacoes/:id" element={<PublicacaoDetalhe />} />
          <Route path="/ministerios/:id" element={<MinisterioDetalhe />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/canal-youtube" element={<CanalYoutube />} />
          <Route path="/mil-amigos" element={<MilAmigos />} />
          <Route path="/pedidos-oracao" element={<PedidoOracao />} />
          <Route path="/participe-grupo" element={<ParticipeGrupo />} />
          <Route path="/espiritualidade" element={<Espiritualidade />} />
          <Route path="/mensagem-coordenacao" element={<MensagemCoordenador />} />
          <Route path="/revista" element={<Revista />} />
          <Route path="/login" element={<Login />} />
          <Route path="/busca" element={<SearchResultsPage />} />
          <Route path="/espiritualidade/:id" element={<EspiritualidadeDetalhe />} />
          <Route path="/grupos-hoje" element={<GruposHoje />} />
          <Route path="/saiba-mais" element={<SaibaMais />} />

          <Route path="/gabaon" element={<Gabaon />} />
          <Route path="/identidade-rcc" element={<IdentidadeRCC />} />
          <Route path="/profecias-rcc" element={<ProfeciasRcc />} />
          <Route path="/estudo-profecias" element={<EstudoProfecias />} />

          <Route path="/admin/videos" element={<ProtectedRoute><VideosUpload /></ProtectedRoute>} />
          <Route path="/videos" element={<VideoPlayer />} />
          <Route path="/video" element={<VideoStandalone />} />

          <Route path="/admin/noticias" element={<ProtectedRoute><AdminNoticias /></ProtectedRoute>} />
          <Route path="/admin/noticias/:id" element={<ProtectedRoute><AdminNoticias /></ProtectedRoute>} />
          <Route path="/admin/publicacoes" element={<ProtectedRoute><AdminPublicacoes /></ProtectedRoute>} />
          <Route path="/admin/publicacoes/:id" element={<ProtectedRoute><AdminPublicacoes /></ProtectedRoute>} />
          <Route path="/admin/espiritualidade" element={<ProtectedRoute><AdminFormacoes /></ProtectedRoute>} />
          <Route path="/admin/formacoes/nova" element={<ProtectedRoute><AdminFormacoes /></ProtectedRoute>} />
          <Route path="/admin/formacoes/:id" element={<ProtectedRoute><AdminFormacoes /></ProtectedRoute>} />
          <Route path="/admin/grupo-oracao" element={<ProtectedRoute><AdminGrupo /></ProtectedRoute>} />
          <Route path="/admin/grupo-oracao/:id" element={<ProtectedRoute><AdminGrupo /></ProtectedRoute>} />
          <Route path="/admin/ministerios" element={<ProtectedRoute><AdminMinisterios /></ProtectedRoute>} />
          <Route path="/admin/ministerios/:id" element={<ProtectedRoute><AdminMinisterios /></ProtectedRoute>} />
          <Route path="/admin/mensagens-coordenacao" element={<ProtectedRoute><AdminMensagemCoord /></ProtectedRoute>} />
          <Route path="/admin/mensagens-coordenacao/:id" element={<ProtectedRoute><AdminMensagemCoord /></ProtectedRoute>} />
          <Route path="/admin/amigos" element={<ProtectedRoute><AdminAmigos /></ProtectedRoute>} />
          <Route path="/admin/amigos/:id" element={<ProtectedRoute><AdminAmigos /></ProtectedRoute>} />

          <Route path="/admin/radio" element={<ProtectedRoute><AdminRadio /></ProtectedRoute>} />
          <Route path="/admin/cenaculo" element={<ProtectedRoute><AdminCenaculo /></ProtectedRoute>} />
          <Route path="/tercoEspiritoSanto" element={<TercoPdfView />} />
          <Route path="/admin/newsletter" element={<ProtectedRoute><AdminNewsletter /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/pao-diario" element={<AdminPaoDiario />} />.

          <Route path="/amo-rcc" element={<AmoRcc />} />
          <Route path="/admin/amorcc" element={<ProtectedRoute><AdminAmoRcc /></ProtectedRoute>} />
          <Route path="/admin/amorcc/:id" element={<ProtectedRoute><AdminAmoRcc /></ProtectedRoute>} />


          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
      {!hideLayout && <SearchSync />}
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <RadioProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <SearchProvider>
              <AppContent />
            </SearchProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </RadioProvider>
    </HelmetProvider>
  );
}