import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaWhatsapp, FaCalendarDay, FaDove, FaLightbulb, FaBookOpen, FaExternalLinkAlt, FaPlay, FaPause } from 'react-icons/fa';

interface PaoDiario {
  referencia: string;
  texto_biblico: string;
  reflexao: string;
  proposito: string;
  audio_url?: string; // Campo de áudio adicionado
}

const PaoDiarioCard: React.FC = () => {
  const [pao, setPao] = useState<PaoDiario | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';

  useEffect(() => {
    const carregarPao = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/pao-diario/hoje`);
        const data = await res.json();
        if (data && data.texto_biblico) setPao(data);
      } catch (err) {
        console.log("Sem pão diário disponível.");
      } finally {
        setLoading(false);
      }
    };
    carregarPao();
  }, [API_BASE_URL]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const compartilharWhatsApp = () => {
    if (!pao) return;
    const msg = `*🔥 Pão Diário - RCC Curitiba*%0A%0A"${pao.texto_biblico}"%0A*(${pao.referencia})*%0A%0A*Reflexão:* ${pao.reflexao}%0A%0A*Propósito:* ${pao.proposito}%0A%0A_Acesse o portal para ouvir e ler:_ www.rcccuritiba.com.br`;
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  if (loading || !pao) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2rem] shadow-2xl border border-orange-100 overflow-hidden flex flex-col h-full relative"
    >
      {/* Marca d'água espiritual */}
      <FaDove className="absolute -right-6 top-24 text-orange-50/50 text-[10rem] -rotate-12 pointer-events-none" />

      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-amber-500 p-5 flex items-center justify-between shadow-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <FaCalendarDay className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-white font-serif font-black uppercase text-sm tracking-widest leading-none">Alimento Diário</h2>
            <p className="text-orange-100 text-[9px] font-bold uppercase tracking-tighter opacity-80">RCC Curitiba</p>
          </div>
        </div>
        <button 
          onClick={compartilharWhatsApp}
          className="bg-white/20 hover:bg-white/40 text-white p-2.5 rounded-full transition-all group shadow-inner"
        >
          <FaWhatsapp size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      </header>

      <div className="p-6 sm:p-8 flex flex-col flex-grow relative z-10">
        
        {/* TÍTULO E PLAYER DE ÁUDIO */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-orange-200"></span>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Palavra do Dia</h3>
          </div>

          {/* Botão de Áudio se existir URL */}
          {pao.audio_url && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleAudio}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-black text-[9px] uppercase tracking-tighter transition-all shadow-sm ${isPlaying ? 'bg-orange-600 text-white animate-pulse' : 'bg-orange-100 text-orange-600'}`}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
              {isPlaying ? 'Ouvindo' : 'Ouvir Reflexão'}
              <audio 
                ref={audioRef} 
                src={`${API_BASE_URL}${pao.audio_url}`} 
                onEnded={() => setIsPlaying(false)}
              />
            </motion.button>
          )}
        </div>

        {/* Bloco do Versículo */}
        <div className="relative mb-8">
          <FaQuoteLeft className="text-orange-100 text-5xl absolute -top-4 -left-2 -z-0 opacity-60" />
          <div className="relative z-10 pl-4 border-l-4 border-orange-500/20">
            <p className="text-slate-800 text-lg sm:text-xl font-serif italic font-semibold leading-relaxed mb-3">
              "{pao.texto_biblico}"
            </p>
            <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {pao.referencia}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Reflexão */}
          <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-100">
            <h4 className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3">
              <FaBookOpen className="text-orange-400" /> A Palavra ao Coração
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              {pao.reflexao}
            </p>
          </div>

          {/* Desafio de Hoje */}
          <div className="bg-orange-600 rounded-2xl p-5 shadow-lg shadow-orange-200 relative overflow-hidden group">
            <motion.div 
              animate={{ x: [-200, 400] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-40 -skew-x-12"
            />
            <h4 className="flex items-center gap-2 text-white/70 font-black text-[10px] uppercase tracking-widest mb-2 relative z-10">
              <FaLightbulb className="text-amber-300 animate-pulse" /> Desafio de Hoje
            </h4>
            <p className="text-white font-bold text-sm sm:text-base leading-tight relative z-10">
              {pao.proposito}
            </p>
          </div>

          {/* TEXTO DE MOTIVAÇÃO PARA COMPARTILHAMENTO */}
          <div className="pt-3 text-center">
            <p className="text-red-400 text-[10px] font-medium leading-relaxed mb-4 italic px-4">
              "Ide por todo o mundo e pregai o Evangelho." <br></br> Que tal levar essa Palavra a mais corações hoje?
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={compartilharWhatsApp}
              className="w-full flex items-center justify-center gap-3 bg-slate-800 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-700 transition-all"
            >
              <FaExternalLinkAlt className="text-orange-400" /> Transbordar a Palavra
            </motion.button>
          </div>

        </div>
      </div>

      <footer className="mt-auto relative">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
        <div className="bg-orange-50/50 py-4 px-6 text-center">
          <motion.p 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-orange-600 drop-shadow-sm"
          >
            Vinde Espírito Santo
          </motion.p>
        </div>
      </footer>
    </motion.div>
  );
};

export default PaoDiarioCard;