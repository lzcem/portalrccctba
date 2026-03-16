import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFire, FaUsers, FaHeart, FaTimes, FaPray } from 'react-icons/fa';
import axios from 'axios';

export default function CheckInEspiritual() {
  const [showModal, setShowModal] = useState(false);
  const [clicou, setClicou] = useState(false);
  const [totalFieis, setTotalFieis] = useState(0);
  const [timer, setTimer] = useState(15); // 15 segundos de prece focada
  const [podeConfirmar, setPodeConfirmar] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';

  useEffect(() => {
    // Carregar total global
    axios.get(`${API_BASE_URL}/api/cenaculo/checkin-total`)
      .then(res => setTotalFieis(res.data.total))
      .catch(() => setTotalFieis(0));

    // Verificar se já orou hoje
    const hoje = new Date().toISOString().split('T')[0];
    if (localStorage.getItem(`checkin_${hoje}`)) {
      setClicou(true);
    }
  }, [API_BASE_URL]);

  // Lógica do cronômetro da prece
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

  return (
    <div className="mt-12 flex flex-col items-center">
      {/* Botão Principal */}
      <motion.button
        whileHover={!clicou ? { scale: 1.05 } : {}}
        whileTap={!clicou ? { scale: 0.95 } : {}}
        onClick={() => !clicou && setShowModal(true)}
        className={`
          relative overflow-hidden px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl flex items-center gap-3
          ${clicou 
            ? 'bg-green-100 text-green-700 border-2 border-green-200 cursor-default' 
            : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-200'}
        `}
      >
        {clicou ? (
          <><FaHeart className="animate-pulse" /> Missão Cumprida Hoje</>
        ) : (
          <><FaFire className="text-amber-200 animate-bounce" /> Minha Prece: Eu clamei o Espírito</>
        )}
      </motion.button>

      {/* Contador Comunitário */}
      <div className="mt-6 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
          <FaUsers className="text-amber-500" /> 
          <span>Corrente de Oração</span>
        </div>
        <p className="text-sm text-gray-600">
          <span className="font-black text-gray-900 text-lg">{totalFieis}</span> pessoas clamaram o Espírito hoje
        </p>
      </div>

      {/* MODAL DE ORAÇÃO */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blue-950/40 backdrop-blur-md z-[2000] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-[3rem] p-8 sm:p-12 max-w-lg w-full shadow-2xl relative text-center border border-amber-100"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-300 hover:text-gray-500 transition-colors">
                <FaTimes size={24} />
              </button>

              <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaPray className="text-amber-600 text-3xl animate-pulse" />
              </div>

              <h3 className="text-2xl font-serif font-black text-gray-800 mb-4">Momento de Clamor</h3>
              
              <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100 italic text-gray-600 leading-relaxed text-lg">
                "Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do Vosso Amor..."
              </div>

              <p className="text-sm text-gray-400 mb-8 uppercase tracking-widest font-bold">
                {timer > 0 ? `Aguarde o momento de escuta: ${timer}s` : "Sua alma está pronta!"}
              </p>

              <button
                disabled={!podeConfirmar}
                onClick={handleFinalizarPrece}
                className={`
                  w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all
                  ${podeConfirmar 
                    ? 'bg-amber-500 text-white shadow-lg hover:bg-amber-600 active:scale-95' 
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'}
                `}
              >
                {podeConfirmar ? "Confirmar Clamor" : "Aguarde..."}
              </button>
              
              <p className="mt-4 text-[10px] text-gray-300 uppercase">
                Sua oração será somada à nossa rede de intercessão
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}