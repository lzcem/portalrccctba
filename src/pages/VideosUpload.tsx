// src/pages/admin/VideosUpload.tsx
import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import axios, { AxiosProgressEvent } from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaSpinner, FaEye, FaPlayCircle } from 'react-icons/fa';

interface Video {
    id: number;
    titulo: string;
    descricao: string;
    video_url: string;
    thumbnail_url: string | null;
    uploaded_at: string;
    views: number;
    is_featured?: boolean;
}

export default function VideosUpload() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0); // Novo: progresso 0-100

    // Estados do formulário
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Modal de confirmação de exclusão
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) throw new Error('Token não encontrado. Faça login como admin.');

            const res = await axios.get(`${API_BASE_URL}/api/noticias-videos`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setVideos(res.data || []);
        } catch (err: any) {
            setError(err.message || 'Não foi possível carregar os vídeos.');
        } finally {
            setLoading(false);
            setUploadProgress(0); // Reset ao final
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validações (igual)
        if (!titulo.trim() || !descricao.trim()) {
            setError('Título e descrição são obrigatórios.');
            return;
        }

        if (!editingId && !videoFile) {
            setError('Selecione um arquivo de vídeo para novo upload.');
            return;
        }

        if (videoFile && videoFile.size > 2 * 1024 * 1024 * 1024) {
            setError('O arquivo de vídeo é muito grande. Limite máximo: 2GB.');
            return;
        }

        if (thumbnailFile && thumbnailFile.size > 10 * 1024 * 1024) {
            setError('A thumbnail é muito grande. Limite máximo: 10MB.');
            return;
        }

        setLoading(true);
        setSuccess(null);
        setError(null);
        setUploadProgress(0); // Reset progresso

        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('descricao', descricao);
        if (videoFile) formData.append('video', videoFile);
        if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    }
                },
            };

            if (editingId) {
                await axios.put(`${API_BASE_URL}/api/admin/videos/${editingId}`, formData, config);
                setSuccess('Vídeo atualizado!');
            } else {
                await axios.post(`${API_BASE_URL}/api/admin/videos`, formData, config);
                setSuccess('Vídeo publicado!');
            }

            resetForm();
            fetchVideos();
            setTimeout(() => setSuccess(null), 4000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao salvar vídeo.');
        } finally {
            setLoading(false);
            setUploadProgress(0); // Reset ao final
        }
    };

    const handleEdit = (video: Video) => {
        setEditingId(video.id);
        setTitulo(video.titulo);
        setDescricao(video.descricao);
        setVideoFile(null);
        setThumbnailFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id: number) => {
        setShowDeleteConfirm(id);
    };

    const confirmDelete = async () => {
        if (!showDeleteConfirm) return;

        const id = showDeleteConfirm;

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/admin/videos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuccess('Vídeo e arquivos excluídos!');
            fetchVideos();
            setTimeout(() => setSuccess(null), 4000);
        } catch (err: any) {
            setError('Erro ao excluir vídeo.');
        } finally {
            setLoading(false);
            setShowDeleteConfirm(null);
        }
    };

    const resetForm = () => {
        setTitulo('');
        setDescricao('');
        setVideoFile(null);
        setThumbnailFile(null);
        setEditingId(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-blue-950 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-green-500/30 overflow-hidden">
                <div className="px-6 py-8 sm:p-10">
                    <h1 className="text-3xl font-bold text-center text-white mb-2">
                        {editingId ? 'Editar Vídeo' : 'Upload de Vídeo'}
                    </h1>
                    <p className="text-center text-green-200 mb-8">
                        {editingId ? 'Atualize as informações do vídeo selecionado' : 'Publique notícias em vídeo para a página inicial'}
                    </p>

                    {success && (
                        <div className="mb-6 p-4 bg-green-800/60 border border-green-500 text-green-100 rounded-lg text-center">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-800/60 border border-red-500 text-red-100 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {/* BARRA DE PROGRESSO */}
                    {loading && uploadProgress > 0 && (
                        <div className="mb-8">
                            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                                <motion.div
                                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress}%` }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                />
                            </div>
                            <p className="text-center text-green-300 mt-2 font-medium">
                                Enviando vídeo... {uploadProgress}% concluído
                            </p>
                        </div>
                    )}

                    {/* Formulário sempre visível */}
                    <form onSubmit={handleSubmit} className="space-y-6 mb-12">
                        <div>
                            <label htmlFor="titulo" className="block text-sm font-medium text-green-200 mb-1">
                                Título do vídeo *
                            </label>
                            <input
                                id="titulo"
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800/60 border border-green-600/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Ex: Liderança Visionária"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="descricao" className="block text-sm font-medium text-green-200 mb-1">
                                Descrição *
                            </label>
                            <textarea
                                id="descricao"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-800/60 border border-green-600/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Resumo ou texto que aparece abaixo do vídeo..."
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="video" className="block text-sm font-medium text-green-200 mb-1">
                                {editingId ? 'Substituir vídeo (opcional)' : 'Arquivo de vídeo *'}
                            </label>
                            <input
                                id="video"
                                type="file"
                                accept="video/mp4,video/webm,video/quicktime"
                                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-3 bg-gray-800/60 border border-green-600/40 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600/40 file:text-white hover:file:bg-green-500/60 transition"
                                {...(!editingId && { required: true })}
                            />
                        </div>

                        <div>
                            <label htmlFor="thumbnail" className="block text-sm font-medium text-green-200 mb-1">
                                Thumbnail (opcional)
                            </label>
                            <input
                                id="thumbnail"
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-3 bg-gray-800/60 border border-green-600/40 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600/40 file:text-white hover:file:bg-green-500/60 transition"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 py-3 px-6 rounded-lg font-bold text-white transition-all shadow-lg ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-xl'
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <FaSpinner className="animate-spin h-5 w-5 mr-3" />
                                        {uploadProgress > 0 ? `Enviando ${uploadProgress}%` : 'Processando...'}
                                    </span>
                                ) : editingId ? (
                                    'Salvar Alterações'
                                ) : (
                                    'Publicar Vídeo'
                                )}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 py-3 px-6 rounded-lg font-bold text-white bg-gray-600 hover:bg-gray-700 transition shadow-lg"
                                >
                                    Cancelar Edição
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Lista de vídeos */}
                    <h2 className="text-2xl font-bold text-white mb-6 text-center border-b border-green-500/30 pb-3">
                        Vídeos Publicados
                    </h2>

                    {loading && videos.length === 0 ? (
                        <div className="text-center py-10">
                            <FaSpinner className="animate-spin h-8 w-8 mx-auto text-green-400 mb-4" />
                            <p className="text-gray-300">Carregando vídeos...</p>
                        </div>
                    ) : videos.length === 0 ? (
                        <p className="text-center text-gray-400 py-10">Nenhum vídeo publicado ainda.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map((video) => (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gray-800/70 rounded-xl overflow-hidden shadow-lg border border-green-700/30 hover:border-green-500/60 transition-all"
                                >
                                    <div className="relative aspect-video">
                                        <img
                                            src={video.thumbnail_url || '/assets/placeholder-video.jpg'}
                                            alt={video.titulo}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <FaPlayCircle className="text-red-500 text-5xl opacity-80" />
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                                            {video.titulo}
                                        </h3>
                                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                                            {video.descricao}
                                        </p>
                                        <div className="flex justify-between text-xs text-gray-400 mb-4">
                                            <span>{new Date(video.uploaded_at).toLocaleDateString('pt-BR')}</span>
                                            <span className="flex items-center gap-1">
                                                <FaEye className="text-green-400" /> {video.views}
                                            </span>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEdit(video)}
                                                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center gap-2"
                                            >
                                                <FaEdit /> Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(video.id)}
                                                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center justify-center gap-2"
                                            >
                                                <FaTrash /> Excluir
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Modal de confirmação */}
                    <AnimatePresence>
                        {showDeleteConfirm !== null && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                                onClick={() => setShowDeleteConfirm(null)}
                            >
                                <motion.div
                                    initial={{ scale: 0.8, y: 50 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.8, y: 50 }}
                                    className="bg-gray-900 border border-red-600/50 rounded-2xl p-8 max-w-md w-full shadow-2xl relative text-white"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <h3 className="text-2xl font-bold text-red-400 mb-4 text-center">
                                        Confirmar Exclusão
                                    </h3>
                                    <p className="text-gray-300 text-center mb-8">
                                        Tem certeza que deseja excluir este vídeo permanentemente?
                                        <br />
                                        <strong>Esta ação removerá também os arquivos do servidor e não pode ser desfeita.</strong>
                                    </p>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setShowDeleteConfirm(null)}
                                            className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium"
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            onClick={confirmDelete}
                                            disabled={loading}
                                            className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all shadow-lg ${loading ? 'bg-red-900 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 hover:shadow-xl'
                                                }`}
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center">
                                                    <FaSpinner className="animate-spin h-5 w-5 mr-3" />
                                                    Excluindo...
                                                </span>
                                            ) : (
                                                'Excluir Definitivamente'
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}