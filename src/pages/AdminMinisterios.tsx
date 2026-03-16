import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import '@/assets/quill-snow.css';

interface EscolaFormacao {
  data: string;
  local: string;
}

interface MinisterioCoordenador {
  id?: string | number;
  nome: string;
  email: string;
  grupo_oracao: string;
  foto_coordenador?: File | string;
}

export default function AdminMinisterios() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [missao, setMissao] = useState('');
  const [escolas, setEscolas] = useState<EscolaFormacao[]>([]);
  const [coordenadores, setCoordenadores] = useState<MinisterioCoordenador[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [ministerios, setMinisterios] = useState<any[]>([]);

  const quillDescricao = useRef<ReactQuill>(null);
  const quillMissao = useRef<ReactQuill>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/admin/ministerios`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setMinisterios(await res.json());
      } catch {
        /* ignore */
      }
    })();
  }, []);

  useEffect(() => {
    if (!id) {
      setNome('');
      setDescricao('');
      setMissao('');
      setEscolas([]);
      setCoordenadores([]);
      return;
    }

    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/ministerios/${id}/detalhes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Ministério não encontrado');
        const data = await res.json();

        setNome(data.detalhes?.nome || '');
        setDescricao(data.detalhes?.descricao || '');
        setMissao(data.detalhes?.missao || '');
        setEscolas(
          data.escolasFormacao.map((e: EscolaFormacao) => ({
            data: new Date(e.data).toISOString().split('T')[0],
            local: e.local,
          })) || []
        );
        setCoordenadores(
          data.coordenador
            ? [{ ...data.coordenador, id: data.coordenador.id || '', foto_coordenador: data.coordenador.foto_coordenador || '' }]
            : []
        );
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar ministério');
      }
    })();
  }, [id]);

  const addEscola = () => setEscolas([...escolas, { data: '', local: '' }]);
  const updateEscola = (idx: number, field: keyof EscolaFormacao, value: string) =>
    setEscolas(escolas.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
  const removeEscola = (idx: number) => setEscolas(escolas.filter((_, i) => i !== idx));

  const addCoord = () => setCoordenadores([...coordenadores, { nome: '', email: '', grupo_oracao: '', foto_coordenador: '' }]);
  const updateCoord = (idx: number, field: keyof MinisterioCoordenador, value: string | File) =>
    setCoordenadores(coordenadores.map((c, i) => (i === idx ? { ...c, [field]: value } : c)));
  const removeCoord = (idx: number) => setCoordenadores(coordenadores.filter((_, i) => i !== idx));

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    if (e.target.files && e.target.files[0]) {
      updateCoord(idx, 'foto_coordenador', e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const method = id ? 'PUT' : 'POST';
      const detalhePayload = { nome, descricao, missao };

      // Salvar detalhes do ministério
      const detalheRes = await fetch(`${API_BASE_URL}/api/admin/ministerios${id ? `/${id}` : ''}`, {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(detalhePayload),
      });
      if (!detalheRes.ok) throw new Error('Erro ao salvar detalhes');

      const responseData = await detalheRes.json();
      console.log('[DEBUG] Resposta do detalhe:', responseData);
      const newId = id || responseData.ministerio_id || responseData.insertId;
      console.log('[DEBUG] Novo ID:', newId);

      if (!newId) throw new Error('ID do ministério não encontrado na resposta');

      // Salvar escolas
      console.log('[DEBUG] Criando/atualizando escolas - newId:', newId, 'escolas:', escolas);
      const escolaRes = await fetch(`${API_BASE_URL}/api/admin/ministerios/${newId}/escolas`, {
        method: 'PUT', // Forçar PUT para alinhar com o backend
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(escolas.filter(e => e.data && e.local)), // Filtrar escolas incompletas
      });
      if (!escolaRes.ok) {
        const error = await escolaRes.json();
        throw new Error(`Erro ao salvar escolas: ${escolaRes.status} - ${error.error}`);
      }
      await escolaRes.json();

      // Salvar coordenadores
      for (const coord of coordenadores) {
        const formData = new FormData();
        formData.append('nome', coord.nome);
        formData.append('email', coord.email);
        formData.append('grupo_oracao', coord.grupo_oracao);
        if (coord.foto_coordenador instanceof File) {
          formData.append('foto_coordenador', coord.foto_coordenador);
        }

        const coordUrl = coord.id
          ? `${API_BASE_URL}/api/admin/ministerios/${newId}/coordenadores/${coord.id}`
          : `${API_BASE_URL}/api/admin/ministerios/${newId}/coordenadores`;
        const coordMethod = coord.id ? 'PUT' : 'POST';

        const coordRes = await fetch(coordUrl, {
          method: coordMethod,
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!coordRes.ok) {
          const error = await coordRes.json();
          throw new Error(`Erro ao salvar coordenador ${coord.nome}: ${coordRes.status} - ${error.error}`);
        }
      }

      setSuccess(id ? 'Ministério atualizado!' : 'Ministério criado!');
      setTimeout(() => setSuccess(null), 3000);
      navigate('/admin/ministerios');
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
      console.error('Erro no handleSubmit:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-green-600 text-white p-6 flex justify-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-semibold mb-8">{id ? 'Editar Ministério' : 'Criar Ministério'}</h1>

        {error && <div className="p-4 mb-4 bg-red-200 text-red-800 rounded-xl text-center">{error}</div>}
        {success && <div className="p-4 mb-4 bg-green-200 text-green-800 rounded-xl text-center">{success}</div>}

        <form onSubmit={handleSubmit} className="bg-white text-gray-900 p-8 rounded-xl shadow-lg space-y-8">
          <div>
            <label className="block text-lg font-semibold mb-2">Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full p-3 border rounded-lg" />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2">Descrição</label>
            <ReactQuill ref={quillDescricao} value={descricao} onChange={setDescricao} theme="snow" className="bg-white rounded-lg h-[200px]" />
          </div>
          <br></br> <br></br>
          <div>
            <label className="block text-lg font-semibold mb-2">Missão</label>
            <ReactQuill ref={quillMissao} value={missao} onChange={setMissao} theme="snow" className="bg-white rounded-lg h-[200px]" />
          </div>
          <br></br> <br></br>
          <div>
            <label className="block text-xl font-semibold mb-4">Escolas de Formação</label>
            {escolas.map((e, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-2">
                <input type="date" value={e.data} onChange={(ev) => updateEscola(i, 'data', ev.target.value)} className="p-2 border rounded-lg" />
                <input type="text" placeholder="Local" value={e.local} onChange={(ev) => updateEscola(i, 'local', ev.target.value)} className="p-2 border rounded-lg flex-1" />
                <button type="button" onClick={() => removeEscola(i)} className="text-red-600 text-xl">×</button>
              </div>
            ))}
            <button type="button" onClick={addEscola} className="mt-2 px-4 py-2 bg-blue-700 text-white rounded-lg">+ Adicionar escola</button>
          </div>

          <div>
            <label className="block text-xl font-semibold mb-4">Coordenadores</label>
            {coordenadores.map((c, i) => (
              <div key={i} className="border p-4 rounded-lg mb-4 bg-gray-50 relative">
                <button type="button" onClick={() => removeCoord(i)} className="absolute top-2 right-3 text-red-600 text-xl">×</button>
                <input placeholder="Nome" value={c.nome} onChange={(e) => updateCoord(i, 'nome', e.target.value)} className="w-full mb-2 p-2 border rounded" />
                <input type="email" placeholder="E‑mail" value={c.email} onChange={(e) => updateCoord(i, 'email', e.target.value)} className="w-full mb-2 p-2 border rounded" />
                <input placeholder="Grupo de Oração" value={c.grupo_oracao} onChange={(e) => updateCoord(i, 'grupo_oracao', e.target.value)} className="w-full mb-2 p-2 border rounded" />
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => handleImagemChange(e, i)}
                  className="w-full p-2 border rounded"
                />
                {c.foto_coordenador && (
                  <div className="mt-4">
                    {typeof c.foto_coordenador === 'string' ? (
                      <img src={`${API_BASE_URL}${c.foto_coordenador}`} alt="Foto do Coordenador" className="w-48 h-32 object-cover rounded-xl shadow" />
                    ) : (
                      <img src={URL.createObjectURL(c.foto_coordenador)} alt="Pré-visualização" className="w-48 h-32 object-cover rounded-xl shadow" />
                    )}
                  </div>
                )}
              </div>
            ))}
            <button type="button" onClick={addCoord} className="mt-2 px-4 py-2 bg-blue-700 text-white rounded-lg">+ Adicionar coordenador</button>
          </div>

          <div className="flex gap-6">
            <button type="submit" className="px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-800 to-green-500">
              {id ? 'Atualizar Ministério' : 'Criar Ministério'}
            </button>
            <button type="button" onClick={() => navigate('/admin/ministerios')} className="px-6 py-3 rounded-xl text-white font-semibold bg-gray-500">Cancelar</button>
          </div>
        </form>

        <h2 className="text-3xl font-semibold mt-12 mb-6">Ministérios Existentes</h2>
        <div className="grid gap-6 mb-16">
          {ministerios.map((m) => (
            <div key={m.ministerio_id} className="p-6 bg-white text-gray-900 rounded-lg shadow-md flex justify-between items-center">
              <h3 className="text-lg font-semibold truncate max-w-xs">{m.nome}</h3>
              <Link to={`/admin/ministerios/${m.ministerio_id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">✏️ Editar</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}