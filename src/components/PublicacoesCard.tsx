import { Link } from 'react-router-dom';
import { useState } from 'react';
import truncate from 'html-truncate';

interface PublicacoesCardProps {
  id: string;
  title: string;
  image: string;
  description?: string;
  date: string;
  author: string | null;
  size?: 'small' | 'large';
}

const PublicacoesCard: React.FC<PublicacoesCardProps> = ({
  id,
  title,
  image,
  description,
  date,
  author,
  size = 'small',
}) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';

  const [imgSrc, setImgSrc] = useState(() => {
    return image || `${API_BASE_URL}/assets/placeholder-400x300.jpg`;
  });

  const handleError = () => {
    console.error('Erro ao carregar imagem:', imgSrc);
    setImgSrc(`${API_BASE_URL}/assets/placeholder-400x300.jpg`);
  };

  const getTruncatedHtml = (html: string, limit: number) => {
    return truncate(html, limit, { keepImageTag: false }) + (html.length > limit ? '...' : '');
  };

  const imageHeight = size === 'large' ? 'h-36 sm:h-64 md:h-72' : 'h-36 sm:h-80 md:h-52';
  const padding = size === 'large' ? 'p-2 sm:p-3 md:p-8' : 'p-2 sm:p-3';
  const titleSize =
    size === 'large' ? 'text-base sm:text-lg md:text-xl' : 'text-sm sm:text-base md:text-lg';

  return (
    <Link
      to={`/publicacoes/${id}`}
      className="relative border rounded-lg shadow-lg overflow-hidden block flex flex-col h-full hover:scale-[1.02] transition-transform"
    >
      <div className={`relative ${imageHeight} w-full`}>
        <img
          src={imgSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center rounded-t-lg"
          onError={handleError}
        />
        <div className="absolute inset-0 bg-black/30 hover:bg-black/20 transition-opacity duration-300" />
      </div>

      <div className={`${padding} flex flex-col justify-between flex-grow bg-[#eef6f3] text-gray-900 rounded-b-lg`}>
        <div>
          <h2
            className={`${titleSize} font-serif tracking-tight font-semibold text-gray-800 mb-1 sm:mb-2 line-clamp-2`}
          >
            {title}
          </h2>
          {size === 'large' && description && (
            <div
              className="hidden sm:block text-sm sm:text-base md:text-lg mb-1 sm:mb-2 leading-relaxed font-light font-serif text-gray-900"
              dangerouslySetInnerHTML={{ __html: getTruncatedHtml(description, 650) }}
            />
          )}
        </div>
        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600">
          <span>{date}</span>
          {author && <span>Por: {author}</span>}
        </div>
      </div>
    </Link>
  );
};

export default PublicacoesCard;
