import { FaGlobe, FaSitemap, FaHistory } from "react-icons/fa";

export interface Formacao {
  titulo: string;
  conteudo: null;
  icone?: JSX.Element;
  bgColor: string;
  textColor: string;
  buttonColor: string;
}

export const formacoes: Formacao[] = [
  {
    titulo: "Identidade da RCC",
    conteudo: null,
    bgColor: "bg-gray-50",
    textColor: "text-gray-900",
    buttonColor: "bg-yellow-400 text-blue-900 hover:bg-yellow-300"
  },
  {
    titulo: "Cultura de Pentecostes",
    conteudo: null,
    icone: <FaGlobe className="text-purple-500 text-5xl" />,
    bgColor: "bg-purple-50",
    textColor: "text-purple-900",
    buttonColor: "bg-purple-500 text-white hover:bg-purple-400"
  },
  {
    titulo: "Como Estamos Organizados",
    conteudo: null,
    icone: <FaSitemap className="text-red-500 text-5xl" />,
    bgColor: "bg-red-50",
    textColor: "text-red-900",
    buttonColor: "bg-red-500 text-white hover:bg-red-400"
  },
  {
    titulo: "Histórico da RCC",
    conteudo: null,
    icone: <FaHistory className="text-green-500 text-5xl" />,
    bgColor: "bg-green-50",
    textColor: "text-green-900",
    buttonColor: "bg-green-500 text-white hover:bg-green-400"
  }
];