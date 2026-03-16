import { useState, useEffect } from 'react';
import YouTubePlayer from 'react-player/youtube';
import { motion } from 'framer-motion';

interface Snippet {
  title: string;
  description: string;
  videoId?: string;
  thumbnailUrl?: string;
  thumbnails?: {
    medium: {
      url: string;
    };
  };
}

interface Video {
  id: string;
  snippet: Snippet;
  type: string;
}

interface Playlist {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

interface YouTubeSearchResponse {
  kind: string;
  items: {
    id: {
      kind: string;
      channelId: string;
    };
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        medium: {
          url: string;
        };
      };
    };
  }[];
}

interface YouTubePlaylistResponse {
  items: {
    id: string;
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        medium: {
          url: string;
        };
      };
    };
  }[];
  nextPageToken?: string;
}

interface YouTubeVideoResponse {
  items: {
    id: string;
    snippet: {
      title: string;
      description: string;
      resourceId: {
        videoId: string;
      };
      thumbnails: {
        medium: {
          url: string;
        };
      };
    };
  }[];
  nextPageToken?: string;
}

const API_KEY = 'AIzaSyBfW_ojnnALgEFrzCgYe-DK_ap19DsVdhc';
const MAX_RESULTS = 50;

const extractType = (title: string): string => {
  const match = title.match(/^(\w+):/);
  return match ? match[1] : 'Outros';
};

export default function CanalYoutube() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
  const [selectedPlaylistTitle, setSelectedPlaylistTitle] = useState<string>('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Buscar CHANNEL_ID e playlists com vídeos
  useEffect(() => {
    const fetchChannelId = async () => {
      try {
        const url: string = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=RCCCURITIBA&key=${API_KEY}`;
        const response: Response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `Erro ${response.status}`);
        }
        const data: YouTubeSearchResponse = await response.json();
        const channelId = data.items[0]?.id?.channelId;
        if (!channelId) {
          throw new Error('Canal não encontrado.');
        }
        const playlistUrl: string = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${channelId}&maxResults=50&key=${API_KEY}`;
        const playlistResponse: Response = await fetch(playlistUrl);
        if (!playlistResponse.ok) {
          const errorData = await playlistResponse.json();
          throw new Error(errorData.error?.message || `Erro ${playlistResponse.status}`);
        }
        const playlistData: YouTubePlaylistResponse = await playlistResponse.json();
        if (playlistData.items.length === 0) {
          setError('Nenhuma playlist pública encontrada para o canal.');
          return;
        }

        // Filtrar playlists com vídeos
        const playlistList: Playlist[] = [];
        for (const item of playlistData.items) {
          const videoCheckUrl: string = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${item.id}&maxResults=1&key=${API_KEY}`;
          const videoResponse: Response = await fetch(videoCheckUrl);
          if (!videoResponse.ok) {
            continue;
          }
          const videoData: YouTubeVideoResponse = await videoResponse.json();
          if (videoData.items.length > 0) {
            playlistList.push({
              id: item.id,
              snippet: {
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnails: {
                  medium: {
                    url: item.snippet.thumbnails.medium.url || '',
                  },
                },
              },
            });
          }
        }

        if (playlistList.length === 0) {
          setError('Nenhuma playlist com vídeos encontrada.');
          return;
        }

        const sortedPlaylists = playlistList.sort((a, b) => a.snippet.title.localeCompare(b.snippet.title));
        setPlaylists(sortedPlaylists);
        // Definir playlist padrão
        setSelectedPlaylistId(sortedPlaylists[0]?.id || '');
        setSelectedPlaylistTitle(sortedPlaylists[0]?.snippet.title || '');
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(`Não foi possível carregar as playlists: ${errorMessage}`);
        console.error('Erro:', err);
      }
    };
    fetchChannelId();
  }, []);

  // Buscar vídeos da playlist selecionada
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setVideos([]);
      setSelectedVideoId(null);
      let allVideos: Video[] = [];
      let nextPageToken: string | null = null;

      try {
        do {
          const url: string = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${MAX_RESULTS}&playlistId=${selectedPlaylistId}&key=${API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
          const response: Response = await fetch(url);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `Erro ${response.status}: Falha na API`);
          }
          const data: YouTubeVideoResponse = await response.json();
          const videoList: Video[] = data.items.map((item) => ({
            id: item.id,
            snippet: {
              title: item.snippet.title,
              description: item.snippet.description,
              videoId: item.snippet.resourceId.videoId,
              thumbnailUrl: item.snippet.thumbnails.medium.url || '',
            },
            type: extractType(item.snippet.title),
          }));
          allVideos = [...allVideos, ...videoList];
          nextPageToken = data.nextPageToken || null;
        } while (nextPageToken);
        setVideos(allVideos);
        setError(null); // Limpar erro ao carregar vídeos com sucesso
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar vídeos';
        setError(`Não foi possível carregar os vídeos: ${errorMessage}`);
        console.error('Erro ao carregar vídeos:', err);
      } finally {
        setLoading(false);
      }
    };
    if (selectedPlaylistId) {
      fetchVideos();
    }
  }, [selectedPlaylistId]);

  const groupedVideos = videos.reduce((acc, video) => {
    acc[video.type] = acc[video.type] || [];
    acc[video.type].push(video);
    return acc;
  }, {} as Record<string, Video[]>);

  const handlePlaylistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPlaylistId = e.target.value;
    setSelectedPlaylistId(newPlaylistId);
    const selectedPlaylist = playlists.find((p) => p.id === newPlaylistId);
    setSelectedPlaylistTitle(selectedPlaylist?.snippet.title || '');
  };

  const handleVideoClick = (videoId: string | null) => {
    setSelectedVideoId(videoId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-green-900 flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8">
      <section className="max-w-4xl w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-6 font-semibold bg-gradient-to-r from-green-600 to-blue-950 sm:text-transparent bg-clip-text">
          Nosso Canal no YouTube
        </h1>
        <div className="mb-6">
          <label htmlFor="playlist-select" className="block text-sm font-medium text-gray-200 mb-2">
            Escolha uma Playlist
          </label>
          <select
            id="playlist-select"
            value={selectedPlaylistId}
            onChange={handlePlaylistChange}
            className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600 sm:text-sm max-h-[20rem] overflow-y-auto"
            disabled={playlists.length === 0}
          >
            {playlists.length === 0 ? (
              <option value="">Nenhuma playlist disponível</option>
            ) : (
              playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.snippet.title}
                </option>
              ))
            )}
          </select>
        </div>
        {error && (
          <p className="text-red-500 text-center text-sm sm:text-base mb-6">{error}</p>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-12 h-12 border-4 border-t-green-500 border-blue-950 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {selectedVideoId && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 border-4 border-gradient-to-r from-green-500 to-blue-500 rounded-lg p-2 bg-gradient-to-br from-green-100/10 to-blue-100/10 shadow-lg"
              >
                <YouTubePlayer
                  url={`https://www.youtube.com/watch?v=${selectedVideoId}`}
                  controls
                  width="100%"
                  height="360px"
                  className="rounded-lg"
                  playing={true}
                />
              </motion.div>
            )}
            {Object.keys(groupedVideos).length === 0 && !error ? (
              <p className="text-gray-200 text-center text-sm sm:text-base">
                Nenhum vídeo encontrado na playlist.
              </p>
            ) : (
              Object.keys(groupedVideos).map((type) => (
                <div key={type} className="mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-4 font-serif">
                    {selectedPlaylistTitle}
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedVideos[type].map((video) => (
                      <motion.li
                        key={video.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white/95 backdrop-blur-md rounded-lg shadow-xl p-4 cursor-pointer"
                        onClick={() => handleVideoClick(video.snippet.videoId ?? null)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleVideoClick(video.snippet.videoId ?? null)}
                      >
                        <img
                          src={video.snippet.thumbnailUrl}
                          alt={video.snippet.title}
                          className="w-full h-40 object-cover rounded-md mb-2"
                        />
                        <h4 className="text-sm sm:text-base font-semibold text-blue-950 line-clamp-2">
                          {video.snippet.title.replace(/^(\w+):/, '').trim()}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">
                          {video.snippet.description || 'Sem descrição'}
                        </p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </>
        )}
      </section>
    </div>
  );
}