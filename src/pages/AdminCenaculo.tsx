// src/pages/AdminCenaculo.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import '@/assets/quill-snow.css';
import {
    FaEdit,
    FaTrash,
    FaSpinner,
    FaSave,
    FaFire,
    FaCheckCircle,
    FaExclamationTriangle,
    FaQuoteLeft
} from 'react-icons/fa';

interface CenaculoData {
    id: number;
    versiculo: string;
    referencia: string;
    desafio: string;
    data_exibicao: string;
}

export default function AdminCenaculo() {
    const [entries, setEntries] = useState<CenaculoData[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [versiculo, setVersiculo] = useState('');
    const [referencia, setReferencia] = useState('');
    const [desafio, setDesafio] = useState('');
    const [dataExibicao, setDataExibicao] = useState(new Date().toISOString().split('T')[0]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/admin/cenaculo`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEntries(res.data || []);
        } catch (err) {
            setError('Não foi possível carregar a lista do Cenáculo.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!versiculo.trim() || !desafio.trim()) return setError('Preencha os campos obrigatórios.');

        setLoading(true);
        setSuccess(null);
        setError(null);

        const payload = { versiculo, referencia, desafio, data_exibicao: dataExibicao };
        const token = localStorage.getItem('token');

        try {
            if (editingId) {
                // MODO EDIÇÃO (PUT)
                await axios.put(`${API_BASE_URL}/api/admin/cenaculo/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccess('✅ Alterações salvas com sucesso!');
            } else {
                // MODO NOVO (POST)
                await axios.post(`${API_BASE_URL}/api/admin/cenaculo`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccess('✅ Desafio agendado com sucesso!');
            }

            resetForm();
            fetchEntries();
            setTimeout(() => setSuccess(null), 4000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao processar requisição.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (entry: CenaculoData) => {
        setEditingId(entry.id);
        setVersiculo(entry.versiculo);
        setReferencia(entry.referencia);
        setDesafio(entry.desafio);
        setDataExibicao(entry.data_exibicao.split('T')[0]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const confirmDelete = async () => {
        if (!showDeleteConfirm) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/admin/cenaculo/${showDeleteConfirm}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('Registro removido com sucesso.');
            fetchEntries();
        } catch (err) {
            setError('Erro ao excluir registro.');
        } finally {
            setLoading(false);
            setShowDeleteConfirm(null);
        }
    };

    const resetForm = () => {
        setVersiculo('');
        setReferencia('');
        setDesafio('');
        setDataExibicao(new Date().toISOString().split('T')[0]);
        setEditingId(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden">
                <div className="p-6 sm:p-10">
                    <div className="flex flex-col items-center mb-8">
                        <FaFire className="text-amber-400 text-5xl mb-4 animate-pulse" />
                        <h1 className="text-3xl font-bold text-white text-center">
                            {editingId ? 'Editar Cenáculo' : 'Gerenciar Cenáculo Diário'}
                        </h1>
                        <div className="h-1 w-24 bg-amber-500 rounded-full mt-2" />
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

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner">
                        <div>
                            <label className="block text-xs font-black text-amber-300 uppercase mb-2 tracking-widest">Data de Exibição *</label>
                            <input type="date" value={dataExibicao} onChange={e => setDataExibicao(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-amber-500 outline-none transition-all" required />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-amber-300 uppercase mb-2 tracking-widest">Referência Bíblica</label>
                            <input type="text" value={referencia} onChange={e => setReferencia(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-amber-500 outline-none transition-all" placeholder="Ex: Lucas 1, 30" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-black text-amber-300 uppercase mb-2 tracking-widest">Palavra Rhema (Versículo) *</label>
                            <textarea rows={3} value={versiculo} onChange={e => setVersiculo(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-amber-500 outline-none transition-all" placeholder="Texto bíblico do dia..." required />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-black text-amber-300 uppercase mb-2 tracking-widest">Desafio Prático (Passo de Fé) *</label>
                            <textarea rows={3} value={desafio} onChange={e => setDesafio(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-amber-500 outline-none transition-all" placeholder="O que o fiel deve fazer hoje?" required />
                        </div>

                        <div className="md:col-span-2 flex gap-4 pt-4">
                            <button type="submit" disabled={loading} className="flex-1 bg-amber-600 hover:bg-amber-500 py-4 rounded-xl font-black text-white transition-all shadow-xl flex items-center justify-center gap-3 disabled:bg-gray-700">
                                {loading ? <FaSpinner className="animate-spin text-xl" /> : <FaSave className="text-xl" />}
                                {editingId ? 'SALVAR ALTERAÇÕES' : 'AGENDAR CENÁCULO'}
                            </button>
                            {editingId && <button type="button" onClick={resetForm} className="px-8 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-white">CANCELAR</button>}
                        </div>
                    </form>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white border-l-4 border-amber-500 pl-4 mb-6">Playlist de Desafios</h2>
                        <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {entries.map((entry) => (
                                <div key={entry.id} className="bg-black/30 border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start gap-4 hover:bg-black/50 transition-all">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black px-2 py-1 rounded">
                                                {new Date(entry.data_exibicao).toLocaleDateString('pt-BR')}
                                            </span>
                                            <span className="text-gray-500 text-xs font-bold uppercase">{entry.referencia}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <FaQuoteLeft className="text-amber-500/30 shrink-0 mt-1" /> {/* <--- Ícone sendo usado aqui */}
                                            <p className="text-sm text-gray-300 italic mb-2">"{entry.versiculo}"</p>
                                        </div>
                                        <p className="text-xs text-white bg-white/5 p-3 rounded-lg"><span className="text-amber-400 font-black">DESAFIO:</span> {entry.desafio}</p>
                                    </div>
                                    <div className="flex sm:flex-col gap-3">
                                        <button onClick={() => handleEdit(entry)} className="p-3 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all"><FaEdit /></button>
                                        <button onClick={() => setShowDeleteConfirm(entry.id)} className="p-3 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all"><FaTrash /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Deletar (Similiar ao AdminRadio) */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-gray-900 border border-red-500/30 p-8 rounded-[2.5rem] max-w-sm w-full text-center">
                            <FaTrash className="text-red-500 text-4xl mx-auto mb-4" />
                            <h3 className="text-white font-black uppercase mb-4">Excluir desafio?</h3>
                            <div className="flex gap-4">
                                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-bold">Voltar</button>
                                <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Excluir</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}