import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaShareAlt } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

interface Video {
    id: number;
    title: string;
    description: string;
    video_url: string;
    thumbnail_url: string;
    upload_date: string;
    views: number;
}

const VideoPlayer = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';
    const [videos, setVideos] = useState<Video[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [shareLink, setShareLink] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/videos`);
                const allVideos: Video[] = res.data;
                setVideos(allVideos);

                const idFromUrl = searchParams.get('id');
                const videoFromUrl = idFromUrl
                    ? allVideos.find(v => v.id === parseInt(idFromUrl))
                    : allVideos[0];

                setSelectedVideo(videoFromUrl || allVideos[0]);
            } catch (error) {
                console.error('Erro ao buscar vídeos:', error);
            }
        };
        fetchVideos();
    }, [searchParams]);

    const handleShare = (video: Video) => {
        const url = `${window.location.origin}/videos?id=${video.id}`;

        if (navigator.share) {
            navigator.share({
                title: video.title,
                text: `Assista esse vídeo: ${video.title}`,
                url,
            }).catch((error) => {
                console.error('Erro ao compartilhar:', error);
                setShareLink(url);
            });
        } else {
            setShareLink(url);
        }
    };

    const closeShareModal = () => {
        setShareLink(null);
    };

    if (!selectedVideo) return <p className="text-center text-white">Carregando vídeo...</p>;

    return (
        <div className="bg-green-950 min-h-screen text-white px-4 py-6">
            <div className="max-w-5xl mx-auto">
                {/* Player */}
                <video controls className="w-full rounded-lg shadow-lg mb-4">
                    <source src={selectedVideo.video_url} type="video/mp4" />
                    Seu navegador não suporta o elemento de vídeo.
                </video>

                {/* Título, data, views, botão de compartilhar */}
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span>📅 {new Date(selectedVideo.upload_date).toLocaleDateString('pt-BR')}</span>
                        <span>👁️ {selectedVideo.views} visualizações</span>
                        <button
                            onClick={() => handleShare(selectedVideo)}
                            aria-label="Compartilhar vídeo"
                            className="hover:text-green-300 transition"
                        >
                            <FaShareAlt size={20} />
                        </button>
                    </div>
                </div>

                {/* Descrição */}
                <p className="mb-6 text-gray-200">{selectedVideo.description}</p>

                {/* Miniaturas */}
                <h3 className="text-xl font-semibold mb-3">Mais vídeos</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {videos
                        .filter((v) => v.id !== selectedVideo.id)
                        .map((video) => (
                            <div
                                key={video.id}
                                className="cursor-pointer bg-green-800 p-2 rounded-md hover:bg-green-700 transition relative"
                                onClick={() => setSelectedVideo(video)}
                            >
                                <img
                                    src={video.thumbnail_url}
                                    alt={video.title}
                                    className="w-full h-32 object-cover rounded-md mb-2"
                                />
                                <h4 className="font-semibold text-white text-sm mb-1">{video.title}</h4>
                                <p className="text-xs text-gray-300">
                                    📅 {new Date(video.upload_date).toLocaleDateString('pt-BR')} | 👁️ {video.views}
                                </p>
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleShare(video);
                                    }}
                                    aria-label="Compartilhar vídeo"
                                    className="absolute top-2 right-2 text-gray-300 hover:text-green-300 transition"
                                >
                                    <FaShareAlt size={16} />
                                </button>
                            </div>
                        ))}
                </div>
            </div>

            {/* Modal fallback para compartilhar */}
            {shareLink && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                    onClick={closeShareModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="share-dialog-title"
                >
                    <div
                        className="bg-green-900 p-6 rounded-md max-w-md w-full relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 id="share-dialog-title" className="text-white text-xl mb-4 font-semibold">
                            Compartilhar vídeo
                        </h2>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(shareLink)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-green-400 underline break-all bg-green-800 p-3 rounded text-center font-medium hover:text-green-300 transition"
                        >
                            {shareLink}
                        </a>
                        <p className="text-gray-300 mt-2 text-sm">Toque no link para compartilhar no WhatsApp ou copiar.</p>

                        <button
                            onClick={closeShareModal}
                            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            aria-label="Fechar modal de compartilhamento"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;