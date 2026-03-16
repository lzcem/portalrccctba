import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FaFireAlt, FaPray, FaQuoteLeft, 
  FaUsers, FaHeart, FaTimes, FaCheckDouble, FaBolt
} from 'react-icons/fa';

interface CenaculoData {
  versiculo: string;
  referencia: string;
  desafio: string;
}

const CenaculoDiario = () => {
  const [revelado, setRevelado] = useState(false);
  const [dados, setDados] = useState<CenaculoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [clicou, setClicou] = useState(false);
  const [totalFieis, setTotalFieis] = useState(0);
  const [timer, setTimer] = useState(15);
  const [podeConfirmar, setPodeConfirmar] = useState(false);

  const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';

  useEffect(() => {
    const init = async () => {
      try {
        const [cenaculoRes, totalRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/cenaculo/hoje`).then(res => res.json()),
          axios.get(`${API_BASE_URL}/api/cenaculo/checkin-total`)
        ]);
        setDados(cenaculoRes);
        setTotalFieis(totalRes.data.total);
        const hoje = new Date().toISOString().split('T')[0];
        if (localStorage.getItem(`checkin_${hoje}`)) setClicou(true);
      } catch (err) {
        console.error("Erro na inicialização:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [API_BASE_URL]);

  useEffect(() => {
    let interval: any;
    if (showModal && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setPodeConfirmar(true);
    }
    return () => clearInterval(interval);
  }, [showModal, timer]);

  const handleFinalizarPrece = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/cenaculo/checkin`);
      setTotalFieis(res.data.total);
      setClicou(true);
      setShowModal(false);
      const hoje = new Date().toISOString().split('T')[0];
      localStorage.setItem(`checkin_${hoje}`, 'true');
    } catch (err) {
      console.error("Erro no check-in", err);
    }
  };

  if (loading) return null;

  const conteudo = dados || {
    versiculo: "Vinde Espírito Santo, enchei os corações dos vossos fiéis.",
    referencia: "Oração da Igreja",
    desafio: "Faça um momento de silêncio e clame que o Espírito Santo guie seus passos."
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2rem] shadow-2xl border border-amber-100 overflow-hidden flex flex-col h-full relative"
    >
      {/* Marca d'água espiritual */}
      <FaFireAlt className="absolute -right-6 top-24 text-amber-50/60 text-[10rem] -rotate-12 pointer-events-none" />

      {/* Header Estilizado (Igual ao PaoDiarioCard) */}
      <header className="bg-gradient-to-r from-amber-500 to-orange-600 p-5 flex items-center justify-between shadow-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md text-white">
            <FaBolt className="text-lg animate-pulse" />
          </div>
          <div>
            <h2 className="text-white font-serif font-black uppercase text-sm tracking-widest leading-none">Cenáculo Diário</h2>
            <p className="text-amber-100 text-[9px] font-bold uppercase tracking-tighter opacity-80">Avivamento RCC</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
          <FaUsers className="text-white text-xs" />
          <span className="text-white font-black text-[10px]">{totalFieis}</span>
        </div>
      </header>

      <div className="p-6 sm:p-8 flex flex-col flex-grow relative z-10">
        
        {/* Título da Seção */}
        <div className="flex items-center gap-2 mb-4">
          <span className="h-px w-6 bg-amber-200"></span>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Palavra Rhema</h3>
        </div>

        {/* Bloco Rhema */}
        <div className="relative mb-6">
          <FaQuoteLeft className="text-amber-100 text-5xl absolute -top-4 -left-2 -z-0 opacity-60" />
          <div className="relative z-10 pl-4 border-l-4 border-amber-500/20">
            <p className="text-slate-800 text-lg sm:text-xl font-serif italic font-semibold leading-relaxed mb-3">
              "{conteudo.versiculo}"
            </p>
            <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {conteudo.referencia}
            </span>
          </div>
        </div>

        {/* Seção de Desafio Revelável */}
        <div className="space-y-6 mt-auto">
          <div className="relative min-h-[140px]">
            <AnimatePresence mode="wait">
              {!revelado ? (
                <motion.div 
                  key="cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setRevelado(true)}
                  className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl p-6 text-center cursor-pointer shadow-lg group overflow-hidden relative"
                >
                   <motion.div 
                    animate={{ x: [-200, 400] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-40 -skew-x-12"
                  />
                  <FaPray className="text-amber-400 text-2xl mx-auto mb-2 animate-bounce" />
                  <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-3">Passo de Fé</h4>
                  <span className="bg-amber-500 text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest group-hover:bg-amber-400 transition-colors">
                    Revelar Desafio
                  </span>
                </motion.div>
              ) : (
                <motion.div 
                  key="content" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-5 text-center relative"
                >
                  <button onClick={() => setRevelado(false)} className="absolute top-2 right-2 text-amber-300 hover:text-amber-500"><FaTimes size={12}/></button>
                  <h4 className="text-amber-600 font-black text-[9px] uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                    <FaCheckDouble /> Sua Resposta de Hoje
                  </h4>
                  <p className="text-slate-700 text-sm sm:text-base font-bold italic leading-tight">
                    "{conteudo.desafio}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Botão de Ação (Check-in) */}
          <motion.button
            whileHover={!clicou ? { scale: 1.02 } : {}}
            whileTap={!clicou ? { scale: 0.98 } : {}}
            onClick={() => !clicou && setShowModal(true)}
            className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3
              ${clicou ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
          >
            {clicou ? (
              <><FaHeart className="text-red-500 animate-pulse" /> Unido em Oração</>
            ) : (
              <><FaFireAlt className="text-amber-400" /> Confirmar Minha Prece</>
            )}
          </motion.button>
        </div>
      </div>

      {/* Footer Oracional (Unificado com PaoDiarioCard) */}
      <footer className="mt-auto relative">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
        <div className="bg-amber-50/50 py-3 px-6 text-center text-amber-600">
          <motion.p 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-[10px] font-black uppercase tracking-[0.4em]"
          >
            Vinde Espírito Santo
          </motion.p>
        </div>
      </footer>

      {/* MODAL DE ORAÇÃO (Ajustado para o novo estilo) */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blue-950/40 backdrop-blur-sm z-[5000] flex items-center justify-center p-4"
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative text-center border border-amber-100">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaPray className="text-amber-600 text-2xl animate-pulse" />
              </div>
              <h3 className="text-xl font-serif font-black text-gray-800 mb-2">Clamor ao Espírito</h3>
              <p className="text-gray-500 text-xs mb-6 leading-relaxed">
                Silencie seu coração por alguns segundos e permita que o fogo de Deus te alcance agora.
              </p>
              
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
                  {timer > 0 ? `Aguarde ${timer}s` : "Pode confirmar!"}
                </span>
                <div className="w-full bg-gray-100 h-1 rounded-full mt-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }} 
                    animate={{ width: "100%" }} 
                    transition={{ duration: 15, ease: "linear" }}
                    className="bg-amber-500 h-full"
                  />
                </div>
              </div>

              <button disabled={!podeConfirmar} onClick={handleFinalizarPrece}
                className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg
                  ${podeConfirmar ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-200' : 'bg-gray-100 text-gray-300'}`}
              >
                {podeConfirmar ? "Confirmar Clamor" : "Respirando..."}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CenaculoDiario;