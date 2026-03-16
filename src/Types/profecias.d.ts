// src/Types/profecias.ts
export interface Profecia {
  id: string;
  titulo: string;
  ano: number;
  local: string;
  conteudo: string;        // OBRIGATÓRIO
  destaque?: boolean;   // OPCIONAL
  autor: string; 
}