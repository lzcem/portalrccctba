import { useEffect, ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { FaBible, FaCross, FaUsers, FaMusic, FaChild, FaShieldAlt, FaInfoCircle, FaCalendarAlt, FaThumbsUp, FaShareAlt } from "react-icons/fa";

// Componente Card with explicit typing
function Card({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-purple-800 bg-opacity-80 p-6 rounded-2xl shadow-xl backdrop-blur-md hover:bg-purple-700 transition-all"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="text-yellow-300 text-3xl">{icon}</div>
        <h3 className="text-xl font-semibold text-yellow-100">{title}</h3>
      </div>
      <p className="text-gray-200 text-base">{children}</p>
    </motion.div>
  );
}

// Função para gerar cor aleatória
function randomColor() {
  const colors = ['#ff0', '#f0f', '#0ff', '#f88', '#8f8', '#88f', '#fff'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Componente de Animação de Confetes e Serpentinas
function ConfettiAnimation() {
  const confettiCount = 50;
  const streamerCount = 20;
  const confettis = Array.from({ length: confettiCount });
  const streamers = Array.from({ length: streamerCount });



  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {/* Confetes */}
      {confettis.map((_, i) => (
        <span
          key={`confetti-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            backgroundColor: randomColor(),
            animation: `fall ${3 + Math.random() * 2}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      {/* Serpentinas */}
      {streamers.map((_, i) => (
        <span
          key={`streamer-${i}`}
          className="absolute w-1 h-20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            backgroundColor: randomColor(),
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `float ${4 + Math.random() * 3}s linear infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-100vh) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        @keyframes float {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 0.8; }
          50% { opacity: 0.5; }
          100% { transform: translateY(100vh) rotate(180deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function Gabaon() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const [likes, setLikes] = useState<number>(0);
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  ///Curtidas e Compartilhamentos

  fetch(`${API_BASE_URL}/api/likes?page=gabaon`)
    .then((res) => res.json())
    .then((data) => setLikes(data.likes || 0))
    .catch((err) => console.error('Erro ao carregar curtidas:', err));

  const handleLike = async () => {
    const userId = localStorage.getItem('userId') || crypto.randomUUID();
    localStorage.setItem('userId', userId);

    try {
      const response = await fetch(`${API_BASE_URL}/api/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 'gabaon', userId, action: 'like' }),
      });
      if (!response.ok) throw new Error('Falha ao processar curtida');
      const data = await response.json();
      setLikes(data.likes || likes + (userLiked ? -1 : 1));
      setUserLiked(!userLiked);
    } catch (err) {
      console.error('Erro ao curtir:', err);
      setError('Erro ao registrar curtida. Tente novamente.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Gabaon 2026 - RCC Curitiba",
        text: "Participe do Gabaon 2026! Um evento de fé e alegria. Confira: ",
        url: window.location.href,
      });
    } else {
      const shareUrl = window.location.href;
      const shareOptions = [
        { name: "WhatsApp", url: `https://wa.me/?text=${encodeURIComponent(`Participe do Gabaon 2026! ${shareUrl}`)}` },
        { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
        { name: "Twitter", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Participe do Gabaon 2026! ${shareUrl}`)}` },
      ];
      alert(`Copie o link ou compartilhe via:\n${shareOptions.map((o) => o.name).join(", ")}\nLink: ${shareUrl}`);
      navigator.clipboard.writeText(shareUrl);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="text-white bg-gradient-to-b from-purple-900 to-black min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none">
        <ConfettiAnimation />
      </div>
      <section className="max-w-6xl mx-auto px-6 space-y-10 relative z-10">
        {/* Seção da Logo */}
        <motion.div
          className="flex justify-center mb-8"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <img src="/gabaon.png" alt="Logo Gabaon" className="w-44 h-auto object-contain" />
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl font-bold text-center text-yellow-300"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          Um poderoso projeto de evangelização
        </motion.h1>

        <motion.div
          className="text-lg leading-relaxed text-center"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <p>
            O Gabaon é uma iniciativa da RCC Curitiba que transforma o Carnaval em um momento de encontro com Deus,
            oferecendo alegria, oração, música e comunhão. Um projeto vivo, santo e vibrante para evangelizar corações!
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-10"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <Card icon={<FaBible />} title="O que é o Gabaon?">
            Um grande evento de evangelização com louvor, pregação, adoração e shows, promovendo a fé cristã.
          </Card>
          <Card icon={<FaCross />} title="Por que Gabaon?">
            Inspirado em Josué 10, proclamamos a vitória sobre as trevas e clamamos para que o sol da justiça brilhe sobre Curitiba.
          </Card>
          <Card icon={<FaUsers />} title="Público Alvo">
            Crianças, jovens e adultos. Aberto a todos que buscam uma experiência de fé e alegria.
          </Card>
          <Card icon={<FaMusic />} title="Metodologia">
            Evangelização através de Bíblia, sacramentos, shows, dança, teatro, louvor e o GABAON KIDS.
          </Card>
          <Card icon={<FaChild />} title="GABAON KIDS">
            Espaço dedicado à recreação e evangelização para crianças, com voluntários especializados.
          </Card>
          <Card icon={<FaShieldAlt />} title="Saúde e Segurança">
            Equipe de saúde voluntária e suporte médico disponível para garantir bem-estar.
          </Card>
          <Card icon={<FaInfoCircle />} title="Informações">
            Um evento inclusivo com atrações que celebram a fé, a cultura e a união da comunidade.
          </Card>
          <Card icon={<FaCalendarAlt />} title="Gabaon 2026">
            Participe da próxima edição em fevereiro de 2026! Fique atento para mais detalhes!
          </Card>
        </motion.div>

        {/* Seção de Fotos */}
        <motion.div className="mt-12" variants={fadeIn} initial="hidden" animate="visible">
          <h2 className="text-2xl font-bold text-yellow-200 text-center mb-6">Galeria de Fotos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <img src="/gabaon04.jpg" alt="Logo Gabaon" className="w-full h-48 object-cover rounded-lg shadow-md" />
            <img src="/gabaon02.jpg" alt="Foto Gabaon 2" className="w-full h-48 object-cover rounded-lg shadow-md" />
            <img src="/gabaon03.jpg" alt="Foto Gabaon 3" className="w-full h-48 object-cover rounded-lg shadow-md" />
            <img src="/gabaon01.jpg" alt="Foto Gabaon 3" className="w-full h-48 object-cover rounded-lg shadow-md" />
            <img src="/gabaon07.jpg" alt="Foto Gabaon 3" className="w-full h-48 object-cover rounded-lg shadow-md" />
            <img src="/gabaon06.jpg" alt="Foto Gabaon 3" className="w-full h-48 object-cover rounded-lg shadow-md" />
          </div>
        </motion.div>

        {/* Seção de Vídeos */}
        <motion.div className="mt-12" variants={fadeIn} initial="hidden" animate="visible">
          <h2 className="text-2xl font-bold text-yellow-200 text-center mb-6">Vídeos do Gabaon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/DoTtYWX6-3E?controls=2&modestbranding=1&rel=0&autoplay=0"
              title="Vídeo 1 do Gabaon"
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-48 rounded-lg shadow-md"
              style={{ aspectRatio: "16/9" }}
            ></iframe>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/--et5BA5Uco?controls=2&modestbranding=1&rel=0&autoplay=0"
              title="Vídeo 2 do Gabaon"
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-48 rounded-lg shadow-md"
              style={{ aspectRatio: "16/9" }}
            ></iframe>
          </div>
        </motion.div>

        <motion.div className="mt-16 text-center" variants={fadeIn} initial="hidden" animate="visible">
          <h2 className="text-2xl font-bold text-yellow-200 mb-4">Alegraram-se ao ver o Senhor! (Jo 20, 20b)</h2>
          <p className="text-lg text-gray-200">Participe desse movimento de fé, compartilhe e evangelize com a RCC Curitiba!</p>
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
            >
              <FaThumbsUp /> {likes} Curtir
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
            >
              <FaShareAlt /> Compartilhar
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}