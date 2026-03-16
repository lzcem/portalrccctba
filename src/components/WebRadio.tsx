// src/components/WebRadio.tsx
import { useEffect, useContext } from 'react';
import { RadioContext } from '../App';
import {
  FaPlay,
  FaStop,
  FaBroadcastTower,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const WebRadio = () => {
  const context = useContext(RadioContext);
  if (!context) return null;

  const {
    playing, setPlaying, station, setStation,
    currentTrackIndex, setCurrentTrackIndex,
    dbFiles, audioRef, API_BASE_URL
  } = context;

  const stationLabels: Record<string, string> = {
    musica: 'Músicas RCC',
    pregacoes: 'Pregações RCC',
    formacoes: 'Formações Espirituais',
    vaticano: 'Rádio Vaticano'
  };

  const getPlaylist = () => {
    if (station === 'vaticano') {
      return [{
        id: 'vaticano-live',
        titulo: 'Programação Ao Vivo',
        local: 'Vaticano',
        data_evento: new Date().toISOString(),
        arquivo_path: 'https://radio.vaticannews.va/stream-pt-b',
        isExternal: true
      }];
    }
    return dbFiles.filter((f: any) => f.categoria === station);
  };

  const currentPlaylist = getPlaylist();
  const currentTrack = currentPlaylist[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => {
      if (currentTrack && !currentTrack.isExternal) {
        localStorage.setItem(`radio_last_pos_${currentTrack.id}`, audio.currentTime.toString());
      }
    };
    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [currentTrack, audioRef]);

  const handleToggleRadio = () => {
    if (!audioRef.current || currentPlaylist.length === 0) return;
    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      const track = currentTrack;
      const src = track.isExternal ? track.arquivo_path : `${API_BASE_URL}${track.arquivo_path}`;
      if (audioRef.current.src !== src) {
        audioRef.current.src = src;
        audioRef.current.load();
        const savedTime = localStorage.getItem(`radio_last_pos_${track.id}`);
        if (savedTime && !track.isExternal) {
          audioRef.current.currentTime = parseFloat(savedTime);
        }
      }
      audioRef.current.play().catch((e: Error) => console.error("Erro ao reproduzir:", e));
      setPlaying(true);
    }
  };

  const changeStationAndPlay = (key: string) => {
    setStation(key);
    setCurrentTrackIndex(0);
    setTimeout(() => {
      const newPlaylist = key === 'vaticano'
        ? [{ id: 'vaticano-live', arquivo_path: 'https://radio.vaticannews.va/stream-pt-b', isExternal: true }]
        : dbFiles.filter((f: any) => f.categoria === key);

      if (audioRef.current && newPlaylist.length > 0) {
        const track = newPlaylist[0];
        const src = track.isExternal ? track.arquivo_path : `${API_BASE_URL}${track.arquivo_path}`;
        audioRef.current.src = src;
        audioRef.current.load();
        const savedTime = localStorage.getItem(`radio_last_pos_${track.id}`);
        if (savedTime && !track.isExternal) {
          audioRef.current.currentTime = parseFloat(savedTime);
        }
        audioRef.current.play().catch((e: Error) => console.error("Erro na troca:", e));
        setPlaying(true);
      }
    }, 50);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-5 border border-blue-500/30 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${playing ? 'bg-green-500/20' : 'bg-gray-800'}`}>
          <FaBroadcastTower className={`${playing ? 'text-green-400 animate-pulse' : 'text-gray-500'} text-lg`} />
          {playing && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          )}
        </div>
        <div>
          <h3 className="text-white font-black text-[10px] uppercase tracking-tighter">Web Rádio RCC</h3>
          <p className={`text-[9px] font-bold  tracking-widest ${playing ? 'text-green-400 animate-pulse' : 'text-blue-300 opacity-50'}`}>
            {playing ? '• Transmitindo Agora' : 'Rádio Offline'}
          </p>
        </div>
      </div>

      {/*
      flex-row: Alinha os itens horizontalmente.
      flex-wrap: Caso o nome do local seja muito longo para a coluna de largura 2, ele permite que a data vá para baixo de forma organizada em vez de "atropelar" o layout.
      whitespace-nowrap: Impede que o ícone se separe do texto (ex: o ícone ficar em uma linha e o nome da cidade em outra).
      gap-x-3: Define um espaçamento elegante entre o local e a data.
      Divisor sutil: Adicionei um • que aparece apenas se houver espaço, para separar melhor as duas informações.
      */}

      {/* ÁREA DE INFORMAÇÕES DO ARQUIVO */}
      <div className="bg-black/40 rounded-xl p-4 mb-4 border border-white/5 text-center min-h-[110px] flex flex-col justify-center">
        {currentTrack ? (
          <>
            <span className="text-[9px] text-blue-400 uppercase font-black tracking-[0.2em] mb-2">
              {stationLabels[station]}
            </span>

            <h4 className="text-white font-bold text-xs leading-snug mb-3 line-clamp-2">
              {currentTrack.titulo}
            </h4>

            {/* ALTERAÇÃO AQUI: De flex-col para flex-row com wrap para segurança */}
            <div className="flex flex-row flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[9px] text-gray-400 italic">
              <span className="flex items-center gap-1 whitespace-nowrap">
                <FaMapMarkerAlt className="text-[7px]" /> {currentTrack.local}
              </span>

              {/* Divisor visual opcional (ponto central) */}
              <span className="hidden sm:inline opacity-30">•</span>

              <span className="flex items-center gap-1 whitespace-nowrap">
                <FaCalendarAlt className="text-[7px]" /> {new Date(currentTrack.data_evento).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-[10px] italic">Selecione uma estação</p>
        )}
      </div>

      <button
        onClick={handleToggleRadio}
        className={`w-full flex items-center justify-center gap-3 py-4 mb-6 rounded-2xl font-black transition-all shadow-lg active:scale-95 text-[10px] uppercase tracking-widest ${playing
          ? 'bg-red-600/90 hover:bg-red-500 shadow-red-900/20'
          : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
          } text-white`}
      >
        {playing ? <><FaStop /> Parar Rádio</> : <><FaPlay /> Ouvir Agora</>}
      </button>

      <div className="grid grid-cols-1 gap-1.5">
        {Object.keys(stationLabels).map((key) => (
          <button
            key={key}
            onClick={() => changeStationAndPlay(key)}
            className={`text-left px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${station === key
              ? 'bg-blue-500/20 border-blue-400 text-white shadow-[inset_0_0_8px_rgba(59,130,246,0.3)]'
              : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10 hover:text-gray-300'
              }`}
          >
            <span className="mr-2 opacity-50">{station === key ? '●' : '○'}</span>
            {stationLabels[key]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WebRadio;