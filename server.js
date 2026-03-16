import 'dotenv/config';
import express from 'express';

import path from 'path';

import dotenv from "dotenv";
dotenv.config();

import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
import Parser from 'rss-parser';
import { exec } from 'child_process';
import fetch from 'node-fetch';
import { Server } from 'socket.io';
import { createServer } from 'http';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const baseUpload = "/var/www/html/portalrccctba/uploads";


/*

const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: '-03:00'
});

*/

import db from './config/database.js'; // Importa a conexão única



// --- FUNÇÃO DE LOG UNIFICADA (Declarada apenas uma vez) ---
export const registrarLog = async (usuarioId, usuarioNome, acao, modulo, req) => {
  try {
    const ip = req?.headers?.['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';
    const ua = req?.headers?.['user-agent'] || 'Sistema Automático';
    await db.query(
      'INSERT INTO admin_logs (usuario_id, usuario_nome, acao, modulo, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
      [usuarioId, usuarioNome, acao, modulo, ip, ua]
    );
  } catch (err) {
    console.error('Falha ao gravar log de auditoria:', err);
  }
};

// --- SERVIDOR HTTP UNIFICADO ---
const httpServer = createServer(app);

// --- SOCKET.IO CONFIGURADO PARA PRODUÇÃO ---
const io = new Server(httpServer, {
  path: '/socket.io/', // Essencial para o Nginx encontrar
  cors: {
    origin: ["https://www.rcccuritiba.com.br", "https://rcccuritiba.com.br"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});


let onlineUsers = 0;
io.on('connection', (socket) => {
  onlineUsers++;
  console.log('[SOCKET] Usuário conectado. Total:', onlineUsers);
  io.emit('updateUserCount', onlineUsers);

  socket.on('disconnect', () => {
    onlineUsers = Math.max(0, onlineUsers - 1);
    console.log('[SOCKET] Usuário desconectado. Total:', onlineUsers);
    io.emit('updateUserCount', onlineUsers);
  });
});


console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

db.on('connection', (conn) => {
  console.log('[DB DEBUG] Nova conexão estabelecida com host:', conn.config.host);
  console.log('[DB DEBUG] Socket path usado:', conn.config.socketPath || 'NENHUM (TCP)');
});

db.on('error', (err) => {
  console.error('[DB POOL ERROR]', err.message);
});


db.on('connection', (conn) => {
  console.log('[DB CONN] Conexão estabelecida com host:', conn.config.host);
  conn.query('SELECT USER(), CONNECTION_ID(), @@hostname', (err, rows) => {
    if (err) console.error('[DB CONN ERROR]', err);
    else console.log('[DB CONN INFO]', rows[0]);
  });
});

// Debug imediato para confirmar
console.log('[DB DEBUG] Tentando conectar com:');
console.log('  User:', process.env.DB_USER || 'fallback root');
console.log('  Database:', process.env.DB_NAME || 'fallback portalrccctba');



// Teste de conexão (opcional, mas ajuda muito)
db.getConnection()
  .then(conn => {
    console.log('[DB SUCCESS] Conexão OK! Usuário real usado:', process.env.DB_USER);
    conn.release();
  })
  .catch(err => {
    console.error('[DB ERROR] Falha na conexão:', err.message);
    console.error('[DB ERROR] Credenciais usadas:', {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD ? 'definida' : 'undefined',
      database: process.env.DB_NAME
    });
  });




// === FUNÇÕES GLOBAIS DE UTILIDADE ===

function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  return text
    .toString()
    .replace(/&/g, '&amp;') // Escapar & primeiro
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/[\r\n]+/g, ' '); // Remove quebras de linha
}

console.log(process.env.NODE_ENV);

console.log('[DEBUG] Variáveis de ambiente:', {
  NODE_ENV: process.env.NODE_ENV,
  API_BASE_URL: process.env.API_BASE_URL,
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET
});

// --- MIDDLEWARES ---
const corsOptions = {
  origin: ['https://rcccuritiba.com.br', 'https://www.rcccuritiba.com.br', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range'],
  exposedHeaders: ['Content-Length', 'Content-Range', 'Accept-Ranges'],
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '2gb' }));

app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url} - Headers: ${JSON.stringify(req.headers)}`);
  next();
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use((err, req, res, next) => {
  console.error('[ERROR] CORS/Request:', err.message);
  res.status(500).json({ error: 'Erro interno' });
});

// Criar diretórios na inicialização
//const basePath = isProduction ? '/var/www/html/portalrccctba' : path.join(__dirname, 'public');
const basePath = isProduction
  ? '/var/www/html/portalrccctba'
  : path.join(__dirname, 'public');

const dirs = ['ImgMensagens', 'ImgCoordenadores', 'ImgFotos', 'ImgNoticias', 'imgPublicacao', 'ImgEspiritualidade', 'ImgGrupos', 'ImgAmigos', 'ImgAmoRcc'];
dirs.forEach(dir => {
  const dirPath = path.join(basePath, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`[DEBUG] Diretório criado: ${dirPath}`);
  }
});

// Caminho absoluto para pasta de vídeos
const VIDEO_DIR = path.join(__dirname, 'public', 'videos');

// Cria a pasta se ela não existir
if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

// Configuração de upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const baseDir = isProduction
      ? '/var/www/html/portalrccctba'
      : path.join(__dirname, 'public');

    let dir;

    if (req.originalUrl.includes('/api/admin/mensagens-coordenacao') && file.fieldname === 'foto_mensagem') {
      dir = path.join(baseDir, 'ImgMensagens');
    } else if (req.originalUrl.includes('/api/admin/mensagens-coordenacao') && file.fieldname === 'foto_coord') {
      dir = path.join(baseDir, 'ImgCoordenadores');
    } else if (req.originalUrl.includes('/api/admin/ministerios')) {
      dir = path.join(baseDir, 'ImgFotos');
    } else if (req.originalUrl.includes('/api/noticias_portal')) {
      dir = path.join(baseDir, 'ImgNoticias');
    } else if (req.originalUrl.includes('/api/publicacoes')) {
      dir = path.join(baseDir, 'imgPublicacao');
    } else if (req.originalUrl.includes('/api/admin/espiritualidade')) {
      dir = path.join(baseDir, 'ImgEspiritualidade');
    } else if (req.originalUrl.includes('/api/admin/grupo-oracao')) {
      dir = path.join(baseDir, 'ImgGrupos');
    } else if (req.originalUrl.includes('/api/admin/amo-rcc-home')) {
      dir = path.join(baseDir, 'ImgAmoRcc');
    } else if (req.originalUrl.includes('/api/admin/mil-amigos-home')) {
      dir = path.join(baseDir, 'ImgAmigos');
    } else if (req.originalUrl.includes('/api/admin/pao-diario')) { // PÃO DIÁRIO
      dir = path.join(baseDir, 'AudiosPaoDiario');
    } else if (req.originalUrl.includes('/api/videos')) {
      dir = path.join(baseDir, 'videos');
    } else if (req.originalUrl.includes('/api/admin/videos')) {
      dir = path.join(baseDir, 'videos');
    } else {
      console.error(`[ERROR] Caminho de destino não suportado para ${req.originalUrl}, campo: ${file.fieldname}`);
      return cb(new Error('Caminho de destino não suportado'));
    }


    console.log(`[DEBUG] Tentando criar diretório: ${dir}`);
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`[DEBUG] Diretório existe: ${fs.existsSync(dir)}`);
      cb(null, dir);
    } catch (err) {
      console.error(`[ERROR] Erro ao criar diretório ${dir}: ${err.message}`);
      cb(err);
    }
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.bin';
    const filename = uniqueSuffix + ext;
    console.log(`[DEBUG] Salvando arquivo como: ${filename}`);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Se não houver arquivo, permite apenas se for uma atualização (PUT)
    if (!file) return req.method === 'PUT' ? cb(null, true) : cb(null, false);

    const imageTypes = ['image/jpeg', 'image/png'];
    const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

    // Lista de áudio expandida para maior compatibilidade (MP3, WAV, M4A, OGG, MPEG)
    const audioTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/x-wav',
      'audio/mp4',
      'audio/m4a',
      'audio/x-m4a',
      'audio/ogg'
    ];

    const fileExt = path.extname(file.originalname).toLowerCase();

    // 1. Campos de imagem
    if ([
      'imagem',
      'image',
      'thumbnail',
      'foto_mensagem',
      'foto_coord',
      'foto',
      'fotosGaleria'
    ].includes(file.fieldname)) {
      if (imageTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Apenas JPEG/PNG para imagem'));
      }
    }

    // 2. Campo de vídeo
    else if (file.fieldname === 'video') {
      if (videoTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Apenas MP4/WEBM/MOV para vídeo'));
      }
    }

    // 3. Campo de áudio (PÃO DIÁRIO)
    else if (file.fieldname === 'audio') {
      // Verifica pelo Mimetype OU pela extensão do arquivo como redundância
      if (audioTypes.includes(file.mimetype) || ['.mp3', '.wav', '.m4a', '.ogg'].includes(fileExt)) {
        cb(null, true);
      } else {
        cb(new Error(`Formato de áudio inválido (${file.mimetype}). Use MP3, WAV ou M4A.`));
      }
    }

    // 4. Caso o campo não seja mapeado
    else {
      cb(new Error('Campo de arquivo não reconhecido pelo servidor'));
    }
  },

  limits: {
    fileSize: 2 * 1024 * 1024 * 1024 // Limite global de 2GB
  }
});

// Configuração de armazenamento para a rádio
const radioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Garante que salve em public/radio
    cb(null, 'public/radio');
  },
  filename: (req, file, cb) => {
    // Mantém o nome original ou gera um único para evitar substituição
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadRadio = multer({ storage: radioStorage });

const authenticateToken = (req, res, next) => {
  console.log('[DEBUG] authenticateToken - Origin:', req.headers.origin);
  console.log('[DEBUG] authenticateToken - Headers:', req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('[DEBUG] authenticateToken - Token não fornecido');
    return cors(corsOptions)(req, res, () => {
      res.status(401).json({ error: 'Token não fornecido' });
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo_jwt_muito_seguro', (err, user) => {
    if (err) {
      console.log('[DEBUG] authenticateToken - Erro:', err.message);
      return cors(corsOptions)(req, res, () => {
        res.status(403).json({ error: 'Token inválido', details: err.message });
      });
    }
    req.user = user;
    next();
  });
};


// Configurar caminhos estáticos uma vez, usando basePath
app.use('/ImgFotos', express.static(path.join(basePath, 'ImgFotos')));
app.use('/AudiosPaoDiario', express.static(path.join(basePath, 'AudiosPaoDiario')));
app.use('/ImgNoticias', express.static(path.join(basePath, 'ImgNoticias')));
app.use('/imgPublicacao', express.static(path.join(basePath, 'imgPublicacao')));
app.use('/ImgEspiritualidade', express.static(path.join(basePath, 'ImgEspiritualidade')));
app.use('/ImgMensagens', express.static(path.join(basePath, 'ImgMensagens')));
app.use('/ImgCoordenadores', express.static(path.join(basePath, 'ImgCoordenadores')));
app.use('/ImgGrupos', express.static(path.join(basePath, 'ImgGrupos')));
app.use('/ImgAmigos', express.static(path.join(basePath, 'ImgAmigos')));
app.use('/ImgAmoRcc', express.static(path.join(basePath, 'ImgAmoRcc')));

if (isProduction) {
  app.get('/', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/home', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/noticias', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/publicacoes', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/paroquias', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/pedido-oracao', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/participe-grupo', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/mil-amigos-home', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/mil-amigos', (req, res) => res.sendFile(path.join(basePath, 'index.html'))); // Adicione esta linha
  app.get('/amo-rcc-home', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/espiritualidade', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/mapa-grupos', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/saiba-mais', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/ministerios', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/mensagem-coordenacao', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/pedidos-oracao', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/revista', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/gabaon', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/canal-youtube', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/pedidos-oracao', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/agenda', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/comentar', (req, res) => res.sendFile(path.join(basePath, 'index.html')));


  app.get('/ministerios/comunicacao-social', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/ministerios/criancas-adolescentes', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/ministerios/familias', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/ministerios/fe-politica', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/ministerios/formacao', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/ministerios/intercessao', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/ministerios/jovens', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/ministerios/894d1744-5a2f-11f0-8ede-cec193641bb8', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/ministerios/oracao-cura-libertacao', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/ministerios/pregacao', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/ministerios/promocao-humana', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
  app.get('/ministerios/universidades-renovadas', (req, res) => res.sendFile(path.join(basePath, 'index.html')));

}

// server.js (Coloque esta rota logo após a seção MIDDLEWARES GLOBAIS/LOGS)
// Rota para notícias (OG para crawlers + SPA para usuários)
// Rota para notícias (OG para crawlers + SPA para usuários)


app.get('/noticias/:id', async (req, res) => {
  const { id } = req.params;
  const API_BASE_URL = process.env.API_BASE_URL || 'https://www.rcccuritiba.com.br';
  const shareUrl = `https://www.rcccuritiba.com.br/noticias/${id}`;

  const userAgent = req.headers['user-agent']?.toLowerCase() || '';
  const isCrawler = userAgent.includes('facebookexternalhit') ||
    userAgent.includes('facebot') ||
    userAgent.includes('twitterbot') ||
    userAgent.includes('linkedinbot') ||
    userAgent.includes('googlebot') ||
    userAgent.includes('bingbot') ||
    userAgent.includes('slackbot') ||
    userAgent.includes('discordbot');

  if (!isCrawler) {
    // Servir o index.html para usuários reais (SPA cuida da rota)
    // const indexPath = isProduction ? '/var/www/html/portalrccctba/index.html' : path.join(__dirname, 'public', 'index.html');
    const indexPath = path.join(basePath, 'index.html');



    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error('[ERROR] index.html não encontrado em:', indexPath);
      res.status(500).json({ error: 'Erro interno', details: 'index.html não encontrado' });
    }
    return;
  }

  // Apenas crawlers: gerar OG tags
  try {
    const response = await fetch(`${API_BASE_URL}/api/noticias_portal/all/${id}`);
    if (!response.ok) throw new Error('Notícia não encontrada');
    const noticia = await response.json();

    let imageUrl = `${API_BASE_URL}/placeholder-400x300.jpg`;
    if (noticia.foto) {
      const sanitizedPath = noticia.foto.startsWith('/') ? noticia.foto.substring(1) : noticia.foto;
      imageUrl = `${API_BASE_URL}/${sanitizedPath}`;
    }

    const raw = (noticia.conteudo || '').replace(/<[^>]+>/g, '').trim();
    let description = raw.length > 200 ? raw.slice(0, 197) + '...' : raw;
    if (description.length === 0) {
      description = "Renovação Carismática Católica - Arquidiocese de Curitiba - PR";
    }

    const escapedTitle = escapeHtml(noticia.manchete || 'Notícia RCC Curitiba');
    const escapedDescription = escapeHtml(description.toString());
    const safeImageUrl = escapeHtml(imageUrl);

    res.status(200).send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapedTitle}</title>
<meta property="og:title" content="${escapedTitle}">
<meta property="og:description" content="${escapedDescription}">
<meta property="og:image" content="${safeImageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${shareUrl}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapedTitle}">
<meta name="twitter:description" content="${escapedDescription}">
<meta name="twitter:image" content="${safeImageUrl}">
<link rel="canonical" href="${shareUrl}" />
</head>
<body></body>
</html>
`);
  } catch (err) {
    console.error('Erro na rota OG (Crawler):', err.message);
    res.status(404).send('Notícia não encontrada');
  }



  // 🛑 2. REDIRECIONAMENTO IMEDIATO PARA USUÁRIOS PADRÃO (NÃO ROBÔS)
  if (!isCrawler) {
    // Se não for robô, envie 302 para o navegador carregar o SPA e saia da função.
    // Isso garante que o usuário veja a página e não entre em loop
    return res.redirect(302, shareUrl);
  }

  // 🛑 O CÓDIGO A PARTIR DAQUI SÓ É EXECUTADO PARA ROBÔS (CRAWLERS) 🛑

  try {
    // 3. Buscar dados da notícia
    const response = await fetch(`${API_BASE_URL}/api/noticias_portal/all/${id}`);
    if (!response.ok) throw new Error('Notícia não encontrada');
    const noticia = await response.json();

    // 4. Definir URL da Imagem, Descrição e Título
    let imageUrl = 'https://www.rcccuritiba.com.br/placeholder-400x300.jpg';
    if (noticia.foto) {
      const sanitizedPath = noticia.foto.startsWith('/') ? noticia.foto.substring(1) : noticia.foto;
      imageUrl = `${API_BASE_URL}/${sanitizedPath}`;
    }

    const raw = (noticia.conteudo || '').replace(/<[^>]+>/g, '').trim();
    let description = raw.length > 200 ? raw.slice(0, 197) + '...' : raw;
    if (description.length === 0) {
      description = "Renovação Carismática Católica - Arquidiocese de Curitiba - PR";
    }

    // 5. Sanitizar Variáveis (Para resolver a descrição quebrando no Meta)
    const escapedTitle = escapeHtml(noticia.manchete || 'Notícia RCC Curitiba');
    // Aplica o escape na descrição que tem o fallback
    const escapedDescription = escapeHtml(description.toString());
    const safeImageUrl = escapeHtml(imageUrl);

    // 6. Enviar HTML de Preview (STATUS 200 OK)
    res.status(200).send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"> 
<title>${escapedTitle}</title>

<meta property="og:title" content="${escapedTitle}">
<meta property="og:description" content="${escapedDescription}">
<meta property="og:image" content="${safeImageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${shareUrl}">
<meta property="og:type" content="article">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapedTitle}">
<meta name="twitter:description" content="${escapedDescription}">
<meta name="twitter:image" content="${safeImageUrl}">
<meta name="twitter:image:alt" content="${escapedTitle}">

<link rel="canonical" href="${shareUrl}" />

</head>
<body>
</body>
</html>
`);
  } catch (err) {
    console.error('Erro na rota OG (Crawler):', err);
    // Se a API falhar, o robô recebe 404 (sem o HTML OG)
    res.status(404).send('Notícia não encontrada');
  }
});


// Rotas existentes...
// Rotas existentes...
app.get('/api/mensagens-coordenacao', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        foto_coord,
        texto_mensagem,
        titulo_mensagem AS tituloMensagem,
        resumo_mensagem AS resumoMensagem,
        data_inicio,
        data_fim,
        foto_mensagem,
        nome_coordenador AS nomeCoordenador
      FROM mensagens_coordenacao
      ORDER BY data_inicio DESC
    `);

    res.json(rows);

  } catch (error) {
    console.error('Erro ao buscar mensagens da coordenação:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
});

app.get('/api/admin/mensagens-coordenacao', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM mensagens_coordenacao');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
});

app.get('/api/admin/mensagens-coordenacao/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM mensagens_coordenacao WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Mensagem não encontrada' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar mensagem' });
  }
});

app.post('/api/admin/mensagens-coordenacao', authenticateToken, upload.fields([{ name: 'foto_mensagem', maxCount: 1 }, { name: 'foto_coord', maxCount: 1 }]), async (req, res) => {
  console.log('[DEBUG] Headers recebidos:', req.headers);
  console.log('[DEBUG] Files recebidos:', req.files ? req.files : 'Nenhum arquivo');
  console.log('[DEBUG] Body recebido:', req.body);
  const { titulo_mensagem, resumo_mensagem, texto_mensagem, data_inicio, data_fim, nome_coordenador } = req.body;
  const foto_mensagem = req.files?.['foto_mensagem']?.[0] ? `/ImgMensagens/${req.files['foto_mensagem'][0].filename}` : null;
  const foto_coord = req.files?.['foto_coord']?.[0] ? `/ImgCoordenadores/${req.files['foto_coord'][0].filename}` : null;
  if (!foto_mensagem && !foto_coord) {
    console.log('[DEBUG] Nenhum arquivo enviado, usando valores existentes se aplicável');
  }
  try {
    const [result] = await db.query(
      'INSERT INTO mensagens_coordenacao (titulo_mensagem, resumo_mensagem, texto_mensagem, foto_mensagem, data_inicio, data_fim, foto_coord, nome_coordenador) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [titulo_mensagem, resumo_mensagem, texto_mensagem || null, foto_mensagem, data_inicio, data_fim || null, foto_coord, nome_coordenador]
    );
    res.json({ id: result.insertId, message: 'Mensagem criada' });
  } catch (err) {
    console.error('[ERROR] Erro ao criar mensagem:', err);
    res.status(500).json({ error: 'Erro ao criar mensagem', details: err.message });
  }
});

app.put('/api/admin/mensagens-coordenacao/:id', authenticateToken, (req, res, next) => {
  console.log('[DEBUG] Headers recebidos no PUT:', req.headers);
  const isMultipart = req.headers['content-type']?.startsWith('multipart/form-data');
  console.log('[DEBUG] Is multipart:', isMultipart);
  if (isMultipart) {
    upload.fields([{ name: 'foto_mensagem', maxCount: 1 }, { name: 'foto_coord', maxCount: 1 }])(req, res, next);
  } else {
    next();
  }
}, async (req, res) => {
  console.log('[DEBUG] Files recebidos no PUT:', req.files ? req.files : 'Nenhum arquivo');
  console.log('[DEBUG] Body recebido no PUT:', req.body);
  const { id } = req.params;
  let body = req.body;
  let fotoMensagem, fotoCoord;

  if (req.headers['content-type']?.startsWith('multipart/form-data')) {
    fotoMensagem = req.files?.['foto_mensagem']?.[0] ? `/ImgMensagens/${req.files['foto_mensagem'][0].filename}` : null;
    fotoCoord = req.files?.['foto_coord']?.[0] ? `/ImgCoordenadores/${req.files['foto_coord'][0].filename}` : null;
    body = { ...req.body, foto_mensagem: fotoMensagem, foto_coord: fotoCoord };
  }

  const { titulo_mensagem, resumo_mensagem, texto_mensagem, data_inicio, data_fim, nome_coordenador } = body;
  if (!titulo_mensagem || !data_inicio || !nome_coordenador) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }
  try {
    const [existing] = await db.query('SELECT * FROM mensagens_coordenacao WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ error: 'Mensagem não encontrada' });
    await db.query(
      'UPDATE mensagens_coordenacao SET titulo_mensagem = ?, resumo_mensagem = ?, texto_mensagem = ?, foto_mensagem = COALESCE(?, foto_mensagem), data_inicio = ?, data_fim = ?, foto_coord = COALESCE(?, foto_coord), nome_coordenador = ? WHERE id = ?',
      [titulo_mensagem, resumo_mensagem, texto_mensagem || null, fotoMensagem, data_inicio, data_fim || null, fotoCoord, nome_coordenador, id]
    );
    res.status(200).json({ message: 'Atualizado com sucesso' });
  } catch (error) {
    console.error('[ERROR] Erro no PUT:', error);
    res.status(500).json({ error: 'Erro ao atualizar mensagem', details: error.message });
  }
});

app.options('/api/admin/amo-rcc-home/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', corsOptions.origin);
  res.header('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
  res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
  res.sendStatus(204);
});

app.post('/api/admin/mensagens-coordenacao/upload/mensagem', authenticateToken, (req, res, next) => {
  upload.fields([{ name: 'foto_mensagem', maxCount: 1 }])(req, res, (err) => {
    if (err) {
      console.log('Erro no multer (mensagem):', err.message);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('Arquivo recebido (mensagem):', req.files);
    if (!req.files?.['foto_mensagem']?.[0]) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    res.json({ filename: req.files['foto_mensagem'][0].filename });
  } catch (err) {
    console.error('Erro no processamento (mensagem):', err);
    res.status(500).json({ error: 'Erro ao processar upload' });
  }
});

app.post('/api/admin/mensagens-coordenacao/upload/coord', authenticateToken, (req, res, next) => {
  upload.fields([{ name: 'foto_coord', maxCount: 1 }])(req, res, (err) => {
    if (err) {
      console.log('Erro no multer (coord):', err.message);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('Arquivo recebido (coord):', req.files);
    if (!req.files?.['foto_coord']?.[0]) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    res.json({ filename: req.files['foto_coord'][0].filename });
  } catch (err) {
    console.error('Erro no processamento (coord):', err);
    res.status(500).json({ error: 'Erro ao processar upload' });
  }
});

app.get('/api/public-access', (req, res) => {
  console.log('[DEBUG] Acessando /api/public-access');
  res.json({ requiresLogin: false, message: 'Acesso público liberado' });
});

const API_BASE_URL = process.env.API_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://www.rcccuritiba.com.br' : 'http://localhost:3000');

app.get('/api/espiritualidade/mes', async (req, res) => {
  try {
    console.log('[DEBUG] NODE_ENV:', process.env.NODE_ENV);
    console.log('[DEBUG] API_BASE_URL:', API_BASE_URL);

    const [rows] = await db.query(
      'SELECT CAST(id AS CHAR) AS id, titulo, resumo, materia, imagem, data_publicacao, data_inicio, data_fim ' +
      'FROM formacao_espiritual WHERE data_inicio <= CURRENT_TIMESTAMP AND (data_fim IS NULL OR data_fim >= CURRENT_TIMESTAMP) ORDER BY data_publicacao DESC LIMIT 1'
    );

    if (!rows.length) {
      const defaultImage = `${API_BASE_URL}/ImgEspiritualidade/formacaoMes.png`;
      console.log('[DEBUG] Nenhuma formação encontrada, retornando imagem padrão:', defaultImage);
      return res.status(200).json({ message: 'Nenhuma formação', imagem: defaultImage });
    }

    const data = rows[0];
    data.imagem = data.imagem ? `${API_BASE_URL}${data.imagem.startsWith('/') ? '' : '/'}${data.imagem}` : `${API_BASE_URL}/ImgEspiritualidade/formacaoMes.png`;
    console.log('[DEBUG] Imagem retornada:', data.imagem);

    res.json(data);
  } catch (error) {
    console.error('[ERROR] Erro ao buscar formação:', error);
    res.status(500).json({ error: 'Erro ao buscar formação', details: error.message });
  }
});

app.get('/api/admin/espiritualidade', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM formacao_espiritual');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar formações', details: error.message });
  }
});

app.get('/api/noticias-rss', async (req, res) => {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL('https://www.vaticannews.va/pt.rss.xml');
    const noticias = feed.items.slice(0, 5).map(item => ({
      title: (item.title || 'Sem título').replace(/[\n\r\s]+/g, ' ').trim(),
      date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('pt-BR') : 'Sem data',
      link: item.link || '#'
    }));
    res.json(noticias.length ? noticias : [
      { title: 'Notícias não disponíveis', date: '19/06/2025', link: '#' },
    ]);
  } catch (error) {
    console.error('Erro ao buscar notícias RSS:', error.message);
    res.status(500).json({ error: 'Erro ao buscar notícias RSS', details: error.message });
  }
});

app.get('/test', (req, res) => res.send('Test OK'));

app.get('/api/paroquias', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT g.id AS id, g.grupo_nome AS nome, p.end_paroquia AS endereco, CAST(p.latitude AS DECIMAL(10,8)) AS lat, CAST(p.longitude AS DECIMAL(11,8)) AS lng,
       CONCAT(COALESCE(g.dia_reuniao_oracao, 'Não informado'), ', ', COALESCE(g.hora_reuniao_oracao, 'Não informado')) AS horario, p.paroquia, p.id_paroquia
       FROM grupos_teste g LEFT JOIN paroquias p ON g.paroquia_go = p.id_paroquia WHERE g.grupo_status = 'ATIVO'`
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar grupos:', error);
    res.status(500).json({ error: 'Erro ao buscar grupos', details: error.message });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM usuarios_portal WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Usuário não encontrado' });

    const usuario = rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (senhaValida) {
      const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome, isAdmin: usuario.is_admin },
        process.env.JWT_SECRET || 'seu_segredo_jwt_muito_seguro',
        { expiresIn: '1h' }
      );

      // --- REGISTRO DO LOG DE ACESSO ---
      await registrarLog(usuario.id, usuario.nome, 'Login efetuado', 'auth', req);

      // Retorna exatamente o que o seu Login.tsx espera
      res.json({
        token,
        nome: usuario.nome,
        isAdmin: Boolean(usuario.is_admin),      // Garante que vá como booleano
        isAdminMin: Boolean(usuario.is_admin_min) // Garante que vá como booleano
      });
    } else {
      res.status(401).json({ error: 'Senha incorreta' });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro no servidor', details: error.message });
  }
});

app.get('/api/verify-token', authenticateToken, (req, res) => res.json({ valid: true, user: req.user }));

app.get('/api/noticias_portal', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT CAST(id AS CHAR) AS id, manchete, foto, LEFT(conteudo, 800) AS resumo, data_publicacao, autor, fotos_galeria, categoria, data_inicio, data_fim ' +
      'FROM noticias_portal WHERE status = "publicado" AND data_inicio <= CURRENT_TIMESTAMP AND (data_fim IS NULL OR data_fim >= CURRENT_TIMESTAMP) ORDER BY data_inicio DESC LIMIT 3'
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    res.status(500).json({ error: 'Erro ao buscar notícias', details: error.message });
  }
});

app.get('/api/admin/noticias/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT CAST(id AS CHAR) AS id, manchete, conteudo, autor, status, foto, fotos_galeria, categoria, data_inicio, data_fim FROM noticias_portal WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Notícia não encontrada' });
    res.json({ ...rows[0], fotos_galeria: rows[0].fotos_galeria ? JSON.parse(rows[0].fotos_galeria) : [] });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar notícia', details: error.message });
  }
});

app.get('/api/admin/noticias', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT CAST(id AS CHAR) AS id, manchete, foto, LEFT(conteudo, 100) AS resumo, data_publicacao, autor, fotos_galeria, categoria, data_inicio, data_fim, status FROM noticias_portal ORDER BY data_publicacao DESC'
    );
    res.json(rows.map(row => ({ ...row, fotos_galeria: row.fotos_galeria ? JSON.parse(row.fotos_galeria) : [] })));
  } catch (error) {
    console.error('Erro ao buscar notícias administrativas:', error);
    res.status(500).json({ error: 'Erro ao buscar notícias administrativas', details: error.message });
  }
});

app.get('/api/noticias_portal/all', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT CAST(id AS CHAR) AS id, manchete, foto, LEFT(conteudo, 100) AS resumo, data_publicacao, autor, fotos_galeria, categoria, data_inicio, data_fim ' +
      'FROM noticias_portal WHERE status = "publicado" ORDER BY data_publicacao DESC'
    );
    res.json(rows.map(row => ({ ...row, fotos_galeria: row.fotos_galeria ? JSON.parse(row.fotos_galeria) : [] })));
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    res.status(500).json({ error: 'Erro ao buscar notícias', details: error.message });
  }
});

app.get('/api/noticias_portal/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT CAST(id AS CHAR) AS id, manchete, foto, conteudo, data_publicacao, autor, fotos_galeria, categoria, data_inicio, data_fim FROM noticias_portal WHERE id = ? AND status = "publicado" AND data_inicio <= CURRENT_TIMESTAMP AND (data_fim IS NULL OR data_fim >= CURRENT_TIMESTAMP)',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Notícia não encontrada' });
    const noticia = rows[0];
    noticia.fotos_galeria = noticia.fotos_galeria ? JSON.parse(noticia.fotos_galeria) : [];
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
    res.json(noticia);
  } catch (error) {
    console.error('Erro ao buscar notícia:', error);
    res.status(500).json({ error: 'Erro ao buscar notícia', details: error.message });
  }
});

app.get('/api/noticias_portal/all/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT CAST(id AS CHAR) AS id, manchete, foto, conteudo, data_publicacao, autor, fotos_galeria, categoria, data_inicio, data_fim FROM noticias_portal WHERE id = ? AND status = "publicado" AND data_inicio <= CURRENT_TIMESTAMP',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Notícia não encontrada' });
    const noticia = rows[0];
    noticia.fotos_galeria = noticia.fotos_galeria ? JSON.parse(noticia.fotos_galeria) : [];
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
    res.json(noticia);
  } catch (error) {
    console.error('Erro ao buscar notícia:', error);
    res.status(500).json({ error: 'Erro ao buscar notícia', details: error.message });
  }
});

app.post('/api/noticias_portal', authenticateToken, upload.fields([{ name: 'foto', maxCount: 1 }, { name: 'fotosGaleria', maxCount: 10 }]), async (req, res) => {
  const { manchete, conteudo, autor, status, categoria, data_inicio, data_fim } = req.body;
  const id_usuario = req.user.id;
  const nome_usuario = req.user.nome; // Nome vindo do token decodificado
  const foto = req.files?.['foto']?.[0] ? `/ImgNoticias/${req.files['foto'][0].filename}` : null;
  const fotosGaleria = req.files?.['fotosGaleria']?.map(file => `/ImgNoticias/${file.filename}`) || [];

  try {
    const [result] = await db.query(
      'INSERT INTO noticias_portal (manchete, foto, conteudo, autor, status, id_usuario, data_publicacao, fotos_galeria, categoria, data_inicio, data_fim) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)',
      [manchete, foto, conteudo, autor || null, status || 'rascunho', id_usuario, JSON.stringify(fotosGaleria), categoria || null, data_inicio, data_fim || null]
    );

    // REGISTRO DE LOG: Criação
    await registrarLog(id_usuario, nome_usuario, `Criou notícia: ${manchete.substring(0, 40)}...`, 'noticias', req);

    res.json({ id: result.insertId, message: 'Notícia criada', foto, fotosGaleria });
  } catch (error) {
    console.error('Erro ao criar notícia:', error);
    res.status(500).json({ error: 'Erro ao criar notícia', details: error.message });
  }
});

app.put('/api/noticias_portal/:id', authenticateToken, upload.fields([{ name: 'foto', maxCount: 1 }, { name: 'fotosGaleria', maxCount: 10 }]), async (req, res) => {
  const { id } = req.params;
  const { manchete, conteudo, autor, status, categoria, data_inicio, data_fim, existingFotosGaleria, data_publicacao } = req.body;
  const id_usuario = req.user.id;
  const nome_usuario = req.user.nome;
  const foto = req.files?.['foto']?.[0] ? `/ImgNoticias/${req.files['foto'][0].filename}` : null;
  const newFotosGaleria = req.files?.['fotosGaleria']?.map(file => `/ImgNoticias/${file.filename}`) || [];
  const validStatus = ['rascunho', 'publicado'].includes(status) ? status : 'publicado';

  try {
    const [existing] = await db.query('SELECT foto, fotos_galeria FROM noticias_portal WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ error: 'Notícia não encontrada' });

    const existingFotos = existingFotosGaleria ? JSON.parse(existingFotosGaleria) : JSON.parse(existing[0].fotos_galeria || '[]');
    const fotosGaleriaToUse = [...existingFotos, ...newFotosGaleria].filter(Boolean);
    const fotoToUse = foto || existing[0].foto;

    await db.query(
      'UPDATE noticias_portal SET manchete = ?, foto = ?, conteudo = ?, autor = ?, status = ?, id_usuario = ?, fotos_galeria = ?, categoria = ?, data_inicio = ?, data_fim = ?, data_publicacao = ? WHERE id = ?',
      [manchete, fotoToUse, conteudo, autor || null, validStatus, id_usuario, JSON.stringify(fotosGaleriaToUse), categoria || null, data_inicio, data_fim || null, data_publicacao || data_inicio, id]
    );

    // REGISTRO DE LOG: Edição
    await registrarLog(id_usuario, nome_usuario, `Editou notícia ID ${id}: ${manchete.substring(0, 30)}...`, 'noticias', req);

    res.json({ id, message: 'Notícia atualizada', foto: fotoToUse, fotosGaleria: fotosGaleriaToUse });
  } catch (error) {
    console.error('Erro ao atualizar notícia:', error);
    res.status(500).json({ error: 'Erro ao atualizar notícia', details: error.message });
  }
});

app.get('/api/publicacoes', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT CAST(id AS CHAR) AS id, titulo, descricao, imagem, data_publicacao, responsavel, status, categoria FROM publicacoes_portalrcccta WHERE status = ? ORDER BY data_publicacao DESC LIMIT 5',
      ['publicada']
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar publicações:', error);
    res.status(500).json({ error: 'Erro ao buscar publicações', details: error.message });
  }
});

app.get('/api/admin/publicacoes', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT CAST(id AS CHAR) AS id, titulo, descricao, imagem, data_publicacao, responsavel, status, categoria
       FROM publicacoes_portalrcccta
       WHERE status != 'excluida'
       ORDER BY data_publicacao DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar publicações:', error);
    res.status(500).json({ error: 'Erro ao buscar publicações', details: error.message });
  }
});


app.get('/api/publicacoes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT CAST(id AS CHAR) AS id, titulo, descricao, imagem, data_publicacao, responsavel, status, categoria FROM publicacoes_portalrcccta WHERE id = ?',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Publicação não encontrada' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar publicação:', error);
    res.status(500).json({ error: 'Erro ao buscar publicação', details: error.message });
  }
});

app.post('/api/publicacoes', authenticateToken, upload.fields([{ name: 'imagem', maxCount: 1 }]), async (req, res) => {
  const { titulo, descricao, responsavel, status, categoria } = req.body;
  const id_usuario = req.user.id;
  const nome_usuario = req.user.nome;
  const imagem = req.files?.['imagem']?.[0] ? `/imgPublicacao/${req.files['imagem'][0].filename}` : null;

  if (!titulo || !descricao || !responsavel || !status || !categoria) {
    return res.status(400).json({ error: 'Campos obrigatórios' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO publicacoes_portalrcccta (id, titulo, descricao, imagem, responsavel, status, categoria, data_publicacao, criado_em, atualizado_em) VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())',
      [titulo, descricao, imagem, responsavel, status, categoria]
    );

    // REGISTRO DE LOG: Nova Publicação
    await registrarLog(id_usuario, nome_usuario, `Criou publicação: ${titulo.substring(0, 40)}`, 'publicacoes', req);

    res.json({ id: result.insertId, message: 'Publicação criada', imagem });
  } catch (error) {
    console.error('Erro ao criar publicação:', error);
    res.status(500).json({ error: 'Erro ao criar publicação', details: error.message });
  }
});

app.put('/api/publicacoes/:id', authenticateToken, upload.fields([{ name: 'imagem', maxCount: 1 }]), async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, responsavel, status, categoria } = req.body;
  const id_usuario = req.user.id;
  const nome_usuario = req.user.nome;
  const imagem = req.files?.['imagem']?.[0] ? `/imgPublicacao/${req.files['imagem'][0].filename}` : null;

  if (!titulo || !descricao || !responsavel || !status || !categoria) {
    return res.status(400).json({ error: 'Campos obrigatórios' });
  }

  try {
    const [existing] = await db.query('SELECT imagem FROM publicacoes_portalrcccta WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ error: 'Publicação não encontrada' });

    const imagemToUse = imagem || existing[0].imagem;

    await db.query(
      'UPDATE publicacoes_portalrcccta SET titulo = ?, descricao = ?, imagem = ?, responsavel = ?, status = ?, categoria = ?, atualizado_em = NOW() WHERE id = ?',
      [titulo, descricao, imagemToUse, responsavel, status, categoria, id]
    );

    // REGISTRO DE LOG: Edição de Publicação
    await registrarLog(id_usuario, nome_usuario, `Editou publicação: ${titulo.substring(0, 40)}`, 'publicacoes', req);

    res.json({ id, message: 'Publicação atualizada', imagem: imagemToUse });
  } catch (error) {
    console.error('Erro ao atualizar publicação:', error);
    res.status(500).json({ error: 'Erro ao atualizar publicação', details: error.message });
  }
});

app.get('/publicacoes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${API_BASE_URL}/api/publicacoes/${id}`);
    if (!response.ok) throw new Error('Publicação não encontrada');
    const publicacao = await response.json();

    const imageUrl = publicacao.imagem ? `${API_BASE_URL}${publicacao.imagem}` : 'https://rcccuritiba.com.br/placeholder-400x300.jpg';
    const description = publicacao.descricao.replace(/<[^>]+>/g, '').slice(0, 200);
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${publicacao.titulo}</title>
        <meta property="og:title" content="${publicacao.titulo}">
        <meta property="og:image" content="${imageUrl}">
        <meta property="og:url" content="https://rcccuritiba.com.br/publicacoes/${id}">
        <meta property="og:type" content="article">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${publicacao.titulo}">
        <meta name="twitter:image" content="${imageUrl}">
      </head>
      <body>
        <script>
          window.location.href = '/publicacoes/${id}'; // Redirect to client-side app
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(404).send('Publicação não encontrada');
  }
});

app.post('/api/pedido-oracao', async (req, res) => {
  const { nome, email, cidade, mensagem } = req.body;
  if (!nome || !email || !cidade || !mensagem) return res.status(400).json({ error: 'Campos obrigatórios' });
  try {
    await db.query('INSERT INTO portal_rcccta_pedido_oracao (nome, email, cidade, mensagem, moderacao) VALUES (?, ?, ?, ?, ?)', [nome, email, cidade, mensagem, 'pendente']);
    res.json({ message: 'Pedido enviado' });
  } catch (error) {
    console.error('Erro ao salvar pedido:', error);
    res.status(500).json({ error: 'Erro ao salvar pedido', details: error.message });
  }
});

app.get('/api/pedidos-oracao/aprovados', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM portal_rcccta_pedido_oracao WHERE moderacao = ?', ['aprovado']);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos', details: error.message });
  }
});

app.post('/api/comments', async (req, res) => {
  const { userId, comment, name, city } = req.body;
  try {
    await db.query('INSERT INTO comments (userId, comment, name, city) VALUES (?, ?, ?, ?)', [userId, comment, name, city]);
    res.json({ message: 'Comentário enviado para moderação' });
  } catch (error) {
    console.error('Erro ao salvar comentário:', error);
    res.status(500).json({ error: 'Erro ao salvar comentário', details: error.message });
  }
});

app.get('/api/comments/approved', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM comments WHERE moderation = ?', ['aprovado']);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    res.status(500).json({ error: 'Erro ao buscar comentários', details: error.message });
  }
});

app.get('/api/comments/unmoderated', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM comments WHERE moderation = ?', ['pendente']);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar comentários não moderados:', error);
    res.status(500).json({ error: 'Erro ao buscar comentários não moderados', details: error.message });
  }
});

app.put('/api/comments/:id/moderate', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { moderation } = req.body;
  if (!['aprovado', 'rejeitado'].includes(moderation)) {
    return res.status(400).json({ error: 'Moderação inválida' });
  }
  try {
    const [result] = await db.query('UPDATE comments SET moderation = ? WHERE id = ?', [moderation, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Comentário não encontrado' });
    res.json({ message: 'Comentário moderado' });
  } catch (error) {
    console.error('Erro ao moderar comentário:', error);
    res.status(500).json({ error: 'Erro ao moderar comentário', details: error.message });
  }
});

app.get('/api/pedidos-oracao/unmoderated', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM portal_rcccta_pedido_oracao WHERE moderacao = ?', ['pendente']);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar pedidos de oração não moderados:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos de oração não moderados', details: error.message });
  }
});

app.put('/api/pedidos-oracao/:id/moderate', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { moderation } = req.body;
  if (!['aprovado', 'rejeitado'].includes(moderation)) {
    return res.status(400).json({ error: 'Moderação inválida' });
  }
  try {
    const [result] = await db.query('UPDATE portal_rcccta_pedido_oracao SET moderacao = ? WHERE id = ?', [moderation, id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Pedido de oração não encontrado' });
    res.json({ message: 'Pedido de oração moderado' });
  } catch (error) {
    console.error('Erro ao moderar pedido de oração:', error);
    res.status(500).json({ error: 'Erro ao moderar pedido de oração', details: error.message });
  }
});

app.get('/api/portal-metrics', async (req, res) => {
  try {
    let [rows] = await db.query('SELECT * FROM portal_metrics LIMIT 1');
    if (!rows.length) {
      await db.query('INSERT INTO portal_metrics (id, noticias, visualizacoes, curtidas, comentarios, updated_at) VALUES (?, ?, ?, ?, ?, NOW())', [1, 0, 0, 0, 0]);
      [rows] = await db.query('SELECT * FROM portal_metrics LIMIT 1');
    }
    const [noticiasRows] = await db.query('SELECT COUNT(*) as count FROM noticias_portal WHERE status = "publicado" AND data_inicio <= CURRENT_TIMESTAMP AND (data_fim IS NULL OR data_fim >= CURRENT_TIMESTAMP)');
    const [commentCount] = await db.query('SELECT COUNT(*) as count FROM comments WHERE moderation = ?', ['aprovado']);
    const metrics = { ...rows[0], noticias: noticiasRows[0].count, comentarios: commentCount[0].count };
    await db.query('UPDATE portal_metrics SET noticias = ?, comentarios = ?, updated_at = NOW() WHERE id = 1', [metrics.noticias, metrics.comentarios]);
    res.json(metrics);
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    res.status(500).json({ error: 'Erro ao buscar métricas', details: error.message });
  }
});

app.post('/api/portal-metrics/update', async (req, res) => {
  const { action, userId, checkOnly, undoLike } = req.body;
  try {
    let [rows] = await db.query('SELECT * FROM portal_metrics LIMIT 1');
    if (!rows.length) {
      await db.query('INSERT INTO portal_metrics (id, noticias, visualizacoes, curtidas, comentarios, updated_at) VALUES (?, ?, ?, ?, ?, NOW())', [1, 0, 0, 0, 0]);
      [rows] = await db.query('SELECT * FROM portal_metrics LIMIT 1');
    }
    let metrics = rows[0];
    if (action === 'view') {
      metrics.visualizacoes += 1;
      await db.query('UPDATE portal_metrics SET visualizacoes = ?, updated_at = NOW() WHERE id = 1', [metrics.visualizacoes]);
    } else if (action === 'like') {
      if (checkOnly) {
        const [likeRows] = await db.query('SELECT * FROM user_likes WHERE user_id = ? LIMIT 1', [userId]);
        return res.json({ userLikes: likeRows });
      } else {
        const [existingLike] = await db.query('SELECT * FROM user_likes WHERE user_id = ? LIMIT 1', [userId]);
        if (undoLike) {
          if (existingLike.length > 0) {
            await db.query('DELETE FROM user_likes WHERE user_id = ?', [userId]);
            metrics.curtidas = Math.max(0, metrics.curtidas - 1);
            await db.query('UPDATE portal_metrics SET curtidas = ?, updated_at = NOW() WHERE id = 1', [metrics.curtidas]);
          }
        } else if (existingLike.length === 0) {
          await db.query('INSERT INTO user_likes (user_id, created_at) VALUES (?, NOW())', [userId]);
          metrics.curtidas += 1;
          await db.query('UPDATE portal_metrics SET curtidas = ?, updated_at = NOW() WHERE id = 1', [metrics.curtidas]);
        }
        res.json(metrics);
      }
    }
    const [commentCount] = await db.query('SELECT COUNT(*) as count FROM comments WHERE moderation = ?', ['aprovado']);
    metrics.comentarios = commentCount[0].count;
    await db.query('UPDATE portal_metrics SET comentarios = ?, updated_at = NOW() WHERE id = 1', [metrics.comentarios]);
    res.json(metrics);
  } catch (error) {
    console.error('Erro ao atualizar métricas:', error);
    res.status(500).json({ error: 'Erro ao atualizar métricas', details: error.message });
  }
});

app.post('/api/admin/espiritualidade', authenticateToken, upload.fields([{ name: 'imagem', maxCount: 1 }]), async (req, res) => {
  const { titulo, resumo, materia, data_publicacao, data_inicio, data_fim } = req.body;
  const imagem = req.files?.['imagem']?.[0] ? `/ImgEspiritualidade/${req.files['imagem'][0].filename}` : null;
  if (!titulo || !resumo || !materia || !data_publicacao || !data_inicio) return res.status(400).json({ error: 'Campos obrigatórios' });
  try {
    const [result] = await db.query(
      'INSERT INTO formacao_espiritual (id, titulo, resumo, materia, imagem, data_publicacao, data_inicio, data_fim) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)',
      [titulo, resumo, materia, imagem, data_publicacao, data_inicio, data_fim || null]
    );
    res.json({ id: result.insertId, message: 'Formação criada', imagem });
  } catch (error) {
    console.error('Erro ao criar formação:', error);
    res.status(500).json({ error: 'Erro ao criar formação', details: error.message });
  }
});

app.get('/api/admin/espiritualidade', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT CAST(id AS CHAR) AS id, titulo, resumo, materia, imagem, data_publicacao, data_inicio, data_fim FROM formacao_espiritual WHERE data_inicio <= CURRENT_TIMESTAMP AND (data_fim IS NULL OR data_fim >= CURRENT_TIMESTAMP) ORDER BY data_publicacao DESC'
    );
    res.json(rows.map(row => ({ ...row, imagem: row.imagem || '/ImgEspiritualidade/formacaoMes.png' })));
  } catch (error) {
    console.error('Erro ao buscar formações:', error);
    res.status(500).json({ error: 'Erro ao buscar formações', details: error.message });
  }
});

app.get('/api/admin/espiritualidade/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT CAST(id AS CHAR) AS id, titulo, resumo, materia, imagem, data_publicacao, data_inicio, data_fim FROM formacao_espiritual WHERE id = ?',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Formação não encontrada' });
    res.json({ ...rows[0], imagem: rows[0].imagem || '/ImgEspiritualidade/formacaoMes.png' });
  } catch (error) {
    console.error('Erro ao buscar formação:', error);
    res.status(500).json({ error: 'Erro ao buscar formação', details: error.message });
  }
});

app.post(
  '/api/admin/espiritualidade/upload',
  authenticateToken,
  upload.fields([{ name: 'imagem', maxCount: 1 }]),
  async (req, res) => {
    try {
      if (!req.files?.['imagem']?.[0]) {
        return res.status(400).json({ error: 'Nenhum arquivo' });
      }

      const filename = req.files['imagem'][0].filename;
      const imagemPath = `/ImgEspiritualidade/${filename}`;

      if (isProduction) {
        const filePath = path.join('/var/www/html/portalrccctba/ImgEspiritualidade', filename);
        try {
          await fs.promises.access(filePath);
          await fs.promises.chmod(filePath, 0o644);
          await fs.promises.chown(filePath, 'www-data', 'www-data');
          console.log('[DEBUG] Permissões ajustadas para:', filePath);
        } catch (err) {
          console.error('[DEBUG] Erro ao ajustar permissões:', err.message);
        }
      }

      res.json({ imagem: imagemPath });
    } catch (error) {
      console.error('Erro ao processar upload:', error);
      res.status(500).json({
        error: 'Erro ao processar upload',
        details: error.message
      });
    }
  }
);

app.put('/api/admin/espiritualidade/:id', authenticateToken, upload.fields([{ name: 'imagem', maxCount: 1 }]), async (req, res) => {
  const { id } = req.params;
  const { titulo, resumo, materia, data_publicacao, data_inicio, data_fim } = req.body;
  const imagem = req.files?.['imagem']?.[0] ? `/ImgEspiritualidade/${req.files['imagem'][0].filename}` : null;
  if (!titulo || !resumo || !materia || !data_publicacao || !data_inicio) {
    return res.status(400).json({ error: 'Campos obrigatórios' });
  }
  try {
    const [existing] = await db.query('SELECT imagem FROM formacao_espiritual WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ error: 'Formação não encontrada' });
    const imagemToUse = imagem || existing[0].imagem;
    await db.query(
      'UPDATE formacao_espiritual SET titulo = ?, resumo = ?, materia = ?, imagem = ?, data_publicacao = ?, data_inicio = ?, data_fim = ? WHERE id = ?',
      [titulo, resumo, materia, imagemToUse, data_publicacao, data_inicio, data_fim || null, id]
    );
    res.json({ id, message: 'Formação atualizada', imagem: imagemToUse });
  } catch (error) {
    console.error('Erro ao atualizar formação:', error);
    res.status(500).json({ error: 'Erro ao atualizar formação', details: error.message });
  }
});

// Lista todos os grupos
app.get('/api/admin/grupo-oracao', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT CAST(id AS CHAR) AS id, title, content, image_path, updated_at FROM grupo_oracao ORDER BY updated_at DESC'
    );
    res.json(rows.map(row => ({
      ...row,
      image_path: row.image_path ? `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${row.image_path}` : '/ImgGrupos/grupoDefault.png'
    })));
  } catch (error) {
    console.error('Erro ao buscar grupos:', error);
    res.status(500).json({ error: 'Erro ao buscar grupos', details: error.message });
  }
});

// Busca um grupo por ID
app.get('/api/admin/grupo-oracao/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT CAST(id AS CHAR) AS id, title, content, image_path, updated_at FROM grupo_oracao WHERE id = ?',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Grupo não encontrado' });
    const data = rows[0];
    data.image_path = data.image_path ? `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${data.image_path}` : '/ImgGrupos/grupoDefault.png';
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar grupo:', error);
    res.status(500).json({ error: 'Erro ao buscar grupo', details: error.message });
  }
});

app.get('/api/grupo-oracao', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT CAST(id AS CHAR) AS id, title, content, image_path, updated_at FROM grupo_oracao ORDER BY updated_at DESC LIMIT 1'
    );
    if (!rows.length) return res.status(404).json({ error: 'Nenhum grupo encontrado' });
    const data = rows[0];
    data.image_path = data.image_path
      ? `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${data.image_path}`
      : '/ImgGrupos/grupoDefault.png';
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar grupo-oracao:', error);
    res.status(500).json({ error: 'Erro ao buscar grupo', details: error.message });
  }
});

// Cria um grupo
app.post('/api/admin/grupo-oracao', authenticateToken, upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
  const { title, content } = req.body;
  const image = req.files?.['image']?.[0] ? `/ImgGrupos/${req.files['image'][0].filename}` : null;
  if (!title || !content || !image) return res.status(400).json({ error: 'Campos obrigatórios: title, content, image' });
  try {
    const [result] = await db.query(
      'INSERT INTO grupo_oracao (id, title, content, image_path, updated_at) VALUES (UUID(), ?, ?, ?, NOW())',
      [title, content, image]
    );
    res.json({ id: result.insertId, message: 'Grupo criado', image_path: image });
  } catch (error) {
    console.error('Erro ao criar grupo:', error);
    res.status(500).json({ error: 'Erro ao criar grupo', details: error.message });
  }
});

// Atualiza um grupo
app.put('/api/admin/grupo-oracao/:id', authenticateToken, upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
  const { id } = req.params;
  const { title, content, oldImagePath } = req.body;
  const image = req.files?.['image']?.[0] ? `/ImgGrupos/${req.files['image'][0].filename}` : null;

  try {
    const [existing] = await db.query('SELECT image_path FROM grupo_oracao WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ error: 'Grupo não encontrado' });

    // Sanitize oldImagePath
    const sanitizedOldPath = (oldImagePath || existing[0].image_path || '').replace(/^https?:\/\/[^/]+/, '');
    const imagePath = image || sanitizedOldPath;

    if (!title || !content || !imagePath) return res.status(400).json({ error: 'Campos obrigatórios: title, content, image' });

    // Excluir imagem antiga se uma nova foi enviada e não for a imagem padrão
    if (image && sanitizedOldPath && sanitizedOldPath !== '/ImgGrupos/grupoDefault.png') {
      const filePath = path.join(__dirname, 'public', sanitizedOldPath.replace(/^\/ImgGrupos\//, 'ImgGrupos/'));
      console.log(`Tentando excluir imagem antiga: ${filePath}`);
      try {
        await fs.promises.access(filePath);
        await fs.promises.unlink(filePath);
        console.log(`Imagem antiga ${sanitizedOldPath} excluída com sucesso`);
      } catch (err) {
        console.warn(`Erro ao excluir imagem antiga ${sanitizedOldPath}: ${err.message}`);
      }
    }

    await db.query(
      'UPDATE grupo_oracao SET title = ?, content = ?, image_path = ?, updated_at = NOW() WHERE id = ?',
      [title, content, imagePath, id]
    );

    res.json({
      id,
      message: 'Grupo atualizado',
      image_path: `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${imagePath}`
    });
  } catch (error) {
    console.error('Erro ao atualizar grupo:', error);
    res.status(500).json({ error: 'Erro ao atualizar grupo', details: error.message });
  }
});

// Upload de imagem (mantido para compatibilidade)
app.post('/api/admin/grupo-oracao/upload', authenticateToken, upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
  try {
    if (!req.files?.['image']?.[0]) return res.status(400).json({ error: 'Nenhum arquivo' });
    res.json({ filename: req.files['image'][0].filename });
  } catch (error) {
    console.error('Erro ao processar upload:', error);
    res.status(500).json({ error: 'Erro ao processar upload', details: error.message });
  }
});

// Rota pública para mil amigos para a página Home.tsx
app.get('/api/mil-amigos-home', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT CAST(id AS CHAR) AS id, title, content, image_path, updated_at FROM mil_amigos_home ORDER BY updated_at DESC LIMIT 1');
    const row = rows[0];
    if (row) {
      row.image_path = row.image_path ? `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${row.image_path}` : '/ImgAmigos/amigoDefault.png';
    }
    console.log('image_path retornado:', row ? row.image_path : 'Nenhum'); // Log para debug
    res.json(row || {});
  } catch (error) {
    console.error('Erro ao buscar mil-amigos-home (público):', error);
    res.status(500).json({ error: 'Erro ao buscar', details: error.message });
  }
});

app.get('/api/admin/mil-amigos-home', async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    console.log('NODE_ENV:', process.env.NODE_ENV, 'isProduction:', isProduction);
    const [rows] = await db.query('SELECT CAST(id AS CHAR) AS id, title, content, image_path, updated_at FROM mil_amigos_home ORDER BY updated_at DESC LIMIT 1');
    const row = rows[0] || {};
    if (!row.id) {
      return res.status(404).json({ error: 'Nenhum registro encontrado' });
    }
    row.image_path = row.image_path
      ? `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${row.image_path}`
      : '/ImgAmigos/amigoDefault.png';
    console.log('Resposta /api/mil-amigos-home:', row);
    res.json([row]); //[] faz a array se objeto e não json
  } catch (error) {
    console.error('Erro ao buscar mil-amigos-home:', error);
    res.status(500).json({ error: 'Erro ao buscar', details: error.message });
  }
});


// Busca um registro de mil-amigos por ID para a AdminAigos.tsx
app.get('/api/admin/mil-amigos-home/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        CAST(id AS CHAR) AS id,
        title,
        content,
        image_path,
        updated_at
      FROM mil_amigos_home
      WHERE id = ?
    `, [id]);

    const row = rows[0];
    if (!row) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }

    // Sempre retorna só caminho relativo
    row.image_path = row.image_path && row.image_path.trim() !== ''
      ? row.image_path
      : '/ImgAmigos/amigoDefault.png';

    res.json(row);
  } catch (error) {
    console.error('Erro ao buscar mil-amigos-home:', error);
    res.status(500).json({ error: 'Erro ao buscar', details: error.message });
  }
});

// Busca um registro de amo-rcc-home por ID para a AdminAmoRcc.tsx
app.get('/api/admin/amo-rcc-home/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT CAST(id AS CHAR) AS id, title, content, image_path, updated_at FROM amo_rcc WHERE id = ?', [id]);
    const row = rows[0];
    if (!row) return res.status(404).json({ error: 'Registro não encontrado' });
    row.image_path = row.image_path ? `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${row.image_path}` : '/ImgAmoRcc/amigoDefault.png';
    console.log('image_path retornado:', row.image_path); // Log para debug
    res.json(row);
  } catch (error) {
    console.error('Erro ao buscar amo-rcc-home:', error);
    res.status(500).json({ error: 'Erro ao buscar', details: error.message });
  }
});

// Cria mil amigos
app.post('/api/admin/mil-amigos-home', authenticateToken, upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
  const { title, content } = req.body;
  const image = req.files?.['image']?.[0] ? `/ImgAmigos/${req.files['image'][0].filename}` : null;

  if (!title || !content || !image) {
    return res.status(400).json({ error: 'Campos obrigatórios: title, content, image' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO mil_amigos_home (id, title, content, image_path, updated_at) VALUES (UUID(), ?, ?, ?, NOW())',
      [title, content, image]
    );

    if (image && isProduction) {
      const filePath = path.join('/var/www/html/portalrccctba/ImgAmigos', req.files['image'][0].filename);
      try {
        await fs.promises.access(filePath);
        await fs.promises.chmod(filePath, 0o644);
        await fs.promises.chown(filePath, 'www-data', 'www-data');
        console.log('[DEBUG] Permissões ajustadas para:', filePath);
      } catch (err) {
        console.error('[DEBUG] Erro ao ajustar permissões:', err.message);
      }
    }

    res.json({
      id: result.insertId,
      message: 'Mil Amigos Home criado com sucesso',
      image_path: `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${image}`
    });
  } catch (error) {
    console.error('Erro ao criar mil-amigos-home:', error);
    res.status(500).json({ error: 'Erro ao criar registro', details: error.message });
  }
});

// Atualiza mil amigos
app.put('/api/admin/mil-amigos-home/:id', authenticateToken, upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
  const { id } = req.params;
  const { title, content, oldImagePath } = req.body;
  const image = req.files?.['image']?.[0] ? `/ImgAmigos/${req.files['image'][0].filename}` : null;

  try {
    const [existing] = await db.query('SELECT image_path FROM mil_amigos_home WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ error: 'Registro não encontrado' });

    const sanitizedOldPath = (oldImagePath || existing[0].image_path || '').replace(/^https?:\/\/[^/]+/, '');
    const imagePath = image || sanitizedOldPath;

    if (!title || !content || !imagePath) {
      return res.status(400).json({ error: 'Campos obrigatórios: title, content, image' });
    }

    if (image && sanitizedOldPath && sanitizedOldPath !== '/ImgAmigos/amigoDefault.png') {
      const filePath = path.join(__dirname, 'public', sanitizedOldPath.replace(/^\/ImgAmigos\//, 'ImgAmigos/'));
      try {
        await fs.promises.access(filePath);
        await fs.promises.unlink(filePath);
        console.log(`Imagem antiga ${sanitizedOldPath} excluída`);
      } catch (err) {
        console.warn(`Erro ao excluir imagem antiga ${sanitizedOldPath}: ${err.message}`);
      }
    }

    if (image && isProduction) {
      const filePath = path.join('/var/www/html/portalrccctba/ImgAmigos', req.files['image'][0].filename);
      try {
        await fs.promises.access(filePath);
        await fs.promises.chmod(filePath, 0o644);
        await fs.promises.chown(filePath, 'www-data', 'www-data');
        console.log('[DEBUG] Permissões ajustadas para:', filePath);
      } catch (err) {
        console.error('[DEBUG] Erro ao ajustar permissões:', err.message);
      }
    }

    await db.query(
      'UPDATE mil_amigos_home SET title = ?, content = ?, image_path = ?, updated_at = NOW() WHERE id = ?',
      [title, content, imagePath, id]
    );

    res.json({
      id,
      message: 'Mil Amigos Home atualizado com sucesso',
      image_path: `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${imagePath}`
    });
  } catch (error) {
    console.error('Erro ao atualizar mil_amigos_home:', error);
    res.status(500).json({ error: 'Erro ao atualizar', details: error.message });
  }
});

// Upload de imagem para mil amigos
app.post('/api/admin/mil-amigos-home/upload', authenticateToken, upload.fields([{ name: 'image', maxCount: 1 }]), (req, res) => {
  try {
    if (!req.files?.['image']?.[0]) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    res.json({ filename: req.files['image'][0].filename });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro no upload', details: error.message });
  }
});

// Rota pública para amo-rcc-home
app.get('/api/amo-rcc-home', async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    console.log('NODE_ENV:', process.env.NODE_ENV, 'isProduction:', isProduction);
    const [rows] = await db.query('SELECT CAST(id AS CHAR) AS id, title, content, image_path, updated_at FROM amo_rcc ORDER BY updated_at DESC LIMIT 1');
    const row = rows[0] || {};
    if (!row.id) {
      return res.status(404).json({ error: 'Nenhum registro encontrado' });
    }
    row.image_path = row.image_path
      ? `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${row.image_path}`
      : '/ImgAmoRcc/amigoDefault.png';
    console.log('Resposta /api/amo-rcc-home:', row);
    res.json(row);
  } catch (error) {
    console.error('Erro ao buscar amo-rcc-home:', error);
    res.status(500).json({ error: 'Erro ao buscar', details: error.message });
  }
});

app.get('/api/admin/amo-rcc-home', async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    console.log('NODE_ENV:', process.env.NODE_ENV, 'isProduction:', isProduction);
    const [rows] = await db.query('SELECT CAST(id AS CHAR) AS id, title, content, image_path, updated_at FROM amo_rcc ORDER BY updated_at DESC LIMIT 1');
    const row = rows[0] || {};
    if (!row.id) {
      return res.status(404).json({ error: 'Nenhum registro encontrado' });
    }
    row.image_path = row.image_path
      ? `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${row.image_path}`
      : '/ImgAmoRcc/amigoDefault.png';
    console.log('Resposta /api/amo-rcc-home:', row);
    res.json(row);
  } catch (error) {
    console.error('Erro ao buscar amo-rcc-home:', error);
    res.status(500).json({ error: 'Erro ao buscar', details: error.message });
  }
});

// Busca um registro de amo-rcc-home por ID para editar na AdminAmoRcc.tsx
app.get('/api/admin/amo-rcc-home/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT CAST(id AS CHAR) AS id, title, content, image_path, updated_at FROM amo_rcc WHERE id = ?', [id]);
    const row = rows[0];
    if (!row) return res.status(404).json({ error: 'Registro não encontrado' });
    row.image_path = row.image_path ? `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${row.image_path}` : '/ImgAmoRcc/amigoDefault.png';
    console.log('image_path retornado:', row.image_path); // Log para debug
    res.json(row);
  } catch (error) {
    console.error('Erro ao buscar amo-rcc-home:', error);
    res.status(500).json({ error: 'Erro ao buscar', details: error.message });
  }
});








// Cria um registro de amo-rcc-home
app.post('/api/admin/amo-rcc-home', authenticateToken, upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
  const { title, content } = req.body;
  const image = req.files?.['image']?.[0] ? `/ImgAmoRcc/${req.files['image'][0].filename}` : null;

  if (!title || !content || !image) {
    return res.status(400).json({ error: 'Campos obrigatórios: title, content, image' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO amo_rcc (id, title, content, image_path, updated_at) VALUES (UUID(), ?, ?, ?, NOW())',
      [title, content, image]
    );

    if (image && isProduction) {
      const filePath = path.join('/var/www/html/portalrccctba/ImgAmoRcc', req.files['image'][0].filename);
      try {
        await fs.promises.access(filePath);
        await fs.promises.chmod(filePath, 0o644);
        await fs.promises.chown(filePath, 'www-data', 'www-data');
        console.log('[DEBUG] Permissões ajustadas para:', filePath);
      } catch (err) {
        console.error('[DEBUG] Erro ao ajustar permissões:', err.message);
      }
    }

    res.json({
      id: result.insertId,
      message: 'Amo RCC Home criado com sucesso',
      image_path: `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${image}`
    });
  } catch (error) {
    console.error('Erro ao criar amo-rcc-home:', error);
    res.status(500).json({ error: 'Erro ao criar registro', details: error.message });
  }
});

// Atualiza um registro de amo-rcc-home
app.put('/api/admin/amo-rcc-home/:id', authenticateToken, upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
  const { id } = req.params;
  const { title, content, oldImagePath } = req.body;
  const image = req.files?.['image']?.[0] ? `/ImgAmoRcc/${req.files['image'][0].filename}` : null;

  try {
    const [existing] = await db.query('SELECT image_path FROM amo_rcc WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ error: 'Registro não encontrado' });

    const sanitizedOldPath = (oldImagePath || existing[0].image_path || '').replace(/^https?:\/\/[^/]+/, '');
    const imagePath = image || sanitizedOldPath;

    if (!title || !content || !imagePath) {
      return res.status(400).json({ error: 'Campos obrigatórios: title, content, image' });
    }

    if (image && sanitizedOldPath && sanitizedOldPath !== '/ImgAmoRcc/amigoDefault.png') {
      const filePath = path.join(__dirname, 'public', sanitizedOldPath.replace(/^\/ImgAmoRcc\//, 'ImgAmoRcc/'));
      try {
        await fs.promises.access(filePath);
        await fs.promises.unlink(filePath);
        console.log(`Imagem antiga ${sanitizedOldPath} excluída`);
      } catch (err) {
        console.warn(`Erro ao excluir imagem antiga ${sanitizedOldPath}: ${err.message}`);
      }
    }

    if (image && isProduction) {
      const filePath = path.join('/var/www/html/portalrccctba/ImgAmoRcc', req.files['image'][0].filename);
      try {
        await fs.promises.access(filePath);
        await fs.promises.chmod(filePath, 0o644);
        await fs.promises.chown(filePath, 'www-data', 'www-data');
        console.log('[DEBUG] Permissões ajustadas para:', filePath);
      } catch (err) {
        console.error('[DEBUG] Erro ao ajustar permissões:', err.message);
      }
    }

    await db.query(
      'UPDATE amo_rcc SET title = ?, content = ?, image_path = ?, updated_at = NOW() WHERE id = ?',
      [title, content, imagePath, id]
    );

    res.json({
      id,
      message: 'Amo RCC Home atualizado com sucesso',
      image_path: `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${imagePath}`
    });
  } catch (error) {
    console.error('Erro ao atualizar amo_rcc:', error);
    res.status(500).json({ error: 'Erro ao atualizar', details: error.message });
  }
});

//------------------------------------------------------------------------------------------------------------------

// Upload de imagem para amo-rcc-home
app.post('/api/admin/amo-rcc-home/upload', authenticateToken, upload.fields([{ name: 'image', maxCount: 1 }]), (req, res) => {
  try {
    if (!req.files?.['image']?.[0]) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    res.json({ filename: req.files['image'][0].filename });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro no upload', details: error.message });
  }
});

app.use(
  ['/api/agenda.php', '/Api/agenda.php'],
  createProxyMiddleware({
    target: 'https://www.rcccuritiba.online',
    changeOrigin: true,
    secure: true,
    pathRewrite: {
      '^/api/agenda.php': '/Api/agenda.php',
      '^/Api/agenda.php': '/Api/agenda.php',
    },
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json',
    },
    on: {
      proxyReq: (proxyReq, req) => {
        console.log(`[PROXY] Request to ${req.url} from ${req.ip} at ${new Date().toISOString()}`);
      },
      proxyRes: (proxyRes, req) => {
        console.log(`[PROXY] Response for ${req.url}: ${proxyRes.statusCode}, Content-Type: ${proxyRes.headers['content-type']}`);
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        delete proxyRes.headers['access-control-allow-origin'];
      },
      error: (err, req, res) => {
        console.error(`[PROXY ERROR] Error proxying ${req.url}: ${err.message}`);
        res.status(500).send('Proxy error');
      },
    },
  })
);

app.use('/Api/mapa_grupos.php', createProxyMiddleware({
  target: 'https://www.rcccuritiba.online',
  changeOrigin: true,
  secure: true,
  pathRewrite: { '^/Api/mapa_grupos.php': '^/Api/mapa_grupos.php' },
  headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
  on: {
    proxyReq: () => { },
    proxyRes: (proxyRes) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      delete proxyRes.headers['access-control-allow-origin'];
    }
  }
}));

app.get('/api/ministerios/:id/detalhes', async (req, res) => {
  try {
    const [coordenadorRows] = await db.query('SELECT * FROM ministerio_coordenadores WHERE ministerio_id = ?', [req.params.id]);
    const coordenador = coordenadorRows.length ? coordenadorRows[0] : null;

    const [detalhesRows] = await db.query('SELECT * FROM ministerio_detalhes WHERE ministerio_id = ?', [req.params.id]);
    const detalhes = detalhesRows.length ? detalhesRows[0] : null;

    const [escolasRows] = await db.query('SELECT data, local FROM ministerio_escolas_formacao WHERE ministerio_id = ?', [req.params.id]);
    const escolasFormacao = escolasRows.map(row => ({ data: row.data, local: row.local })).filter(item => item.data && item.local);

    if (!detalhes && !coordenador && !escolasFormacao.length) {
      return res.status(404).json({ error: 'Detalhes não encontrados' });
    }

    res.json({ coordenador, detalhes, escolasFormacao });
  } catch (error) {
    console.error('Erro ao buscar detalhes:', error);
    res.status(500).json({ error: 'Erro ao buscar detalhes', details: error.message });
  }
});

app.get('/api/admin/ministerios', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ministerio_detalhes');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar ministérios:', error);
    res.status(500).json({ error: 'Erro ao buscar ministérios', details: error.message });
  }
});

app.get('/api/admin/ministerios/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ministerio_detalhes WHERE ministerio_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Ministério não encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar ministério:', error);
    res.status(500).json({ error: 'Erro ao buscar ministério', details: error.message });
  }
});

// 1. Criar/Salvar detalhes do Ministério
app.post('/api/admin/ministerios', authenticateToken, async (req, res) => {
  const { nome, descricao, missao } = req.body;
  if (!nome || !descricao || !missao) return res.status(400).json({ error: 'Campos obrigatórios faltando' });

  try {
    const ministerio_id = nome.toLowerCase().replace(/[^a-z0-9]/g, '');
    await db.query(
      'INSERT INTO ministerio_detalhes (ministerio_id, nome, descricao, missao) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE nome = VALUES(nome), descricao = VALUES(descricao), missao = VALUES(missao)',
      [ministerio_id, nome, descricao, missao]
    );

    // REGISTRO DE LOG
    await registrarLog(req.user.id, req.user.nome, `Salvou detalhes do ministério: ${nome}`, 'ministerios', req);

    res.json({ ministerio_id, message: 'Detalhes salvos' });
  } catch (error) {
    console.error('Erro ao salvar detalhes:', error);
    res.status(500).json({ error: 'Erro ao salvar detalhes', details: error.message });
  }
});

// 2. Atualizar Escolas de Formação (Com Transação)
app.put('/api/admin/ministerios/:id/escolas', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const escolas = req.body;
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [detalhes] = await connection.query('SELECT nome FROM ministerio_detalhes WHERE ministerio_id = ?', [id]);
    if (!detalhes.length) {
      await connection.rollback();
      return res.status(404).json({ error: 'Ministério não encontrado' });
    }

    await connection.query('DELETE FROM ministerio_escolas_formacao WHERE ministerio_id = ?', [id]);
    const insertPromises = escolas.map((escola) =>
      connection.query('INSERT INTO ministerio_escolas_formacao (ministerio_id, data, local) VALUES (?, ?, ?)', [id, escola.data, escola.local])
    );
    await Promise.all(insertPromises);

    await connection.commit();

    // REGISTRO DE LOG (Após o Commit)
    await registrarLog(req.user.id, req.user.nome, `Atualizou as escolas de formação do ministério: ${detalhes[0].nome}`, 'ministerios', req);

    res.json({ message: 'Escolas atualizadas com sucesso' });
  } catch (error) {
    if (connection) await connection.rollback();
    res.status(500).json({ error: 'Erro ao atualizar escolas', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

// 3. Adicionar Coordenador
app.post('/api/admin/ministerios/:id/coordenadores', authenticateToken, upload.fields([{ name: 'foto_coordenador', maxCount: 1 }]), async (req, res) => {
  const { id } = req.params;
  const { nome, email, grupo_oracao } = req.body;
  if (!nome || !email || !grupo_oracao) return res.status(400).json({ error: 'Campos obrigatórios' });

  const foto = req.files?.['foto_coordenador']?.[0] ? `/ImgFotos/${req.files['foto_coordenador'][0].filename}` : null;

  try {
    const [detalhes] = await db.query('SELECT nome FROM ministerio_detalhes WHERE ministerio_id = ?', [id]);
    if (!detalhes.length) return res.status(404).json({ error: 'Ministério não encontrado' });

    await db.query(
      'INSERT INTO ministerio_coordenadores (ministerio_id, nome, email, grupo_oracao, foto_coordenador) VALUES (?, ?, ?, ?, ?)',
      [id, nome, email, grupo_oracao, foto]
    );

    // REGISTRO DE LOG
    await registrarLog(req.user.id, req.user.nome, `Adicionou coordenador ${nome} ao ministério ${detalhes[0].nome}`, 'ministerios', req);

    res.json({ message: 'Coordenador salvo' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar coordenador', details: error.message });
  }
});

// 4. Atualizar Coordenador
app.put('/api/admin/ministerios/:id/coordenadores/:coordId', authenticateToken, upload.fields([{ name: 'foto_coordenador', maxCount: 1 }]), async (req, res) => {
  const { id, coordId } = req.params;
  const { nome, email, grupo_oracao } = req.body;
  const foto = req.files?.['foto_coordenador']?.[0] ? `/ImgFotos/${req.files['foto_coordenador'][0].filename}` : undefined;

  try {
    const [existing] = await db.query('SELECT nome FROM ministerio_coordenadores WHERE id = ?', [coordId]);
    if (!existing.length) return res.status(404).json({ error: 'Coordenador não encontrado' });

    await db.query(
      'UPDATE ministerio_coordenadores SET nome = ?, email = ?, grupo_oracao = ?, foto_coordenador = ? WHERE id = ?',
      [nome, email, grupo_oracao, foto || existing[0].foto_coordenador, coordId]
    );

    // REGISTRO DE LOG
    await registrarLog(req.user.id, req.user.nome, `Editou o coordenador: ${existing[0].nome} (ID: ${coordId})`, 'ministerios', req);

    res.json({ message: 'Coordenador atualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar coordenador', details: error.message });
  }
});

// 5. Deletar Ministério (Ação Crítica)
app.delete('/api/admin/ministerios/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    // Pegamos o nome antes de deletar para o log ficar legível
    const [min] = await db.query('SELECT nome FROM ministerio_detalhes WHERE ministerio_id = ?', [id]);
    if (!min.length) return res.status(404).json({ error: 'Ministério não encontrado' });

    await db.query('DELETE FROM ministerio_detalhes WHERE ministerio_id = ?', [id]);
    await db.query('DELETE FROM ministerio_escolas_formacao WHERE ministerio_id = ?', [id]);
    await db.query('DELETE FROM ministerio_coordenadores WHERE ministerio_id = ?', [id]);

    // REGISTRO DE LOG
    await registrarLog(req.user.id, req.user.nome, `EXCLUIU COMPLETAMENTE o ministério: ${min[0].nome}`, 'ministerios', req);

    res.json({ message: 'Ministério deletado' });
  } catch (error) {
    console.error('Erro ao deletar ministério:', error);
    res.status(500).json({ error: 'Erro ao deletar ministério', details: error.message });
  }
});

app.get('/api/espiritualidade/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT CAST(id AS CHAR) AS id, titulo, resumo, materia, imagem, data_publicacao, data_inicio, data_fim FROM formacao_espiritual WHERE id = ?',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Formação não encontrada' });
    const data = rows[0];
    data.imagem = data.imagem ? `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${data.imagem}` : `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}/ImgEspiritualidade/formacaoMes.png`;
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar formação:', error);
    res.status(500).json({ error: 'Erro ao buscar formação', details: error.message });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.query?.toString() || '';
    const like = `%${query}%`;

    const [formacoes] = await db.query(
      `SELECT id, titulo AS title, materia AS preview FROM formacao_espiritual WHERE titulo LIKE ? OR materia LIKE ?`,
      [like, like]
    );

    const [mensagens] = await db.query(
      `SELECT id, titulo_mensagem AS title, resumo_mensagem AS preview FROM mensagens_coordenacao WHERE titulo_mensagem LIKE ? OR resumo_mensagem LIKE ?`,
      [like, like]
    );

    const [noticias] = await db.query(
      `SELECT DISTINCT id, manchete AS title, conteudo AS preview FROM noticias_portal WHERE manchete LIKE ? OR conteudo LIKE ?`,
      [like, like]
    );

    const [publicacoes] = await db.query(
      `SELECT id, titulo AS title, descricao AS preview FROM publicacoes_portalrcccta WHERE titulo LIKE ? OR descricao LIKE ?`,
      [like, like]
    );

    const results = [
      ...formacoes.map(f => ({ ...f, type: 'Formação', route: `/espiritualidade/${f.id}` })),
      ...mensagens.map(m => ({ ...m, type: 'Mensagem', route: `/mensagem-coordenacao/` })),
      ...noticias.map(n => ({ ...n, type: 'Notícia', route: `/noticias/${n.id}` })),
      ...publicacoes.map(p => ({ ...p, type: 'Publicação', route: `/publicacoes/${p.id}` })),
    ];
    console.log('formacoes:', formacoes);
    console.log('mensagens:', mensagens);
    console.log('noticias:', noticias);
    console.log('publicacoes:', publicacoes);
    res.json(results);
  } catch (error) {
    console.error('Erro na busca:', error.message, error.stack);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

app.post('/api/likes', async (req, res) => {
  const { page, userId, action } = req.body;
  if (action === 'like') {
    try {
      const [result] = await db.query(
        `UPDATE page_likes SET ${page} = COALESCE(${page}, 0) + 1, updated_at = NOW() WHERE 1=1`
      );
      if (result.affectedRows === 0) {
        await db.query(
          `INSERT INTO page_likes (${page}, updated_at) VALUES (1, NOW()) ON DUPLICATE KEY UPDATE ${page} = ${page} + 1, updated_at = NOW()`
        );
      }
      const [rows] = await db.query('SELECT ? AS page FROM page_likes', [page]);
      res.json({ likes: rows[0]?.[page] || 0 });
    } catch (err) {
      console.error('Erro ao atualizar curtidas:', err);
      res.status(500).json({ error: 'Erro ao gravar curtida' });
    }
  } else {
    res.status(400).json({ error: 'Ação inválida' });
  }
});

app.get('/api/likes', async (req, res) => {
  const page = req.query.page;
  try {
    const [rows] = await db.query(`SELECT ${db.escapeId(page)} AS likes FROM page_likes LIMIT 1`);
    res.json({ likes: rows[0]?.likes || 0 });
  } catch (err) {
    console.error('Erro ao buscar curtidas:', err);
    res.status(500).json({ error: 'Erro ao buscar curtidas' });
  }
});

// server.js - Rota /noticias/:id


if (isProduction) {
  app.get('/video', (req, res) => res.sendFile(path.join(basePath, 'index.html')));
}

const pastaVideos = path.resolve('public/videos');

app.post(
  '/api/videos',
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      if (!fs.existsSync(pastaVideos)) {
        fs.mkdirSync(pastaVideos, { recursive: true });
        console.log(`📁 Pasta criada: ${pastaVideos}`);
      }

      const { title, description } = req.body;
      const video = req.files?.['video']?.[0];
      const thumbnail = req.files?.['thumbnail']?.[0];

      if (!title || !video) {
        return res.status(400).json({ error: 'Título e vídeo são obrigatórios' });
      }

      const videoUrl = `/videos/${path.basename(video.path)}`;
      const thumbnailUrl = thumbnail ? `/videos/${path.basename(thumbnail.path)}` : null;

      const [result] = await db.query(
        'INSERT INTO videos (title, description, video_url, thumbnail_url, upload_date, views) VALUES (?, ?, ?, ?, NOW(), 0)',
        [title, description || null, videoUrl, thumbnailUrl]
      );

      const logFile = path.resolve('log-upload.txt');

      if (video?.path) {
        exec(`chown www-data:www-data "${video.path}" && chmod 755 "${video.path}"`, (err, stdout, stderr) => {
          const log = `🟡 VIDEO: ${video.path}\nSTDOUT: ${stdout}\nSTDERR: ${stderr}\nERROR: ${err?.message || 'nenhum'}\n\n`;
          fs.appendFileSync(logFile, log);
        });
      }

      if (thumbnail?.path) {
        exec(`chown www-data:www-data "${thumbnail.path}" && chmod 755 "${thumbnail.path}"`, (err, stdout, stderr) => {
          const log = `🟢 THUMB: ${thumbnail.path}\nSTDOUT: ${stdout}\nSTDERR: ${stderr}\nERROR: ${err?.message || 'nenhum'}\n\n`;
          fs.appendFileSync(logFile, log);
        });
      }

      res.json({
        id: result.insertId,
        message: 'Vídeo enviado com sucesso',
        videoUrl,
        thumbnailUrl
      });
    } catch (error) {
      console.error('Erro ao processar upload de vídeo:', error);
      res.status(500).json({ error: 'Erro ao processar upload de vídeo', details: error.message });
    }
  }
);

app.get('/api/videos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, title, description, video_url, thumbnail_url, upload_date, views FROM videos ORDER BY upload_date DESC');
    res.json(rows.map(row => ({
      ...row,
      video_url: `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${row.video_url}`,
      thumbnail_url: row.thumbnail_url ? `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${row.thumbnail_url}` : null
    })));
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    res.status(500).json({ error: 'Erro ao buscar vídeos', details: error.message });
  }
});
app.get('/api/videos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT id, title, description, video_url, thumbnail_url, upload_date, views FROM videos WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Vídeo não encontrado' });
    const video = rows[0];
    video.video_url = `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${video.video_url}`;
    video.thumbnail_url = video.thumbnail_url ? `${isProduction ? 'https://rcccuritiba.com.br' : 'http://localhost:3000'}${video.thumbnail_url}` : null;
    await db.query('UPDATE videos SET views = views + 1 WHERE id = ?', [id]);
    res.json(video);
  } catch (error) {
    console.error('Erro ao buscar vídeo:', error);
    res.status(500).json({ error: 'Erro ao buscar vídeo', details: error.message });
  }
});
app.put('/api/videos/:id', authenticateToken, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const video = req.files?.['video']?.[0];
  const thumbnail = req.files?.['thumbnail']?.[0];

  try {
    const [existing] = await db.query('SELECT video_url, thumbnail_url FROM videos WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ error: 'Vídeo não encontrado' });

    const videoUrl = video ? `/videos/${video.filename}` : existing[0].video_url;
    const thumbnailUrl = thumbnail ? `/videos/${thumbnail.filename}` : existing[0].thumbnail_url;

    await db.query(
      'UPDATE videos SET title = ?, description = ?, video_url = ?, thumbnail_url = ?, updated_at = NOW() WHERE id = ?',
      [title || existing[0].title, description || existing[0].description, videoUrl, thumbnailUrl, id]
    );

    res.json({ id, message: 'Vídeo atualizado', videoUrl, thumbnailUrl });
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    res.status(500).json({ error: 'Erro ao atualizar vídeo', details: error.message });
  }
});
app.delete('/api/videos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await db.query('SELECT video_url, thumbnail_url FROM videos WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ error: 'Vídeo não encontrado' });
    const videoPath = path.join(__dirname, 'public', existing[0].video_url);
    const thumbnailPath = existing[0].thumbnail_url ? path.join(__dirname, 'public', existing[0].thumbnail_url) : null;
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    if (thumbnailPath && fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
    await db.query('DELETE FROM videos WHERE id = ?', [id]);
    res.json({ message: 'Vídeo deletado' });
  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
    res.status(500).json({ error: 'Erro ao deletar vídeo', details: error.message });
  }
});


//Sessão Notícias com Vídeo

// POST - Upload de vídeo (somente admin autenticado)
app.post('/api/admin/videos', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { titulo, descricao } = req.body;
    const videoFile = req.files['video']?.[0];
    const thumbnailFile = req.files['thumbnail']?.[0];

    if (!titulo || !descricao || !videoFile) {
      return res.status(400).json({ error: 'Título, descrição e vídeo são obrigatórios' });
    }

    // Caminhos relativos (ex: /videos/nome-do-arquivo.mp4)
    const videoUrl = `/videos/${videoFile.filename}`;
    const thumbnailUrl = thumbnailFile ? `/videos/${thumbnailFile.filename}` : null;

    // INSERT com status fixo 'publicado'
    const [result] = await db.query(
      `INSERT INTO videos_noticias 
       (titulo, descricao, video_url, thumbnail_url, status, uploaded_at) 
       VALUES (?, ?, ?, ?, 'publicado', NOW())`,
      [titulo, descricao, videoUrl, thumbnailUrl]
    );

    console.log(`[SUCCESS] Vídeo-notícia criado - ID: ${result.insertId}, Título: ${titulo}`);

    res.status(201).json({
      message: 'Vídeo-notícia publicado com sucesso',
      id: result.insertId
    });
  } catch (err) {
    console.error('[ERROR] Ao criar vídeo-notícia:', err);
    res.status(500).json({ error: 'Erro ao publicar vídeo-notícia', details: err.message });
  }
});

// GET - Listar vídeos publicados (público)
app.get('/api/videos', async (req, res) => {
  const pageStr = req.query.page;
  const page = typeof pageStr === 'string' ? parseInt(pageStr, 10) : 1;
  if (isNaN(page) || page < 1) page = 1; // fallback seguro

  const limit = 6;
  const offset = (page - 1) * limit;
  const orderBy = req.query.orderBy === 'views' ? 'views DESC' : 'uploaded_at DESC';

  try {
    const [rows] = await db.query(
      `SELECT * FROM videos_noticias 
       WHERE status = 'publicado' 
       ORDER BY is_featured DESC, ${orderBy} 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const videos = rows.map(row => ({
      ...row,
      video_url: `${API_BASE_URL}${row.video_url}`,
      thumbnail_url: row.thumbnail_url ? `${API_BASE_URL}${row.thumbnail_url}` : null
    }));

    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar vídeos' });
  }
});

//----------------------------


// Rota exclusiva para vídeos-notícias
app.get('/api/noticias-videos', async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = 6;
    const offset = (page - 1) * limit;
    const orderBy = req.query.orderBy === 'views' ? 'views DESC' : 'uploaded_at DESC';

    const [rows] = await db.query(
      `SELECT id, titulo, descricao, video_url, thumbnail_url, uploaded_at, views, is_featured 
       FROM videos_noticias 
       WHERE status = 'publicado' 
       ORDER BY is_featured DESC, ${orderBy} 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const videos = rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      descricao: row.descricao,
      video_url: `${API_BASE_URL}${row.video_url}`,
      thumbnail_url: row.thumbnail_url ? `${API_BASE_URL}${row.thumbnail_url}` : null,
      uploaded_at: row.uploaded_at,
      views: row.views,
      is_featured: row.is_featured || false
    }));

    console.log('Vídeos-notícias retornados:', videos.length);

    res.json(videos);
  } catch (err) {
    console.error('Erro ao listar vídeos-notícias:', err);
    res.status(500).json({ error: 'Erro ao listar vídeos-notícias' });
  }
});


// Rota para registrar uma visualização (chamada quando o vídeo começa a tocar)
app.post('/api/videos/:id/view', async (req, res) => {
  try {
    const videoId = parseInt(req.params.id, 10);

    // Incrementa +1 no campo views
    const [result] = await db.query(
      'UPDATE videos_noticias SET views = views + 1 WHERE id = ?',
      [videoId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    // Opcional: retorna o novo total de views
    const [updated] = await db.query(
      'SELECT views FROM videos_noticias WHERE id = ?',
      [videoId]
    );

    console.log(`[VIEW] +1 visualização registrada para vídeo ID ${videoId}. Total agora: ${updated[0].views}`);

    res.json({ success: true, views: updated[0].views });
  } catch (err) {
    console.error('[ERROR] Ao registrar view:', err);
    res.status(500).json({ error: 'Erro ao registrar visualização' });
  }
});

// PUT - Editar vídeo
app.put('/api/admin/videos/:id', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const id = req.params.id;
    const { titulo, descricao } = req.body;
    const videoFile = req.files['video']?.[0];
    const thumbnailFile = req.files['thumbnail']?.[0];

    let updates = 'titulo = ?, descricao = ?';
    const params = [titulo, descricao];

    if (videoFile) {
      const videoUrl = `/videos/${videoFile.filename}`;
      updates += ', video_url = ?';
      params.push(videoUrl);
    }
    if (thumbnailFile) {
      const thumbnailUrl = `/videos/${thumbnailFile.filename}`;
      updates += ', thumbnail_url = ?';
      params.push(thumbnailUrl);
    }

    params.push(id);

    await db.query(`UPDATE videos_noticias SET ${updates} WHERE id = ?`, params);

    res.json({ message: 'Vídeo atualizado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar vídeo' });
  }
});

// DELETE - Excluir vídeo
app.delete('/api/admin/videos/:id', async (req, res) => {
  const videoId = req.params.id;
  const token = req.headers.authorization?.split(' ')[1];

  // Verificação de admin (se você já tem middleware, pode usar)
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    // 1. Buscar os caminhos dos arquivos antes de deletar o registro
    const [rows] = await db.query(
      'SELECT video_url, thumbnail_url FROM videos_noticias WHERE id = ?',
      [videoId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    const video = rows[0];
    const baseDir = process.env.BASE_DIR || path.join(__dirname, 'public'); // ajuste conforme sua config

    // Caminhos absolutos dos arquivos
    let videoPath = null;
    let thumbnailPath = null;

    if (video.video_url) {
      videoPath = path.join(baseDir, video.video_url.replace(/^\//, '')); // remove / inicial
    }
    if (video.thumbnail_url) {
      thumbnailPath = path.join(baseDir, video.thumbnail_url.replace(/^\//, ''));
    }

    console.log(`[DELETE] Tentando remover vídeo ID ${videoId}`);
    console.log(`  - Video path: ${videoPath || 'não existe'}`);
    console.log(`  - Thumbnail path: ${thumbnailPath || 'não existe'}`);

    // 2. Deletar arquivos físicos (se existirem)
    if (videoPath && fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
      console.log(`[SUCCESS] Arquivo de vídeo removido: ${videoPath}`);
    }

    if (thumbnailPath && fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
      console.log(`[SUCCESS] Thumbnail removido: ${thumbnailPath}`);
    }

    // 3. Deletar registro do banco
    await db.query('DELETE FROM videos_noticias WHERE id = ?', [videoId]);

    res.json({ message: 'Vídeo e arquivos removidos com sucesso' });
  } catch (err) {
    console.error('[ERROR] Ao deletar vídeo:', err);
    res.status(500).json({
      error: 'Erro ao deletar vídeo ou arquivos',
      details: err.message
    });
  }
});

// Rota para listar APENAS vídeos-notícias (tabela videos_noticias)
app.get('/api/noticias-videos', async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = 20; // ou o limite que preferir no admin
    const offset = (page - 1) * limit;

    console.log(`[DEBUG] GET /api/noticias-videos - page=${page}`);

    const [rows] = await db.query(
      `SELECT 
         id, 
         titulo, 
         descricao, 
         video_url, 
         thumbnail_url, 
         uploaded_at, 
         views, 
         is_featured 
       FROM videos_noticias 
       ORDER BY uploaded_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const videos = rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      descricao: row.descricao,
      video_url: `${API_BASE_URL}${row.video_url}`,
      thumbnail_url: row.thumbnail_url ? `${API_BASE_URL}${row.thumbnail_url}` : null,
      uploaded_at: row.uploaded_at,
      views: row.views,
      is_featured: !!row.is_featured
    }));

    console.log(`[DEBUG] Vídeos-notícias retornados: ${videos.length} itens`, videos);

    res.json(videos);
  } catch (err) {
    console.error('[ERROR] Ao listar vídeos-notícias:', err);
    res.status(500).json({ error: 'Erro ao listar vídeos-notícias' });
  }
});


// --- WEB RADIO ---

// Rota pública para buscar os arquivos da rádio
// Troquei 'router' por 'app'
app.get('/api/radio-files', async (req, res) => {
  try {
    // rows é o resultado da query
    const [rows] = await db.execute('SELECT * FROM radio_files ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar arquivos da rádio:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota protegida para upload (Admin)
// Note o uso de 'uploadRadio.single' para a rádio
app.post('/api/admin/radio-upload', authenticateToken, uploadRadio.single('audio'), async (req, res) => {
  try {
    const { titulo, categoria, local, data_evento } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const arquivo_path = `/radio/${req.file.filename}`;
    const id = crypto.randomUUID();

    await db.execute(
      'INSERT INTO radio_files (id, titulo, categoria, local, data_evento, arquivo_path) VALUES (?, ?, ?, ?, ?, ?)',
      [id, titulo, categoria, local, data_evento, arquivo_path]
    );

    res.status(201).json({ message: 'Upload realizado com sucesso', id });
  } catch (error) {
    console.error('Erro ao salvar áudio no banco:', error);
    res.status(500).json({ error: 'Erro ao salvar no banco' });
  }
});

// Rota para deletar arquivo e remover do disco
app.delete('/api/admin/radio-files/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Buscar o caminho do arquivo antes de deletar do banco
    const [rows] = await db.execute('SELECT arquivo_path FROM radio_files WHERE id = ?', [id]);

    if (rows.length > 0) {
      const relativePath = rows[0].arquivo_path; // Ex: /radio/123.mp3
      const absolutePath = path.join(process.cwd(), 'public', relativePath);

      // 2. Remover o arquivo físico
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    }

    // 3. Deletar do banco de dados
    await db.execute('DELETE FROM radio_files WHERE id = ?', [id]);

    res.json({ message: 'Registro e arquivo removidos com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar:', error);
    res.status(500).json({ error: 'Erro ao deletar arquivo' });
  }
});

// Rota para atualizar (Editar)
app.put('/api/admin/radio-files/:id', authenticateToken, uploadRadio.single('audio'), async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, categoria, local, data_evento } = req.body;

    if (req.file) {
      // Se enviou novo áudio, deleta o antigo primeiro (lógica similar ao delete acima)
      const arquivo_path = `/radio/${req.file.filename}`;
      await db.execute(
        'UPDATE radio_files SET titulo=?, categoria=?, local=?, data_evento=?, arquivo_path=? WHERE id=?',
        [titulo, categoria, local, data_evento, arquivo_path, id]
      );
    } else {
      await db.execute(
        'UPDATE radio_files SET titulo=?, categoria=?, local=?, data_evento=? WHERE id=?',
        [titulo, categoria, local, data_evento, id]
      );
    }
    res.json({ message: 'Atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar' });
  }
});





if (isProduction) {
  app.use(express.static(basePath));
  console.log('[DEBUG] Middleware express.static registrado para produção');
} else {
  app.use(express.static(path.join(__dirname, 'public')));
}

// Error handling final
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: 'Erro no upload de arquivo', details: err.message });
  } else if (err) {
    res.status(500).json({ error: 'Erro interno', details: err.message });
  } else {
    next();
  }
});


//--- CENÁCULO DIÁRIO ---
app.get('/api/cenaculo/hoje', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await db.query(
      'SELECT versiculo, referencia, desafio FROM cenaculo_diario WHERE data_exibicao = ?',
      [today]
    );

    if (rows.length === 0) {
      // Retorno padrão caso você esqueça de cadastrar um dia
      return res.json({
        versiculo: "Vinde Espírito Santo, enchei os corações dos vossos fiéis.",
        referencia: "Oração à Igreja",
        desafio: "Faça um momento de silêncio e peça que o Espírito Santo guie seus passos hoje."
      });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota Admin para cadastrar (Proteja com seu middleware authenticateToken)
app.post('/api/admin/cenaculo', authenticateToken, async (req, res) => {
  const { versiculo, referencia, desafio, data_exibicao } = req.body;
  try {
    await db.query(
      'INSERT INTO cenaculo_diario (versiculo, referencia, desafio, data_exibicao) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE versiculo=VALUES(versiculo), desafio=VALUES(desafio)',
      [versiculo, referencia, desafio, data_exibicao]
    );
    res.json({ message: "Cenáculo diário atualizado!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});
// Rota Admin para listar todos os registros na página AdminCenaculo/.tsx
app.get('/api/admin/cenaculo', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM cenaculo_diario ORDER BY data_exibicao DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota Admin para excluir registros na página AdminCenaculo/.tsx
app.delete('/api/admin/cenaculo/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM cenaculo_diario WHERE id = ?', [req.params.id]);
    res.json({ message: "Registro excluído com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para editar um Cenáculo existente
app.put('/api/admin/cenaculo/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { versiculo, referencia, desafio, data_exibicao } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE cenaculo_diario SET versiculo = ?, referencia = ?, desafio = ?, data_exibicao = ? WHERE id = ?',
      [versiculo, referencia, desafio, data_exibicao, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Registro não encontrado." });
    }

    res.json({ message: "Cenáculo atualizado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar no banco de dados." });
  }
});

// Rota para registrar o clamor (Check-in)
app.post('/api/cenaculo/checkin', async (req, res) => {
  try {
    // Incrementa o contador na tabela de estatísticas (crie esta tabela se necessário)
    await db.query('UPDATE estatisticas SET valor = valor + 1 WHERE chave = "fieis_em_oracao"');

    const [rows] = await db.query('SELECT valor FROM estatisticas WHERE chave = "fieis_em_oracao"');
    res.json({ total: rows[0].valor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para buscar o total atual
app.get('/api/cenaculo/checkin-total', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT valor FROM estatisticas WHERE chave = "fieis_em_oracao"');
    res.json({ total: rows[0]?.valor || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
const cron = require('node-cron');

// Agenda uma tarefa para as 00:00 de todos os dias
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Limpando contador de fiéis em oração para o novo dia...');
    await db.query('UPDATE estatisticas SET valor = 0 WHERE chave = "fieis_em_oracao"');
  } catch (err) {
    console.error('Erro ao resetar estatísticas diárias:', err);
  }
});
*/

// ROTAS PARA CDASTRAR EMAIL PARA A newsletter //
app.post('/api/newsletter/inscrever', async (req, res) => {
  const { contato, tipo } = req.body;

  if (!contato) {
    return res.status(400).json({ error: "O campo de contato é obrigatório." });
  }

  try {
    // Verifica se já existe
    const [existe] = await db.query(
      'SELECT id FROM newsletter_inscritos WHERE contato = ?',
      [contato]
    );

    if (existe.length > 0) {
      return res.status(409).json({ message: "Este contato já está cadastrado no Pão Diário!" });
    }

    // Insere novo registro
    await db.query(
      'INSERT INTO newsletter_inscritos (contato, tipo) VALUES (?, ?)',
      [contato, tipo]
    );

    res.status(201).json({ message: "Inscrição realizada com sucesso!" });
  } catch (err) {
    console.error("Erro na newsletter:", err);
    res.status(500).json({ error: "Erro interno ao processar cadastro." });
  }
});

app.get('/api/admin/newsletter/inscritos', async (req, res) => {
  try {
    // Idealmente, adicione aqui o seu middleware de verificação de token (autenticação)
    const [inscritos] = await db.query(
      'SELECT id, contato, tipo, DATE_FORMAT(data_inscricao, "%d/%m/%Y %H:%i") as data FROM newsletter_inscritos ORDER BY data_inscricao DESC'
    );
    res.json(inscritos);
  } catch (err) {
    console.error("Erro ao buscar inscritos:", err);
    res.status(500).json({ error: "Erro ao buscar lista de inscritos." });
  }
});

app.get('/api/admin/newsletter/count', async (req, res) => {
  try {
    const [result] = await db.query('SELECT COUNT(*) as total FROM newsletter_inscritos');
    res.json({ total: result[0].total });
  } catch (err) {
    res.status(500).json({ error: "Erro ao contar inscritos." });
  }
});

app.get('/api/admin/logs', async (req, res) => {
  // Dica: Adicione aqui seu middleware de verifyToken se já tiver um pronto
  try {
    const [logs] = await db.query(`
      SELECT 
        id, 
        usuario_nome AS usuario, 
        acao, 
        DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS data 
      FROM admin_logs 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    res.json(logs);
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    res.status(500).json({ error: 'Erro ao buscar logs' });
  }
});




// AGENDADOR DE GERAÇÃO DE newsletter
import * as newsletterService from './services/newsletterService.js';

// rota manual para o Admin disparar o teste
app.post('/api/admin/newsletter/testar', authenticateToken, async (req, res) => {
  console.log('[ROUTE] Clique recebido de:', req.user.nome);

  try {
    // Importação dinâmica para evitar travas de carregamento
    const { enviarNewsletterSemanario } = await import('./services/newsletterService.js');

    const resultado = await enviarNewsletterSemanario();

    console.log('[ROUTE] Sucesso no disparo');
    res.json({ message: 'Newsletter disparada!', detalhes: resultado });
  } catch (error) {
    console.error('[ROUTE ERR]:', error);
    res.status(500).json({ error: 'Falha interna no disparo', detail: error.message });
  }
});

app.get('/api/newsletter/unsubscribe/:email', async (req, res) => {
  const { email } = req.params;
  try {
    // Ajustado para 'newsletter_inscritos' e coluna 'contato'
    const [result] = await db.query('DELETE FROM newsletter_inscritos WHERE contato = ?', [email]);

    if (result.affectedRows > 0) {
      await registrarLog(0, 'SISTEMA', `E-mail removido da newsletter: ${email}`, 'newsletter', req);

      res.send(`
        <div style="text-align:center; padding:50px; font-family:sans-serif;">
          <h1 style="color:#1e3a8a;">Inscrição Cancelada</h1>
          <p>O e-mail <strong>${email}</strong> foi removido com sucesso.</p>
          <a href="https://www.rcccuritiba.com.br" style="color:#16a34a;">Voltar para o Portal</a>
        </div>
      `);
    } else {
      res.status(404).send('E-mail não encontrado.');
    }
  } catch (error) {
    res.status(500).send('Erro ao processar solicitação.');
  }
});

app.get('/api/admin/stats/newsletter', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(data_inscricao, '%b/%y') as mes, 
        COUNT(*) as total 
      FROM newsletter_inscritos 
      WHERE data_inscricao >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY YEAR(data_inscricao), MONTH(data_inscricao), DATE_FORMAT(data_inscricao, '%b/%y')
      ORDER BY MIN(data_inscricao) ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro nas estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});



// --- ROTA DO PÃO DIÁRIO CORRIGIDA ---

// --- ROTA PÚBLICA DO PÃO DIÁRIO (PARA A HOME) ---
app.get('/api/pao-diario/hoje', async (req, res) => {
  try {
    const hoje = new Date().toISOString().split('T')[0];

    // 1. ADICIONADO audio_url AQUI
    const [rows] = await db.query(
      'SELECT referencia, texto_biblico, reflexao, proposito, audio_url FROM pao_diario WHERE data_exibicao = ?',
      [hoje]
    );

    if (rows.length > 0) {
      return res.json(rows[0]);
    }

    // 2. ADICIONADO audio_url NO FALLBACK TAMBÉM
    const [lastRows] = await db.query(
      'SELECT referencia, texto_biblico, reflexao, proposito, audio_url FROM pao_diario ORDER BY data_exibicao DESC LIMIT 1'
    );

    if (lastRows.length > 0) {
      return res.json(lastRows[0]);
    }

    res.status(404).json({ error: "Nenhum pão diário encontrado." });

  } catch (error) {
    console.error("Erro na rota pao-diario/hoje:", error);
    res.status(500).json({ error: "Erro interno ao buscar conteúdo" });
  }
});

// 1. Listar todos (Admin)
app.get('/api/admin/pao-diario', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pao_diario ORDER BY data_exibicao DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar registro existente
app.put('/api/admin/pao-diario/:id', authenticateToken, upload.single('audio'), async (req, res) => {
  const { id } = req.params;
  const { referencia, texto_biblico, reflexao, proposito, data_exibicao } = req.body;

  try {
    // 1. Buscar o áudio antigo no banco
    const [existing] = await db.query('SELECT audio_url FROM pao_diario WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ error: "Registro não encontrado" });

    const audioAntigo = existing[0].audio_url;
    let novoAudioUrl = audioAntigo;

    // 2. Se um NOVO arquivo foi enviado
    if (req.file) {
      novoAudioUrl = `/AudiosPaoDiario/${req.file.filename}`;

      // 3. Remover o arquivo ANTIGO do disco (se ele existir e for diferente do novo)
      if (audioAntigo) {
        const pathAntigo = path.join(basePath, audioAntigo);
        if (fs.existsSync(pathAntigo)) {
          fs.unlinkSync(pathAntigo);
          console.log(`[LIMPEZA] Arquivo antigo removido: ${pathAntigo}`);
        }
      }
    }

    // 4. Atualizar o banco de dados
    await db.query(
      'UPDATE pao_diario SET referencia=?, texto_biblico=?, reflexao=?, proposito=?, data_exibicao=?, audio_url=? WHERE id=?',
      [referencia, texto_biblico, reflexao, proposito, data_exibicao, novoAudioUrl, id]
    );

    res.json({ message: "Atualizado com sucesso e arquivos limpos!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar registro." });
  }
});

// Deletar registro
app.delete('/api/admin/pao-diario/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Buscar o caminho do áudio antes de deletar a linha do banco
    const [row] = await db.query('SELECT audio_url FROM pao_diario WHERE id = ?', [id]);
    
    if (row.length > 0 && row[0].audio_url) {
      const audioPath = path.join(basePath, row[0].audio_url);
      
      // 2. Remover o arquivo físico
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
        console.log(`[LIMPEZA] Arquivo deletado permanentemente: ${audioPath}`);
      }
    }

    // 3. Deletar do banco
    await db.query('DELETE FROM pao_diario WHERE id = ?', [id]);
    res.json({ message: "Registro e áudio removidos com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover registro." });
  }
});

// Rota para salvar novo Pão Diário (POST)
app.post('/api/admin/pao-diario', authenticateToken, upload.single('audio'), async (req, res) => {
  try {
    const { referencia, texto_biblico, reflexao, proposito, data_exibicao } = req.body;

    // IMPORTANTE: Use AudiosPaoDiario para bater com seu storage
    const audio_url = req.file ? `/AudiosPaoDiario/${req.file.filename}` : null;

    await db.query(
      `INSERT INTO pao_diario 
      (referencia, texto_biblico, reflexao, proposito, data_exibicao, audio_url)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [referencia, texto_biblico, reflexao, proposito, data_exibicao, audio_url]
    );

    res.json({ success: true, message: "Pão Diário criado com sucesso!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar pão diário", details: err.message });
  }
});
// --- SPA FALLBACK CORRIGIDO ---
if (isProduction) {
  app.use(express.static(basePath));
  // Correção para o erro de PathError: usando regex compatível com versões novas do express/router
  app.get(/^(?!\/api|\/socket\.io).*$/, (req, res) => {
    res.sendFile(path.join(basePath, 'index.html'));
  });
} else {
  app.use(express.static(path.join(__dirname, 'public')));
}

// --- FINALIZAÇÃO DO SERVIDOR (CHAMADA ÚNICA) ---
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor e Socket.io rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`);
});