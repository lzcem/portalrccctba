import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPray, FaBookOpen, FaHandsHelping, FaMapMarkerAlt, FaPhone, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

export default function SaibaMais() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-green-900 text-white px-4 py-12 sm:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-6 font-serif tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          Bem-vindo à Renovação Carismática Católica da Arquidiocese de Curitiba
        </motion.h2>
        <motion.p
          className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          Somos um movimento eclesial da Igreja Católica Apostólica Romana que busca o avivamento do Espírito Santo na vida dos fiéis.
          Nosso objetivo é proporcionar uma experiência viva com Deus, através do louvor, da oração, da Palavra e dos dons do Espírito.
        </motion.p>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 mt-12">
          <motion.div
            className="bg-white bg-opacity-10 p-6 rounded-2xl shadow-xl border border-green-300/20 hover:shadow-2xl transition-shadow duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.03 }}
          >
            <FaPray className="text-3xl text-green-400 mb-3 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 font-serif">Grupos de Oração</h3>
            <p className="text-gray-300 text-sm font-sans">
              Participe de um grupo de oração perto de você e viva a experiência de Pentecostes.
            </p>
          </motion.div>

          <motion.div
            className="bg-white bg-opacity-10 p-6 rounded-2xl shadow-xl border border-green-300/20 hover:shadow-2xl transition-shadow duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.03 }}
          >
            <FaBookOpen className="text-3xl text-green-400 mb-3 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 font-serif">Formações</h3>
            <p className="text-gray-300 text-sm font-sans">
              Aprofunde-se na fé por meio dos nossos cursos e escolas de formação espiritual e doutrinária.
            </p>
          </motion.div>

          <motion.div
            className="bg-white bg-opacity-10 p-6 rounded-2xl shadow-xl border border-green-300/20 hover:shadow-2xl transition-shadow duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.03 }}
          >
            <FaHandsHelping className="text-3xl text-green-400 mb-3 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 font-serif">Missão e Serviço</h3>
            <p className="text-gray-300 text-sm font-sans">
              Descubra os diversos ministérios e formas de servir ao Senhor em comunidade.
            </p>
          </motion.div>
        </div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 font-serif">Entre em Contato</h2>
          <div className="bg-white bg-opacity-10 p-6 rounded-2xl shadow-xl border border-green-300/20">
            <motion.div
              className="flex items-center mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <FaMapMarkerAlt className="text-green-400 mr-2" />
              <p className="text-gray-200 text-base sm:text-lg font-sans">
                <strong>Endereço:</strong> Al. Dr. Muricy, 926, 8º andar, Centro, Curitiba - PR, CEP: 80020-040
              </p>
            </motion.div>
            <motion.div
              className="flex items-center mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <FaPhone className="text-green-400 mr-2" />
              <p className="text-gray-200 text-base sm:text-lg font-sans">
                <strong>Telefone:</strong> (41) 3222-9332
              </p>
            </motion.div>
            <motion.div
              className="flex items-center mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <FaWhatsapp className="text-green-400 mr-2" />
              <p className="text-gray-200 text-base sm:text-lg font-sans">
                <strong>WhatsApp:</strong> (41) 99132-0890
              </p>
            </motion.div>
            <motion.div
              className="flex items-center mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <FaEnvelope className="text-green-400 mr-2" />
              <p className="text-gray-200 text-base sm:text-lg font-sans">
                <strong>E-mail:</strong> rcccuritiba@gmail.com
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <Link
            to="/participe-grupo"
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full text-lg font-semibold shadow-lg font-sans transition-colors duration-300 inline-flex items-center gap-2"
          >
            Participe Conosco
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}