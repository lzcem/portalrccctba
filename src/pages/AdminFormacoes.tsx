import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import '@/assets/quill-snow.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Formacao {
  id: string;
  titulo: string;
  resumo: string;
  materia: string;
  imagem: string | null;
  data_publicacao: string;
  data_inicio: string;
  data_fim: string | null;
}

export default function AdminFormacoes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [materia, setMateria] = useState('');
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [dataPublicacao, setDataPublicacao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [previewImagem, setPreviewImagem] = useState<string | null>(null);
  const [formacoes, setFormacoes] = useState<Formacao[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string; visible: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const urlRefImagem = useRef<string | null>(null);
  const authHeader = { Authorization: `Bearer ${localStorage.getItem('token') || ''}` };
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
   // console.log('[DEBUG] useEffect: Carregando lista de formações');
    const fetchFormacoes = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/espiritualidade`, { headers: authHeader });
        if (!res.ok) throw new Error(`Erro ao buscar lista: ${res.status} ${res.statusText}`);
        const data = await res.json();
       // console.log('[DEBUG] Formações recebidas:', data);
        setFormacoes(data);
      } catch (e) {
        console.error('[DEBUG] Erro ao buscar formações:', e);
        setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Erro desconhecido', visible: true });
      }
    };
    fetchFormacoes();
  }, []);

  useEffect(() => {
    //console.log('[DEBUG] useEffect: ID da URL:', id);
    if (!id) {
    //  console.log('[DEBUG] Nenhum ID fornecido, limpando formulário');
      clearForm();
      return;
    }
    const fetchOne = async () => {
      try {
        setLoading(true);
       // console.log('[DEBUG] Buscando formação com ID:', id);
        const res = await fetch(`${API_BASE_URL}/api/admin/espiritualidade/${id}`, { headers: authHeader });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Formação não encontrada: ${res.status} ${res.statusText} - ${errorText}`);
        }
        const data: Formacao = await res.json();
       // console.log('[DEBUG] Dados da formação:', data);
        setTitulo(data.titulo);
        setResumo(data.resumo);
        setMateria(data.materia || '');
        setDataPublicacao(new Date(data.data_publicacao).toISOString().slice(0, 16));
        setDataInicio(new Date(data.data_inicio).toISOString().slice(0, 16));
        setDataFim(data.data_fim ? new Date(data.data_fim).toISOString().slice(0, 16) : '');
        setPreviewImagem(data.imagem ? data.imagem : null);
      } catch (e) {
        console.error('[DEBUG] Erro ao buscar formação:', e);
        setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Erro desconhecido', visible: true });
        navigate('/admin/espiritualidade');
      } finally {
        setLoading(false);
      }
    };
    fetchOne();
  }, [id]);

  useEffect(() => {
    if (!message?.visible) return;
    const t = setTimeout(() => setMessage((prev) => (prev ? { ...prev, visible: false } : null)), 3000);
    return () => clearTimeout(t);
  }, [message?.visible]);

  useEffect(() => {
    return () => {
      if (urlRefImagem.current) {
        URL.revokeObjectURL(urlRefImagem.current);
        urlRefImagem.current = null;
      }
    };
  }, []);

  const clearForm = () => {
    setTitulo('');
    setResumo('');
    setMateria('');
    setDataPublicacao('');
    setDataInicio('');
    setDataFim('');
    setImagemFile(null);
    if (urlRefImagem.current) URL.revokeObjectURL(urlRefImagem.current);
    urlRefImagem.current = null;
    setPreviewImagem(null);
    if (id) navigate('/admin/espiritualidade');
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/image\/(jpeg|png)$/.test(file.type)) {
      setMessage({ type: 'error', text: 'Apenas JPEG ou PNG', visible: true });
      return;
    }
    setImagemFile(file);
    const url = URL.createObjectURL(file);
    if (urlRefImagem.current) URL.revokeObjectURL(urlRefImagem.current);
    urlRefImagem.current = url;
    setPreviewImagem(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('resumo', resumo);
      formData.append('materia', materia);
      formData.append('data_publicacao', dataPublicacao);
      formData.append('data_inicio', dataInicio);
      if (dataFim) formData.append('data_fim', dataFim);
      if (imagemFile instanceof File) {
        formData.append('imagem', imagemFile);
      } else if (imagemFile) {
        console.warn('[DEBUG] imagemFile não é um arquivo válido:', imagemFile);
      }

      const method = id ? 'PUT' : 'POST';
      const endpoint = id
        ? `${API_BASE_URL}/api/admin/espiritualidade/${id}`
        : `${API_BASE_URL}/api/admin/espiritualidade`;

      const res = await fetch(endpoint, {
        method,
        headers: {
          Authorization: authHeader.Authorization,
        },
        body: formData,
        credentials: 'include', // Mantido, mas pode ser removido se cookies não forem necessários
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
        console.error('[DEBUG] Erro na resposta:', {
          status: res.status,
          statusText: res.statusText,
          error: errorData,
        });
        throw new Error(errorData.error || `Erro ${res.status}: ${res.statusText}`);
      }

      setMessage({
        type: 'success',
        text: id ? 'Atualizada com sucesso!' : 'Criada com sucesso!',
        visible: true,
      });
      clearForm();
    } catch (err) {
      console.error('[DEBUG] Erro no submit:', err);
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro desconhecido',
        visible: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-green-600 text-white font-sans p-6 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-semibold mb-8 tracking-wide text-white drop-shadow-lg">
          {id ? 'Editar Formação' : 'Criar Formação'}
        </h1>

        {loading && <div className="text-center text-white">Carregando...</div>}

        {message?.visible && (
          <div
            className={`p-3 rounded-lg text-white text-center transition-all duration-300 ${message.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
              } ${message.visible ? 'opacity-100' : 'opacity-0'}`}
            style={{ marginBottom: '1rem' }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-5xl mx-auto space-y-6">
          <div className="space-y-6">
            <div className="mb-6">
              <label htmlFor="titulo" className="block text-lg font-semibold text-gray-900 mb-4">
                Título da Formação
              </label>
              <input
                id="titulo"
                className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="resumo" className="block text-lg font-semibold text-gray-900 mb-4">
                Resumo
              </label>
              <ReactQuill
                ref={quillRef}
                value={resumo}
                onChange={setResumo}
                className="h-48 border border-gray-300 rounded-lg bg-white text-gray-900 border-b-0"
                theme="snow"
              />
            </div>
            <br /><br />
            <div className="mb-6">
              <label htmlFor="materia" className="block text-lg font-semibold text-gray-900 mb-4">
                Matéria
              </label>
              <ReactQuill
                ref={quillRef}
                value={materia}
                onChange={setMateria}
                className="h-48 border border-gray-300 rounded-lg bg-white text-gray-900 border-b-0"
                theme="snow"
              />
            </div>
            <br /><br />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="dataPublicacao" className="block text-lg font-semibold text-gray-900 mb-4">
                  Data de Publicação
                </label>
                <input
                  id="dataPublicacao"
                  type="datetime-local"
                  className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
                  value={dataPublicacao}
                  onChange={(e) => setDataPublicacao(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="dataInicio" className="block text-lg font-semibold text-gray-900 mb-4">
                  Data de Início
                </label>
                <input
                  id="dataInicio"
                  type="datetime-local"
                  className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="dataFim" className="block text-lg font-semibold text-gray-900 mb-4">
                  Data de Fim
                </label>
                <input
                  id="dataFim"
                  type="datetime-local"
                  className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="imagem" className="block text-lg font-semibold text-gray-900 mb-4">
                Imagem
              </label>
              <input
                id="imagem"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImagemChange}
                className="w-full p-2 border border-gray-300 rounded-lg text-base bg-white text-gray-900"
              />
              {previewImagem && (
                <img
                  src={previewImagem}
                  alt="preview formação"
                  onError={(e) => {
                    if (!previewImagem.startsWith('blob:')) {
                      e.currentTarget.src = '/ImgEspiritualidade/formacaoMes.png';
                    }
                  }}
                  className="w-48 h-32 object-cover mt-4 rounded-lg shadow-md"
                />
              )}
            </div>
            <div className="flex justify-between items-center gap-4">
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-900 to-green-600 text-white rounded-lg text-base hover:from-blue-800 hover:to-green-500 transition duration-200 shadow-md"
                type="submit"
                disabled={loading}
              >
                {id ? 'Atualizar' : 'Criar'}
              </button>
              <button
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-lg text-base hover:from-gray-600 hover:to-gray-800 transition duration-200 shadow-md"
                type="button"
                onClick={clearForm}
                disabled={loading}
              >
                Limpar
              </button>
            </div>
          </div>
        </form>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-white drop-shadow-lg">Formações Existentes</h2>

        <div className="grid gap-6 mb-16">
          {formacoes.map((f) => (
            <div
              key={f.id}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 flex justify-between items-center border border-gray-100"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 truncate max-w-xs" title={f.titulo}>
                  {f.titulo}
                </h3>
                <p className="text-sm text-gray-600">
                  Início: {new Date(f.data_inicio).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'medium' })} -
                  Fim: {f.data_fim ? new Date(f.data_fim).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'medium' }) : 'Sem fim'}
                </p>
              </div>
              <Link to={`/admin/formacoes/${f.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                ✏️ Editar
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}