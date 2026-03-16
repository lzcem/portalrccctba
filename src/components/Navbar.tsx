import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Portal RCC Curitiba
        </Link>
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className={`md:flex md:items-center ${isMenuOpen ? 'block' : 'hidden'} w-full md:w-auto`}>
          <ul className="md:flex md:space-x-4 mt-4 md:mt-0">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${isActive ? 'bg-gray-600' : 'hover:bg-gray-700'}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/noticias"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${isActive ? 'bg-gray-600' : 'hover:bg-gray-700'}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Notícias
              </NavLink>
            </li>
            {isLoggedIn && (
              <li className="relative group">
                <button
                  className="block px-4 py-2 rounded-md hover:bg-gray-700 flex items-center focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen ? 'true' : 'false'}
                >
                  Admin
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <ul className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-200 z-50">
                  <li>
                    <NavLink
                      to="/admin/publicacoes"
                      className={({ isActive }) =>
                        `block px-4 py-2 hover:bg-gray-700 ${isActive ? 'bg-gray-600' : ''}`
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Nova Publicação
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/noticias"
                      className={({ isActive }) =>
                        `block px-4 py-2 hover:bg-gray-700 ${isActive ? 'bg-gray-600' : ''}`
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Nova Notícia
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}