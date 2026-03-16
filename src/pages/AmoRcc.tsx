import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaChurch, FaHandsHelping, FaUsers, FaBible, FaFire } from 'react-icons/fa';

const sections = [
  {
    title: 'Visão',
    icon: <FaHeart className="text-pink-300 text-4xl mb-2" />,
    content:
      'Fortalecer o sentimento de unidade e pertencimento à Renovação Carismática Católica entre os servos em Curitiba, alinhando-os com a missão e os objetivos da RCC nacional.',
  },
  {
    title: 'Motivação',
    icon: <FaFire className="text-red-400 text-4xl mb-2" />,
    content:
      '"A RCC é uma fonte de renovação espiritual e comunhão com o Espírito Santo." \n"Através da RCC, podemos experimentar o poder transformador do amor de Deus em nossas vidas."',
  },
  {
    title: 'Chamado',
    icon: <FaBible className="text-yellow-300 text-4xl mb-2" />,
    content:
      '"Cada um de nós tem um chamado único e especial para servir a Deus na RCC e na Igreja." \n"Deus nos chama a sermos testemunhas do Seu amor e da Sua obra de salvação."',
  },
  {
    title: 'Pertencimento à Igreja e à RCC',
    icon: <FaChurch className="text-blue-300 text-4xl mb-2" />,
    content:
      '"A RCC é parte integrante da Igreja Católica, chamada a servir e evangelizar sob a orientação dos pastores da Igreja." \n"Ao pertencer à RCC, fazemos parte de uma família espiritual unida pelo amor a Deus e ao próximo."',
  },
  {
    title: 'Importância da RCC',
    icon: <FaUsers className="text-green-300 text-4xl mb-2" />,
    content:
      '"A RCC oferece um ambiente de comunhão, formação e crescimento espiritual para os fiéis." \n"Através da RCC, somos capacitados pelo Espírito Santo para viver uma vida cristã autêntica e testemunhar o amor de Deus ao mundo."',
  },
  {
    title: 'Engajamento de Todos',
    icon: <FaHandsHelping className="text-purple-300 text-4xl mb-2" />,
    content:
      '"O engajamento de todos os membros da RCC é essencial para o sucesso deste projeto." \n"Cada um de nós tem um papel vital a desempenhar na edificação e expansão da RCC em Curitiba."',
  },
];

const AmoRcc = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-blue-950 to-green-900 text-white py-12 px-4 sm:px-6 lg:px-8 font-sans"
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-10 text-green-100 drop-shadow-lg tracking-wide">
          💚 Projeto Eu Amo a RCC
        </h1>

        <div className="grid gap-8 sm:grid-cols-2">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center text-center">
                {section.icon}
                <h2 className="text-2xl font-semibold text-green-100 mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-200 whitespace-pre-line text-base leading-relaxed">
                  {section.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-md transition-transform duration-300 hover:scale-105 border border-white/20"
          >
            ⬅️ Voltar para Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AmoRcc;
