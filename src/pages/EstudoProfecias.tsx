// src/pages/EstudoProfecias.tsx
import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import {
  BookOpen, Sparkles, Home
} from "lucide-react";
import { FaDove } from "react-icons/fa";

export default function EstudoProfecias() {
  const heroRef = useRef(null);
  const introRef = useRef(null);
  const cap1Ref = useRef(null);
  const cap2Ref = useRef(null);
  const conclusaoRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const isIntroInView = useInView(introRef, { once: true, margin: "-100px" });
  const isCap1InView = useInView(cap1Ref, { once: true, margin: "-100px" });
  const isCap2InView = useInView(cap2Ref, { once: true, margin: "-100px" });
  const isConclusaoInView = useInView(conclusaoRef, { once: true, margin: "-100px" });

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const fadeLeft: Variants = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-indigo-50">

      {/* HERO */}
      <section ref={heroRef} className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-indigo-600/10" />
        <motion.div
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="container mx-auto px-6 text-center relative z-10"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-20 h-20 mx-auto text-yellow-400 drop-shadow-xl" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-teal-900 mb-6 leading-tight">
            Estudo Profundo
          </h1>
          <h2 className="text-2xl md:text-3xl font-serif text-teal-700 mb-6 italic">
            O Carisma da Profecia na RCC Brasil
          </h2>
          <p className="text-lg md:text-xl text-teal-700 max-w-4xl mx-auto leading-relaxed opacity-90">
            Uma jornada espiritual para compreender, viver e discernir o dom profético à luz da Palavra e do Espírito Santo.
          </p>
        </motion.div>
      </section>

      {/* BREADCRUMB */}
      <nav className="container mx-auto px-6 py-6">
        <ol className="flex items-center gap-2 text-sm font-medium">
          <li>
            <a href="/" className="text-teal-600 hover:text-teal-800 flex items-center gap-1">
              <Home className="w-4 h-4" /> Início
            </a>
          </li>
          <li className="text-teal-900">Estudo Profecias</li>
        </ol>
      </nav>

      {/* INTRODUÇÃO */}
      <section ref={introRef} className="container mx-auto px-6 py-12 max-w-5xl">
        <motion.div
          initial="hidden"
          animate={isIntroInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
          }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-teal-100"
        >
          <p className="text-teal-800 leading-relaxed text-lg text-justify mb-6">
            O carisma da profecia é uma <strong>chamada do Espírito Santo</strong> para nos conduzir à santidade, à missão e à renovação da Igreja. Ele nos alerta, consola e orienta conforme os desígnios divinos.
          </p>
          <div className="bg-amber-50/80 border-l-4 border-amber-400 p-5 rounded-r-xl mb-6">
            <p className="text-amber-900 italic text-center text-sm font-medium">
              “<strong>O Espírito Santo sopra onde quer, e seus dons despertam os corações à conversão.</strong>”
            </p>
          </div>
          <div className="text-center">
            <a
              href="https://www.youtube.com/@RCCBRASIL"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-xl transition-all"
            >
              <FaDove className="w-5 h-5" /> RCCBRASIL no YouTube
            </a>
          </div>
        </motion.div>
      </section>

      {/* CAPÍTULO 1 */}
      <section ref={cap1Ref} className="container mx-auto px-6 py-16 max-w-5xl">
        <motion.div
          initial="hidden"
          animate={isCap1InView ? "visible" : "hidden"}
          variants={fadeLeft}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 md:p-14 border border-teal-100"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-teal-900 mb-10 flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-teal-600" />
            Fundamentos Bíblicos da Profecia
          </h2>

          <div className="mb-12">
            <h3 className="text-xl font-bold text-teal-800 mb-4">No Antigo Testamento</h3>
            <p className="text-teal-700 leading-relaxed mb-4">
              Profetas como Isaías, Jeremias e Amós foram instrumentos de Deus para chamar o povo à fidelidade. A profecia anunciava juízo, mas também esperança, revelando o amor de Deus e a urgência da conversão (Am 3,7; Is 61,1-3).
            </p>
            <p className="text-teal-700 leading-relaxed mb-4">
              O dom profético era muitas vezes acompanhado de sinais, sonhos e visões, apontando não apenas para acontecimentos futuros, mas para a transformação espiritual do coração humano.
            </p>
          </div>

          <div className="my-12 bg-gradient-to-r from-indigo-50 to-teal-50 p-6 rounded-2xl shadow-inner">
            <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden shadow-xl">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/SbKoiGL5Xw8"
                title="Dom da Profecia"
                allowFullScreen
              />
            </div>
            <p className="text-center mt-4 text-sm font-medium text-indigo-700">Formação: <strong>O Dom da Profecia</strong> – Márcio Mendes</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-indigo-800 mb-4">Nos Tempos Atuais</h3>
            <p className="text-indigo-700 leading-relaxed mb-4">
              Hoje, a profecia fortalece a Igreja, denuncia o pecado e convida à renovação espiritual. É um dom para discernir os tempos, apontar caminhos de unidade e encorajar a missão evangelizadora.
            </p>
            <p className="text-indigo-700 leading-relaxed">
              Exercer a profecia exige intimidade com Deus, humildade, oração e submissão à autoridade eclesial, garantindo que a mensagem seja sempre edificante e centrada em Cristo.
            </p>
          </div>
        </motion.div>
      </section>

      {/* CAPÍTULO 2 */}
      <section ref={cap2Ref} className="container mx-auto px-6 py-16 max-w-5xl">
        <motion.div
          initial="hidden"
          animate={isCap2InView ? "visible" : "hidden"}
          variants={fadeLeft}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 md:p-14 border border-teal-100"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-teal-900 mb-10 flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-teal-600" />
            Vivendo o Dom da Profecia
          </h2>

          <p className="text-teal-700 leading-relaxed mb-6">
            O dom da profecia não é apenas para “ver o futuro”, mas para <strong>transformar vidas hoje</strong>. Ele inspira conversão pessoal, decisões sábias e discernimento comunitário.
          </p>

          <p className="text-teal-700 leading-relaxed mb-6">
            Quem profetiza deve sempre buscar a <strong>pureza de coração</strong>, oração constante e obediência à Palavra. A profecia se manifesta na edificação, consolo e exortação, sendo instrumento de graça e comunhão.
          </p>

          <p className="text-teal-700 leading-relaxed mb-6">
            A prática do dom envolve ouvir a voz de Deus, discernir os sinais do Espírito e compartilhar a mensagem com amor, sempre respeitando os limites da comunidade eclesial.
          </p>

          <div className="mt-8 rounded-2xl overflow-hidden shadow-xl border border-amber-200">
            <img src="/profetaisaias.png" alt="Profecia em ação" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </motion.div>
      </section>

      {/* CONCLUSÃO */}
      <section ref={conclusaoRef} className="container mx-auto px-6 py-16 max-w-5xl">
        <motion.div
          initial="hidden"
          animate={isConclusaoInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
          }}
          className="bg-gradient-to-r from-emerald-50 to-teal-50 p-10 rounded-3xl border-l-4 border-emerald-500 text-center shadow-xl"
        >
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-emerald-900 mb-6">
            Aplicando as Profecias Hoje
          </h3>
          <p className="text-emerald-800 leading-relaxed text-lg mb-6 max-w-3xl mx-auto">
            Viver o carisma da profecia é ser <strong>um instrumento de Deus no presente</strong>. Cada palavra profética nos desafia à conversão diária, missão ousada e unidade na Igreja.
          </p>
          <p className="text-emerald-700 italic mb-8">
            “Quero que o ímpio se converta e viva” (Ez 33,11).
          </p>

          <div className="bg-white/80 p-6 rounded-2xl mb-8 max-w-xl mx-auto">
            <h4 className="font-bold text-teal-900 mb-3">Convite à Oração</h4>
            <p className="text-teal-700 text-sm">
              <strong>Reflita:</strong> Qual mensagem profética toca seu coração hoje?<br />
              <strong>Partilhe</strong> no seu grupo de oração e busque discernimento.
            </p>
          </div>

          <p className="text-2xl font-serif text-teal-900">
            Que o Espírito Santo desperte em você o dom da profecia e o conduza à santidade. <strong>Amém.</strong>
          </p>
        </motion.div>
      </section>

      {/* BOTÃO FLUTUANTE DE VOLTAR */}
      <motion.button
        onClick={() => window.history.back()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-20 z-50 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-indigo-600 text-white rounded-full font-semibold shadow-2xl hover:shadow-2xl transition-all"
      >
        <svg className="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </motion.button>

    </div>
  );
}
