import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

interface Noticia {
  id: string;
  manchete: string;
  foto: string | null;
  fotos_galeria: string[] | null;
  conteudo: string;
  data_publicacao: string;
  autor: string | null;
  categoria: string | null;
}

export default function NoticiaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [galeriaSrcs, setGaleriaSrcs] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [userLiked, setUserLiked] = useState<boolean>(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
  const DEFAULT_IMAGE = 'https://rcccuritiba.com.br/og-image.jpg';


  // === Carregar notícia ===
  useEffect(() => {
    if (!id) return;

    const endpoint = `${API_BASE_URL}/api/noticias_portal/all/${id}`;

    fetch(endpoint, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Notícia não encontrada');
        return res.json();
      })
      .then((data) => {
        setNoticia(data);

        // URL absoluta da imagem ou default
        const imageUrl = data.foto
          ? data.foto.startsWith('http')
            ? data.foto
            : `${API_BASE_URL}${data.foto}`
          : DEFAULT_IMAGE;

        setImgSrc(imageUrl);
        console.log('imgSrc definida para:', imageUrl);




        const galeriaUrls = Array.isArray(data.fotos_galeria)
          ? data.fotos_galeria.map((foto: string) =>
            foto.startsWith('http') ? foto : `${API_BASE_URL}${foto}`
          )
          : [];
        setGaleriaSrcs(galeriaUrls);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message);
      });
  }, [id, API_BASE_URL]);

  // === Carregar curtidas ===
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/likes?page=noticia`)
      .then((res) => res.json())
      .then((data) => setLikes(data.likes || 0))
      .catch((err) => console.error('Erro ao carregar curtidas:', err));
  }, [API_BASE_URL]);

  // === Curtir ===
  const handleLike = async () => {
    const userId = localStorage.getItem('userId') || crypto.randomUUID();
    localStorage.setItem('userId', userId);

    try {
      const response = await fetch(`${API_BASE_URL}/api/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'noticia', userId, action: 'like' }),
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

  // === Compartilhar ===
 // === Compartilhar ===
 const handleShare = async () => {
  if (!noticia) return;

  // 1. Link Absoluto: É crucial que seja a URL pública da notícia
  // Este link acionará o seu backend (Rota OG) para renderizar as meta tags (título, imagem, etc.)
  const shareUrl = `https://www.rcccuritiba.com.br/noticias/${noticia.id}`;

  // 2. Texto: Remove tags HTML e limita o tamanho para a descrição
  const cleanContent = noticia.conteudo.replace(/<[^>]+>/g, '').trim();
  const shareText = cleanContent.length > 200
   ? cleanContent.substring(0, 197) + '...'
   : cleanContent;

  try {
   if (navigator.share) {
    // Uso da Web Share API nativa (em dispositivos móveis/navegadores compatíveis)
    await navigator.share({
     title: noticia.manchete, // Título
     text: shareText, // Resumo/Texto
     url: shareUrl, // Link da Notícia (crucial)
    });
   } else {
    // Fallback: Copiar Título e Link para a área de transferência
    const copyText = `${noticia.manchete}\n\n${shareText}\n\nLeia a íntegra: ${shareUrl}`;
    await navigator.clipboard.writeText(copyText);
    alert('Título, resumo e link copiados! Compartilhe onde desejar.');
   }
  } catch (err) {
   console.error('Erro ao compartilhar:', err);
   // Fallback de emergência: Copiar apenas o link
   await navigator.clipboard.writeText(shareUrl);
   alert(`Erro ao iniciar compartilhamento. O link da notícia foi copiado: ${shareUrl}`);
  }
 };

  // === Tratamento de erros de imagem ===
  const handleImageError = (index?: number) => {
    console.error('Erro ao carregar imagem:', index !== undefined ? galeriaSrcs[index] : imgSrc);
    if (index !== undefined) {
      const newGaleria = [...galeriaSrcs];
      newGaleria[index] = DEFAULT_IMAGE;
      setGaleriaSrcs(newGaleria);
    } else {
      setImgSrc(DEFAULT_IMAGE);
    }
  };

  // === Lightbox ===
  const openLightbox = (index: number) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);
  const nextImage = () => {
    if (selectedImageIndex !== null && galeriaSrcs.length > 0) {
      setSelectedImageIndex((prev) => (prev !== null ? (prev + 1) % galeriaSrcs.length : 0));
    }
  };
  const prevImage = () => {
    if (selectedImageIndex !== null && galeriaSrcs.length > 0) {
      setSelectedImageIndex((prev) => (prev !== null ? (prev - 1 + galeriaSrcs.length) % galeriaSrcs.length : 0));
    }
  };

  if (error) return <div className="text-center text-red-600 p-4">{error}</div>;
  if (!noticia) return <div className="text-center text-gray-600 p-4">Carregando...</div>;

  return (
    <>
      <Helmet>
        <title>{noticia.manchete}</title>
        <meta property="og:title" content={noticia.manchete} />
        <meta property="og:image" content={imgSrc || DEFAULT_IMAGE} />
        <meta property="og:image:secure_url" content={imgSrc || DEFAULT_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={noticia.manchete} />
        <meta property="og:url" content={`https://www.rcccuritiba.com.br/noticias/${noticia.id}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="RCC Curitiba" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4 bg-transparent max-w-[800px]"
      >
        <Link to="/noticias" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Voltar para Notícias
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={imgSrc}
            alt={noticia.manchete}
            className="w-full max-h-[400px] object-contain rounded-lg mb-4 shadow-md"
            onError={() => handleImageError()}
            loading="lazy"
          />

          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">{noticia.manchete}</h1>
            <p className="text-sm text-gray-500 mb-4">
              {new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')}
              {noticia.autor && ` | ${noticia.autor}`}
              {noticia.categoria && ` | ${noticia.categoria}`}
            </p>

            <div
              className="text-gray-800 text-lg leading-relaxed mb-6 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
            />

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Galeria de Fotos</h2>
              {galeriaSrcs.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galeriaSrcs.map((src, index) => (
                    <motion.img
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      src={src}
                      alt={`Galeria ${noticia.manchete} ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer shadow-sm hover:shadow-md"
                      onError={() => handleImageError(index)}
                      onClick={() => openLightbox(index)}
                      loading="lazy"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Nenhuma foto na galeria.</p>
              )}
            </div>

            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleLike}
                className={`px-4 py-2 rounded ${userLiked ? 'bg-red-500' : 'bg-blue-500'} text-white`}
              >
                Curtir ({likes})
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Compartilhar
              </button>
            </div>
          </div>
        </article>

        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={closeLightbox}
          >
            <div className="relative flex items-center justify-center w-full h-full">
              <button
                className="absolute left-4 text-white text-3xl z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                aria-label="Imagem anterior"
              >
                &larr;
              </button>
              <motion.img
                key={selectedImageIndex}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                src={galeriaSrcs[selectedImageIndex]}
                alt={`Imagem ampliada ${noticia.manchete} ${selectedImageIndex + 1}`}
                className="max-w-[90%] max-h-[90%] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                className="absolute right-4 text-white text-3xl z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                aria-label="Próxima imagem"
              >
                &rarr;
              </button>
              <button
                className="absolute top-4 right-4 text-white text-2xl"
                onClick={closeLightbox}
                aria-label="Fechar lightbox"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
