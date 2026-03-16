import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AmoRcc {
  id: string;
  title: string;
  content: string;
  image_path: string; 
  updated_at: string;
}

export default function AdminAmoRcc() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [oldImagePath, setOldImagePath] = useState<string | null>(null);
  const [registros, setRegistros] = useState<AmoRcc[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string; visible: boolean } | null>(null);

  const urlRef = useRef<string | null>(null);
  const authHeader = { Authorization: `Bearer ${localStorage.getItem('token') || ''}` };
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
   // console.log('Token:', token);
   // console.log('API_BASE_URL:', API_BASE_URL);
    if (!token) {
      setMessage({ type: 'error', text: 'Faça login para continuar', visible: true });
      navigate('/login');
      return;
    }

    const fetchAll = async () => {
      try {
        //const res = await fetch(`${API_BASE_URL}/api/admin/amo-rcc-home?t=${Date.now()}`, { headers: authHeader });
        
          const res = await fetch(`/api/admin/amo-rcc-home?t=${Date.now()}`, { headers: authHeader });

        if (!res.ok) throw new Error(`Erro ao buscar registros: ${res.status} ${res.statusText}`);
        const data = await res.json();
       // console.log('Resposta /api/admin/amo-rcc-home:', data);
        setRegistros(Array.isArray(data) ? data : data && Object.keys(data).length > 0 ? [data] : []);
      } catch (error) {
        console.error('Erro fetchAll:', error);
        setMessage({ type: 'error', text: 'Erro ao carregar registros', visible: true });
      }
    };

    const fetchOne = async () => {
      if (!id) {
        clearForm();
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/amo-rcc-home/${id}?t=${Date.now()}`, { headers: authHeader });
        if (!res.ok) throw new Error(`Erro ao buscar registro: ${res.status} ${res.statusText}`);
        const data: AmoRcc = await res.json();
       // console.log('Resposta /api/admin/amo-rcc-home/:id:', data);
        setTitle(data.title);
        const clean = data.content.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, '');
        setContent(clean);
        if (data.image_path) {
          // Normalizar URL
          let img = data.image_path;
          if (img.includes('localhost')) {
            img = img.replace('http://localhost:3000', 'https://rcccuritiba.com.br');
            console.warn('URL ajustada:', img);
          } else if (!img.startsWith('http')) {
            img = `${API_BASE_URL}${img}`;
          }
         // console.log('Preview URL:', img);
          setPreview(img);
          const relative = img.replace(/^https?:\/\/[^/]+/, '');
          setOldImagePath(relative);
          // Verificar se a imagem é acessível
          const imgTest = new Image();
          imgTest.src = img;
          imgTest.onerror = () => {
            console.warn('Imagem não encontrada, usando fallback:', img);
            setPreview(`${API_BASE_URL}/ImgAmoRcc/amigoDefault.png`);
          };
        }
      } catch (error) {
        console.error('Erro fetchOne:', error);
        setMessage({ type: 'error', text: 'Erro ao carregar o registro', visible: true });
      }
    };

    fetchAll();
    fetchOne();
  }, [id, navigate]);

  useEffect(() => {
    if (message?.visible) {
      const timer = setTimeout(() => setMessage((prev) => prev ? { ...prev, visible: false } : null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message?.visible]);

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
    if (id) navigate('/admin/amorcc');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id && !image) {
      setMessage({ type: 'error', text: 'Imagem é obrigatória ao criar', visible: true });
      return;
    }
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('content', content);
      if (image) fd.append('image', image);
      if (oldImagePath) fd.append('oldImagePath', oldImagePath);

      const url = id ? `${API_BASE_URL}/api/admin/amo-rcc-home/${id}` : `${API_BASE_URL}/api/admin/amo-rcc-home`;
      const method = id ? 'PUT' : 'POST';

      const resp = await fetch(url, {
        method,
        headers: authHeader,
        body: fd
      });
      if (!resp.ok) throw new Error('Erro ao salvar');

      setMessage({ type: 'success', text: id ? 'Atualizado com sucesso!' : 'Criado com sucesso!', visible: true });
      clearForm();

      const list = await fetch(`${API_BASE_URL}/api/admin/amo-rcc-home?t=${Date.now()}`, { headers: authHeader });
      if (list.ok) setRegistros(await list.json());
    } catch (error) {
      console.error('Erro handleSubmit:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar dados', visible: true });
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
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = URL.createObjectURL(file);
    setPreview(urlRef.current);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-green-600 text-white p-6 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-semibold mb-8">{id ? 'Editar Projeto Amo a RCC' : 'Novo Projeto Amo a RCC'}</h1>

        {message?.visible && (
          <div className={`p-3 rounded-lg text-center ${message.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6 text-gray-800">
          <div>
            <label htmlFor="title" className="block font-semibold mb-2">Título</label>
            <input
              id="title"
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block font-semibold mb-2">Conteúdo</label>
            <ReactQuill
              ref={quillRef}
              value={content}
              onChange={setContent}
              theme="snow"
              className="bg-white"
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline'],
                  ['link'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
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
          </div>

          <div>
            <label htmlFor="image" className="block font-semibold mb-2">Imagem</label>
            <input
              id="image"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
              className="w-full"
            />
            {preview && <img src={preview} alt="preview" className="w-48 h-32 object-cover mt-4 rounded-lg shadow-md" />}
          </div>

          <div className="flex justify-between items-center gap-4">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
              {id ? 'Atualizar' : 'Criar'}
            </button>
            <button type="button" onClick={clearForm} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg">
              Limpar
            </button>
          </div>
        </form>

        <h2 className="text-2xl font-semibold mt-12 mb-4">Registros Existentes</h2>
        <div className="grid gap-6 mb-16">
          {registros.length > 0 ? registros.map((r) => (
            <div key={r.id} className="bg-white text-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{r.title}</h3>
                <p className="text-sm">Atualizado: {new Date(r.updated_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <Link to={`/admin/amorcc/${r.id}`} className="text-blue-600 hover:underline">✏️ Editar</Link>
            </div>
          )) : (
            <p>Nenhum registro encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}