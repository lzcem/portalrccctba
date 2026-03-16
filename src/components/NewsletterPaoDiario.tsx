import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaBreadSlice, FaPaperPlane, FaExclamationCircle, FaTimes, FaDove } from 'react-icons/fa';

interface NewsletterProps {
  onSuccess: () => void;
}

const NewsletterPaoDiario: React.FC<NewsletterProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [mensagemLocal, setMensagemLocal] = useState<{ texto: string; tipo: 'erro' | 'info' } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemLocal(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/newsletter/inscrever`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contato: email, tipo: 'email' }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmail('');
        onSuccess();
      } else if (response.status === 409) {
        setMensagemLocal({ texto: data.message || "E-mail já cadastrado.", tipo: 'info' });
      } else {
        throw new Error();
      }
    } catch (err) {
      setMensagemLocal({ texto: "Ops! Tente novamente mais tarde.", tipo: 'erro' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2rem] shadow-2xl border border-orange-100 overflow-hidden flex flex-col relative"
    >
      {/* Marca d'água espiritual */}
      <FaDove className="absolute -right-4 top-16 text-orange-50/60 text-8xl -rotate-12 pointer-events-none" />

      {/* Header Estilizado */}
      <header className="bg-gradient-to-r from-blue-2900 to-blue-500 p-5 flex items-center gap-3 shadow-md relative z-10">
        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
          <FaBreadSlice className="text-white text-lg" />
        </div>
        <div>
          <h2 className="text-white font-serif font-black uppercase text-sm tracking-widest leading-none">Newsletter</h2>
          <p className="text-orange-100 text-[9px] font-bold uppercase tracking-tighter opacity-80">Conexão RCC Curitiba</p>
        </div>
      </header>

      <div className="p-6 flex flex-col relative z-10">
        <p className="text-red-500 text-[12px] leading-relaxed mb-5 font-medium italic text-center px-2">
          "A fé vem pelo ouvir." Receba o Pão Diário e as notícias semanais no seu e-mail.
        </p>

        <form onSubmit={handleSubscribe} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <FaEnvelope size={12} />
            </div>
            <input
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-700 placeholder-slate-400 transition-all outline-none"
            />
          </div>

          {/* Mensagem de Feedback */}
          <AnimatePresence>
            {mensagemLocal && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className={`relative overflow-hidden rounded-xl p-3 border flex items-start gap-3 ${
                  mensagemLocal.tipo === 'erro' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-blue-50 border-blue-100 text-blue-600'
                }`}
              >
                <FaExclamationCircle className="mt-0.5 shrink-0" size={12} />
                <p className="text-[10px] font-bold leading-tight flex-1">{mensagemLocal.texto}</p>
                <button type="button" onClick={() => setMensagemLocal(null)} className="opacity-40 hover:opacity-100">
                  <FaTimes size={10} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-slate-800 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-2 group"
          >
            Cadastrar E-mail
            <FaPaperPlane className="text-orange-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={10} />
          </motion.button>
        </form>
      </div>

      {/* Footer Oracional */}
      <footer className="mt-auto relative">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
        <div className="bg-orange-50/50 py-3 px-6 text-center text-orange-600">
          <motion.p 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-[10px] font-black uppercase tracking-[0.4em]"
          >
            Vinde Espírito Santo
          </motion.p>
        </div>
      </footer>
    </motion.div>
  );
};

export default NewsletterPaoDiario;