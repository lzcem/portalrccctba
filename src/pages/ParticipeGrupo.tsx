import React from 'react';
import { Link } from 'react-router-dom';

const ParticipeGrupo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-green-900 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Participe de um Grupo de Oração</h1>
        <p className="text-lg mb-6">
          Venha fazer parte de uma comunidade viva de fé! Participar de um Grupo de Oração traz renovação espiritual, fortalecimento da fé e a experiência transformadora do Espírito Santo. É um espaço de louvor, intercessão e crescimento pessoal.
        </p>
        <p className="text-md mb-8">
          Nos Grupos de Oração, você encontrará irmãos em Cristo que se reúnem para orar, compartilhar a Palavra e viver o carisma de Pentecostes. O Espírito Santo age poderosamente, trazendo paz, cura e unidade.
        </p>
        <Link
          to="/mapa-grupos"
          className="bg-red-600 text-yellow-300 px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Encontre seu Grupo de Oração
        </Link>
      </div>
    </div>
  );
};

export default ParticipeGrupo;