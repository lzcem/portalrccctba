// src/pages/AdminNewsletter.tsx
import React, { useEffect, useState } from 'react';
import { FaDownload, FaTrash, FaEnvelope, FaWhatsapp, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface Inscrito {
  id: number;
  contato: string;
  tipo: 'email' | 'whatsapp';
  data: string;
}

const AdminNewsletter: React.FC = () => {
  const [inscritos, setInscritos] = useState<Inscrito[]>([]);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.rcccuritiba.com.br';

  useEffect(() => {
    fetchInscritos();
  }, []);

  const fetchInscritos = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/newsletter/inscritos`);
      const data = await res.json();
      setInscritos(data);
    } catch (err) {
      console.error("Erro ao carregar lista");
    }
  };

const exportarExcel = () => {
  // Adiciona o BOM (Byte Order Mark) para o Excel reconhecer UTF-8 (acentos)
  const BOM = "\uFEFF";
  const cabecalho = "ID;Contato;Tipo;Data de Inscrição\n";
  const rows = inscritos.map(i => `${i.id};${i.contato};${i.tipo};${i.data}`).join("\n");
  
  const csvContent = BOM + cabecalho + rows;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `newsletter_rcc_curitiba_${new Date().toISOString().split('T')[0]}.csv`);
  a.click();
};

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors font-bold">
            <FaArrowLeft /> Voltar
          </button>
          
          <h1 className="text-2xl font-serif font-black text-gray-800 uppercase tracking-tighter text-center">
            Gestão do <span className="text-orange-600">Pão Diário</span>
          </h1>

          <button 
            onClick={exportarExcel}
            className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-green-700 transition-all"
          >
            <FaDownload /> Exportar Excel (CSV)
          </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Tipo</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Contato</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Inscrição</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {inscritos.map((inscrito) => (
                  <tr key={inscrito.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-6 py-4">
                      {inscrito.tipo === 'email' ? 
                        <FaEnvelope className="text-blue-500" title="E-mail" /> : 
                        <FaWhatsapp className="text-green-500" title="WhatsApp" />
                      }
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{inscrito.contato}</td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-medium">{inscrito.data}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-300 hover:text-red-500 transition-colors">
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {inscritos.length === 0 && (
            <div className="p-20 text-center text-gray-400 italic">
              Ainda não há inscritos na base de dados.
            </div>
          )}
        </div>
        
        <p className="mt-6 text-center text-[10px] text-gray-400 uppercase font-black tracking-[0.3em]">
          RCC Curitiba • Sistema Administrativo 2026
        </p>
      </div>
    </div>
  );
};

export default AdminNewsletter;