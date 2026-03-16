import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import '@/assets/quill-snow.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface GrupoOracao {
    id: string;
    title: string;
    content: string;
    image_path: string;
    updated_at: string;
}

export default function AdminGrupo() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [oldImagePath, setOldImagePath] = useState<string | null>(null);
    const [grupos, setGrupos] = useState<GrupoOracao[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string; visible: boolean } | null>(null);

    const urlRef = useRef<string | null>(null);
    const authHeader = { Authorization: `Bearer ${localStorage.getItem('token') || ''}` };
    const quillRef = useRef<ReactQuill>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage({ type: 'error', text: 'Faça login para continuar', visible: true });
            navigate('/login');
            return;
        }

        const fetchGrupos = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/grupo-oracao`, { headers: authHeader });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || `Erro ao buscar lista: ${res.statusText}`);
                }
                const data = await res.json();
                setGrupos(Array.isArray(data) ? data : []);
            } catch (e) {
                console.error('Erro ao buscar grupos:', e);
                setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Erro desconhecido', visible: true });
                setGrupos([]);
            }
        };

        const fetchOne = async () => {
            if (!id) {
                clearForm();
                return;
            }
            try {
                const res = await fetch(`${API_BASE_URL}/api/admin/grupo-oracao/${id}`, { headers: authHeader });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || 'Grupo de Oração não encontrado');
                }
                const data: GrupoOracao = await res.json();
                setTitle(data.title);
                const cleanContent = data.content.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, '');
                setContent(cleanContent);

                if (data.image_path) {
                    const imageUrl = data.image_path.startsWith('http') ? data.image_path : `${API_BASE_URL}${data.image_path}`;
                    setPreview(imageUrl);

                    // Corrige oldImagePath: extrai apenas a parte a partir de /ImgGrupos
                    const relativePath = data.image_path.replace(/^https?:\/\/[^/]+/, ''); // remove domínio
                    setOldImagePath(relativePath);
                }

            } catch (e) {
                console.error('Erro ao buscar grupo:', e);
                setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Erro desconhecido', visible: true });
            }
        };

        fetchGrupos();
        fetchOne();
    }, [id, navigate]);

    useEffect(() => {
        if (message?.visible) {
            const timer = setTimeout(() => setMessage((prev) => prev ? { ...prev, visible: false } : null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message?.visible]);

    // Revogar blob apenas na desmontagem do componente
    useEffect(() => {
        return () => {
            if (urlRef.current) {
                URL.revokeObjectURL(urlRef.current);
                urlRef.current = null;
            }
        };
    }, []);

    const clearForm = () => {
        setTitle('');
        setContent('');
        setImage(null);
        setOldImagePath(null);
        if (urlRef.current) {
            URL.revokeObjectURL(urlRef.current);
            urlRef.current = null;
        }
        setPreview(null);
        if (id) navigate('/admin/grupo-oracao');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id && !image) {
            setMessage({ type: 'error', text: 'Imagem é obrigatória ao criar um grupo', visible: true });
            return;
        }
        try {
            const fd = new FormData();
            fd.append('title', title);
            fd.append('content', content);
            if (image) fd.append('image', image);
            if (oldImagePath) fd.append('oldImagePath', oldImagePath);
            console.log('Enviando oldImagePath:', oldImagePath);

            const url = id ? `${API_BASE_URL}/api/admin/grupo-oracao/${id}` : `${API_BASE_URL}/api/admin/grupo-oracao`;
            const method = id ? 'PUT' : 'POST';

            const resp = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
                body: fd,
            });
            if (!resp.ok) {
                const text = await resp.text();
                const err = text ? JSON.parse(text) : { error: 'Erro interno do servidor' };
                throw new Error(err.error || 'Falha ao salvar');
            }

            const data = await resp.json();
            console.log('Resposta do backend:', data);
            setMessage({ type: 'success', text: id ? 'Atualizado com sucesso!' : 'Criado com sucesso!', visible: true });
            setPreview(data.image_path);
            clearForm();

            const list = await fetch(`${API_BASE_URL}/api/admin/grupo-oracao`, { headers: authHeader });
            if (list.ok) {
                const data = await list.json();
                setGrupos(Array.isArray(data) ? data : []);
            }
        } catch (e) {
            console.error('Erro no submit:', e);
            setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Erro desconhecido', visible: true });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setMessage({ type: 'error', text: 'Apenas JPEG ou PNG são permitidos', visible: true });
            return;
        }
        setImage(file);
        if (urlRef.current) {
            URL.revokeObjectURL(urlRef.current);
        }
        urlRef.current = URL.createObjectURL(file);
        setPreview(urlRef.current);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-green-600 text-white font-sans p-6 flex justify-center">
            <div className="w-full max-w-4xl">
                <h1 className="text-4xl font-semibold mb-8 tracking-wide text-white drop-shadow-lg">
                    {id ? 'Editar Grupo de Oração' : 'Criar Grupo de Oração'}
                </h1>

                {message?.visible && (
                    <div
                        className={`p-3 rounded-lg text-white text-center transition-all duration-300 ${message.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}
                        style={{ marginBottom: '1rem' }}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-5xl mx-auto space-y-6">
                    <div className="space-y-6">
                        <div className="mb-6">
                            <label htmlFor="title" className="block text-lg font-semibold text-gray-900 mb-4">
                                Título
                            </label>
                            <input
                                id="title"
                                className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 bg-white text-gray-900"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="content" className="block text-lg font-semibold text-gray-900 mb-4">
                                Conteúdo
                            </label>
                            <ReactQuill
                                ref={quillRef}
                                value={content}
                                onChange={setContent}
                                className="h-64 border border-gray-300 rounded-lg bg-white"
                                theme="snow"
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, false] }],
                                        ['bold', 'italic', 'underline'],
                                        ['link'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['clean']
                                    ]
                                }}
                            />
                            <style>{`
                .ql-editor,
                .ql-editor p,
                .ql-editor span,
                .ql-editor div {
                  color: #000000 !important;
                }
              `}</style>
                            <br /><br />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="image" className="block text-lg font-semibold text-gray-900 mb-4">
                                Imagem
                            </label>
                            <input
                                id="image"
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleImageChange}
                                className="w-full p-2 border border-gray-300 rounded-lg text-base bg-white text-gray-900"
                            />
                            {preview && (
                                <img
                                    src={preview}
                                    alt="preview"
                                    onError={(e) => (e.currentTarget.src = '/placeholder-400x300.jpg')}
                                    className="w-48 h-32 object-cover mt-4 rounded-lg shadow-md"
                                />
                            )}
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

                <h2 className="text-3xl font-semibold mt-12 mb-6 text-white drop-shadow-lg">Grupos de Oração Existentes</h2>

                <div className="grid gap-6 mb-16">
                    {Array.isArray(grupos) && grupos.length > 0 ? (
                        grupos.map((g) => (
                            <div
                                key={g.id}
                                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 flex justify-between items-center border border-gray-100"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 truncate max-w-xs" title={g.title}>
                                        {g.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Atualizado em: {new Date(g.updated_at).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'medium' })}
                                    </p>
                                </div>
                                <Link to={`/admin/grupo-oracao/${g.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    ✏️ Editar
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-white">Nenhum grupo encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
}