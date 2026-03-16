import { useState, useEffect, useRef, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { slide as Menu } from 'react-burger-menu';
import axios from 'axios';
import SearchContext from '../contexts/SearchContext';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMinistriesOpen, setIsMinistriesOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMobileMinistriesOpen, setIsMobileMinistriesOpen] = useState(false);
  const [ministerios, setMinisterios] = useState<any[]>([]);
  const [unmoderatedCount, setUnmoderatedCount] = useState(0);
  const [showModerationForm, setShowModerationForm] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [pedidosOracao, setPedidosOracao] = useState<any[]>([]);
  const [processingId, setProcessingId] = useState<number | null>(null);
  
  const adminMenuRef = useRef<HTMLDivElement>(null);
  const ministriesMenuRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';
  const context = useContext(SearchContext);
  if (!context) throw new Error('SearchContext deve ser usado dentro de um SearchProvider');
  const { search, setSearch } = context;

  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('token');

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) setIsAdminOpen(false);
      if (ministriesMenuRef.current && !ministriesMenuRef.current.contains(event.target as Node)) setIsMinistriesOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchMinisterios = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/ministerios`);
        setMinisterios(res.data.sort((a: any, b: any) => a.nome.localeCompare(b.nome)));
      } catch (err) { console.error(err); }
    };
    const fetchUnmoderated = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const [c, p] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/comments/unmoderated`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/api/pedidos-oracao/unmoderated`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
        ]);
        setComments(c.data);
        setPedidosOracao(p.data);
        setUnmoderatedCount(c.data.length + p.data.length);
      } catch (err) { console.error(err); }
    };
    fetchMinisterios();
    if (isLoggedIn) fetchUnmoderated();
  }, [API_BASE_URL, isLoggedIn]);

  const handleModerate = async (id: number, action: 'approve' | 'reject', type: 'comment' | 'pedido') => {
    setProcessingId(id);
    try {
      const token = localStorage.getItem('token');
      const moderation = action === 'approve' ? 'aprovado' : 'rejeitado';
      const endpoint = type === 'comment' ? `/api/comments/${id}/moderate` : `/api/pedidos-oracao/${id}/moderate`;
      await axios.put(`${API_BASE_URL}${endpoint}`, { moderation }, { headers: { Authorization: `Bearer ${token}` } });
      if (type === 'comment') setComments(prev => prev.filter(i => i.id !== id));
      else setPedidosOracao(prev => prev.filter(i => i.id !== id));
      setUnmoderatedCount(prev => prev - 1);
    } catch (err) { console.error(err); } finally { setProcessingId(null); }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/busca?query=${encodeURIComponent(search)}`);
      setIsMenuOpen(false);
    }
  };

  const menuStyles = {
    bmBurgerButton: { display: 'none' },
    bmMenuWrap: { position: 'fixed', height: '100vh', top: '0', width: '280px', zIndex: '2000' },
    bmMenu: { background: '#1e3a8a', padding: '2.5em 0', fontSize: '1rem' },
    bmItemList: { display: 'block', padding: '0' },
    bmOverlay: { background: 'rgba(0, 0, 0, 0.7)', zIndex: '1999', top: '0', left: '0' },
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-gradient-to-r from-blue-900 to-green-600 shadow-md h-16 sm:h-20">
      <div className="container mx-auto px-4 h-full flex items-center justify-between gap-2">
        
        {/* LOGO */}
        <Link to="/" className="shrink-0 max-w-[110px] sm:max-w-none">
          <img src="/logobrancarcc.png" alt="RCC Curitiba" className="h-9 sm:h-12 w-auto" />
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav className="hidden lg:flex items-center space-x-1 text-[11px] font-bold uppercase tracking-tight">
          <NavLink to="/" className="text-white hover:text-green-300 px-2">Home</NavLink>
          <div className="relative" ref={ministriesMenuRef}>
            <button onClick={() => setIsMinistriesOpen(!isMinistriesOpen)} className="text-white hover:text-green-300 px-2 flex items-center">Ministérios</button>
            <AnimatePresence>
              {isMinistriesOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-2 bg-blue-900 text-white rounded shadow-lg w-48 p-1 z-[110]">
                  {ministerios.map((m) => (
                    <NavLink key={m.id} to={`/ministerios/${m.ministerio_id || m.id}`} className="block px-3 py-2 hover:bg-green-700 text-[10px] rounded" onClick={() => setIsMinistriesOpen(false)}>{m.nome}</NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <NavLink to="/saiba-mais" className="text-white hover:text-green-300 px-2">Sobre</NavLink>
          <NavLink to="/mapa-grupos" className="text-white hover:text-green-300 px-2">Grupos</NavLink>
          <NavLink to="/agenda" className="text-white hover:text-green-300 px-2">Agenda</NavLink>
          <NavLink to="/mil-amigos" className="text-white hover:text-green-300 px-2">Mil Amigos</NavLink>
          <NavLink to="/revista" className="text-white hover:text-green-300 px-2">Revista</NavLink>

          {/* Busca Desktop */}
          <form onSubmit={handleSearchSubmit} className="relative ml-4">
            <input 
              type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-white/10 border border-white/20 text-white text-[10px] rounded-full py-1.5 pl-8 pr-3 focus:bg-white focus:text-gray-900 transition-all w-24 focus:w-40 outline-none"
            />
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </form>
        </nav>

        {/* LADO DIREITO */}
        <div className="flex items-center gap-1 sm:gap-2">
          {isLoggedIn && (
            <>
              <button onClick={() => setShowModerationForm(true)} className="relative p-2 text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1h6" strokeWidth="2"/></svg>
                {unmoderatedCount > 0 && <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{unmoderatedCount}</span>}
              </button>
              
              <div className="relative" ref={adminMenuRef}>
                <button onClick={() => setIsAdminOpen(!isAdminOpen)} className="bg-orange-600 text-white px-3 py-1.5 rounded text-[10px] font-black">ADMIN</button>
                <AnimatePresence>
                  {isAdminOpen && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute top-full right-0 mt-2 bg-gray-900 border border-orange-500/30 rounded shadow-xl w-44 p-2 z-[110] flex flex-col gap-1">
                      <NavLink to="/admin/dashboard" className="block px-3 py-2 text-white hover:bg-orange-600 rounded text-[11px] font-bold transition-colors" onClick={() => setIsAdminOpen(false)}>
                        Painel Principal
                      </NavLink>
                      <button 
                        onClick={() => { setIsAdminOpen(false); handleLogout(); }}
                        className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded text-[11px] font-bold border-t border-white/5 mt-1 transition-colors"
                      >
                        Sair do Sistema
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
          <button className="lg:hidden text-white p-2" onClick={() => setIsMenuOpen(true)}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2.5"/></svg>
          </button>
        </div>
      </div>

      {/* MODAL DE MODERAÇÃO */}
      <AnimatePresence>
        {showModerationForm && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowModerationForm(false)} />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh]">
              <div className="p-5 border-b flex justify-between items-center bg-gray-50 rounded-t-3xl">
                <h2 className="font-bold text-gray-800 text-sm uppercase tracking-widest">Moderação</h2>
                <button onClick={() => setShowModerationForm(false)} className="text-gray-400 text-2xl font-bold">&times;</button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {[...comments, ...pedidosOracao].map(item => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-gray-900 shadow-sm">
                    <p className="font-bold text-xs">{item.name || item.nome}</p>
                    <p className="text-xs italic opacity-70 my-2">"{item.comment || item.mensagem}"</p>
                    <div className="flex gap-2">
                      <button disabled={processingId === item.id} onClick={() => handleModerate(item.id, 'approve', item.comment ? 'comment' : 'pedido')} className="flex-1 bg-green-600 text-white py-2 rounded-xl text-[10px] font-bold uppercase">
                        {processingId === item.id ? '...' : 'Aprovar'}
                      </button>
                      <button disabled={processingId === item.id} onClick={() => handleModerate(item.id, 'reject', item.comment ? 'comment' : 'pedido')} className="flex-1 bg-red-600 text-white py-2 rounded-xl text-[10px] font-bold uppercase">
                        {processingId === item.id ? '...' : 'Rejeitar'}
                      </button>
                    </div>
                  </div>
                ))}
                {unmoderatedCount === 0 && <p className="text-center text-gray-400 py-10">Tudo limpo!</p>}
              </div>
              <div className="p-4 border-t bg-gray-50 rounded-b-3xl">
                <button onClick={() => setShowModerationForm(false)} className="w-full py-3 bg-gray-800 text-white rounded-2xl font-bold text-xs uppercase tracking-widest">Fechar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MENU MOBILE */}
      <Menu right isOpen={isMenuOpen} onStateChange={(s) => setIsMenuOpen(s.isOpen)} styles={menuStyles}>
        <div className="flex flex-col w-full text-white uppercase font-bold text-xs tracking-widest">
          
          {/* Busca Mobile */}
          <div className="px-6 py-4 border-b border-white/10">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input 
                type="text" placeholder="BUSCAR..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg py-3 pl-10 pr-4 outline-none text-xs"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </form>
          </div>

          <NavLink to="/" className="block py-5 px-6 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
          
          <div className="w-full border-b border-white/5">
            <button onClick={() => setIsMobileMinistriesOpen(!isMobileMinistriesOpen)} className="w-full flex items-center justify-between py-5 px-6">
              <span>Ministérios</span>
              <span className={`transition-transform ${isMobileMinistriesOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <AnimatePresence>
              {isMobileMinistriesOpen && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-black/20 overflow-hidden flex flex-col">
                  {ministerios.map((m) => (
                    <NavLink key={m.id} to={`/ministerios/${m.ministerio_id || m.id}`} className="block py-4 pl-12 pr-4 text-[10px] text-gray-300 border-b border-white/5 last:border-0" onClick={() => setIsMenuOpen(false)}>◇ {m.nome}</NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/saiba-mais" className="block py-5 px-6 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Sobre</NavLink>
          <NavLink to="/mapa-grupos" className="block py-5 px-6 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Grupos</NavLink>
          <NavLink to="/agenda" className="block py-5 px-6 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Agenda</NavLink>
          <NavLink to="/mil-amigos" className="block py-5 px-6 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>Mil Amigos</NavLink>
          <NavLink to="/revista" className="block py-5 px-6 border-b border-white/10" onClick={() => setIsMenuOpen(false)}>Revista</NavLink>
          
          {isLoggedIn && (
            <div className="px-6 flex flex-col gap-4 mt-10 pb-10">
              <NavLink to="/admin/dashboard" className="block w-full py-4 bg-orange-600 text-white rounded-xl text-center shadow-xl" onClick={() => setIsMenuOpen(false)}>PAINEL ADMIN</NavLink>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full py-4 bg-red-600/20 text-red-200 border border-red-500/30 rounded-xl">SAIR DO SISTEMA</button>
            </div>
          )}
        </div>
      </Menu>
    </header>
  );
};

export default Header;