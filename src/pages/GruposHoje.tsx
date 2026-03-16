import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Interface para os grupos retornados pela API
interface Grupo {
    id: number;
    nome: string | null;
    endereco: string | null;
    lat: string | null;
    lng: string | null;
    horario: string | null;
    paroquia: string | null;
    id_paroquia: number;
}

interface Paroquia {
    id_paroquia: number;
    lat: number;
    lng: number;
    endereco: string | null;
    paroquia: string | null;
    grupos: { nome: string | null; horario: string | null }[];
}

export default function GruposHoje() {
    const [gruposHoje, setGruposHoje] = useState<Paroquia[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGrupos = async () => {
            setIsLoading(true);
            try {
                const gruposRes = await fetch('https://www.rcccuritiba.online/Api/mapa_grupos.php').then(res =>
                    res.ok ? res.json() as Promise<Grupo[]> : Promise.reject(`Erro HTTP: ${res.status}`)
                );
                const now = new Date();
                const diaAtual = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][now.getDay()].toLowerCase();
                console.log('Dia atual:', diaAtual); // Depuração
                const grouped = gruposRes.reduce((acc: Paroquia[], grupo: Grupo) => {
                    if (grupo.lat === null || grupo.lng === null || !grupo.id_paroquia || !grupo.horario) return acc;
                    const horarios = grupo.horario.toLowerCase().split(',').map(h => h.trim());
                    console.log('Horário do grupo:', grupo.horario, 'Normalizado:', horarios); // Depuração
                    if (horarios.some(h => h === diaAtual)) { // Verifica se diaAtual está nos horários
                        const key = grupo.id_paroquia;
                        const existing = acc.find((p: Paroquia) => p.id_paroquia === key);
                        if (existing) {
                            existing.grupos.push({ nome: grupo.nome, horario: grupo.horario });
                        } else {
                            acc.push({
                                id_paroquia: key,
                                lat: Number(grupo.lat),
                                lng: Number(grupo.lng),
                                endereco: grupo.endereco,
                                paroquia: grupo.paroquia,
                                grupos: [{ nome: grupo.nome, horario: grupo.horario }],
                            });
                        }
                    }
                    return acc;
                }, [] as Paroquia[]);
                setGruposHoje(grouped);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar grupos');
                console.error('Erro ao buscar grupos:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGrupos();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-blue-950 to-green-900">
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="h-8 w-8 border-4 border-t-green-300 border-white rounded-full animate-spin"
                ></motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400 bg-gradient-to-br from-blue-950 to-green-900">
                <p>Erro: {error}</p>
                <p>Verifique se o servidor está ativo e a URL está correta.</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen mx-auto max-w-7xl px-2 sm:px-4 py-6 bg-transparent pt-15"
        >
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-white/95 drop-shadow-md">Grupos de Oração Hoje</h1>
            <p className="text-center text-gray-300 mb-6">({new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Sao_Paulo' })})</p>
            {gruposHoje.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 pb-16">
                    {gruposHoje.map((paroquia) => (
                        <motion.div
                            key={paroquia.id_paroquia}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(0, 128, 128, 0.4)" }}
                            className="bg-teal-900/40 p-3 sm:p-4 rounded-xl border-2 border-teal-700/40 shadow-md flex flex-col items-center text-center h-64 transition-all duration-300 hover:bg-teal-900/50"
                        >
                            <h3 className="text-sm sm:text-base font-semibold text-white/90 line-clamp-1 mb-1 sm:mb-2">
                                {paroquia.paroquia && !paroquia.paroquia.toLowerCase().startsWith('capela') ? `Paróquia ${paroquia.paroquia}` : paroquia.paroquia || 'Local sem nome'}
                            </h3>
                            <p className="mt-1 text-gray-200 text-xs sm:text-sm font-medium line-clamp-1 mb-2">
                                {paroquia.endereco}
                            </p>
                            <ul className="list-none mt-1 flex-1 overflow-y-visible text-sm sm:text-base text-gray-300 px-2 space-y-2 sm:space-y-3">
                                {paroquia.grupos.map((grupo, index) => (
                                    <li key={index} className="py-1 sm:py-2 border-b border-teal-700/50 last:border-b-0">
                                        <span className="font-semibold text-white/85 line-clamp-1 block whitespace-nowrap overflow-hidden text-ellipsis">
                                            Grupo {grupo.nome || 'Sem nome'}
                                        </span>
                                        <span className="text-teal-300 font-medium block mt-0.5 sm:mt-1">{grupo.horario || 'Horário não informado'}</span>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${paroquia.lat},${paroquia.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 sm:mt-3 text-xs sm:text-sm bg-teal-800/70 hover:bg-teal-600/80 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-1 sm:gap-1.5 hover:shadow-lg border border-teal-700/40"
                            >
                                <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                                Traçar rota
                            </a>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-300 h-64 sm:h-72 flex items-center justify-center">Nenhum grupo de oração disponível hoje.</div>
            )}
            <div className="text-center mt-6">
                <Link to="/" className="bg-blue-900 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                    Voltar para Home
                </Link>
            </div>
        </motion.div>
    );
}