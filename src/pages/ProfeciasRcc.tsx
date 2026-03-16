'use client';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import {
    Download,
    Share2,
    Star,
    Heart,
    Flame,
    Sun,
    Cloud,
    Zap,
    Anchor,
    Cross,
    Sparkles,
    Mountain,
    TreePine,
    Waves,
    Wind,
    Lightbulb,
    Shield,
    Sword,
    Crown,
    Gem,
    Flower,
    Leaf,
    Feather,
    X,
    Search,
    Filter,
} from "lucide-react";
import { FaDove } from "react-icons/fa";

import temas from "../data/temaAno.json";
import ProfeciaCard from "../components/ProfeciaCard";
import { useProfecias } from "../hooks/useProfecias";
import type { Profecia } from "../Types/profecias";

// ---------------------------------------------------------------
// TIPOS
// ---------------------------------------------------------------
interface TemaAno {
    year: number;
    theme: string;
    icon: string;
    bg: string;
    explicacao: string;
    biblia: string;
}

// ---------------------------------------------------------------
// MAPEAMENTO DE ÍCONES
// ---------------------------------------------------------------
const iconMap: Record<string, JSX.Element> = {
    Star: <Star className="w-8 h-8 text-yellow-600" />,
    Heart: <Heart className="w-8 h-8 text-red-600" />,
    Flame: <Flame className="w-8 h-8 text-orange-600" />,
    Sun: <Sun className="w-8 h-8 text-amber-600" />,
    Cloud: <Cloud className="w-8 h-8 text-sky-600" />,
    Zap: <Zap className="w-8 h-8 text-yellow-500" />,
    Anchor: <Anchor className="w-8 h-8 text-indigo-600" />,
    Cross: <Cross className="w-8 h-8 text-purple-700" />,
    FaDove: <FaDove className="w-8 h-8 text-teal-600" />,
    Sparkles: <Sparkles className="w-8 h-8 text-pink-600" />,
    Mountain: <Mountain className="w-8 h-8 text-emerald-700" />,
    TreePine: <TreePine className="w-8 h-8 text-green-700" />,
    Waves: <Waves className="w-8 h-8 text-cyan-600" />,
    Wind: <Wind className="w-8 h-8 text-blue-600" />,
    Lightbulb: <Lightbulb className="w-8 h-8 text-yellow-400" />,
    Shield: <Shield className="w-8 h-8 text-amber-700" />,
    Sword: <Sword className="w-8 h-8 text-gray-700" />,
    Crown: <Crown className="w-8 h-8 text-yellow-700" />,
    Gem: <Gem className="w-8 h-8 text-purple-600" />,
    Flower: <Flower className="w-8 h-8 text-pink-500" />,
    Leaf: <Leaf className="w-8 h-8 text-lime-600" />,
    Feather: <Feather className="w-8 h-8 text-indigo-500" />,
    default: <Star className="w-8 h-8 text-gray-600" />,
};

// ---------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ---------------------------------------------------------------
const EstudoProfecias: React.FC = () => {
    const {
        profecias,
        anos,
        anoSelecionado,
        setAnoSelecionado,
        busca,
        setBusca,
    } = useProfecias();

    const [selectedTema, setSelectedTema] = useState<TemaAno | null>(null);
    const [selecionadasTema, setSelecionadasTema] = useState<TemaAno[]>([]);
    const [profeciaAberta, setProfeciaAberta] = useState<Profecia | null>(null);
    const [selecionadasProfecias, setSelecionadasProfecias] = useState<Profecia[]>([]);

    useEffect(() => {
        if (profeciaAberta || selectedTema) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [profeciaAberta, selectedTema]);

    const temasAno: TemaAno[] = temas as TemaAno[];
    const totalSelecionados = selecionadasTema.length + selecionadasProfecias.length;
    const itensSelecionados = [...selecionadasTema, ...selecionadasProfecias];

    // -------------------------------------------------------------
    // FUNÇÕES DE SELEÇÃO
    // -------------------------------------------------------------
    const toggleSelecaoTema = (item: TemaAno) => {
        setSelecionadasTema((prev) =>
            prev.some((s) => s.year === item.year)
                ? prev.filter((s) => s.year !== item.year)
                : [...prev, item]
        );
    };

    const toggleSelecaoProfecia = (p: Profecia) => {
        setSelecionadasProfecias((prev) =>
            prev.some((s) => s.id === p.id)
                ? prev.filter((s) => s.id !== p.id)
                : [...prev, p]
        );
    };

    // -------------------------------------------------------------
    // UTILIDADES (PDF + Compartilhar)
    // -------------------------------------------------------------
    const stripHtml = (html: string): string => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };

    const baixarPDF = (itens: any[], tituloPadrao: string) => {
        if (itens.length === 0) return;
        const doc = new jsPDF();
        let y = 20;

        const title = itens.length === 1
            ? "theme" in itens[0] ? itens[0].theme : itens[0].titulo
            : tituloPadrao;

        doc.setFontSize(16);
        doc.text(title, 20, y);
        y += 15;

        itens.forEach((item) => {
            if (y > 270) { doc.addPage(); y = 20; }

            doc.setFontSize(12);
            const header = "theme" in item ? String(item.year) : String(item.ano);
            doc.text(header, 20, y);
            y += 8;

            const texto = "theme" in item ? item.explicacao : stripHtml(item.conteudo);
            const lines = doc.splitTextToSize(texto, 170);
            doc.setFontSize(11);
            lines.forEach((line: string) => {
                if (y > 280) { doc.addPage(); y = 20; }
                doc.text(line, 20, y);
                y += 7;
            });
            y += 10;
        });

        doc.save(`${title.replace(/[^a-z0-9]/gi, "_")}.pdf`);
    };

    const compartilhar = (itens: any[], tituloPadrao: string) => {
        if (itens.length === 0) return;

        const textos = itens.map((item) => {
            if ("theme" in item) {
                return `${item.year} – ${item.theme}\n${item.explicacao}`;
            } else {
                return `${item.titulo} (${item.ano})\n${stripHtml(item.conteudo)}`;
            }
        }).join("\n\n---\n\n");

        const url = `${window.location.origin}${window.location.pathname}`;
        const mensagem = `${tituloPadrao}:\n\n${textos}\n\nLeia mais: ${url}`;

        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`, "_blank");
    };

    // -------------------------------------------------------------
    // RENDER
    // -------------------------------------------------------------
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-4 sm:p-6 md:p-8 font-[Inter,system-ui,sans-serif] antialiased">

            {/* ==================== INTRODUÇÃO ==================== */}
            <div className="bg-gradient-to-br from-white via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100 rounded-3xl shadow-2xl p-8 sm:p-12 mb-12 overflow-hidden transition-all duration-500 hover:shadow-3xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-center text-amber-700 dark:text-amber-300 mb-8 leading-snug tracking-tight">
                    Linha do Tempo dos Temas do Ano da RCC Brasil
                </h1>

                <div className="space-y-6 text-base sm:text-lg leading-relaxed text-center max-w-3xl mx-auto">
                    <p>
                        Desde <strong className="text-amber-800 dark:text-amber-200">2003</strong>, a{" "}
                        <strong className="text-teal-700 dark:text-teal-300">Renovação Carismática Católica do Brasil</strong>{" "}
                        recebe anualmente um <em className="italic text-amber-900 dark:text-amber-100">Tema do Ano</em> — uma Palavra Norteadora, fruto de um profundo tempo de{" "}
                        <strong className="text-teal-700 dark:text-teal-300">escuta profética</strong> do Conselho Nacional.
                    </p>

                    <p>
                        Após oração e discernimento, essa mensagem é enviada a <em>todos os Grupos de Oração do país</em>, orientando as ações missionárias, a formação e a vivência da fé ao longo do ano.
                    </p>

                    <div className="my-8 p-6 sm:p-8 bg-gradient-to-r from-teal-100/70 to-cyan-100/70 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-2xl border border-teal-200 dark:border-teal-700 shadow-inner">
                        <p className="text-base sm:text-lg italic text-teal-800 dark:text-teal-200 font-medium tracking-wide">
                            “As profecias se cumprem no tempo de Deus — mas apenas quando o Seu povo <strong>não se esquece delas</strong>.”
                        </p>
                    </div>

                    <p>
                        Abaixo, você encontrará as{" "}
                        <strong className="text-purple-700 dark:text-purple-300">principais profecias</strong> de alcance nacional e internacional recebidas pela RCC. Palavras vivas que continuam a guiar, consolar e desafiar o povo de Deus.
                    </p>
                </div>

                <div className="flex justify-center mt-8">
                    <div className="w-20 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-teal-400 rounded-full animate-pulse"></div>
                </div>
            </div>

            {/* ==================== LINHA DO TEMPO ==================== */}
            <section className="py-12">
                <h2 className="text-3xl font-serif font-bold text-center text-teal-900 mb-10">
                    Temas do Ano (Linha do Tempo)
                </h2>

                <div className="relative container mx-auto max-w-6xl">
                    {/* LINHA CENTRAL - MOBILE: centralizada | DESKTOP: alternada */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-teal-300 to-purple-300 hidden md:block" />
                    <div className="md:hidden absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-teal-300 to-purple-300 opacity-30" />

                    {temasAno.map((item, i) => {
                        const isLeft = i % 2 === 0;
                        const isSelected = selecionadasTema.some((s) => s.year === item.year);

                        return (
                            <motion.div
                                key={item.year}
                                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative flex justify-center mb-12 md:mb-10"
                            >
                                {/* CARD CONTAINER */}
                                <div className="relative w-full max-w-md md:w-5/12">
                                    {/* CARD */}
                                    <motion.div
                                        whileHover={{ scale: 1.04 }}
                                        className={`
                                            p-5 rounded-xl bg-gradient-to-br ${item.bg} border border-teal-200 
                                            shadow-lg flex items-center gap-4 cursor-pointer transition-all
                                            md:flex-row ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}
                                            flex-row
                                        `}
                                        onClick={() => setSelectedTema(item)}
                                    >
                                        {/* ÍCONE */}
                                        <div className="flex-shrink-0">
                                            {iconMap[item.icon] || iconMap.default}
                                        </div>

                                        {/* CONTEÚDO */}
                                        <div className="flex-1 text-left md:text-left">
                                            <div className="px-3 py-1 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-sm border border-teal-300 inline-block">
                                                <p className="text-lg font-bold text-teal-700 dark:text-teal-300">{item.year}</p>
                                            </div>
                                            <p className="text-sm font-medium text-teal-900 dark:text-teal-100 line-clamp-2 mt-1">
                                                {item.theme}
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* BOTÃO DE SELEÇÃO - LINHA DO TEMPO */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSelecaoTema(item);
                                        }}
                                        className={`
                                            absolute top-3 right-3 w-7 h-7 rounded-full 
                                            transition-all duration-200 z-20
                                            flex items-center justify-center
                                            ${isSelected
                                                ? "bg-emerald-600 shadow-lg ring-2 ring-emerald-500 ring-offset-2"
                                                : "bg-white shadow-md ring-2 ring-gray-300 hover:ring-emerald-400"
                                            }
                                        `}
                                        aria-label={isSelected ? "Desselecionar" : "Selecionar"}
                                    >
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>

                                    {/* PONTO NA LINHA - MOBILE: centralizado | DESKTOP: alternado */}
                                    <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-teal-600 rounded-full border-4 border-white shadow z-10
                                        left-1/2 -translate-x-1/2 
                                        md:left-auto md:translate-x-0
                                        ${isLeft ? 'md:-left-2' : 'md:-right-2'}
                                    `} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ==================== CARD EXPLICATIVO ==================== */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="container mx-auto px-4 sm:px-6 mb-6"
            >
                <div className="bg-gradient-to-r from-amber-50 via-yellow-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-md p-4 sm:p-6 text-center">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-yellow-200 mb-3">
                        Leve a Palavra Profética ao seu Grupo de Oração!
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                        Selecione uma ou mais profecias marcando os campos ao lado dos títulos.
                        Depois, utilize os botões abaixo para <strong>compartilhar</strong> nas redes sociais ou <strong>baixar</strong> em PDF e levar ao seu grupo de oração.
                    </p>
                </div>
            </motion.div>

            {/* ==================== EXPLICAÇÃO DAS PROFECIAS ==================== */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="container mx-auto px-4 sm:px-6 mb-8"
            >
                <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950/50 dark:via-cyan-950/50 dark:to-blue-950/50 rounded-3xl p-6 sm:p-8 shadow-lg border border-teal-200 dark:border-teal-700">
                    <h2 className="text-xl sm:text-2xl font-bold text-teal-800 dark:text-teal-200 mb-4 text-center">
                        Profecias para a RCC Brasil e o Mundo
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center max-w-4xl mx-auto">
                        Profecias recebidas para a <strong className="text-teal-700 dark:text-teal-300">RCC do Brasil e do mundo</strong> em diversos momentos importantes onde o <strong className="text-teal-700 dark:text-teal-300">Espírito Santo</strong> inspirou palavras que estão <em>norteando a RCC em todo o mundo</em>.
                    </p>

                    <div className="my-6 p-5 bg-white/70 dark:bg-gray-800/70 rounded-2xl border border-teal-100 dark:border-teal-700 shadow-inner">
                        <p className="text-sm sm:text-base italic text-teal-800 dark:text-teal-200 font-medium leading-relaxed text-center">
                            “Precisamos <strong>orar pelo cumprimento das profecias</strong> e, como o povo da Bíblia fazia, devemos <strong>sempre relembrar as profecias</strong> para que o povo <strong>não se esqueça das promessas e exortações do Senhor</strong>.”
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-teal-600 dark:text-teal-400 font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.966 7.966 0 0014.5 4c-1.255 0-2.443.29-3.5.804V15.2a8.003 8.003 0 00-2 0V4.804z" />
                            </svg>
                            <span>Deuteronômio 8, 2 Coríntios 13,1, Apocalipse 19,10</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ==================== FILTROS E BUSCA ==================== */}
            <section className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="bg-white/90 backdrop-blur rounded-2xl p-4 sm:p-5 shadow border border-teal-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
                            <input
                                type="text"
                                placeholder="Buscar profecias..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-teal-300 rounded-xl text-base text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-teal-400 outline-none"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
                            <select
                                value={anoSelecionado ?? ""}
                                onChange={(e) => setAnoSelecionado(e.target.value ? Number(e.target.value) : null)}
                                className="w-full pl-10 pr-8 py-3 bg-white border border-teal-300 rounded-xl text-base text-gray-800 focus:ring-2 focus:ring-teal-400 outline-none appearance-none"
                            >
                                <option value="">Todos os anos</option>
                                {anos.map((a) => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== PROFECIAS ==================== */}
            <section className="container mx-auto px-4 sm:px-6 pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {profecias.map((p) => {
                        const isSelected = selecionadasProfecias.some((s) => s.id === p.id);

                        return (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -6 }}
                            >
                                <div className="relative">
                                    <ProfeciaCard
                                        profecia={p}
                                        onClick={() => setProfeciaAberta(p)}
                                        selecionada={isSelected}
                                    />

                                    {/* BOTÃO DE SELEÇÃO - PROFECIAS */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSelecaoProfecia(p);
                                        }}
                                        className={`
                                            absolute top-3 right-3 w-7 h-7 rounded-full 
                                            transition-all duration-200 z-20
                                            flex items-center justify-center
                                            ${isSelected
                                                ? "bg-emerald-600 shadow-lg ring-2 ring-emerald-500 ring-offset-2"
                                                : "bg-white shadow-md ring-2 ring-gray-300 hover:ring-emerald-400"
                                            }
                                        `}
                                        aria-label={isSelected ? "Desselecionar" : "Selecionar"}
                                    >
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Card de aprofundamento */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-md p-4 sm:p-6 text-center mt-6 hover:shadow-lg transition-shadow"
                >
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-yellow-200 mb-3">
                        Quer aprofundar o entendimento das profecias?
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                        Explore os significados espirituais e conexões bíblicas no nosso estudo
                        completo sobre as profecias reveladas.
                    </p>
                    <a
                        href="/estudo-profecias"
                        className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white text-sm sm:text-base font-medium px-4 sm:px-6 py-2 rounded-full shadow transition-all focus-visible:ring-2 focus-visible:ring-yellow-400"
                        aria-label="Acessar estudo das profecias"
                    >
                        Acessar o Estudo das Profecias
                    </a>
                </motion.div>
            </section>

            {/* ==================== PAINEL FLUTUANTE ==================== */}
            <AnimatePresence>
                {totalSelecionados > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="
                            fixed bottom-6 left-4 right-4 
                            md:left-1/2 md:-translate-x-1/2 md:max-w-sm md:w-full
                            bg-white dark:bg-gray-800 
                            rounded-2xl shadow-2xl p-4 
                            flex flex-col sm:flex-row items-center justify-between gap-3 
                            z-50 border border-gray-200 dark:border-gray-700 
                            mx-auto
                        "
                    >
                        {/* CONTADOR */}
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-bold">
                                {totalSelecionados}
                            </span>
                            <span>
                                item{totalSelecionados > 1 ? "s" : ""} selecionado{totalSelecionados > 1 ? "s" : ""}
                            </span>
                        </div>

                        {/* BOTÕES */}
                        <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                            <button
                                onClick={() => baixarPDF(itensSelecionados, "Seleções RCC")}
                                className="
                                    flex-1 sm:flex-initial p-3 bg-teal-600 hover:bg-teal-700 
                                    text-white rounded-xl transition-all duration-200 
                                    focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2
                                "
                                aria-label="Baixar seleção em PDF"
                            >
                                <Download className="w-5 h-5 mx-auto sm:mx-0" />
                            </button>
                            <button
                                onClick={() => compartilhar(itensSelecionados, "Seleções RCC")}
                                className="
                                    flex-1 sm:flex-initial p-3 bg-blue-600 hover:bg-blue-700 
                                    text-white rounded-xl transition-all duration-200 
                                    focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
                                "
                                aria-label="Compartilhar seleção"
                            >
                                <Share2 className="w-5 h-5 mx-auto sm:mx-0" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ==================== MODAL DO TEMA DO ANO ==================== */}
            <AnimatePresence>


                {selectedTema && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedTema(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 30, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="
                                bg-gradient-to-br from-white via-teal-50/50 to-cyan-50/30
                                dark:from-gray-900 dark:via-teal-950/50 dark:to-cyan-950/30
                                rounded-3xl shadow-2xl
                                max-w-2xl w-full max-h-[90vh] my-8
                                overflow-y-auto
                                border border-teal-200 dark:border-teal-800
                                relative
                                scrollbar-custom
                                "
                            onClick={(e) => e.stopPropagation()}


                        >
                            <button
                                onClick={() => setSelectedTema(null)}
                                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 z-10"
                                aria-label="Fechar"
                            >
                                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </button>

                            <div className="p-6 sm:p-8 pt-16">
                                <div className="flex justify-center mb-6">
                                    <div className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-bold text-xl rounded-full shadow-lg border border-amber-300">
                                        {selectedTema.year}
                                    </div>
                                </div>

                                <h3 className="text-2xl sm:text-3xl font-bold text-center text-teal-800 dark:text-teal-200 mb-6 leading-tight">
                                    {selectedTema.theme}
                                </h3>

                                <div className="bg-white/70 dark:bg-gray-800/70 p-5 rounded-2xl border border-teal-100 dark:border-teal-700 mb-6">
                                    <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                        {selectedTema.explicacao}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 p-4 rounded-xl border-l-4 border-teal-600 dark:border-teal-400">
                                    <p className="text-sm sm:text-base italic text-teal-800 dark:text-teal-200 font-medium flex items-center gap-2">
                                        <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.966 7.966 0 0014.5 4c-1.255 0-2.443.29-3.5.804V15.2a8.003 8.003 0 00-2 0V4.804z" />
                                        </svg>
                                        {selectedTema.biblia}
                                    </p>
                                </div>

                                <div className="flex justify-center mt-6">
                                    <div className="p-3 bg-teal-100 dark:bg-teal-900/50 rounded-full">
                                        {iconMap[selectedTema.icon] || iconMap.default}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ==================== MODAL DA PROFECIA ==================== */}
            <AnimatePresence>
                {profeciaAberta && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] overflow-y-auto"
                        onClick={() => setProfeciaAberta(null)}


                    >

                        {/* Wrapper com padding-top para o header fixo */}
                        <div className="min-h-screen flex flex-col justify-center pt-20 sm:pt-24 pb-8 px-4">
                            <motion.div
                                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="flex justify-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="
            bg-white dark:bg-gray-900 rounded-3xl shadow-2xl 
            max-w-2xl w-full max-h-[85vh] 
            overflow-y-auto 
            border border-teal-200 dark:border-teal-800 
            relative scrollbar-custom
          ">
                                    {/* BOTÃO FECHAR */}
                                    <button
                                        onClick={() => setProfeciaAberta(null)}
                                        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 z-50"
                                        aria-label="Fechar"
                                    >
                                        <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    </button>

                                    {/* CONTEÚDO */}
                                    <div className="p-6 sm:p-8 pt-16">
                                        <div className="flex justify-center mb-4">
                                            <div className="px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg rounded-full shadow-lg">
                                                {profeciaAberta.ano}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl sm:text-3xl font-bold text-center text-teal-800 dark:text-teal-200 mb-6 leading-tight">
                                            {profeciaAberta.titulo}
                                        </h3>

                                        <p className="text-center text-sm text-teal-600 dark:text-teal-400 mb-6">
                                            {profeciaAberta.local}
                                        </p>

                                        <div
                                            className="prose prose-teal dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: profeciaAberta.conteudo }}
                                        />

                                        {profeciaAberta.destaque && (
                                            <div className="mt-6 p-4 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl border-l-4 border-orange-500">
                                                <p className="text-sm font-semibold text-orange-800 dark:text-orange-200 flex items-center gap-2">
                                                    <Sparkles className="w-5 h-5" />
                                                    Em destaque na RCC
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EstudoProfecias;