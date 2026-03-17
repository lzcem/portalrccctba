import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaExternalLinkAlt } from 'react-icons/fa';

const FacebookFeed: React.FC = () => {
  useEffect(() => {
    const renderFB = () => {
      if ((window as any).FB) {
        (window as any).FB.XFBML.parse();
      }
    };
    const timer = setTimeout(renderFB, 500);
    window.addEventListener('resize', renderFB);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', renderFB);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2.5rem] shadow-xl border border-blue-50 overflow-hidden h-full flex flex-col w-full relative"
    >
      <style>{`
        .fb-container .fb-page, 
        .fb-container .fb-page span, 
        .fb-container .fb-page iframe {
          width: 100% !important;
          max-width: 100% !important;
          display: block !important;
        }
      `}</style>

      {/* Header Estilizado */}
      <div className="bg-[#1877F2] p-6 text-white flex items-center gap-3 relative z-10">
        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
          <FaFacebook size={24} />
        </div>
        <div>
          <h3 className="font-serif font-black uppercase text-sm tracking-widest leading-none">Nossa Rede Social</h3>
          <p className="text-blue-100 text-[9px] font-bold uppercase tracking-tighter opacity-80 mt-1">RCC Curitiba</p>
        </div>

        {/* Link Direto Externo para garantir o login do usuário */}
        <a 
          href="https://www.facebook.com/rcccuritiba" 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-auto bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all"
        >
          <FaExternalLinkAlt size={12} />
        </a>
      </div>

      {/* Container do Feed */}
      <div className="fb-container p-0 bg-white flex-grow min-h-[500px] w-full overflow-hidden flex justify-center">
        <div 
          className="fb-page" 
          data-href="https://www.facebook.com/rcccuritiba" 
          data-tabs="timeline" 
          data-width="500" 
          data-height="800" 
          data-small-header="false" 
          data-adapt-container-width="true" 
          data-hide-cover="false" 
          data-show-facepile="true"
        >
          <blockquote cite="https://www.facebook.com/rcccuritiba" className="fb-xfbml-parse-ignore">
            <div className="p-10 text-center text-gray-400 text-xs italic">
              <a href="https://www.facebook.com/rcccuritiba">Carregando feed da RCC Curitiba...</a>
            </div>
          </blockquote>
        </div>
      </div>
    </motion.div>
  );
};

export default FacebookFeed;