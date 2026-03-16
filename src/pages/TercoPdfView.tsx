// src/pages/TercoPdfView.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TercoPdfView: React.FC = () => {
  const navigate = useNavigate();
  const pdfPath = '/tercoEspiritoSanto.pdf'; // Caminho na pasta /public

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 pt-24 pb-10 px-4"
    >
      <div className="max-w-5xl mx-auto">
        {/* Barra de Ações Superior */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-900 font-bold hover:text-orange-600 transition-colors"
          >
            <FaArrowLeft /> Voltar à página inicial
          </button>
          
          <a 
            href={pdfPath} 
            download="Terco_Espirito_Santo_RCC.pdf"
            className="bg-orange-600 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-orange-500 transition-all"
          >
            <FaDownload /> Baixar PDF
          </a>
        </div>

        {/* Container do PDF */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200" style={{ height: '80vh' }}>
          <iframe
            src={`${pdfPath}#view=FitH`}
            title="Folheto Terço ao Espírito Santo"
            className="w-full h-full border-none"
          />
        </div>
        
        <p className="text-center text-gray-400 text-[10px] mt-4 uppercase font-bold tracking-widest">
          Documento Oficial RCCBRASIL - Arquidiocese de Curitiba
        </p>
      </div>
    </motion.div>
  );
};

export default TercoPdfView;