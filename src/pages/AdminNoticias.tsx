import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import '@/assets/quill-snow.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Noticia {
  id: string;
  manchete: string;
  conteudo: string;
  autor: string | null;
  status: string;
  foto: string | null;
  fotos_galeria: string[] | null;
  categoria: string | null;
  data_inicio: string;
  data_fim: string | null;
}

export default function AdminNoticias() {
  const { id } = useParams<{ id: string }>();
  const [manchete, setManchete] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [autor, setAutor] = useState('');
  const [status, setStatus] = useState('publicado');
  const [categoria, setCategoria] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [fotosGaleria, setFotosGaleria] = useState<File[]>([]);
  const [existingFotosGaleria, setExistingFotosGaleria] = useState<string[]>([]);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const quillRef = useRef<ReactQuill>(null);
  const [existingFoto, setExistingFoto] = useState<string | null>(null);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token de autenticação não encontrado');
        const res = await fetch(`${API_BASE_URL}/api/admin/noticias`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Erro ao buscar notícias: ${res.status} - ${res.statusText}`);
        const data = await res.json();
        setNoticias(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      }
    };

    fetchNoticias();

    if (id) {
      fetch(`${API_BASE_URL}/api/admin/noticias/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Notícia não encontrada: ${res.status} - ${res.statusText}`);
          return res.json();
        })
        .then((data: Noticia) => {
          setManchete(data.manchete);
          setConteudo(data.conteudo);
          setAutor(data.autor || '');
          setStatus(data.status || 'publicado');
          setCategoria(data.categoria || '');
          setExistingFotosGaleria(data.fotos_galeria || []);
          setExistingFoto(data.foto || null);
          const offset = -3 * 60;
          const startDate = new Date(data.data_inicio);
          startDate.setMinutes(startDate.getMinutes() + offset);
          setDataInicio(startDate.toISOString().slice(0, 16));
          const endDate = data.data_fim ? new Date(data.data_fim) : null;
          if (endDate) {
            endDate.setMinutes(endDate.getMinutes() + offset);
            setDataFim(endDate.toISOString().slice(0, 16));
          } else {
            setDataFim('');
          }
        })
        .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar notícia'));
    } else {
      clearForm();
    }
  }, [id]);

  const clearForm = () => {
    setManchete('');
    setConteudo('');
    setAutor('');
    setStatus('publicado');
    setCategoria('');
    setFoto(null);
    setFotosGaleria([]);
    setExistingFotosGaleria([]);
    setExistingFoto('');
    setDataInicio('');
    setDataFim('');

    const form = document.querySelector('form');
    if (form) form.reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('manchete', manchete);
    formData.append('conteudo', conteudo);
    formData.append('autor', autor);
    formData.append('status', status || 'publicado');
    formData.append('categoria', categoria || '');
    formData.append('data_inicio', dataInicio);
    formData.append('data_fim', dataFim || '');
    if (foto) formData.append('foto', foto);
    fotosGaleria.forEach((file) => {
      formData.append('fotosGaleria', file);
    });
    formData.append('existingFotosGaleria', JSON.stringify(existingFotosGaleria || []));
    formData.append('data_publicacao', dataInicio);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');
      const url = id
        ? `${API_BASE_URL}/api/noticias_portal/${id}`
        : `${API_BASE_URL}/api/noticias_portal`;
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Erro do servidor:', error);
        throw new Error('Erro ao salvar notícia');
      }

      setSuccess(id ? 'Notícia atualizada com sucesso!' : 'Notícia criada com sucesso!');
      setError(null);
      clearForm();

      const res = await fetch(`${API_BASE_URL}/api/admin/noticias`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNoticias(data);
      }

      setTimeout(() => setSuccess(null), 3000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (!id) navigate('/admin/noticias');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoto(e.target.files[0]);
    }
  };

  const handleGaleriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotosGaleria(Array.from(e.target.files));
    }
  };

  const removeExistingFoto = (index: number) => {
    setExistingFotosGaleria(existingFotosGaleria.filter((_, i) => i !== index));
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Sem fim';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-green-600 text-white font-sans p-4 sm:p-6 overflow-x-hidden">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-6 sm:mb-8 tracking-wide text-white drop-shadow-lg">
          {id ? 'Editar Notícia' : 'Criar Notícia'}
        </h1>

        {error && (
          <div className="text-center p-3 sm:p-4 mb-4 bg-red-200 text-red-800 rounded-xl text-sm sm:text-base">
            {error}
          </div>
        )}
        {success && (
          <div className="text-center p-3 sm:p-4 mb-4 bg-green-200 text-green-800 rounded-xl text-sm sm:text-base">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 space-y-4 sm:space-y-6"
        >
          <div className="relative">
            <label htmlFor="titulo" className="block text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
              Título
            </label>
            <input
              id="titulo"
              value={manchete}
              onChange={(e) => setManchete(e.target.value)}
              required
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
            />
          </div>

          <div className="relative">
            <label htmlFor="conteudo" className="block text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
              Conteúdo
            </label>
            <ReactQuill
              ref={quillRef}
              value={conteudo}
              onChange={setConteudo}
              className="min-h-[200px] sm:min-h-[300px] border border-gray-300 rounded-lg bg-white text-gray-900"
              theme="snow"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <label htmlFor="autor" className="block text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
                Autor
              </label>
              <input
                id="autor"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
              />
            </div>
            <div className="flex-1 relative">
              <label htmlFor="status" className="block text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
              >
                <option value="rascunho">Rascunho</option>
                <option value="publicado">Publicado</option>
              </select>
            </div>
            <div className="flex-1 relative">
              <label htmlFor="categoria" className="block text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
                Categoria
              </label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
              >
                <option value="">Selecione uma categoria</option>
                <option value="Notícia">Notícia</option>
                <option value="Evento">Evento</option>
                <option value="Formação">Formação</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <label
                htmlFor="dataInicio"
                className="block text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4"
              >
                Data de Início
              </label>
              <input
                id="dataInicio"
                type="datetime-local"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
              />
            </div>
            <div className="flex-1 relative">
              <label
                htmlFor="dataFim"
                className="block text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4"
              >
                Data de Fim
              </label>
              <input
                id="dataFim"
                type="datetime-local"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="foto" className="block text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
              Imagem Principal
            </label>
            <input
              id="foto"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFotoChange}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
            />
            {foto ? (
              <img
                src={URL.createObjectURL(foto)}
                alt="Pré-visualização"
                className="w-full max-w-[200px] sm:max-w-[240px] h-auto object-cover mt-4 rounded-xl shadow"
              />
            ) : existingFoto ? (
              <img
                src={`${API_BASE_URL}${existingFoto}`}
                alt="Imagem principal existente"
                className="w-full max-w-[200px] sm:max-w-[240px] h-auto object-cover mt-4 rounded-xl shadow"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.jpg';
                }}
              />
            ) : null}
          </div>

          <div className="relative">
            <label
              htmlFor="fotosGaleria"
              className="block text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4"
            >
              Fotos da Galeria
            </label>
            <input
              id="fotosGaleria"
              type="file"
              accept="image/jpeg,image/png"
              multiple
              onChange={handleGaleriaChange}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
            />
            {(existingFotosGaleria.length > 0 || fotosGaleria.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {existingFotosGaleria.map((url, index) => (
                  <div key={`existing-${id}-foto-${index}`} className="relative">
                    <img
                      src={`${API_BASE_URL}${url}`}
                      alt={`Foto existente ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl shadow"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingFoto(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {fotosGaleria.map((file, index) => (
                  <img
                    key={`new-${id}-foto-${index}`}
                    src={URL.createObjectURL(file)}
                    alt={`Nova foto ${index + 1}`}
                    className="w-full h-32 object-cover rounded-xl shadow"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-800 to-green-500 hover:from-blue-700 hover:to-green-400 transition-all duration-300 shadow-md"
            >
              {id ? 'Atualizar Notícia' : 'Criar Notícia'}
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-white font-semibold bg-gray-500 hover:bg-gray-600 transition-all duration-300 shadow-md"
            >
              Limpar
            </button>
          </div>
        </form>

        <h2 className="text-2xl sm:text-3xl font-semibold mt-8 sm:mt-12 mb-4 sm:mb-6 text-white drop-shadow-lg">
          Notícias Existentes
        </h2>

        <div className="grid gap-6 mb-16 max-h-[500px] overflow-y-auto p-4">
          {noticias.map((noticia) => (
            <div
              key={noticia.id}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 flex justify-between items-center border border-gray-100"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 truncate max-w-xs" title={noticia.manchete}>
                  {noticia.manchete}
                </h3>
                <p className="text-sm text-gray-600">
                  Início: {formatDate(noticia.data_inicio)} | Fim: {formatDate(noticia.data_fim)}
                </p>
              </div>
              <Link to={`/admin/noticias/${noticia.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                ✏️ Editar
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}