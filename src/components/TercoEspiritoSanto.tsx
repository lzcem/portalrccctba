// src/components/TercoEspiritoSanto.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
    FaFire, FaPray, FaCross, FaDownload, FaVideo,
    FaDove, FaWhatsapp, FaUsers, FaCalendarAlt, FaStar
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface PassoTerco {
    titulo: string;
    instrucao: string;
    texto: string;
    icone: JSX.Element;
    repeticao?: string;
    conclusao?: string;
}

const TercoEspiritoSanto: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);

    const conclusaoMisterio = "Maria, que, por obra do Espírito Santo, concebeste o Salvador, roga por nós!";

    const passos: PassoTerco[] = [
        { titulo: "Início", instrucao: "Oração Inicial", texto: "Vinde, ó Deus, em meu auxílio. Socorrei-me sem demora. Glória ao Pai, ao Filho e ao Espírito Santo, como era no princípio agora e sempre, amém!", icone: <FaCross /> },
        { titulo: "1º Dom", instrucao: "Mistério da Sabedoria", texto: "Vem, Espírito de Sabedoria, desapega-nos das coisas da terra e infunde em nós o amor e o gosto pelas coisas do céu.", repeticao: "Reze 7x: Pai Santo, no nome de Jesus, manda o Teu Espírito para renovar o mundo!", conclusao: conclusaoMisterio, icone: <FaFire className="text-orange-500" /> },
        { titulo: "2º Dom", instrucao: "Mistério do Entendimento", texto: "Vem, Espírito de Entendimento, ilumina a nossa mente com a luz da Tua Eterna Verdade e a enriquece de santos pensamentos.", repeticao: "Reze 7x: Pai Santo...", conclusao: conclusaoMisterio, icone: <FaFire className="text-orange-600" /> },
        { titulo: "3º Dom", instrucao: "Mistério do Conselho", texto: "Vem, Espírito de Conselho faz-nos dóceis às tuas inspirações e guia-nos na via da salvação.", repeticao: "Reze 7x: Pai Santo...", conclusao: conclusaoMisterio, icone: <FaFire className="text-red-500" /> },
        { titulo: "4º Dom", instrucao: "Mistério da Fortaleza", texto: "Vem, Espírito de Fortaleza, e dá-nos a força, constância e vitória nas batalhas contra os nossos inimigos espirituais.", repeticao: "Reze 7x: Pai Santo...", conclusao: conclusaoMisterio, icone: <FaFire className="text-red-600" /> },
        { titulo: "5º Dom", instrucao: "Mistério da Ciência", texto: "Vem, Espírito de Ciência, seja o Mestre de nossas almas e ajuda-nos a colocar em prática os Seus Ensinamentos.", repeticao: "Reze 7x: Pai Santo...", conclusao: conclusaoMisterio, icone: <FaStar className="text-yellow-500" /> },
        { titulo: "6º Dom", instrucao: "Mistério da Piedade", texto: "Vem, Espírito de Piedade, vem habitar em nossos corações para possuir e santificar todos os nossos afetos.", repeticao: "Reze 7x: Pai Santo...", conclusao: conclusaoMisterio, icone: <FaFire className="text-blue-500" /> },
        { titulo: "7º Dom", instrucao: "Mistério do Temor de Deus", texto: "Vem, o Espírito de Santo Temor de Deus, reina sobre a nossa vontade e faz com que sejamos sempre dispostos a sofrer todos os males, antes que pecar.", repeticao: "Reze 7x: Pai Santo...", conclusao: conclusaoMisterio, icone: <FaFire className="text-gray-700" /> },
        { titulo: "Maria I", instrucao: "1ª Invocação Final", texto: "Ó, puríssima Virgem Maria, que em tua imaculada conceição, foste constituída pelo Espírito Santo em tabernáculo eleito da Divindade, roga por nós: para que o Paráclito venha logo a renovar a face da terra.", repeticao: "Reze: 1 Ave Maria", icone: <FaDove className="text-blue-400" /> },
        { titulo: "Maria II", instrucao: "2ª Invocação Final", texto: "Ó, puríssima Virgem Maria, que no mistério da encarnação foste constituída verdadeiramente Mãe de Deus, roga por nós: para que o Paráclito venha logo a renovar a face da terra.", repeticao: "Reze: 1 Ave Maria", icone: <FaDove className="text-blue-500" /> },
        { titulo: "Maria III", instrucao: "3ª Invocação Final", texto: "Ó, puríssima Virgem Maria, que perseverando em oração no Cenáculo com os apóstolos, foste abundantemente inflamada pelo Espírito Santo, roga por nós: para que o Paráclito venha logo a renovar a face da terra.", repeticao: "Reze: 1 Ave Maria", icone: <FaDove className="text-blue-600" /> },
        {
            titulo: "Consagração",
            instrucao: "Oração a Nossa Senhora de Pentecostes",
            texto: "Maria, Filha predileta do Pai, Mãe Santíssima do Nosso Senhor Jesus Salvador, Esposa mística do Espírito Santo, Nossa Senhora de Pentecostes. Nós nos consagramos ao vosso maternal amor e vos tomamos como modelo perfeito de louvor a Deus, de santidade, de espírito missionário e evangelizador. Vós, que no dia de Pentecostes, junto com os apóstolos, ficastes repleta do inefável dom do Espírito Santo, ajudai-nos, na efusão do mesmo Espírito que recebemos no dia do Batismo, a sermos constantemente fiéis ao Senhor. Amém! Nossa Senhora de Pentecostes, rogai por nós que recorremos a Vós!",
            icone: <FaPray className="text-amber-600" />
        },
        {
            titulo: "Final",
            instrucao: "Oração Final",
            texto: "Venha sobre nós o Teu Espírito, Senhor, transforme-nos interiormente com Teus dons: cria em nós um novo coração para que possamos agradar-Te e conformar-nos à Tua santa vontade. Por Cristo, Nosso Senhor, Amém!",
            icone: <FaFire className="text-red-600" />
        }
    ];

    const shareText = encodeURIComponent("Una-se a nós no Terço ao Espírito Santo rumo a Pentecostes! Início dia 16/03. Veja o guia: https://www.rcccuritiba.com.br");

    return (
        <section className="w-full py-12 px-2 sm:px-6 relative overflow-hidden">
            {/* Fundo Animado Temático */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 -z-10" />
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-20 -right-20 w-96 h-96 bg-orange-400 rounded-full blur-[100px] -z-10"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md border border-orange-200 rounded-[3rem] shadow-2xl overflow-hidden"
            >
                <div className="p-6 sm:p-10 flex flex-col lg:flex-row gap-8 items-stretch relative z-10">

                    {/* Lado Esquerdo: Identidade (Configurado como Flexbox para expandir a imagem) */}
                    <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-orange-100 pb-8 lg:pb-0 lg:pr-8 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <h2 className="text-3xl font-serif font-black text-gray-800 leading-tight mb-2">
                            Terço ao <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 italic">Espírito Santo</span>
                        </h2>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-2xl mb-6 shadow-lg shadow-red-200"
                        >
                            <FaCalendarAlt className="animate-pulse" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Início 16 de Março</p>
                        </motion.div>


                        <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-5 rounded-3xl border border-amber-200 w-full mb-4">
                            <h5 className="text-amber-900 font-bold text-xs mb-3 flex items-center gap-2 justify-center lg:justify-start">
                                <FaUsers className="text-white-500 animate-pulse text-6xl" /> Compartilhe esta notícia com três irmãos e comece a semana rezando com eles.
                            </h5>
                            <a
                                href={`https://wa.me/?text=${shareText}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-md"
                            >
                                <FaWhatsapp size={16} /> Convidar Servos
                            </a>
                        </div>

                        {/* Container da Imagem ajustado para ser menor em mobile e maior em desktop */}
                        <div className="flex-grow w-full flex items-center justify-center py-4 lg:py-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                /* w-32: Tamanho pequeno em mobile 
                                   sm:w-48: Médio em tablets
                                   lg:w-full: Tamanho original em desktop
                                */
                                className="w-31 sm:w-48 lg:w-full h-auto max-h-[180px] sm:max-h-[250px] lg:max-h-[350px] flex items-center justify-center relative"
                            >
                                {/* Efeito de Glória/Fogo atrás da pomba */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-orange-400/30 via-orange-100/5 to-transparent blur-2xl sm:blur-3xl animate-pulse" />

                                <motion.img
                                    src="/pomba-espirito-santo1.png"
                                    alt="Símbolo do Espírito Santo"
                                    className="w-full h-full object-contain relative z-10"
                                    style={{ filter: "drop-shadow(0 0 8px rgba(180, 83, 9, 0.3))" }}
                                    animate={{
                                        y: [0, -8, 0], // Movimento mais suave em telas menores
                                    }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    onError={(e) => {
                                        e.currentTarget.src = "https://www.rcccuritiba.com.br/api/assets/pomba-espirito-santo1.png";
                                    }}
                                />
                            </motion.div>
                        </div>

                    </div>

                    {/* Lado Direito: Guia Principal */}
                    <div className="flex-1 w-full">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-8">
                            {passos.map((p, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveStep(idx)}
                                    className={`flex flex-col items-center justify-center py-3 rounded-2xl transition-all border-2 ${activeStep === idx
                                        ? "bg-gradient-to-br from-orange-500 to-red-600 text-white border-transparent shadow-xl scale-110 z-20"
                                        : "bg-white text-gray-400 border-gray-100 hover:border-orange-200 hover:bg-orange-50"
                                        }`}
                                >
                                    <span className="text-lg mb-1">{p.icone}</span>
                                    <span className="text-[8px] font-black uppercase text-center px-1">{p.titulo}</span>
                                </button>
                            ))}
                        </div>

                        <div className="min-h-[380px] sm:min-h-[300px] flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStep}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-gradient-to-br from-white to-orange-50/50 rounded-[2.5rem] p-8 sm:p-10 border border-orange-100 shadow-inner relative"
                                >
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="absolute top-6 right-8 text-orange-200/40 text-6xl"
                                    >
                                        {passos[activeStep].icone}
                                    </motion.div>

                                    <div className="relative z-10">
                                        <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6 inline-block">
                                            {passos[activeStep].instrucao}
                                        </span>

                                        <p className="text-gray-800 text-xl sm:text-2xl font-serif italic leading-relaxed mb-8">
                                            {passos[activeStep].texto}
                                        </p>

                                        <div className="grid gap-4">
                                            {passos[activeStep].repeticao && (
                                                <div className="bg-gray-900 text-white p-5 rounded-2xl flex items-start gap-4 shadow-xl">
                                                    <FaFire className="text-orange-500 mt-1 shrink-0 animate-pulse" />
                                                    <p className="text-xs sm:text-sm font-bold tracking-wide">{passos[activeStep].repeticao}</p>
                                                </div>
                                            )}

                                            {passos[activeStep].conclusao && (
                                                <div className="bg-white border-l-8 border-blue-400 p-5 rounded-r-2xl shadow-sm border-y border-r border-blue-50">
                                                    <p className="text-[11px] text-blue-900 font-medium italic">
                                                        <span className="font-black uppercase text-[9px] text-blue-500 block mb-1">Conclusão do Mistério</span>
                                                        {passos[activeStep].conclusao}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/tercoEspiritoSanto"
                                className="flex-1 bg-gray-900 text-white hover:bg-orange-600 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center transition-all flex items-center justify-center gap-3 shadow-xl group"
                            >
                                <FaDownload className="text-orange-400 group-hover:animate-bounce" /> Abrir Folheto PDF
                            </Link>
                            <a
                                href="https://rccbrasil.org.br/terco-ao-espirito-santo/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-white text-gray-900 border-2 border-orange-100 hover:border-red-500 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center transition-all flex items-center justify-center gap-3 group"
                            >
                                <FaVideo className="text-red-600 group-hover:scale-125 transition-transform" />
                                Rezar em Vídeo
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default TercoEspiritoSanto;