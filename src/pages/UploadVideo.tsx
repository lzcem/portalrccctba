import { useState } from 'react';
import axios from 'axios';

const UploadVideo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video || !title) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('thumbnail', thumbnail || '');
    formData.append('video', video);

    try {
      setUploading(true);
      setProgress(0);

      await axios.post(`${API_BASE_URL}/api/videos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        }
      });

      alert('Vídeo enviado com sucesso!');
      setTitle('');
      setDescription('');
      setThumbnail(null);
      setVideo(null);
      setProgress(0);
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar vídeo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Upload de Vídeo</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título do vídeo"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição"
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
          required
        />

        {uploading && (
          <div className="w-full bg-gray-300 rounded h-4 overflow-hidden">
            <div
              className="bg-blue-600 h-4 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          disabled={uploading}
        >
          {uploading ? `Enviando... ${progress}%` : 'Enviar'}
        </button>
      </form>
    </div>
  );
};

export default UploadVideo;
