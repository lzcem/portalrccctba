import { useEffect, useState } from 'react';
import NewsTabs from '../components/NewsTabs';
import NewsCard from '../components/NewsCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';
//const WEBSITE_URL = 'https://www.rcccuritiba.com.br'; // Força www

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

export default function Noticias() {
  const [noticias, setNoticias] = useLocalStorage<Noticia[]>('noticias', []);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/noticias_portal/all`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ao buscar notícias: ${res.status}`);
        return res.json();
      })
      .then((data: Noticia[]) => {
        const uniqueNoticias = Array.from(new Map(data.map((item) => [item.id, item])).values());
        setNoticias(uniqueNoticias);
      })
      .catch((err) => {
        console.error('Erro na requisição:', err);
        setError(err.message);
      });
  }, []);

  // === FUNÇÃO DE COMPARTILHAMENTO ===
  const handleShare = async (noticia: Noticia) => {
    const shareUrl = `http://localhost:5173/noticias/${noticia.id}`;
    const title = noticia.manchete;
    const text = noticia.resumo || 'Confira esta notícia da RCC Curitiba!';

    // URL DA IMAGEM: JÁ VEM COMPLETA DO BACKEND
    const imageUrl = noticia.foto || 'http://localhost:5173/assets/placeholder-400x300.jpg';

    console.log('[SHARE DEBUG]', {
      id: noticia.id,
      title,
      imageUrl,
      shareUrl,
      fotoOriginal: noticia.foto // Para ver o que veio da API
    });

    // Web Share API com imagem
    if (navigator.share && navigator.canShare) {
      try {
        const response = await fetch(imageUrl, {
          method: 'GET',
          mode: 'cors',
          headers: { 'Accept': 'image/*' }
        });

        if (!response.ok) {
          console.error('Erro ao carregar imagem:', response.status, imageUrl);
          throw new Error(`Status ${response.status}`);
        }

        const blob = await response.blob();
        if (blob.size === 0) {
          console.error('Blob vazio:', imageUrl);
          throw new Error('Blob vazio');
        }

        const file = new File([blob], 'noticia.jpg', { type: blob.type || 'image/jpeg' });

        const shareData: any = { title, text, url: shareUrl };
        if (navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }

        await navigator.share(shareData);
        console.log('Compartilhado com SUCESSO via Web Share');
        return;
      } catch (err) {
        console.error('Erro no Web Share:', err);
      }
    }

    // Fallback: WhatsApp com texto + link
    const shareText = `${title}\n\n${text}\n\nLeia mais: ${shareUrl}`;
    const encoded = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const filteredNoticias = noticias.filter((noticia) => {
    const now = new Date();
    const startDate = new Date(noticia.data_inicio);
    return startDate <= now && (activeTab === 'all' || noticia.categoria?.toLowerCase() === activeTab.toLowerCase());
  });

  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen container mx-auto px-4 sm:px-6 py-6 bg-transparent"
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-100">Notícias</h1>
      <NewsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { value: 'all', label: 'Todas' },
          { value: 'Notícia', label: 'Notícia' },
          { value: 'Evento', label: 'Evento' },
          { value: 'Formação', label: 'Formação' },
        ]}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 contain-layout">
        {filteredNoticias.length > 0 ? (
          filteredNoticias.map((noticia) => (
            <motion.div
              key={noticia.id}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              className="flex flex-col overflow-hidden bg-gradient-to-tr from-blue-800 to-green-700 rounded-xl shadow-xl border border-green-300/50 p-1 sm:p-2 relative group"
            >
              {/* Botão de compartilhar (aparece no hover) */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleShare(noticia);
                }}
                className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                aria-label="Compartilhar notícia"
                title="Compartilhar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9 2.684a3 3 0 10-6 0m6 0a3 3 0 11-6 0m-6-6h.01M9 18h.01"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h1a4 4 0 010 8h-1M7 8h1a4 4 0 010 8H7"
                  />
                </svg>
              </button>

              <NewsCard
                id={noticia.id}
                title={noticia.manchete}
                image={noticia.foto || '/assets/placeholder-400x300.jpg'}
                description={noticia.resumo}
                date={noticia.data_inicio} // Já corrigido antes
                author={noticia.autor}
              />
            </motion.div>
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-full py-8">Nenhana notícia encontrada.</div>
        )}
      </div>
    </motion.div>
  );
}