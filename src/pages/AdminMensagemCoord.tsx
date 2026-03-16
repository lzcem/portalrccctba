import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import '@/assets/quill-snow.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface MensagemCoord {
    id: string;
    titulo_mensagem: string;
    texto_mensagem: string;
    resumo_mensagem: string;
    foto_mensagem: string | null;
    data_inicio: string;
    data_fim: string | null;
    foto_coord: string | null;
    nome_coordenador: string;
}

export default function AdminMensagemCoord() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    /* ─────────── estados do formulário ─────────── */
    const [tituloMensagem, setTituloMensagem] = useState('');
    const [resumoMensagem, setResumoMensagem] = useState('');
    const [textoMensagem, setTextoMensagem] = useState('');
    const [fotoMensagemFile, setFotoMensagemFile] = useState<File | null>(null);
    const [fotoCoordFile, setFotoCoordFile] = useState<File | null>(null);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [nomeCoordenador, setNomeCoordenador] = useState('');

    /* previews */
    const [previewMensagem, setPreviewMensagem] = useState<string | null>(null);
    const [previewCoord, setPreviewCoord] = useState<string | null>(null);

    /* lista existente */
    const [mensagens, setMensagens] = useState<MensagemCoord[]>([]);

    /* feedback */
    const [message, setMessage] = useState<{
        type: 'success' | 'error';
        text: string;
        visible: boolean;
    } | null>(null);

    /* refs auxiliares para liberar URLs */
    const urlRefMensagem = useRef<string | null>(null);
    const urlRefCoord = useRef<string | null>(null);

    const authHeader = { Authorization: `Bearer ${localStorage.getItem('token') || ''}` };
    const quillRef = useRef<ReactQuill>(null);

    /* ─────────── busca lista + item (se id) ─────────── */
    useEffect(() => {
        const fetchMensagens = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/mensagens-coordenacao`, { headers: authHeader });
                if (!res.ok) throw new Error('Erro ao buscar lista');
                setMensagens(await res.json());
            } catch (e) {
                setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Erro desconhecido', visible: true });
            }
        };

        const fetchOne = async () => {
            if (!id) {
                clearForm();
                return;
            }
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/mensagens-coordenacao/${id}`, { headers: authHeader });
                if (!res.ok) throw new Error('Mensagem não encontrada');
                const data: MensagemCoord = await res.json();
                setTituloMensagem(data.titulo_mensagem);
                setResumoMensagem(data.resumo_mensagem);
                setTextoMensagem(data.texto_mensagem || '');
                setDataInicio(new Date(data.data_inicio).toISOString().slice(0, 16));
                setDataFim(data.data_fim ? new Date(data.data_fim).toISOString().slice(0, 16) : '');
                setPreviewMensagem(data.foto_mensagem ? `${API_BASE_URL}${data.foto_mensagem}` : null);
                setPreviewCoord(data.foto_coord ? `${API_BASE_URL}${data.foto_coord}` : null);
                setNomeCoordenador(data.nome_coordenador);
            } catch (e) {
                setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Erro desconhecido', visible: true });
            }
        };

        fetchMensagens();
        fetchOne();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    /* auto‑hide alert */
    useEffect(() => {
        if (!message?.visible) return;
        const t = setTimeout(() => setMessage((prev) => (prev ? { ...prev, visible: false } : null)), 3000);
        return () => clearTimeout(t);
    }, [message?.visible]);

    /* revoke previews quando alteram */
    /* revoke previews apenas no unmount do componente */
    useEffect(() => {
        return () => {
            if (urlRefMensagem.current) {
                URL.revokeObjectURL(urlRefMensagem.current);
                urlRefMensagem.current = null;
            }
            if (urlRefCoord.current) {
                URL.revokeObjectURL(urlRefCoord.current);
                urlRefCoord.current = null;
            }
        };
    }, []);


    /* ─────────── helpers ─────────── */
    const clearForm = () => {
        setTituloMensagem('');
        setResumoMensagem('');
        setTextoMensagem('');
        setDataInicio('');
        setDataFim('');
        setFotoMensagemFile(null);
        setFotoCoordFile(null);
        setNomeCoordenador('');
        if (urlRefMensagem.current) URL.revokeObjectURL(urlRefMensagem.current);
        if (urlRefCoord.current) URL.revokeObjectURL(urlRefCoord.current);
        urlRefMensagem.current = null;
        urlRefCoord.current = null;
        setPreviewMensagem(null);
        setPreviewCoord(null);
        if (id) navigate('/admin/mensagens-coordenacao');
    };

    /* ─────────── submit ─────────── */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('titulo_mensagem', tituloMensagem);
            formData.append('resumo_mensagem', resumoMensagem);
            formData.append('texto_mensagem', textoMensagem);
            formData.append('data_inicio', dataInicio);
            if (dataFim) formData.append('data_fim', dataFim);
            if (fotoMensagemFile instanceof File) formData.append('foto_mensagem', fotoMensagemFile);
            if (fotoCoordFile instanceof File) formData.append('foto_coord', fotoCoordFile);
            formData.append('nome_coordenador', nomeCoordenador);

            // Depuração detalhada do FormData
            for (let [key, value] of formData.entries()) {
                console.log(`FormData [${key}]:`, value instanceof File ? `${value.name} (${value.type})` : value);
            }

            const method = id ? 'PUT' : 'POST';
            const endpoint = id
                ? `${API_BASE_URL}/api/admin/mensagens-coordenacao/${id}`
                : `${API_BASE_URL}/api/admin/mensagens-coordenacao`;

            const res = await fetch(endpoint, {
                method,
                headers: {
                    Authorization: authHeader.Authorization, // Mantém apenas o token, se necessário
                },
                body: formData,
                credentials: 'include',
            });
            if (!res.ok) {
                const errorText = await res.text();
                console.error('Erro na resposta:', errorText);
                throw new Error(errorText || 'Erro desconhecido');
            }

            setMessage({ type: 'success', text: id ? 'Atualizada com sucesso!' : 'Criada com sucesso!', visible: true });
            clearForm();
        } catch (err) {
            console.error('Erro no submit:', err);
            setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erro desconhecido', visible: true });
        }
    };
    /* ─────────── handlers de imagens (preview + file state) ─────────── */
    const handleFotoMensagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!/image\/(jpeg|png)$/.test(file.type)) return setMessage({ type: 'error', text: 'Apenas JPEG ou PNG', visible: true });
        setFotoMensagemFile(file);
        const url = URL.createObjectURL(file);
        if (urlRefMensagem.current) URL.revokeObjectURL(urlRefMensagem.current);
        urlRefMensagem.current = url;
        setPreviewMensagem(url);
    };

    const handleFotoCoordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!/image\/(jpeg|png)$/.test(file.type)) return setMessage({ type: 'error', text: 'Apenas JPEG ou PNG', visible: true });
        setFotoCoordFile(file);
        const url = URL.createObjectURL(file);
        if (urlRefCoord.current) URL.revokeObjectURL(urlRefCoord.current);
        urlRefCoord.current = url;
        setPreviewCoord(url);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-green-600 text-white font-sans p-6 flex justify-center">
            <div className="w-full max-w-4xl">
                <h1 className="text-4xl font-semibold mb-8 tracking-wide text-white drop-shadow-lg">
                    {id ? 'Editar Mensagem' : 'Criar Mensagem'}
                </h1>

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
                            <label htmlFor="tituloMensagem" className="block text-lg font-semibold text-gray-900 mb-4">
                                Título da Mensagem
                            </label>
                            <input
                                id="tituloMensagem"
                                className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
                                value={tituloMensagem}
                                onChange={(e) => setTituloMensagem(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="resumoMensagem" className="block text-lg font-semibold text-gray-900 mb-4">
                                Resumo da Mensagem
                            </label>
                            <ReactQuill
                                ref={quillRef}
                                value={resumoMensagem}
                                onChange={setResumoMensagem}
                                className="h-48 border border-gray-300 rounded-lg bg-white text-gray-900 border-b-0"
                                theme="snow"
                            />
                        </div>
                        <br></br> <br></br>
                        <div className="mb-6">
                            <label htmlFor="textoMensagem" className="block text-lg font-semibold text-gray-900 mb-4">
                                Texto da Mensagem
                            </label>
                            <ReactQuill
                                ref={quillRef}
                                value={textoMensagem}
                                onChange={setTextoMensagem}
                                className="h-48 border border-gray-300 rounded-lg bg-white text-gray-900 border-b-0"
                                theme="snow"
                            />
                        </div>
                        <br></br> <br></br>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                            <label htmlFor="foto_mensagem" className="block text-lg font-semibold text-gray-900 mb-4">
                                Foto da Mensagem
                            </label>
                            <input
                                id="foto_mensagem"
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleFotoMensagemChange}
                                className="w-full p-2 border border-gray-300 rounded-lg text-base bg-white text-gray-900"
                            />
                            {previewMensagem && (
                                <img
                                    src={previewMensagem}
                                    alt="preview mensagem"
                                    onError={(e) => {
                                        if (!previewMensagem.startsWith('blob:')) {
                                            e.currentTarget.src = '/ImgMensagens/default-mensagem.jpg';
                                        }
                                    }}
                                    className="w-48 h-32 object-cover mt-4 rounded-lg shadow-md"
                                />
                            )}



                        </div>
                        <div className="mb-6">
                            <label htmlFor="foto_coord" className="block text-lg font-semibold text-gray-900 mb-4">
                                Foto do Coordenador
                            </label>
                            <input
                                id="foto_coord"
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleFotoCoordChange}
                                className="w-full p-2 border border-gray-300 rounded-lg text-base bg-white text-gray-900"
                            />
                            {previewCoord && (
                                <img
                                    src={previewCoord}
                                    alt="preview coordenador"
                                    onError={(e) => (e.currentTarget.src = '/ImgCoordenadores/default-coordenador.jpg')}
                                    className="w-48 h-32 object-cover mt-4 rounded-lg shadow-md"
                                />
                            )}
                        </div>
                        <div className="mb-6">
                            <label htmlFor="nome_coordenador" className="block text-lg font-semibold text-gray-900 mb-4">
                                Nome do Coordenador
                            </label>
                            <input
                                id="nome_coordenador"
                                className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
                                value={nomeCoordenador}
                                onChange={(e) => setNomeCoordenador(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <button
                                className="px-6 py-3 bg-gradient-to-r from-blue-900 to-green-600 text-white rounded-lg text-base hover:from-blue-800 hover:to-green-500 transition duration-200 shadow-md"
                                type="submit"
                            >
                                {id ? 'Atualizar' : 'Criar'}
                            </button>
                            <button
                                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-lg text-base hover:from-gray-600 hover:to-gray-800 transition duration-200 shadow-md"
                                type="button"
                                onClick={clearForm}
                            >
                                Limpar
                            </button>
                        </div>
                    </div>
                </form>

                <h2 className="text-3xl font-semibold mt-12 mb-6 text-white drop-shadow-lg">Mensagens Existentes</h2>

                <div className="grid gap-6 mb-16">
                    {mensagens.map((m) => (
                        <div
                            key={m.id}
                            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 flex justify-between items-center border border-gray-100"
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 truncate max-w-xs" title={m.titulo_mensagem}>
                                    {m.titulo_mensagem}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Início: {new Date(m.data_inicio).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'medium' })} -
                                    Fim: {m.data_fim ? new Date(m.data_fim).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'medium' }) : 'Sem fim'}
                                </p>
                            </div>
                            <Link to={`/admin/mensagens-coordenacao/${m.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                ✏️ Editar
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}