import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaExternalLinkAlt } from 'react-icons/fa';

const FacebookFeed: React.FC = () => {
  // Mantemos o width em 500 para garantir que o FB renderize o layout completo interno
  const fbUrl = "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Frcccuritiba&tabs=timeline&width=330&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-[2.5rem] shadow-xl border border-blue-50 overflow-hidden w-full relative h-[650px] flex flex-col"
    >
      {/* Header */}
      <div className="bg-[#1877F2] p-5 text-white flex items-center gap-3 relative z-10 shrink-0">
        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
          <FaFacebook size={20} />
        </div>
        <div className="flex-1">
          <h3 className="font-serif font-black uppercase text-xs tracking-widest leading-none">Rede Social</h3>
          <p className="text-blue-100 text-[8px] font-bold uppercase mt-1 opacity-80">RCC Curitiba</p>
        </div>
        <a 
          href="https://www.facebook.com/rcccuritiba" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
        >
          <FaExternalLinkAlt size={10} />
        </a>
      </div>

      {/* Container que resolve o corte lateral */}
      <div className="flex-grow w-full bg-white relative overflow-hidden flex justify-center items-start">
        <div className="w-full flex justify-center overflow-visible">
          <iframe 
            src={fbUrl}
            title="Facebook Feed"
            scrolling="no" 
            frameBorder="0" 
            allowFullScreen={true} 
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            style={{ 
              border: 'none', 
              overflow: 'hidden',
              height: '600px',
              width: '500px', // Travamos em 500 para o FB não bugar
              // ESTE É O SEGREDO: Se o espaço for menor que 500px, o CSS encolhe o iframe
              maxWidth: '100%', 
              transformOrigin: 'top center',
              // Faz o ajuste fino se estiver em telas muito pequenas (mobile)
            }} 
            className="fb-iframe-responsive"
          ></iframe>
        </div>
      </div>

      <div className="bg-gray-50 p-3 text-center border-t border-gray-100 shrink-0">
         <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
           Acompanhe nossas postagens
         </span>
      </div>
    </motion.div>
  );
};

export default FacebookFeed;