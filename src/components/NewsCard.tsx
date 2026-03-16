import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import truncate from 'html-truncate';

interface NewsCardProps {
  id: string;
  title: string;
  image: string;
  description?: string;
  date: string;  // Agora é data_inicio
  author: string | null;
  size?: 'small' | 'large';
}

const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  image,
  description,
  date,
  author,
  size = 'small',
}) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';
  const navigate = useNavigate();

  const [imgSrc, setImgSrc] = useState(() => {
    // Se já é URL completa (do backend), usa diretamente
    if (image && (image.startsWith('http') || image.startsWith('/ImgNoticias'))) {
      return image;
    }
    // Senão, constrói
    if (image && image.startsWith('/ImgNoticia')) {
      return `${API_BASE_URL}${image}`;
    }
    return `${API_BASE_URL}/placeholder-400x300.jpg`;
  });

  const handleError = () => {
    console.error('Erro ao carregar imagem:', imgSrc);
    setImgSrc(`${API_BASE_URL}/placeholder-400x300.jpg`);
  };

  const handleCommentClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/comentar');
  };

  // === TRUNCAR RESUMO COM HTML ===
  const getTruncatedHtml = (html: string, limit: number) => {
    if (!html) return '';
    const truncated = truncate(html, limit, { keepImageTag: false });
    return truncated + (html.length > limit ? '...' : '');
  };

  // === FORMATAÇÃO DE DATA: dd/mm/aaaa (usando data_inicio) ===
  const formatDate = (dateStr: string): string => {
    if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === '') {
      return 'Data não informada';
    }

    const clean = dateStr.trim().split('T')[0]; // Remove hora
    const [year, month, day] = clean.split('-').map(Number);

    if (!year || !month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
      return clean;
    }

    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
  };

  const imageHeight = size === 'large' ? 'h-36 sm:h-64 md:h-72' : 'h-36 sm:h-80 md:h-52';
  const padding = size === 'large' ? 'p-2 sm:p-3 md:p-8' : 'p-2 sm:p-3';
  const titleSize = size === 'large' ? 'text-base sm:text-lg md:text-xl' : 'text-sm sm:text-base md:text-lg';

  return (
    <Link
      to={`/noticias/${id}`}
      className="relative border rounded-lg shadow-lg overflow-hidden block flex flex-col h-full news-card-hover group"
    >
      <button
        onClick={handleCommentClick}
        aria-label="Comentar"
        className="absolute top-2 right-2 z-20 p-1 bg-white/80 rounded-full hover:bg-white transition-opacity opacity-0 group-hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20 2H4a2 2 0 00-2 2v16l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
        </svg>
      </button>

      <div className={`relative ${imageHeight} w-full`}>
        <img
          src={imgSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center rounded-t-lg transition-transform duration-500 group-hover:scale-105"
          onError={handleError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className={`${padding} flex flex-col justify-between flex-grow bg-[#f9f1de] text-gray-900 rounded-b-lg`}>
        <div className="space-y-1.5 sm:space-y-2">
          <h2
            className={`${titleSize} font-serif font-bold text-gray-800 leading-tight line-clamp-2 tracking-tight`}
            style={{ lineHeight: '1.25' }}
          >
            {title}
          </h2>

          {size === 'large' && description && (
            <div
              className="hidden sm:block text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 font-light italic prose prose-sm max-w-none"
              style={{
                lineHeight: '1.6',
                letterSpacing: '0.01em',
              }}
              dangerouslySetInnerHTML={{
                __html: getTruncatedHtml(description, 650),
              }}
            />
          )}

          {size === 'small' && description && (
            <p
              className="text-xs sm:text-sm leading-snug text-gray-600 font-light line-clamp-3"
              style={{
                lineHeight: '1.45',
                letterSpacing: '0.02em',
              }}
              dangerouslySetInnerHTML={{
                __html: getTruncatedHtml(description, 180),
              }}
            />
          )}
        </div>

        {/* RODAPÉ COM DATA E AUTOR */}
        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500 mt-3 pt-2 border-t border-gray-300/50">
          <time dateTime={date} className="font-medium">
            {formatDate(date)}
          </time>
          {author && (
            <span className="italic truncate max-w-[120px] sm:max-w-none">
              Por: {author}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;