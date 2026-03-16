import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaTimes, FaQuoteLeft, FaTrash, FaEdit, FaMicrophone, FaPlay, FaBible } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface PaoDiario {
    id: number;
    referencia: string;
    texto_biblico: string;
    reflexao: string;
    proposito: string;
    data_exibicao: string;
    audio_url?: string;
}

const AdminPaoDiario: React.FC = () => {
    const [formData, setFormData] = useState({
        referencia: '',
        texto_biblico: '',
        reflexao: '',
        proposito: '',
        data_exibicao: new Date().toISOString().split('T')[0]
    });

    const [paes, setPaes] = useState<PaoDiario[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [feedback, setFeedback] = useState<{ texto: string; tipo: 'success' | 'error' | 'info' } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const token = localStorage.getItem('token');

    // Carregar lista de pães
    const fetchPaes = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/pao-diario`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setPaes(data);
        } catch (err) {
            console.error("Erro ao carregar lista", err);
        }
    };

    useEffect(() => {
        fetchPaes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Usamos FormData para suportar o envio do arquivo de áudio
        const data = new FormData();
        data.append('referencia', formData.referencia);
        data.append('texto_biblico', formData.texto_biblico);
        data.append('reflexao', formData.reflexao);
        data.append('proposito', formData.proposito);
        data.append('data_exibicao', formData.data_exibicao);

        if (audioFile) {
            data.append('audio', audioFile);
        }

        const url = editingId
            ? `${API_BASE_URL}/api/admin/pao-diario/${editingId}`
            : `${API_BASE_URL}/api/admin/pao-diario`;

        const method = editingId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Nota: Não definir Content-Type ao enviar FormData, o navegador faz isso automaticamente
                },
                body: data
            });

            if (res.ok) {
                setFeedback({
                    texto: editingId ? 'Alimento atualizado!' : 'Pão Diário publicado!',
                    tipo: 'success'
                });
                setAudioFile(null); // Limpa o estado do arquivo selecionado
                if (fileInputRef.current) fileInputRef.current.value = ''; // Limpa o input visualmente
                resetForm();
                fetchPaes();
            } else {
                const errData = await res.json();
                throw new Error(errData.error || 'Erro ao salvar');
            }
        } catch (err: any) {
            setFeedback({ texto: err.message || 'Erro ao salvar no banco.', tipo: 'error' });
        } finally {
            setLoading(false);
            setTimeout(() => setFeedback(null), 4000);
        }
    };

    const handleEdit = (pao: PaoDiario) => {
        setEditingId(pao.id);
        setFormData({
            referencia: pao.referencia,
            texto_biblico: pao.texto_biblico,
            reflexao: pao.reflexao,
            proposito: pao.proposito,
            data_exibicao: pao.data_exibicao.split('T')[0]
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Deseja realmente remover este Pão Diário?")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/pao-diario/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setFeedback({ texto: 'Removido com sucesso!', tipo: 'info' });
                fetchPaes();
            }
        } catch (err) {
            setFeedback({ texto: 'Erro ao excluir.', tipo: 'error' });
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setAudioFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setFormData({
            referencia: '',
            texto_biblico: '',
            reflexao: '',
            proposito: '',
            data_exibicao: new Date().toISOString().split('T')[0]
        });
    };

    const inputStyle = "w-full bg-white border-2 border-gray-200 rounded-xl p-4 text-gray-800 font-medium focus:border-orange-500 focus:ring-0 outline-none transition-all shadow-sm placeholder:text-gray-300";
    const labelStyle = "block text-xs font-black text-gray-500 uppercase mb-2 ml-1 tracking-widest";

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6">
            <AnimatePresence>
                {feedback && (
                    <motion.div initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 100, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} className="fixed top-0 left-1/2 z-[200] w-full max-w-md px-4">
                        <div className={`p-5 rounded-2xl shadow-2xl flex items-center gap-4 border backdrop-blur-md ${feedback.tipo === 'success' ? 'bg-green-600/95 border-green-400 text-white' : feedback.tipo === 'error' ? 'bg-red-600/95 border-red-400 text-white' : 'bg-blue-600/95 border-blue-400 text-white'}`}>
                            {feedback.tipo === 'success' ? <FaCheckCircle size={20} /> : feedback.tipo === 'error' ? <FaExclamationTriangle size={20} /> : <FaCheckCircle size={20} />}
                            <p className="font-bold text-sm flex-1">{feedback.texto}</p>
                            <button onClick={() => setFeedback(null)}><FaTimes /></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto">
                <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-600 font-bold text-xs uppercase tracking-widest mb-8 transition-colors">
                    <FaArrowLeft /> Painel Administrativo
                </Link>

                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden mb-12">
                    <div className="bg-gray-900 p-10 text-white relative">
                        <FaQuoteLeft className="absolute top-6 right-10 text-white/5 text-7xl" />
                        <h1 className="text-4xl font-serif font-black uppercase tracking-tighter italic">
                            {editingId ? 'Editar Alimento' : 'Novo Pão Diário'}
                        </h1>
                        <p className="text-orange-500 text-xs font-black uppercase tracking-[0.4em] mt-2">Palavra e Reflexão</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className={labelStyle}>Passagem / Referência</label>
                                <input type="text" value={formData.referencia} onChange={e => setFormData({ ...formData, referencia: e.target.value })} className={inputStyle} placeholder="Ex: Mateus 6, 33" required />
                            </div>
                            <div className="space-y-2">
                                <label className={labelStyle}>Data de Exibição no Portal</label>
                                <input type="date" value={formData.data_exibicao} onChange={e => setFormData({ ...formData, data_exibicao: e.target.value })} className={inputStyle} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={labelStyle}>Texto Bíblico Completo</label>
                            <textarea rows={2} value={formData.texto_biblico} onChange={e => setFormData({ ...formData, texto_biblico: e.target.value })} className={`${inputStyle} italic border-l-4 border-l-orange-500`} placeholder="Digite o versículo..." required />
                        </div>

                        <div className="space-y-2">
                            <label className={labelStyle}>Meditação e Reflexão</label>
                            <textarea rows={5} value={formData.reflexao} onChange={e => setFormData({ ...formData, reflexao: e.target.value })} className={inputStyle} placeholder="Escreva a mensagem espiritual para os fiéis..." required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-2">
                                <label className={labelStyle}>Propósito Prático</label>
                                <input type="text" value={formData.proposito} onChange={e => setFormData({ ...formData, proposito: e.target.value })} className={`${inputStyle} bg-orange-50/50 border-orange-100 text-orange-900 font-bold`} placeholder="Desafio para o dia..." required />
                            </div>

                            <div className="space-y-2">
                                <label className={labelStyle}>Áudio da Narração (MP3)</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="audio/*"
                                        onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="audio-upload"
                                    />
                                    <label htmlFor="audio-upload" className="flex items-center gap-3 w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer group-hover:border-orange-400 group-hover:bg-orange-50 transition-all text-sm font-bold text-gray-500">
                                        <FaMicrophone className={audioFile ? "text-green-500" : "text-gray-400"} />
                                        {audioFile ? audioFile.name : "Selecionar arquivo de áudio..."}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" disabled={loading} className="flex-1 bg-orange-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-200 hover:bg-orange-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95">
                                {loading ? 'Enviando ao servidor...' : <><FaSave size={18} /> {editingId ? 'Confirmar Alterações' : 'Publicar no Portal'}</>}
                            </button>

                            {editingId && (
                                <button type="button" onClick={resetForm} className="px-8 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase text-[10px] hover:bg-gray-200 transition-all border border-gray-200">
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* LISTAGEM PARA GESTÃO */}
                <div className="bg-white rounded-[2.5rem] shadow-xl p-10 border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter flex items-center gap-4">
                            <span className="w-3 h-10 bg-orange-500 rounded-full"></span>
                            Histórico de Publicações
                        </h2>
                        <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                            {paes.length} registros
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em]">
                                    <th className="pb-4 px-4">Exibição</th>
                                    <th className="pb-4 px-4">Palavra</th>
                                    <th className="pb-4 px-4">Áudio</th>
                                    <th className="pb-4 px-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paes.map((pao) => (
                                    <tr key={pao.id} className="bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group rounded-2xl">
                                        <td className="py-5 px-4 first:rounded-l-2xl font-bold text-gray-500">
                                            {new Date(pao.data_exibicao).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="py-5 px-4 font-black text-gray-800">
                                            {pao.referencia}
                                        </td>
                                        <td className="py-5 px-4">
                                            {pao.audio_url ? (
                                                <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase">
                                                    <FaPlay size={10} /> Sim
                                                </div>
                                            ) : (
                                                <span className="text-gray-300 text-[10px] uppercase font-bold">Não</span>
                                            )}
                                        </td>
                                        <td className="py-5 px-4 last:rounded-r-2xl text-right">
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => handleEdit(pao)} className="p-3 bg-white text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl shadow-sm transition-all" title="Editar">
                                                    <FaEdit size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(pao.id)} className="p-3 bg-white text-red-400 hover:bg-red-500 hover:text-white rounded-xl shadow-sm transition-all" title="Excluir">
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {paes.length === 0 && (
                            <div className="text-center py-20 text-gray-300">
                                <FaBible size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-bold uppercase text-xs tracking-widest">Nenhuma publicação encontrada no sistema</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPaoDiario;