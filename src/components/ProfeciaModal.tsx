// src/components/ProfeciaModal.tsx
import { Profecia } from '../Types/profecias';
import { X } from 'lucide-react';

interface Props {
  profecia: Profecia;
  onClose: () => void;
}

export default function ProfeciaModal({ profecia, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-gray-800">
            {profecia.titulo}
          </h2>
          {/* X VISÍVEL */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span><strong>Ano:</strong> {profecia.ano}</span>
            {profecia.autor && <span><strong>Por:</strong> {profecia.autor}</span>}
            {profecia.local && <span><strong>Local:</strong> {profecia.local}</span>}
          </div>

          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: profecia.conteudo }}
          />
        </div>

        <div className="p-6 border-t bg-gray-50 text-center">
          <p className="text-sm italic text-gray-500">
            “O Senhor fala ao seu povo em todo tempo.” (Cf. Hb 1,1-2)
          </p>
        </div>
      </div>
    </div>
  );
}