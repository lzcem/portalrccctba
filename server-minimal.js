import express from 'express';
import cors from 'cors';

console.log('[DEBUG] Iniciando servidor mínimo...');

const app = express();
console.log('[DEBUG] Express inicializado');

const PORT = process.env.PORT || 3000;

console.log('[DEBUG] Configurando middlewares...');
app.use(cors({
  origin: ['https://rcccuritiba.com.br', 'https://www.rcccuritiba.com.br', 'http://localhost:5173'],
  credentials: true,
}));
console.log('[DEBUG] Middleware CORS registrado');

app.use(express.json());
console.log('[DEBUG] Middleware express.json registrado');

app.use(express.urlencoded({ extended: true }));
console.log('[DEBUG] Middleware express.urlencoded registrado');

// Rota de teste
app.get('/api/public-access', (req, res) => {
  console.log('[DEBUG] Acessando /api/public-access');
  res.json({ requiresLogin: false, message: 'Acesso público liberado' });
});
console.log('[DEBUG] Rota /api/public-access registrada');

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('[ERROR] Erro no Express:', err.stack);
  res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
});
console.log('[DEBUG] Middleware de erro registrado');

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor mínimo rodando na porta ${PORT} (${process.env.NODE_ENV ? 'produção' : 'desenvolvimento'})`);
});