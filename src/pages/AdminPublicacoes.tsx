import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import '@/assets/quill-snow.css';


interface Publicacao {
  id: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  status: string;
  imagem: string | null;
  categoria: string;
  data_publicacao: string;
  atualizado_em: string | null;
}

export default function AdminPublicacoes() {
  const { id } = useParams<{ id: string }>();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [status, setStatus] = useState('publicada');
  const [categoria, setCategoria] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const quillRef = useRef<ReactQuill>(null);
  const [existingImagem, setExistingImagem] = useState<string | null>(null);

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchPublicacoes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/publicacoes`);
        if (!res.ok) throw new Error('Erro ao buscar publicações');
        const data = await res.json();
        setPublicacoes(data);

      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      }
    };

    fetchPublicacoes();

    if (id) {
      fetch(`${API_BASE_URL}/api/publicacoes/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Publicação não encontrada');
          return res.json();
        })
        .then((data) => {
          setTitulo(data.titulo);
          setDescricao(data.descricao);
          setResponsavel(data.responsavel);
          setStatus(data.status);
          setCategoria(data.categoria);
          setExistingImagem(data.imagem || null);
        })
        .catch((err) => setError(err.message));
    }
  }, [id]);

  const clearForm = () => {
    setTitulo('');
    setDescricao('');
    setResponsavel('');
    setStatus('publicada');
    setCategoria('');
    setImagem(null);
    setExistingImagem(null);
    const form = document.querySelector('form');
    if (form) form.reset();
  };

  const normalizeCategoria = (cat: string) => {
    return cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);
    formData.append('responsavel', responsavel);
    formData.append('status', status);
    formData.append('categoria', normalizeCategoria(categoria));
    if (imagem) {
      formData.append('imagem', imagem);
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem('token');
      const url = id ? `${API_BASE_URL}/api/publicacoes/${id}` : `${API_BASE_URL}/api/publicacoes`;
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao salvar publicação');
      }

      setSuccess(id ? 'Publicação atualizada com sucesso!' : 'Publicação criada com sucesso!');
      setError(null);
      clearForm();

      const res = await fetch(`${API_BASE_URL}/api/publicacoes`);
      if (res.ok) {
        const data = await res.json();
        setPublicacoes(data);
      }

      setTimeout(() => setSuccess(null), 3000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/admin/publicacoes');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagem(e.target.files[0]);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-green-600 text-white font-sans p-6 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-semibold mb-8 tracking-wide text-white drop-shadow-lg">
          {id ? 'Editar Publicação' : 'Criar Publicação'}
        </h1>

        {error && <div className="text-center p-4 mb-4 bg-red-200 text-red-800 rounded-xl">{error}</div>}
        {success && <div className="text-center p-4 mb-4 bg-green-200 text-green-800 rounded-xl">{success}</div>}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-5xl mx-auto space-y-6">
          <div className="relative mb-6">
            <label htmlFor="titulo" className="block text-lg font-bold text-gray-900 mb-4">Título</label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg font-bold text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
            />
          </div>

          <div className="relative mb-6 flex">
            <div className="w-full">
              <label htmlFor="descricao" className="block text-lg font-bold text-gray-900 mb-4">Descrição</label>
              <ReactQuill
                ref={quillRef}
                value={descricao}
                onChange={setDescricao}
                className="bg-white text-gray-900 rounded-lg h-[290px]"
                theme="snow"
              />
            </div>
          </div>
          <br></br><br></br><br></br>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <label htmlFor="responsavel" className="block text-lg font-bold text-gray-900 mb-4">Responsável</label>

              <input
                id="responsavel"
                type="text"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
              />
            </div>
            <div className="flex-1 relative">
              <label htmlFor="status" className="block text-lg font-bold text-gray-900 mb-4">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
              >
                <option value="excluida">Excluída</option>
                <option value="publicada">Publicada</option>
                <option value="rascunho">Rascunho</option>
                
              </select>
            </div>
          </div>

          <div className="relative mb-6">
            <label htmlFor="categoria" className="block text-lg font-bold text-gray-900 mb-4">Categoria</label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
            >
              <option value="">Selecione uma categoria</option>
              <option value="Notícia">Notícia</option>
              <option value="Evento">Evento</option>
              <option value="Formação">Formação</option>
              <option value="Outras">Outras</option>
            </select>
          </div>

          <div className="relative mb-6">
            <label htmlFor="imagem" className="block text-lg font-bold text-gray-900 mb-4">Imagem</label>
            <input
              id="imagem"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImagemChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
            />
            {imagem ? (
              <img
                src={URL.createObjectURL(imagem)}
                alt="Pré-visualização da imagem"
                className="w-48 h-32 object-cover mt-4 rounded-xl shadow"
              />
            ) : existingImagem ? (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${existingImagem}`}
                alt="Imagem existente"
                className="w-48 h-32 object-cover mt-4 rounded-xl shadow"
                onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
              />
            ) : null}
          </div>

          <div className="flex space-x-6 mt-6">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-800 to-green-500 hover:from-blue-700 hover:to-green-400 transition-all duration-300 shadow-md"
            >
              {id ? 'Atualizar Publicação' : 'Criar Publicação'}
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="px-6 py-3 rounded-xl text-white font-semibold bg-gray-500 hover:bg-gray-600 transition-all duration-300 shadow-md"
            >
              Limpar
            </button>
          </div>
        </form>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-white drop-shadow-lg">Publicações Existentes</h2>
        <div className="grid gap-6 mb-16 max-h-[500px] overflow-y-auto p-4">
          {publicacoes
            .filter(pub => pub.status === 'rascunho' || pub.status === 'publicada')
            .map((publicacao) => (
              <div
                key={publicacao.id}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 flex justify-between items-center border border-gray-100"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 truncate max-w-xs" title={publicacao.titulo}>
                    {publicacao.titulo}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(publicacao.data_publicacao)} | Status:{' '}
                    <span className={publicacao.status === 'publicada' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {publicacao.status.charAt(0).toUpperCase() + publicacao.status.slice(1)}
                    </span>
                  </p>
                </div>
                <Link to={`/admin/publicacoes/${publicacao.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  ✏️ Editar
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
