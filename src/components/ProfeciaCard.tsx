// src/components/ProfeciaCard.tsx
import { Profecia } from '../Types/profecias';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ProfeciaCardProps {
  profecia: Profecia;
  onClick: () => void;
  selecionada?: boolean;
  onSelect?: () => void;
}

const stripHtml = (html: string): string => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

export default function ProfeciaCard({ 
  profecia, 
  onClick, 
  selecionada = false,
}: ProfeciaCardProps) {
  const textoLimpo = stripHtml(profecia.conteudo);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
      className={`
        relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg 
        border transition-all cursor-pointer
        ${selecionada 
          ? 'border-emerald-500 ring-2 ring-emerald-500 ring-offset-2 shadow-emerald-200' 
          : 'border-teal-100 hover:border-teal-300'
        }
      `}
    >
      {/* Destaque */}
      {profecia.destaque && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
          Em destaque
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex items-start gap-3">
        <Sparkles className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-teal-900 text-lg mb-1">{profecia.titulo}</h3>
          <p className="text-sm text-teal-600 mb-2">{profecia.ano} – {profecia.local}</p>
          <p className="text-sm text-teal-800 line-clamp-3 leading-relaxed">
            “{textoLimpo}”
          </p>
        </div>
      </div>
    </motion.div>
  );
}