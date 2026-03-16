// src/pages/admin/VideoUpload.tsx (crie esse arquivo)

import React, { useState } from 'react';
import axios from 'axios';

export default function VideoUpload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (video) formData.append('video', video);
    if (thumbnail) formData.append('thumbnail', thumbnail);

    try {
      const response = await axios.post('/api/admin/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccess('Vídeo carregado com sucesso!');
      setTitle('');
      setDescription('');
      setVideo(null);
      setThumbnail(null);
    } catch (err) {
      setError('Erro ao carregar vídeo. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Carregar Vídeo</h1>
      {error && <div className="text-center text-red-500 p-4">{error}</div>}
      {success && <div className="text-center text-green-500 p-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            required
          />
        </div>
        <div>
          <label htmlFor="video" className="block text-sm font-medium text-gray-700">
            Vídeo
          </label>
          <input
            id="video"
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
            Thumbnail (capa)
          </label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Carregando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}