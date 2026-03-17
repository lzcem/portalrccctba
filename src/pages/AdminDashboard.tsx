import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaUsers, FaNewspaper, FaMicrophone, FaPray, FaHeart,
  FaGraduationCap, FaLayerGroup, FaBullhorn, FaFileAlt,
  FaVideo, FaChartLine, FaArrowRight, FaHistory, FaTimes,
  FaCheckCircle, FaExclamationTriangle, FaPaperPlane, FaBible
} from 'react-icons/fa';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const [totalNewsletter, setTotalNewsletter] = useState(0);
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [enviando, setEnviando] = useState(false);

  // Estados para alertas e confirmação estilizados
  const [feedback, setFeedback] = useState<{ texto: string; tipo: 'success' | 'error' | 'info' } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const headers = { 'Authorization': `Bearer ${token}` };

    fetch(`${API_BASE_URL}/api/admin/newsletter/count`, { headers })
      .then(res => res.json())
      .then(data => setTotalNewsletter(data.total))
      .catch(err => console.error("Erro contador:", err));

    fetch(`${API_BASE_URL}/api/admin/logs`, { headers })
      .then(res => res.json())
      .then(data => setLogs(data.slice(0, 6)))
      .catch(() => {
        setLogs([{ id: 0, usuario: 'Sistema', acao: 'Aguardando logs...', data: '-' }]);
      });

    fetch(`${API_BASE_URL}/api/admin/stats/newsletter`, { headers })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Erro stats:", err));
  }, [API_BASE_URL, token]);

  // Abre o modal customizado em vez do confirm do windows
  const abrirConfirmacao = () => setShowConfirmModal(true);

  const executarDisparoNewsletter = async () => {
    setShowConfirmModal(false);
    setEnviando(true);
    setFeedback({ texto: 'Iniciando o envio para os servos...', tipo: 'info' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/newsletter/testar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (response.ok) {
        setFeedback({
          texto: data.message || "Newsletter enviada com sucesso!",
          tipo: 'success'
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      setFeedback({ texto: "Falha no disparo. Verifique os logs do servidor.", tipo: 'error' });
    } finally {
      setEnviando(false);
      setTimeout(() => setFeedback(null), 8000);
    }
  };

  const secoes = [
    {
      categoria: "Comunicação",
      itens: [
        { title: 'Newsletter', count: totalNewsletter, icon: <FaUsers />, link: '/admin/newsletter', color: 'bg-orange-500' },
        { title: 'Notícias', icon: <FaNewspaper />, link: '/admin/noticias', color: 'bg-blue-600' },
        { title: 'Publicações', icon: <FaFileAlt />, link: '/admin/publicacoes', color: 'bg-indigo-600' },
        { title: 'Vídeos', icon: <FaVideo />, link: '/admin/videos', color: 'bg-red-600' },
      ]
    },
    {
      categoria: "Espiritualidade",
      itens: [
        { title: 'Pão Diário', icon: <FaBible />, link: '/admin/pao-diario', color: 'bg-purple-600' }, // NOVA OPÇÃO
        { title: 'Cenáculo', icon: <FaPray />, link: '/admin/cenaculo', color: 'bg-amber-500' },
        { title: 'Formação Mensal', icon: <FaGraduationCap />, link: '/admin/formacoes/nova', color: 'bg-emerald-600' },
        { title: 'Mensagem da Coord.', icon: <FaBullhorn />, link: '/admin/mensagens-coordenacao', color: 'bg-teal-600' },
         { title: 'Rádio', icon: <FaMicrophone />, link: '/admin/radio', color: 'bg-pink-600' },
      ]
    },
    {
      categoria: "Institucional",
      itens: [
        { title: 'Eu Amo RCC', icon: <FaHeart />, link: '/admin/amorcc', color: 'bg-red-500' },
        { title: 'Mil Amigos', icon: <FaUsers />, link: '/admin/amigos', color: 'bg-cyan-600' },
        { title: 'Ministérios', icon: <FaLayerGroup />, link: '/admin/ministerios', color: 'bg-gray-700' },
        { title: 'Grupos', icon: <FaPray />, link: '/admin/grupo-oracao', color: 'bg-green-600' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-3 sm:px-6 relative">

      {/* 1. TOAST DE FEEDBACK */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 100, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-0 left-1/2 z-[200] w-full max-w-md px-4"
          >
            <div className={`
                relative overflow-hidden rounded-2xl shadow-2xl border backdrop-blur-md p-5 flex items-center gap-4
                ${feedback.tipo === 'success' ? 'bg-green-600/95 border-green-400 text-white' : ''}
                ${feedback.tipo === 'error' ? 'bg-red-600/95 border-red-400 text-white' : ''}
                ${feedback.tipo === 'info' ? 'bg-blue-600/95 border-blue-400 text-white' : ''}
            `}>
              <div className="bg-white/20 p-3 rounded-xl text-white">
                {feedback.tipo === 'success' && <FaCheckCircle size={18} />}
                {feedback.tipo === 'error' && <FaExclamationTriangle size={18} />}
                {feedback.tipo === 'info' && <FaPaperPlane size={18} className="animate-pulse" />}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm leading-tight">{feedback.texto}</p>
              </div>
              <button onClick={() => setFeedback(null)} className="opacity-50 hover:opacity-100 p-1">
                <FaTimes size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MODAL DE CONFIRMAÇÃO */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
              onClick={() => setShowConfirmModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center border border-orange-100"
            >
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBullhorn className="text-orange-600 text-2xl" />
              </div>
              <h3 className="text-xl font-serif font-black text-gray-800 mb-2">Confirmar Envio?</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Deseja gerar a newsletter e disparar e-mails para todos os servos cadastrados agora?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={executarDisparoNewsletter} className="flex-1 bg-orange-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all">
                  Sim, Enviar!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-4xl font-serif font-black text-gray-800 uppercase tracking-tighter">
              Painel <span className="text-orange-600">Admin</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Gestão Portal RCC Curitiba 2026</p>
          </div>
          <div className="bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-center gap-3">
            <FaChartLine className="text-orange-500 text-sm" />
            <div className="text-left">
              <p className="text-[8px] font-black text-gray-400 uppercase leading-none mb-1">Newsletter</p>
              <p className="text-sm font-black text-gray-800 leading-none">
                {totalNewsletter} <span className="text-[10px] font-normal text-gray-400">servos</span>
              </p>
            </div>
          </div>
        </header>

        {secoes.map((secao, idx) => (
          <div key={idx} className="mb-8">
            <h2 className="text-[9px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 border-l-3 border-orange-500 pl-2">
              {secao.categoria}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {secao.itens.map((item, iIdx) => (
                <motion.div key={iIdx} whileTap={{ scale: 0.96 }}>
                  <Link to={item.link} className="block bg-white p-4 sm:p-6 rounded-[1.5rem] shadow-sm border border-gray-100 hover:shadow-lg transition-all group h-full relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${item.color} p-2.5 sm:p-4 rounded-xl text-white shadow-md`}>
                        {React.cloneElement(item.icon as React.ReactElement, { className: "text-sm sm:text-xl" })}
                      </div>
                      <FaArrowRight className="text-gray-100 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-0.5 truncate">{item.title}</h3>
                    <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                      {item.count !== undefined ? `${item.count} Inscritos` : 'Gerenciar'}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* GRÁFICO */}
        <div className="mt-8 bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-black uppercase text-gray-800 tracking-widest mb-6">Crescimento Newsletter</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: '700', fill: '#9ca3af' }} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px' }} />
                <Line type="monotone" dataKey="total" stroke="#f97316" strokeWidth={4} dot={{ r: 4, fill: '#f97316', stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOTÃO DISPARO MANUAL */}
        <div className="mt-8 flex justify-center md:justify-end">
          <button
            onClick={abrirConfirmacao}
            disabled={enviando}
            className={`${enviando ? 'bg-gray-300 cursor-not-allowed border-gray-400' : 'bg-orange-600 hover:bg-orange-700 active:scale-95 border-orange-800'
              } text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-lg flex items-center gap-3 border-b-4`}
          >
            {enviando ? (
              <> <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enviando... </>
            ) : (
              <> Gerar e Enviar Newsletter Manual <FaBullhorn /> </>
            )}
          </button>
        </div>

        {/* LOGS */}
        <div className="mt-8 bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gray-800 p-2 rounded-lg text-white"><FaHistory size={16} /></div>
            <h2 className="text-sm font-black uppercase text-gray-800 tracking-widest">Logs de Atividade</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="pb-3 font-black text-gray-400 uppercase tracking-tighter">Usuário</th>
                  <th className="pb-3 font-black text-gray-400 uppercase tracking-tighter">Ação</th>
                  <th className="pb-3 font-black text-gray-400 uppercase tracking-tighter text-right">Data/Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-bold">{log.usuario}</td>
                    <td className="py-3">
                      <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border border-orange-100">{log.acao}</span>
                    </td>
                    <td className="py-3 text-gray-400 text-right">{log.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-[8px] sm:text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">RCC Curitiba • Sistema Seguro • 2026</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;