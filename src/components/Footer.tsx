import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

const PASSWORD = 'rcc2025'; // Troque para a senha desejada

export default function Footer() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  function handleProtectedLinkClick(path: string) {
    setPendingPath(path);
    setPasswordInput('');
    setError('');
    setModalOpen(true);
  }

  function handleSubmitPassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === PASSWORD) {
      setModalOpen(false);
      if (pendingPath) {
        navigate(pendingPath);
      }
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  }

  function handleCloseModal() {
    setModalOpen(false);
    setPasswordInput('');
    setError('');
    setPendingPath(null);
  }

  return (
    <>
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-900 to-green-600 text-white py-6 sm:py-8 relative z-20 w-full"
      >
        <div className="container mx-auto px-4 sm:px-6 w-full max-w-full">

          {/* LINKS RÁPIDOS + LINKS ÚTEIS no topo, VISIBLE ONLY MOBILE */}
          <div className="sm:hidden mb-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Links Rápidos */}
              <div className="flex flex-col items-center">
                <h3 className="text-base font-semibold mb-3 text-white">Links Rápidos</h3>
                <ul className="space-y-2 text-center">
                  <li><Link to="/" className="text-xs text-gray-200 hover:text-green-300">Home</Link></li>
                  <li><Link to="/noticias" className="text-xs text-gray-200 hover:text-green-300">Notícias</Link></li>
                  <li><Link to="/agenda" className="text-xs text-gray-200 hover:text-green-300">Agenda</Link></li>
                  <li><Link to="/pedidos-oracao" className="text-xs text-gray-200 hover:text-green-300">Pedidos de Oração</Link></li>
                  <li>
                    <Link to="/login" className="flex items-center text-white hover:text-green-300 text-xs py-1 justify-center">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Login
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Links Úteis */}
              <div className="flex flex-col items-center">
                <h3 className="text-base font-semibold mb-3 text-white">Links Úteis</h3>
                <ul className="space-y-2 text-center">
                  <li><a href="https://rccbrasil.org.br" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-200 hover:text-green-300">RCCBRASIL</a></li>
                  <li><a href="https://rccparana.org.br" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-200 hover:text-green-300">RCC Paraná</a></li>
                  <li><a href="https://arquidiocesedecuritiba.org.br" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-200 hover:text-green-300">Arquidiocese de Curitiba</a></li>
                  <li><a href="https://www.vatican.va/" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-200 hover:text-green-300">Vaticano</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Layout ORIGINAL, visible only sm+ */}
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-8 text-center sm:text-left">
            {/* Sobre */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Sobre a RCC Curitiba</h3>
              <p className="text-xs sm:text-sm text-gray-200">
                Semeando a Cultura de Pentecostes na Arquidiocese de Curitiba.
              </p>
              <img src="/logorccbco.png" alt="RCC Curitiba Logo" className="mt-4 h-40 w-40" />
            </div>

            {/* Links Rápidos */}
            <div className="flex flex-col">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-xs sm:text-sm text-gray-200 hover:text-green-300">Home</Link></li>
                <li><Link to="/noticias" className="text-xs sm:text-sm text-gray-200 hover:text-green-300">Notícias</Link></li>
                <li><Link to="/agenda" className="text-xs sm:text-sm text-gray-200 hover:text-green-300">Agenda</Link></li>
                <li><Link to="/pedidos-oracao" className="text-xs sm:text-sm text-gray-200 hover:text-green-300">Pedidos de Oração</Link></li>
                <li>
                  <Link to="/login" className="flex items-center text-white hover:text-green-300 text-xs md:text-sm py-1">
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Links Úteis */}
            <div className="flex flex-col">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Links Úteis</h3>
              <ul className="space-y-2">
                <li><a href="https://rccbrasil.org.br" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-gray-200 hover:text-green-300">RCCBRASIL</a></li>
                <li><a href="https://rccparana.com.br" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-gray-200 hover:text-green-300">RCC Paraná</a></li>
                <li><a href="https://arquidiocesedecuritiba.org.br" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-gray-200 hover:text-green-300">Arquidiocese de Curitiba</a></li>
                <li><a href="https://www.vatican.va/" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-gray-200 hover:text-green-300">Vaticano</a></li>
              </ul>
            </div>

            {/* Contato e Redes */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contato</h3>
              <p className="text-xs sm:text-sm text-gray-200">Email: rcccuritiba@gmail.com</p>
              <p className="text-xs sm:text-sm text-gray-200">Telefone: (41) 3222-9332</p>
              <p className="text-xs sm:text-sm text-gray-200">Endereço: Al. Dr. Muricy, 926, 8º andar, Centro - Curitiba - PR</p>
              <div className="mt-4 flex space-x-4 text-lg">
                <a href="https://facebook.com/rcccuritiba" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-green-300 transition">
                  <FaFacebookF />
                </a>
                <a href="https://instagram.com/rcccuritiba" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-green-300 transition">
                  <FaInstagram />
                </a>
                <a href="https://youtube.com/rcccuritiba" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-green-300 transition">
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200/20 text-center">
            <p className="text-xs sm:text-sm text-gray-200">
              © 2025 RCC Curitiba. Todos os direitos reservados.
            </p>
          </div>

          {/* Botões protegidos */}
<div className="flex sm:flex-col justify-start items-start gap-4">
  <button
    onClick={() => handleProtectedLinkClick('/videos')}
    className="text-sm text-blue-900 hover:text-blue-700 transition-colors duration-200"
    aria-label="Vídeos (protegido por senha)"
  >
    Víd
  </button>
  <button
    onClick={() => handleProtectedLinkClick('/upload-video')}
    className="text-sm text-blue-900 hover:text-blue-700 transition-colors duration-200"
    aria-label="Enviar Vídeo (protegido por senha)"
  >
    Env
  </button>
</div>

        </div>
      </motion.footer>

      {/* Modal de senha */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="password-modal-title"
        >
          <div className="bg-green-900 p-6 rounded-md max-w-sm w-full">
            <h2 id="password-modal-title" className="text-white text-xl font-semibold mb-4 text-center">
              Informe a senha para acessar
            </h2>
            <form onSubmit={handleSubmitPassword}>
              <input
                type="password"
                className="w-full p-2 rounded mb-3 text-black"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Senha"
                autoFocus
                aria-label="Campo para inserir senha"
              />
              {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
