import { useEffect, useState } from 'react';
import { useSearch } from '../contexts/SearchContext';
import { Link } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  type: string;
  route: string;
  preview: string;
}

export default function SearchResultsPage({ onClose }: { onClose?: () => void }) {
  const { search } = useSearch();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/search?query=${encodeURIComponent(search)}`);
        const data = await res.json();
       // console.log('Dados da busca:', data);
        setResults(data);
      } catch (error) {
        console.error('Erro na busca:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (search.trim()) fetchResults();
  }, [search]);

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4 h-[80vh] overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Resultados para: "{search}"</h1>
      {loading ? (
        <p>Buscando...</p>
      ) : results.length === 0 ? (
        <p>Nenhum resultado encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((item) => (
            <li key={`${item.id}-${item.type}`}>
              <Link
                to={`${item.route}?t=${Date.now()}`}
                onClick={() => onClose && onClose()}
                className="text-blue-600 hover:underline text-lg font-semibold"
              >
                {item.title} <span className="text-sm text-gray-500">({item.type})</span>
              </Link>
              <div
                className="text-gray-700"
                dangerouslySetInnerHTML={{ __html: item.preview.slice(0, 100) + '...' }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}