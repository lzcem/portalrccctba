import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  upload_date: string;
  views: number;
}

const VideoGallery = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/videos`);
        setVideos(res.data);
      } catch (error) {
        console.error('Erro ao buscar vídeos:', error);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Galeria de Vídeos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Link
            to={`/video/${video.id}`}
            key={video.id}
            className="bg-white shadow-md rounded-md overflow-hidden hover:shadow-xl transition duration-300"
          >
            <img
              src={`${API_BASE_URL}${video.thumbnail_url}`}
              alt={video.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1">{video.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(video.upload_date).toLocaleDateString('pt-BR')} · {video.views} visualizações
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
