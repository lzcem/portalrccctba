import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

const API_URL = 'https://www.rcccuritiba.online/Api/mapa_grupos.php';

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

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

function Localizador() {
  const map = useMap();
  useEffect(() => {
    map.locate({ setView: true, maxZoom: 14 });
  }, [map]);
  return null;
}

export default function MapaGrupos() {
  const [paroquias, setParoquias] = useState<Paroquia[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'today'>('map');
  const [selectedDay, setSelectedDay] = useState<string>(''); // Estado do dia selecionado
  const [isLoading, setIsLoading] = useState(true);

  const daysOfWeek = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    setIsLoading(true);
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        console.log(API_URL)
        return response.json();
      })
      .then((data: Grupo[]) => {
        const grouped = data.reduce((acc: Paroquia[], grupo: Grupo) => {
          if (grupo.lat === null || grupo.lng === null || !grupo.id_paroquia) return acc;
          const key = grupo.id_paroquia;
          const existing = acc.find((p) => p.id_paroquia === key);
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
          return acc;
        }, [] as Paroquia[]);
        setParoquias(grouped);
        setError(null);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Erro na requisição:', error);
        setError(error.message);
        setIsLoading(false);
      });

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredParoquias = paroquias.filter((p) => {
    if (viewMode === 'today' || selectedDay) {
      const diaFiltro = selectedDay || ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][new Date().getDay()].toLowerCase();
      return p.grupos.some((g) => g.horario?.toLowerCase().split(',').map(h => h.trim()).includes(diaFiltro));
    }
    return p.paroquia?.toLowerCase().includes(search.toLowerCase()) ||
      p.endereco?.toLowerCase().includes(search.toLowerCase()) ||
      p.grupos.some((g) => g.nome?.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 bg-gradient-to-br from-blue-950 to-green-900 text-white mt-3 pb-16"
    >
      <h3 className="text-2xl font-sans font-bold mb-4">Localize Grupos de Oração</h3>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nome ou endereço..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded-lg bg-white text-gray-900 border-gray-300 focus:ring-green-300"
        />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setViewMode('map'); setSelectedDay(''); }}
            className={`px-4 py-2 rounded-lg text-white transition ${viewMode === 'map' ? 'bg-green-300 text-blue-950' : 'bg-blue-950/50 hover:bg-blue-950/80'}`}
            aria-label="Exibir mapa"
          >
            Mapa
          </button>
          <button
            onClick={() => { setViewMode('today'); setSelectedDay(''); }}
            className={`px-4 py-2 rounded-lg text-white transition ${viewMode === 'today' ? 'bg-green-300 text-blue-950' : 'bg-blue-950/50 hover:bg-blue-950/80'}`}
            aria-label="Exibir grupos de hoje"
          >
           Hoje
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-white transition ${viewMode === 'list' ? 'bg-green-300 text-blue-950' : 'bg-blue-950/50 hover:bg-blue-950/80'}`}
            aria-label="Exibir lista"
          >
            Lista
          </button>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="px-4 py-2 rounded-lg bg-blue-950/50 text-white focus:ring-green-300"
          >
            <option value="">Por dia</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <p className="text-center text-gray-300 mt-6">Carregando grupos...</p>}
      {error && <div className="text-center text-red-400 p-4">Erro ao carregar dados: {error}</div>}

      {!isLoading && !error && (
        <>
          {viewMode !== 'list' ? (
            <div className="h-[60vh] rounded-lg overflow-hidden shadow-lg">
              <MapContainer
                center={[-25.4284, -49.2733]}
                zoom={12}
                scrollWheelZoom={true}
                className="h-full w-full rounded-lg z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Localizador />
                {filteredParoquias.length > 0 ? (
                  filteredParoquias.map((paroquia) => (
                    <Marker
                      key={paroquia.id_paroquia}
                      position={[paroquia.lat, paroquia.lng]}
                      icon={defaultIcon}
                    >
                      {!isSmallScreen && (
                        <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
                          {paroquia.grupos.map((grupo, index) => (
                            <div key={index} className="text-gray-900">{grupo.nome || 'Grupo sem nome'}</div>
                          ))}
                        </Tooltip>
                      )}
                      <Popup>
                        <div className="text-gray-900">
                          <h3 className="font-bold">{paroquia.paroquia || 'Paróquia sem nome'}</h3>
                          <p><strong>Endereço:</strong> {paroquia.endereco || 'Não informado'}</p>
                          <p><strong>Grupos:</strong></p>
                          <ul className="list-disc pl-5">
                            {paroquia.grupos.map((grupo, index) => (
                              <li key={index}>
                                {grupo.nome || 'Grupo sem nome'} - {grupo.horario || 'Horário não informado'}
                              </li>
                            ))}
                          </ul>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${paroquia.lat},${paroquia.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-300 hover:underline"
                          >
                            Traçar rota
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  ))
                ) : (
                  <div className="text-center text-white">Nenhum grupo encontrado</div>
                )}
              </MapContainer>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredParoquias.map((paroquia) => (
                <motion.div
                  key={paroquia.id_paroquia}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-tr from-blue-800 to-green-700 p-4 rounded-lg shadow-lg"
                >
                  <h3 className="font-bold text-white">{paroquia.paroquia || 'Paróquia sem nome'}</h3>
                  <p className="text-gray-200">{paroquia.endereco || 'Não informado'}</p>
                  <p className="text-gray-200"><strong>Grupos:</strong></p>
                  <ul className="list-disc pl-5 text-gray-200">
                    {paroquia.grupos.map((grupo, index) => (
                      <li key={index}>
                        {grupo.nome || 'Grupo sem nome'} - {grupo.horario || 'Horário não informado'}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${paroquia.lat},${paroquia.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-300 hover:underline"
                  >
                    Traçar rota
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}