import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PedidoOracao: React.FC = () => {
  const [formData, setFormData] = useState({ nome: '', cidade: '', email: '', mensagem: '' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      const response = await fetch(`${API_BASE_URL}/api/pedido-oracao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });


      const result = await response.json();
      if (response.ok) {
        setMessage('Pedido enviado com sucesso! 🙏');
        setIsSuccess(true);
        setFormData({ nome: '', cidade: '', email: '', mensagem: '' });
      } else {
        setMessage(`Erro: ${result.error}`);
        setIsSuccess(false);
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erro ao enviar o formulário.');
      setIsSuccess(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-950 to-green-900 text-white py-16"
    >
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-gradient-to-br from-blue-900 to-green-600 bg-opacity-90 backdrop-blur-md rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-sans font-bold text-white text-center mb-2">🙏 Pedidos de Oração</h1>
          <p className="text-gray-200 text-center text-sm font-serif italic mb-6">
            Compartilhe suas intenções. Oramos com você.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-sans font-medium text-white mb-1">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-blue-950/50 border border-blue-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 placeholder-gray-400 transition"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label htmlFor="cidade" className="block text-sm font-sans font-medium text-white mb-1">Cidade</label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-blue-950/50 border border-blue-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 placeholder-gray-400 transition"
                placeholder="Sua cidade"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-sans font-medium text-white mb-1">E-mail (opcional)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-blue-950/50 border border-blue-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 placeholder-gray-400 transition"
                placeholder="Seu e-mail"
              />
            </div>
            <div>
              <label htmlFor="mensagem" className="block text-sm font-sans font-medium text-white mb-1">Pedido de Oração</label>
              <textarea
                id="mensagem"
                name="mensagem"
                value={formData.mensagem}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-blue-950/50 border border-blue-300 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 placeholder-gray-400 transition h-24 resize-none"
                placeholder="Escreva seu pedido"
              />
            </div>
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-800 to-green-700 text-white py-2 rounded-lg font-sans font-semibold flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-900 hover:to-green-600 transition shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Enviar Pedido
            </motion.button>
          </form>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 p-3 rounded-lg text-center font-sans text-sm ${isSuccess ? 'bg-green-300 text-blue-950' : 'bg-red-300 text-red-950'}`}
            >
              {message}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PedidoOracao;