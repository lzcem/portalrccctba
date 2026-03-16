import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../hooks/useLocalStorage';
import PublicacoesTabs from '../components/PublicacoesTabs';
import PublicacoesCard from '../components/PublicacoesCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export default function Publicacoes() {
  const [publicacoes, setPublicacoes] = useLocalStorage<Publicacao[]>('publicacoes', []);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/publicacoes`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ao buscar publicações: ${res.status}`);
        return res.json();
      })
      .then((data: Publicacao[]) => {
        const uniquePublicacoes = Array.from(new Map(data.map((item) => [item.id, item])).values());
        setPublicacoes(uniquePublicacoes.filter((pub) => pub.status === 'publicada' || pub.status === 'rascunho'));
      })
      .catch((err) => {
        console.error('Erro na requisição:', err);
        setError(err.message);
      });
  }, []);

  const filteredPublicacoes = publicacoes.filter((publicacao) => {
    const now = new Date();
    const pubDate = new Date(publicacao.data_publicacao);
    return (
      pubDate <= now &&
      (activeTab === 'all' ||
        publicacao.categoria.toLowerCase() === activeTab.toLowerCase())
    );
  });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 to-green-900">
        <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl shadow-xl">
          <p className="text-red-400 text-lg font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-950 to-green-900 py-8 px-4 sm:px-6"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Título com contraste */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 
                     bg-gradient-to-r from-green-300 via-teal-200 to-blue-300 
                     bg-clip-text text-transparent drop-shadow-lg"
        >
          Publicações da RCC Curitiba
        </motion.h1>

        {/* Tabs */}
        <div className="mb-8">
          <PublicacoesTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              { value: 'all', label: 'Todas' },
              { value: 'Evento', label: 'Eventos' },
              { value: 'Formação', label: 'Formações' },
              { value: 'Outras', label: 'Outras' },
            ]}
          />
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPublicacoes.length > 0 ? (
            filteredPublicacoes.map((publicacao, index) => (
              <motion.div
                key={publicacao.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group"
              >
                <PublicacoesCard
                  id={publicacao.id}
                  title={publicacao.titulo}
                  image={
                    publicacao.imagem
                      ? `${API_BASE_URL}${publicacao.imagem}`
                      : '/assets/placeholder-400x300.jpg'
                  }
                  description={publicacao.descricao}
                  date={new Date(publicacao.data_publicacao).toLocaleDateString('pt-BR')}
                  author={publicacao.responsavel || 'RCC Curitiba'}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
                <p className="text-gray-300 text-lg mb-4">
                  Nenhuma publicação encontrada para esta categoria.
                </p>
                <button
                  onClick={() => setActiveTab('all')}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
                >
                  Ver Todas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}