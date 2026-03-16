// src/pages/AdminRadio.tsx
import React, { useState, useEffect } from 'react';
import axios, { AxiosProgressEvent } from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaEdit, 
    FaTrash, 
    FaSpinner, 
    FaUpload, 
    FaBroadcastTower, 
    FaCalendarAlt, 
    FaMapMarkerAlt, 
    FaCheckCircle, 
    FaExclamationTriangle,
    FaLayerGroup
} from 'react-icons/fa';

interface RadioFile {
    id: string;
    titulo: string;
    categoria: 'musica' | 'pregacoes' | 'formacoes' | 'vaticano';
    local: string;
    data_evento: string;
    arquivo_path: string;
}

export default function AdminRadio() {
    const [files, setFiles] = useState<RadioFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const [titulo, setTitulo] = useState('');
    const [categoria, setCategoria] = useState('pregacoes');
    const [local, setLocal] = useState('');
    const [dataEvento, setDataEvento] = useState('');
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/radio-files`);
            
            // ORDENAÇÃO AQUI: Primeiro por Categoria (Ordem alfabética) e depois por Data (Mais recente)
            const sortedData = (res.data || []).sort((a: RadioFile, b: RadioFile) => {
                if (a.categoria < b.categoria) return -1;
                if (a.categoria > b.categoria) return 1;
                
                // Se a categoria for igual, ordena por data decrescente
                return new Date(b.data_evento).getTime() - new Date(a.data_evento).getTime();
            });

            setFiles(sortedData);
        } catch (err) {
            setError('Não foi possível carregar os arquivos da rádio.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo.trim()) return setError('O título é obrigatório.');
        if (!editingId && !audioFile) return setError('Selecione um arquivo de áudio para o novo upload.');

        setLoading(true);
        setSuccess(null);
        setError(null);

        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('categoria', categoria);
        formData.append('local', local);
        formData.append('data_evento', dataEvento);
        if (audioFile) formData.append('audio', audioFile);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}` 
                },
                onUploadProgress: (p: AxiosProgressEvent) => {
                    if (p.total) setUploadProgress(Math.round((p.loaded * 100) / p.total));
                },
            };

            if (editingId) {
                await axios.put(`${API_BASE_URL}/api/admin/radio-files/${editingId}`, formData, config);
                setSuccess('Arquivo atualizado com sucesso!');
            } else {
                await axios.post(`${API_BASE_URL}/api/admin/radio-upload`, formData, config);
                setSuccess('Áudio publicado com sucesso!');
            }

            resetForm();
            fetchFiles();
            setTimeout(() => setSuccess(null), 4000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao salvar arquivo na rádio.');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleEdit = (file: RadioFile) => {
        setEditingId(file.id);
        setTitulo(file.titulo);
        setCategoria(file.categoria);
        setLocal(file.local || '');
        setDataEvento(file.data_evento ? file.data_evento.split('T')[0] : '');
        setAudioFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const confirmDelete = async () => {
        if (!showDeleteConfirm) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/admin/radio-files/${showDeleteConfirm}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('Registro e arquivo físico removidos!');
            fetchFiles();
        } catch (err) {
            setError('Erro ao excluir arquivo.');
        } finally {
            setLoading(false);
            setShowDeleteConfirm(null);
        }
    };

    const resetForm = () => {
        setTitulo('');
        setCategoria('pregacoes');
        setLocal('');
        setDataEvento('');
        setAudioFile(null);
        setEditingId(null);
    };

    // Agrupamento visual para o título da seção
    const categoryNames: Record<string, string> = {
        musica: 'Músicas',
        pregacoes: 'Pregações',
        formacoes: 'Formações',
        vaticano: 'Vaticano'
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl border border-blue-500/30 shadow-2xl overflow-hidden">
                <div className="p-6 sm:p-10">
                    <div className="flex flex-col items-center mb-8">
                        <FaBroadcastTower className="text-blue-400 text-5xl mb-4 animate-pulse" />
                        <h1 className="text-3xl font-bold text-white text-center">
                            {editingId ? 'Editar Faixa' : 'Gerenciar Web Rádio'}
                        </h1>
                        <div className="h-1 w-24 bg-blue-500 rounded-full mt-2" />
                    </div>

                    <AnimatePresence>
                        {success && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-200 rounded-xl flex items-center gap-3">
                                <FaCheckCircle /> {success}
                            </motion.div>
                        )}
                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-200 rounded-xl flex items-center gap-3">
                                <FaExclamationTriangle /> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {loading && uploadProgress > 0 && (
                        <div className="mb-8 bg-black/40 p-4 rounded-2xl border border-white/10">
                            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                                <motion.div className="bg-gradient-to-r from-blue-400 to-blue-600 h-full" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} />
                            </div>
                            <p className="text-center text-blue-300 mt-3 font-bold text-sm">Enviando MP3: {uploadProgress}%</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-black text-blue-300 uppercase mb-2 tracking-widest">Título da Faixa *</label>
                            <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all" placeholder="Nome da pregação ou música" required />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-black text-blue-300 uppercase mb-2 tracking-widest">Categoria</label>
                            <select value={categoria} onChange={e => setCategoria(e.target.value as any)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500">
                                <option value="pregacoes">Pregações</option>
                                <option value="musica">Músicas</option>
                                <option value="formacoes">Formações</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-blue-300 uppercase mb-2 tracking-widest">Data do Evento</label>
                            <input type="date" value={dataEvento} onChange={e => setDataEvento(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-blue-300 uppercase mb-2 tracking-widest">Local / Evento</label>
                            <input type="text" value={local} onChange={e => setLocal(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500" placeholder="Ex: Aparecida - SP" />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-blue-300 uppercase mb-2 tracking-widest">Arquivo MP3 {editingId && '(opcional)'}</label>
                            <input type="file" accept="audio/mpeg" onChange={e => setAudioFile(e.target.files?.[0] || null)} className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer" />
                        </div>

                        <div className="md:col-span-2 flex gap-4 pt-4">
                            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black text-white transition-all shadow-xl flex items-center justify-center gap-3 disabled:bg-gray-700">
                                {loading ? <FaSpinner className="animate-spin text-xl" /> : editingId ? <FaEdit className="text-xl" /> : <FaUpload className="text-xl" />}
                                {editingId ? 'ATUALIZAR ARQUIVO' : 'PUBLICAR NA RÁDIO'}
                            </button>
                            {editingId && <button type="button" onClick={resetForm} className="px-8 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-white">CANCELAR</button>}
                        </div>
                    </form>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white border-l-4 border-blue-500 pl-4">Playlist Organizada</h2>
                            <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase">
                                <FaLayerGroup /> Categoria + Data
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {files.length > 0 ? (
                                files.map((file, index) => {
                                    // Lógica para mostrar o título da categoria apenas quando ela muda
                                    const showCategoryHeader = index === 0 || files[index - 1].categoria !== file.categoria;

                                    return (
                                        <React.Fragment key={file.id}>
                                            {showCategoryHeader && (
                                                <div className="mt-4 mb-2 px-2 py-1 bg-blue-500/10 border-b border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                                    {categoryNames[file.categoria]}
                                                </div>
                                            )}
                                            <div className="bg-black/30 border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-black/50 hover:border-blue-500/30 transition-all group">
                                                <div className="flex-1 text-center sm:text-left">
                                                    <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors">{file.titulo}</h3>
                                                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2 text-[10px] text-gray-400 uppercase font-black tracking-wider">
                                                        <span className="flex items-center gap-1.5"><FaMapMarkerAlt /> {file.local || 'Local não informado'}</span>
                                                        <span className="flex items-center gap-1.5"><FaCalendarAlt /> {file.data_evento ? new Date(file.data_evento).toLocaleDateString('pt-BR') : '--/--/----'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 shrink-0">
                                                    <button onClick={() => handleEdit(file)} className="p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all"><FaEdit /></button>
                                                    <button onClick={() => setShowDeleteConfirm(file.id)} className="p-3 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all"><FaTrash /></button>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 bg-black/20 rounded-2xl border border-dashed border-white/10">
                                    <p className="text-gray-500 italic">Nenhum arquivo de áudio encontrado.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-gray-900 border border-red-500/30 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl text-center">
                            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner animate-bounce"><FaTrash /></div>
                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Confirmar Exclusão</h3>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">Você está prestes a remover esta faixa. <br /><strong>O arquivo MP3 será deletado permanentemente do servidor.</strong></p>
                            <div className="flex gap-4">
                                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-4 bg-gray-800 text-white rounded-2xl font-black hover:bg-gray-700 transition-all text-xs uppercase">Voltar</button>
                                <button onClick={confirmDelete} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-500 transition-all shadow-lg shadow-red-600/30 text-xs uppercase">Sim, Excluir</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.6); }
            `}} />
        </motion.div>
    );
}