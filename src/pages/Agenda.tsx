import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaSearch, FaSort, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

console.log("process.env.NODE_ENV =====>"+process.env.NODE_ENV);

const API_URL = process.env.NODE_ENV === 'development'

  ? 'https://www.rcccuritiba.online/Api/agenda.php'
  : 'https://www.rcccuritiba.online/Api/agenda.php';


//const API_URL = process.env.NODE_ENV === 'production'

//  ? 'https://www.rcccuritiba.online/Api/agenda.php'
//  : '/Api/agenda.php';

console.log("API_URL2 =====>"+API_URL);

interface Event {
  id_evento: number;
  title: string;
  description: string;
  data_inicio: string;
  data_fim: string;
  local: string;
}

const Agenda: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [showAll, setShowAll] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const eventsPerPage = 9;
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = Array.from(
    { length: new Date().getFullYear() - 2019 + 5 },
    (_, i) => 2020 + i
  );

  useEffect(() => {
    setIsLoading(true);
    fetch(API_URL, {
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(async (response) => {
       // console.log('Resposta recebida:', response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`Falha na requisição: ${response.status} ${response.statusText}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Resposta da API não é JSON');
        }
        const data = await response.json();
        // Filtrar eventos de 2025 ou posteriores
        const filteredData = data.filter((event: Event) => {
          const [eventYear] = event.data_inicio.split('-').map(Number);
          return eventYear >= 2025;
        });
        const sortedData = [...filteredData].sort((a: Event, b: Event) => {
          const dateA = new Date(a.data_inicio);
          const dateB = new Date(b.data_inicio);
          return dateA.getTime() - dateB.getTime();
        });
        setEvents(sortedData);
        localStorage.setItem('events', JSON.stringify(sortedData));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar eventos:', error.message);
        setError(`Não foi possível carregar os eventos: ${error.message}`);
        setIsLoading(false);
      });
  }, []);

  const filteredEvents = events.filter(event => {
    const [eventYear, eventMonth, day] = event.data_inicio.split('-').map(Number);
    const eventDate = new Date(eventYear, eventMonth - 1, day);
    const matchesText =
      event.title.toLowerCase().includes(filter.toLowerCase()) ||
      event.description.toLowerCase().includes(filter.toLowerCase()) ||
      event.local.toLowerCase().includes(filter.toLowerCase());
    const excludesReuniao = !event.title.toLowerCase().includes('reunião');
    if (showAll) return matchesText && excludesReuniao && eventDate >= new Date();
    return (
      matchesText &&
      excludesReuniao &&
      eventDate.getMonth() === selectedMonth &&
      eventDate.getFullYear() === selectedYear &&
      eventDate >= new Date()
    );
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.data_inicio);
    const dateB = new Date(b.data_inicio);
    return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const isFutureEvent = (startDate: string) => {
    return new Date(startDate) >= new Date();
  };

  // Função para capitalizar apenas a primeira letra
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const generateCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const eventDays = filteredEvents
      .map(event => {
        const [, , day] = event.data_inicio.split('-').map(Number);
        return day;
      })
      .filter((day, index, self) => self.indexOf(day) === index);

    const weeks = [];
    let currentWeek = Array(7).fill(null);
    let dayCounter = 1;

    for (let i = 0; i < startingDay; i++) {
      currentWeek[i] = null;
    }

    for (let i = startingDay; dayCounter <= daysInMonth; i++) {
      if (i === 7) {
        weeks.push(currentWeek);
        currentWeek = Array(7).fill(null);
        i = 0;
      }
      currentWeek[i] = dayCounter;
      dayCounter++;
    }

    if (currentWeek.some(day => day !== null)) {
      weeks.push(currentWeek);
    }

    return { weeks, eventDays };
  };

  const { weeks, eventDays } = generateCalendar();

  const handleDayClick = (day: number | null) => {
    if (!day) return;
    setSelectedDay(day);

    const eventIndex = sortedEvents.findIndex(event => {
      const [year, month, eventDay] = event.data_inicio.split('-').map(Number);
      return eventDay === day && month - 1 === selectedMonth && year === selectedYear;
    });

    if (eventIndex !== -1) {
      const targetPage = Math.floor(eventIndex / eventsPerPage) + 1;
      setCurrentPage(targetPage);
      setTimeout(() => {
        const indexOnPage = eventIndex % eventsPerPage;
        if (eventRefs.current[indexOnPage]) {
          eventRefs.current[indexOnPage]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-green-900 text-white px-4 sm:px-8 pt-16 pb-20">
      <div className="max-w-[1400px] mx-auto">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-center text-green-300 mb-8 font-serif tracking-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <FaCalendarAlt className="inline-block mr-3 text-green-400 animate-pulse" />
          Agenda RCC Curitiba
        </motion.h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendário do Mês */}
          <motion.div
            className="lg:w-1/5 bg-white bg-opacity-10 p-6 rounded-2xl shadow-xl border border-green-300/20"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xl font-semibold text-green-300 mb-4 font-serif">
              {months[selectedMonth]} {selectedYear}
            </h2>
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-sans">
              <div className="font-bold text-gray-200">Dom</div>
              <div className="font-bold text-gray-200">Seg</div>
              <div className="font-bold text-gray-200">Ter</div>
              <div className="font-bold text-gray-200">Qua</div>
              <div className="font-bold text-gray-200">Qui</div>
              <div className="font-bold text-gray-200">Sex</div>
              <div className="font-bold text-gray-200">Sáb</div>
              {weeks.map((week, weekIndex) => (
                <React.Fragment key={weekIndex}>
                  {week.map((day, dayIndex) => (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`p-2 rounded-full cursor-pointer ${day
                        ? eventDays.includes(day)
                          ? selectedDay === day
                            ? 'bg-green-600 text-white font-bold'
                            : 'bg-green-500 text-white font-bold'
                          : 'text-gray-200 hover:bg-gray-700'
                        : 'text-gray-600'
                        }`}
                      onClick={() => handleDayClick(day)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {day || ''}
                    </motion.div>
                  ))}
                </React.Fragment>
              ))}
            </div>
            {/* Lista de eventos do mês */}
            <div className="mt-10">
              <h3 className="text-base font-semibold text-green-300 mb-2 font-serif">Eventos do mês</h3>
              {filteredEvents.length > 0 ? (
                <ul className="space-y-2 max-h-164 overflow-y-auto">
                  {filteredEvents
                    .filter(event => isFutureEvent(event.data_inicio))
                    .map(event => (
                      <li key={event.id_evento} className="text-gray-200 font-['Roboto'] text-xs">
                        {formatDate(event.data_inicio)} - {capitalizeFirstLetter(event.title)}
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-300 font-['Roboto'] text-xs">
                  Nenhum evento futuro encontrado para {months[selectedMonth]} {selectedYear}.
                </p>
              )}
            </div>
          </motion.div>

          {/* Conteúdo Principal */}
          <div className="lg:w-4/5">
            <motion.div
              className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white bg-opacity-10 p-6 rounded-2xl shadow-xl border border-green-300/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-full md:w-1/2">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400" />
                <input
                  type="text"
                  placeholder="Filtrar por título, descrição ou local..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="p-3 pl-12 w-full border rounded-lg bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 font-sans transition duration-300"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={showAll ? 'all' : selectedMonth}
                  onChange={(e) => {
                    if (e.target.value === 'all') {
                      setShowAll(true);
                    } else {
                      setShowAll(false);
                      setSelectedMonth(Number(e.target.value));
                    }
                    setCurrentPage(1);
                  }}
                  className="p-3 border rounded-lg bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 font-sans transition duration-300"
                >
                  <option value="all">Todos os Meses</option>
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
                {!showAll && (
                  <select
                    value={selectedYear}
                    onChange={(e) => {
                      setSelectedYear(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="p-3 border rounded-lg bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 font-sans transition duration-300"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                )}
                <motion.button
                  onClick={() => {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    setCurrentPage(1);
                  }}
                  className="bg-green-500 text-white px-5 py-3 rounded-lg hover:bg-green-600 transition flex items-center gap-2 font-sans"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSort className="text-white" />
                  Ordenar por Data {sortOrder === 'asc' ? '↑' : '↓'}
                </motion.button>
              </div>
            </motion.div>

            {isLoading && (
              <motion.p
                className="text-center text-gray-300 mt-8 font-['Inter'] text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <FaClock className="inline-block mr-2 animate-spin" />
                Carregando eventos...
              </motion.p>
            )}
            {error && (
              <motion.p
                className="text-center text-red-400 mt-8 font-['Inter'] text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {error}
              </motion.p>
            )}

            {!isLoading && !error && (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {currentEvents.map((event, index) => (
                    isFutureEvent(event.data_inicio) && (
                      <motion.div
                        key={event.id_evento}
                        ref={el => (eventRefs.current[index] = el)}
                        className={`p-6 rounded-2xl shadow-xl bg-white bg-opacity-10 border transition duration-300 ${selectedDay &&
                          parseInt(event.data_inicio.split('-')[2]) === selectedDay &&
                          new Date(event.data_inicio).getMonth() === selectedMonth &&
                          new Date(event.data_inicio).getFullYear() === selectedYear
                          ? 'border-red-600 bg-blue-600/20'
                          : 'border-green-300/20 hover:shadow-2xl'
                          }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale:
                            selectedDay &&
                              parseInt(event.data_inicio.split('-')[2]) === selectedDay &&
                              new Date(event.data_inicio).getMonth() === selectedMonth &&
                              new Date(event.data_inicio).getFullYear() === selectedYear
                              ? 1.03
                              : 1
                        }}
                        transition={{ duration: 0.5, delay: 0.1 * (index % 4) }}
                        whileHover={{ scale: 1.03 }}
                      >
                        <h2 className={`text-xl font-bold mb-3 font-['Inter'] tracking-wide uppercase ${selectedDay &&
                          parseInt(event.data_inicio.split('-')[2]) === selectedDay &&
                          new Date(event.data_inicio).getMonth() === selectedMonth &&
                          new Date(event.data_inicio).getFullYear() === selectedYear
                          ? 'text-green-200'
                          : 'text-green-300'
                          }`}>{capitalizeFirstLetter(event.title)}</h2>
                        <div className="flex items-center mb-2">
                          <FaClock className="text-green-400 mr-2" />
                          <p className="text-teal-300 font-['Roboto'] text-base font-semibold">
                            <strong>Data:</strong> {formatDate(event.data_inicio)}{' '}
                            {event.data_fim !== event.data_inicio ? `a ${formatDate(event.data_fim)}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center mb-2">
                          <FaMapMarkerAlt className="text-green-400 mr-2" />
                          <p className="text-gray-200 font-['Roboto'] text-sm"><strong>Local:</strong> {event.local}</p>
                        </div>
                        <hr className="border-t border-green-300/30 my-5" />
                        <p className="text-gray-200 mb-4 whitespace-pre-line font-['Roboto'] text-sm leading-relaxed">{event.description}</p>
                      </motion.div>
                    )
                  ))}
                </div>

                {currentEvents.length === 0 && (
                  <motion.p
                    className="text-center text-gray-300 mt-8 font-['Inter'] text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    Nenhum evento futuro encontrado para {showAll ? 'todos os meses' : `${months[selectedMonth]} de ${selectedYear}`}.
                  </motion.p>
                )}

                <motion.div
                  className="flex justify-center mt-10 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-5 py-3 bg-green-500 text-white rounded-full disabled:bg-gray-600 hover:bg-green-600 transition font-['Inter'] shadow-lg"
                    whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                    whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                  >
                    Anterior
                  </motion.button>
                  <span className="px-5 py-3 text-gray-200 font-['Inter'] text-lg">
                    Página {currentPage} de {totalPages}
                  </span>
                  <motion.button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-5 py-3 bg-green-500 text-white rounded-full disabled:bg-gray-600 hover:bg-green-600 transition font-['Inter'] shadow-lg"
                    whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                    whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                  >
                    Próxima
                  </motion.button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agenda;