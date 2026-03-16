import { Link } from 'react-router-dom';
const GroupPrayerSection = () => {
  return (
    <section className="mb-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-blue-900 to-green-800 rounded-xl p-6 shadow-lg border border-green-300/50">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white text-center tracking-wide">
          O Que é um Grupo de Oração da Renovação Carismática?
        </h2>
        <div className="space-y-4 text-gray-200">
          <p className="text-base sm:text-lg font-medium leading-relaxed">
            Um grupo de oração da Renovação Carismática Católica é um espaço vibrante de comunhão onde os fiéis se reúnem para adorar a Deus, buscar a ação do Espírito Santo e crescer na fé cristã.
          </p>
          <p className="text-base sm:text-lg font-medium leading-relaxed">
            Inspirado no Pentecostes, esse movimento busca revitalizar a Igreja por meio de uma experiência pessoal com o Espírito, marcada por cânticos de louvor, oração carismática, meditação na Palavra de Deus e partilha fraterna.
          </p>
          <p className="text-base sm:text-lg font-medium leading-relaxed">
            É um ambiente acolhedor que promove a cura espiritual, o batismo no Espírito e a missão evangelizadora, sendo aberto a todos que desejam viver uma fé mais intensa e transformadora. Esses grupos são o coração pulsante da Renovação Carismática, espalhando a alegria do Evangelho em comunidades ao redor do mundo.
          </p>
        </div>
        <br></br>
        <section className="mb-6 max-w-7xl mx-auto text-center">
          <Link to="/grupos-hoje" className="bg-blue-900 hover:bg-green-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors duration-200 border-2 border-white">

            Veja os Grupos que se reúnem hoje
          </Link>
        </section>
      </div>

    </section>
  );
};

export default GroupPrayerSection;

