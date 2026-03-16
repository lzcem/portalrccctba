// src/pages/Revista.tsx
import { useEffect, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function useWin() {
  const getSize = () => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1200,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  const [s, set] = useState(getSize());

  useEffect(() => {
    const onR = () => set(getSize());
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);

  return s;
}

export default function Revista() {
  const pdfUrl = '/assets/revista.pdf';
  const { w, h } = useWin();

  // Proporção A4
  const pageH = Math.min(h * 0.85, 800);
  const pageW = pageH * 0.707;

  const twoUp = w >= 1024;
  const scale = twoUp ? 1 : Math.min(1, (w * 1.25) / pageW);

  const [num, setNum] = useState<number>();
  const [err, setErr] = useState<string>();

  useEffect(() => {
    fetch(pdfUrl, { cache: 'no-store' })
      .then(r => {
        if (!r.ok) throw new Error('PDF não encontrado');
      })
      .catch(e => setErr(e.message));
  }, [pdfUrl]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-900 to-green-700 text-white p-4">
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          margin: '0 auto',
          width: `${pageW * (twoUp ? 2 : 1)}px`,
        }}
        className="flex flex-col items-center bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <h1 className="text-xl sm:text-3xl font-bold my-4 text-slate-800">
          Revista RCC Curitiba
        </h1>

        {err && (
          <p className="text-red-600 mb-4 font-medium">
            {err}
          </p>
        )}

        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setNum(numPages)}
          onLoadError={(e) => setErr(e.message)}
          loading={<p className="text-slate-700 mb-4">Carregando PDF…</p>}
          error={<p className="text-red-600 mb-4">Erro ao carregar PDF</p>}
        >
          {num && (
            <HTMLFlipBook
              key={`${num}-${twoUp}`}
              width={pageW}
              height={pageH}
              minWidth={pageW}
              maxWidth={pageW * (twoUp ? 2 : 1)}
              minHeight={pageH}
              maxHeight={pageH}
              size="fixed"
              usePortrait={!twoUp}
              showCover={twoUp}
              startPage={0}
              /* ✅ OBRIGATÓRIAS nas typings */
              startZIndex={0}
              maxShadowOpacity={0.5}
              drawShadow
              flippingTime={700}
              autoSize={false}
              mobileScrollSupport
              swipeDistance={30}
              clickEventForward
              useMouseEvents
              showPageCorners
              disableFlipByClick={false}
              className="select-none"
              style={{ background: '#f0f0f0', borderRadius: 12 }}
            >
              {Array.from({ length: num }, (_, i) => (
                <div
                  key={i + 1}
                  className="flex justify-center items-center shadow-md border border-gray-300"
                  style={{
                    width: pageW,
                    height: pageH,
                    backgroundColor: 'white',
                    padding: '8px',
                    boxSizing: 'border-box',
                    borderRadius: 4,
                  }}
                >
                  <Page
                    pageNumber={i + 1}
                    width={pageW - 1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={<span />}
                  />
                </div>
              ))}
            </HTMLFlipBook>
          )}
        </Document>
      </div>
    </div>
  );
}