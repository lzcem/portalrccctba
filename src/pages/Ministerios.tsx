// src/pages/Ministerios.tsx
import { useParams } from 'react-router-dom';

export default function Ministerios() {
  const { id } = useParams();
  return <div className="p-4 text-xl">Ministério {id}</div>;
}
