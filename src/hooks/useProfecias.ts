// src/hooks/useProfecias.ts
import { useState, useMemo } from 'react';
import profeciasData from '@/data/profecias.json';
import type { Profecia } from '../Types/profecias';

const data = profeciasData as readonly Profecia[];

export const useProfecias = () => {
  const [anoSelecionado, setAnoSelecionado] = useState<number | null>(null);
  const [busca, setBusca] = useState('');

  const anosDisponiveis: number[] = Array.from(
    new Set(data.map(p => p.ano))
  ).sort((a, b) => b - a);

  const profeciasFiltradas = useMemo(() => {
    return data.filter(p => {
      const porAno = !anoSelecionado || p.ano === anoSelecionado;

      // Extrai texto limpo do HTML
      const stripHtml = (html: string) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
      };

      const textoLimpo = stripHtml(p.conteudo).toLowerCase();
      const tituloBusca = p.titulo.toLowerCase();
      const autorBusca = (p.autor || '').toLowerCase();

      const porBusca = !busca || 
        tituloBusca.includes(busca.toLowerCase()) ||
        textoLimpo.includes(busca.toLowerCase()) ||
        autorBusca.includes(busca.toLowerCase());

      return porAno && porBusca;
    });
  }, [anoSelecionado, busca]);

  return {
    profecias: profeciasFiltradas,
    anos: anosDisponiveis,
    anoSelecionado,
    setAnoSelecionado,
    busca,
    setBusca,
  };
};