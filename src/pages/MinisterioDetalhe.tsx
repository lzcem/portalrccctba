import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import placeholder from '../assets/placeholder-400x300.jpg';

export default function MinisterioDetalhe() {
  const { id } = useParams<{ id: string }>();
  const [coordenador, setCoordenador] = useState<{ id: number; ministerio_id: string; nome: string; email: string; grupo_oracao: string; foto_coordenador?: string } | null>(null);
  const [detalhes, setDetalhes] = useState<{ ministerio_id: string; nome: string; descricao: string; missao: string; icone: string } | null>(null);
  const [escolasFormacao, setEscolasFormacao] = useState<{ data: string; local: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState<string>(placeholder);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE_URL}/api/ministerios/${id}/detalhes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Detalhes do ministério não encontrados');
        return res.json();
      })
      .then((data) => {
        setCoordenador(data.coordenador || null);
        setDetalhes(data.detalhes || null);
        setEscolasFormacao(data.escolasFormacao || []);

        const imageUrl = data.coordenador?.foto_coordenador
          ? `${API_BASE_URL}${data.coordenador.foto_coordenador}`
          : `${API_BASE_URL}/ImgFotos/default-coordenador.jpg`;
        setImgSrc(imageUrl);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Erro ao carregar detalhes do ministério');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return (
      <div className="container mx-auto p-4 text-center text-white">
        <h1 className="text-4xl font-bold">Ministério Não Encontrado</h1>
        <p className="text-gray-200 mt-4">ID do ministério não fornecido.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 text-center text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-t-green-300 border-white rounded-full mx-auto"
        />
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-white">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const handleImageError = () => {
    console.error('Erro ao carregar imagem:', imgSrc);
    setImgSrc(`${API_BASE_URL}/ImgFotos/default-coordenador.jpg`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto p-4 text-white"
    >
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 max-w-3xl mx-auto sm:p-8">
        <div className="flex items-center space-x-4 mb-6 sm:mb-8">
          <svg className="w-12 h-12 text-green-300 sm:w-14 sm:h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={detalhes?.icone || ''} />
          </svg>
          {detalhes && (
            <h1 className="text-3xl font-bold sm:text-4xl">{detalhes.nome}</h1>
          )}
        </div>
        <h2 className="text-xl font-semibold text-green-300 mb-4 sm:text-2xl sm:mb-6">Descrição</h2>
        {detalhes && (
          <p className="text-gray-200 mb-6 sm:mb-8" dangerouslySetInnerHTML={{ __html: detalhes.descricao }} />
        )}
        {detalhes && (
          <>
            <h2 className="text-xl font-semibold text-green-300 mb-4 sm:text-2xl sm:mb-6">Missão</h2>
            <p className="text-gray-200 mb-6 sm:mb-8" dangerouslySetInnerHTML={{ __html: detalhes.missao }} />
          </>
        )}

        {coordenador && (
          <>
            <h2 className="text-xl font-semibold text-green-300 mb-4 sm:text-2xl sm:mb-6">Coordenador</h2>
            <div className="flex items-start space-x-4 text-gray-200 mb-6 sm:mb-8">
              <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28">
                <img
                  src={imgSrc}
                  alt={`${coordenador.nome} - Foto do Coordenador`}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full"
                  onError={handleImageError}
                  loading="lazy"
                />
              </div>
              <div className="flex-grow">
                <p className="sm:text-lg"><strong>Nome:</strong> {coordenador.nome}</p>
                <p className="sm:text-lg"><strong>E-mail:</strong> {coordenador.email}</p>
                <p className="sm:text-lg"><strong>Grupo de Oração:</strong> {coordenador.grupo_oracao}</p>
              </div>
            </div>
          </>
        )}

        {escolasFormacao.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-green-300 mb-4 sm:text-2xl sm:mb-6">Escolas de Formação</h2>
            {escolasFormacao.map((escola, index) => (
              <div key={index} className="text-gray-200 mb-2 sm:mb-4">
                <p className="sm:text-lg"><strong>Data:</strong> {new Date(escola.data).toLocaleDateString('pt-BR')}</p>
                <p className="sm:text-lg"><strong>Local:</strong> {escola.local}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
}