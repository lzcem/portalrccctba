import { useState, useRef } from "react";
import { FaBook, FaAngleDown } from "react-icons/fa";
import { motion } from "framer-motion";
import DOMPurify from 'dompurify';
import { temas } from "../data/identidadeData";
import { pentecostesTemas } from "../data/pentecostesData";
import { organizacaoTemas } from "../data/organizacaoData";
import { historicoTemas } from "../data/historicoData";
import { formacoes } from "../data/formacoesData";

export default function FormacaoIdentidadeRCC() {
  const [formacaoSelecionada, setFormacaoSelecionada] = useState<string>("Identidade da RCC");
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const handleScrollToSection = (index: number) => {
    const section = sectionRefs.current[index];
    if (section) {
      const offsetTop = section.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  const toggleExpandedSection = (temaId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [temaId]: !prev[temaId]
    }));
  };

  const selectedFormacao = formacoes.find(f => f.titulo === formacaoSelecionada);

  const getTemas = () => {
    switch (formacaoSelecionada) {
      case "Identidade da RCC":
        return temas;
      case "Cultura de Pentecostes":
        return pentecostesTemas;
      case "Como Estamos Organizados":
        return organizacaoTemas;
      case "Histórico da RCC":
        return historicoTemas;
      default:
        return temas;
    }
  };

  const currentTemas = getTemas();

  // Variantes para animações dos cards
  const cardVariants = {
    initial: { opacity: 0, scale: 0.9, y: 50 },
    animate: { opacity: 1, scale: 1, y: 0 },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className={`min-h-screen ${selectedFormacao?.bgColor || "bg-gray-50"} ${selectedFormacao?.textColor || "text-gray-900"} font-roboto flex flex-col`}>
      {/* Cabeçalho */}
      <section
        className="py-8 shadow-xl sticky top-0 z-30 bg-gradient-to-r from-blue-800 to-blue-600 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/ImgFotos/fundoformacao.png)`,
          backgroundColor: 'rgba(0, 51, 102, 0.7)',
          backgroundBlendMode: 'overlay'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-4 sm:px-6"
        >
          {/* Agrupamento título + select alinhados à esquerda */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            {/* Título */}
            <div className="flex items-center gap-4">
              <FaBook className="text-yellow-300 text-4xl" aria-hidden="true" />
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                {formacaoSelecionada}
              </h1>
            </div>

            {/* Select */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full sm:w-96"
            >
              <select
                className="appearance-none w-full p-4 pr-12 rounded-xl bg-white/90 text-gray-900 
                     font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300 
                     shadow-lg cursor-pointer transition-all duration-300 hover:bg-white"
                value={formacaoSelecionada}
                onChange={(e) => setFormacaoSelecionada(e.target.value)}
                aria-label={`Selecionar formação: ${formacaoSelecionada}`}
              >
                {formacoes.map((formacao, idx) => (
                  <option key={idx} value={formacao.titulo}>{formacao.titulo}</option>
                ))}
              </select>
              <FaAngleDown
                className="absolute right-4 top-1/2 transform -translate-y-1/2 
                     text-gray-700 text-xl pointer-events-none"
                aria-hidden="true"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Seção de Cards */}
      <section id="pilares" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 bg-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-12 text-blue-800"
        >
          Temas da Formação
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentTemas.map((tema, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              transition={{
                delay: idx * 0.2,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className={`${tema.bgColor} p-6 rounded-2xl shadow-xl flex flex-col items-center text-center relative overflow-hidden`}
            >
              <div className="bg-white rounded-full p-4 shadow-md mb-4">{tema.icone}</div>
              <h3 className={`text-xl sm:text-2xl font-semibold ${tema.textColor} mb-3`}>{tema.titulo}</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">{tema.resumo}</p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 ${selectedFormacao?.buttonColor || "bg-yellow-400 text-blue-900 hover:bg-yellow-300"} font-semibold rounded-full shadow-md transition-colors duration-300`}
                onClick={() => handleScrollToSection(idx)}
                aria-label={`Saiba mais sobre ${tema.titulo}`}
              >
                Saiba mais
              </motion.button>
              <span className="absolute bottom-2 right-2 text-2xl opacity-20" aria-hidden="true">🕊</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Seções de Aprofundamento */}
      {currentTemas.map((tema, idx) => (
        <section
          key={idx}
          ref={el => (sectionRefs.current[idx] = el)}
          className="max-w-6xl mx-auto px-4 sm:px-6 py-12 my-10 bg-white rounded-2xl shadow-xl border border-gray-100"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="bg-blue-100 rounded-full p-4 shadow-md">{tema.icone}</div>
            <h2 className={`text-2xl sm:text-3xl font-bold ${tema.textColor}`}>{tema.titulo}</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 space-y-6"
          >
            <img
              src={tema.imagem}
              alt={tema.titulo}
              className="w-full h-80 object-cover rounded-xl shadow-md"
              loading="lazy"
            />
            <div
              className="text-gray-700 leading-relaxed text-justify prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(tema.conteudo, {
                  ALLOWED_TAGS: ['p', 'br', 'h1', 'h2', 'h3', 'ul', 'li', 'strong', 'em']
                })
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-full shadow-lg hover:from-blue-500 hover:to-blue-300 transition-all duration-300"
              onClick={() => toggleExpandedSection(`${formacaoSelecionada}-${idx}`)}
              aria-expanded={expandedSections[`${formacaoSelecionada}-${idx}`]}
              aria-controls={`section-${formacaoSelecionada}-${idx}`}
            >
              {expandedSections[`${formacaoSelecionada}-${idx}`] ? "Ocultar" : "Saiba mais"}
            </motion.button>
            {expandedSections[`${formacaoSelecionada}-${idx}`] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                id={`section-${formacaoSelecionada}-${idx}`}
                className="mt-8 p-6 bg-gray-50 rounded-xl shadow-inner prose prose-blue max-w-none"
              >
                <div
                  className="text-gray-700 leading-relaxed text-justify"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(tema.conteudoAprofundado, {
                      ALLOWED_TAGS: ['p', 'br', 'h1', 'h2', 'h3', 'ul', 'li', 'strong', 'em']
                    })
                  }}
                />
              </motion.div>
            )}
          </motion.div>
        </section>
      ))}
    </div>
  );
}