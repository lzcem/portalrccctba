import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaShareAlt } from 'react-icons/fa';

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  upload_date: string;
  views: number;
  thumbnail_url: string | null;
}

const VideoStandalone = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';
  const [searchParams] = useSearchParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasRegisteredView = useRef(false);

  useEffect(() => {
    const fetchVideo = async () => {
      const id = searchParams.get('id');
      if (!id) {
        setError('ID do vídeo não fornecido.');
        return;
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/api/videos/${id}`);
        setVideo(res.data);
      } catch (error) {
        setError('Erro ao buscar vídeo.');
        console.error('Erro ao buscar vídeo:', error);
      }
    };
    fetchVideo();
  }, [searchParams, API_BASE_URL]);

  useEffect(() => {
    const registerView = async () => {
      if (video && videoRef.current && !hasRegisteredView.current) {
        try {
          await axios.post(`${API_BASE_URL}/api/videos/${video.id}/views`);
          setVideo(prev => (prev ? { ...prev, views: prev.views + 1 } : null));
          hasRegisteredView.current = true;
        } catch (error) {
          console.error('Erro ao registrar visualização:', error);
        }
      }
    };

    const handlePlay = () => registerView();
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('play', handlePlay);
    }
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('play', handlePlay);
      }
    };
  }, [video, API_BASE_URL]);

  if (error || !video) {
    return (
      <div className="bg-gray-50 text-gray-600 p-8 text-center min-h-screen flex items-center justify-center" aria-live="polite">
        {error || 'Erro ao carregar vídeo.'}
      </div>
    );
  }

  const videoSrc = video.video_url;
  const thumbnailSrc = video.thumbnail_url || '';
  const uploadDate = new Date(video.upload_date).toLocaleDateString('pt-BR');
  const viewsText = `${video.views} visualizações`;
  const currentUrl = `${window.location.origin}/video?id=${video.id}`;

  const handleShare = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      if (navigator.share) {
        navigator.share({
          title: video.title,
          url: currentUrl,
        }).catch(console.error);
      }
    });
  };

  const handleThumbnailClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className=" min-h-screen">
      <header className="fixed top-0 left-0 w-full bg-gray-800 text-white shadow-md z-10 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <h1 className="text-lg sm:text-xl font-bold font-roboto">
          PLATAFORMA DE CADASTRO - TREINAMENTO
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleShare}
            aria-label="Compartilhar vídeo"
            className="text-gray-200 hover:text-blue-400 focus:outline-none"
          >
            <FaShareAlt size={20} />
          </button>
        </div>
      </header>
      <main className="max-w-[1080px] mx-auto pt-1 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <video
            ref={videoRef}
            controls
            className="w-full aspect-video rounded-lg shadow-md"
            onError={(e) => {
              console.error('Erro ao carregar vídeo:', e.nativeEvent);
              setError('Erro ao carregar o vídeo. Verifique o formato ou a disponibilidade.');
            }}
          >
            <source src={videoSrc} type="video/mp4" />
            Seu navegador não suporta vídeo.
          </video>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 font-roboto mb-3">{video.title}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <span className="text-gray-900 font-medium">{viewsText}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-900">{uploadDate}</span>
            </div>
            <button
              onClick={handleShare}
              aria-label="Compartilhar vídeo"
              className="text-blue-600 hover:text-blue-800 focus:outline-none flex items-center space-x-2"
            >
              <FaShareAlt size={18} />
              <span className="text-sm font-medium">Compartilhar</span>
            </button>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-base text-gray-900 font-roboto leading-6 whitespace-pre-wrap">{video.description}</p>
          </div>
          {thumbnailSrc && (
            <img
              src={thumbnailSrc}
              alt="Thumbnail"
              className="w-32 sm:w-40 rounded-md cursor-pointer mt-4"
              onClick={handleThumbnailClick}
              onError={(e) => console.error('Erro ao carregar miniatura:', e.nativeEvent)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default VideoStandalone;