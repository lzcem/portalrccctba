import express from 'express';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
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
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

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

const corsOptions = {
  origin: [
    'https://rcccuritiba.com.br',
    'https://www.rcccuritiba.com.br',
    'http://localhost:5173',
  ],
  credentials: true, // Set credentials to true
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range'],
  exposedHeaders: ['Content-Length', 'Content-Range', 'Accept-Ranges'],
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
const basePath = isProduction ? '/var/www/html/portalrccctba' : path.join(__dirname, 'public');
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
    } else if (req.originalUrl.includes('/api/videos')) {
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
    if (!file) return req.method === 'PUT' ? cb(null, true) : cb(null, false);

    const imageTypes = ['image/jpeg', 'image/png'];
    const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

    // Adicionar 'foto' e 'fotosGaleria' à lista de fieldnames permitidos
    if (['imagem', 'image', 'thumbnail', 'foto_mensagem', 'foto_coord', 'foto', 'fotosGaleria'].includes(file.fieldname)) {
      if (imageTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Apenas JPEG/PNG para imagem'));
      }
    } else if (file.fieldname === 'video') {
      if (videoTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Apenas MP4/WEBM/MOV para vídeo'));
      }
    } else {
      cb(new Error('Campo de arquivo não reconhecido'));
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024
  }
});

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

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'NovaSenha#123',
  database: process.env.DB_NAME || 'portalrccctba',
  timezone: '-03:00'
});

// Configurar caminhos estáticos uma vez, usando basePath
app.use('/ImgFotos', express.static(path.join(basePath, 'ImgFotos')));
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

if (!isProduction) {
  app.set('etag', false); // Desativa ETag
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
  });
}

// Rotas existentes...
app.get('/api/mensagens-coordenacao', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM mensagens_coordenacao');
    res.json(rows);
  } catch (err) {
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
    if (await bcrypt.compare(senha, usuario.senha)) {
      const token = jwt.sign({ id: usuario.id, nome: usuario.nome, isAdmin: usuario.is_admin }, process.env.JWT_SECRET || 'seu_segredo_jwt_muito_seguro', { expiresIn: '1h' });
      res.json({ token, nome: usuario.nome });
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
      `SELECT 
         CAST(id AS CHAR) AS id, 
         manchete, 
         foto, 
         LEFT(conteudo, 100) AS resumo, 
         data_publicacao, 
         autor, 
         fotos_galeria, 
         categoria, 
         data_inicio, 
         data_fim 
       FROM noticias_portal 
       WHERE status = "publicado" 
       ORDER BY data_publicacao DESC`
    );

    // URL BASE
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

    // MONTAR URL COMPLETA DA FOTO
    const processedRows = rows.map(row => {
      const fotoCompleta = row.foto 
        ? `${API_BASE_URL}${row.foto.startsWith('/') ? '' : '/'}${row.foto}`
        : null;

      console.log('[DEBUG] Foto processada:', { id: row.id, original: row.foto, completa: fotoCompleta });

      return {
        ...row,
        foto: fotoCompleta,
        fotos_galeria: row.fotos_galeria ? JSON.parse(row.fotos_galeria) : []
      };
    });

    res.json(processedRows);
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
  const foto = req.files?.['foto']?.[0] ? `/ImgNoticias/${req.files['foto'][0].filename}` : null;
  const fotosGaleria = req.files?.['fotosGaleria']?.map(file => `/ImgNoticias/${file.filename}`) || [];
  try {
    const [result] = await db.query(
      'INSERT INTO noticias_portal (manchete, foto, conteudo, autor, status, id_usuario, data_publicacao, fotos_galeria, categoria, data_inicio, data_fim) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)',
      [manchete, foto, conteudo, autor || null, status || 'rascunho', id_usuario, JSON.stringify(fotosGaleria), categoria || null, data_inicio, data_fim || null]
    );
    res.json({ id: result.insertId, message: 'Notícia criada', foto, fotosGaleria });
  } catch (error) {
    console.error('Erro ao criar notícia:', error);
    res.status(500).json({ error: 'Erro ao criar notícia', details: error.message });
  }
});

app.put('/api/noticias_portal/:id', authenticateToken, upload.fields([{ name: 'foto', maxCount: 1 }, { name: 'fotosGaleria', maxCount: 10 }]), async (req, res) => {
  const { id } = req.params;
  const { manchete, conteudo, autor, status, categoria, data_inicio, data_fim, existingFotosGaleria, data_publicacao } = req.body;
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
      [manchete, fotoToUse, conteudo, autor || null, validStatus, req.user.id, JSON.stringify(fotosGaleriaToUse), categoria || null, data_inicio, data_fim || null, data_publicacao || data_inicio, id]
    );
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
  const imagem = req.files?.['imagem']?.[0] ? `/imgPublicacao/${req.files['imagem'][0].filename}` : null;
  if (!titulo || !descricao || !responsavel || !status || !categoria) return res.status(400).json({ error: 'Campos obrigatórios' });
  try {
    const [result] = await db.query(
      'INSERT INTO publicacoes_portalrcccta (id, titulo, descricao, imagem, responsavel, status, categoria, data_publicacao, criado_em, atualizado_em) VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())',
      [titulo, descricao, imagem, responsavel, status, categoria]
    );
    res.json({ id: result.insertId, message: 'Publicação criada', imagem });
  } catch (error) {
    console.error('Erro ao criar publicação:', error);
    res.status(500).json({ error: 'Erro ao criar publicação', details: error.message });
  }
});

app.put('/api/publicacoes/:id', authenticateToken, upload.fields([{ name: 'imagem', maxCount: 1 }]), async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, responsavel, status, categoria } = req.body;
  const imagem = req.files?.['imagem']?.[0] ? `/imgPublicacao/${req.files['imagem'][0].filename}` : null;
  if (!titulo || !descricao || !responsavel || !status || !categoria) return res.status(400).json({ error: 'Campos obrigatórios' });
  try {
    const [existing] = await db.query('SELECT imagem FROM publicacoes_portalrcccta WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ error: 'Publicação não encontrada' });
    const imagemToUse = imagem || existing[0].imagem;
    await db.query(
      'UPDATE publicacoes_portalrcccta SET titulo = ?, descricao = ?, imagem = ?, responsavel = ?, status = ?, categoria = ?, atualizado_em = NOW() WHERE id = ?',
      [titulo, descricao, imagemToUse, responsavel, status, categoria, id]
    );
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
  pathRewrite: { '^/Api/mapa_grupos.php': '/Api/mapa_grupos.php' },
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

app.post('/api/admin/ministerios', authenticateToken, async (req, res) => {
  const { nome, descricao, missao } = req.body;
  if (!nome || !descricao || !missao) return res.status(400).json({ error: 'Campos obrigatórios faltando' });

  try {
    const ministerio_id = nome.toLowerCase().replace(/[^a-z0-9]/g, '');
    const [result] = await db.query('INSERT INTO ministerio_detalhes (ministerio_id, nome, descricao, missao) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE nome = VALUES(nome), descricao = VALUES(descricao), missao = VALUES(missao)', [ministerio_id, nome, descricao, missao]);
    res.json({ ministerio_id, message: 'Detalhes salvos' });
  } catch (error) {
    console.error('Erro ao salvar detalhes:', error);
    res.status(500).json({ error: 'Erro ao salvar detalhes', details: error.message });
  }
});

app.put('/api/admin/ministerios/:id', authenticateToken, async (req, res) => {
  const { nome, descricao, missao } = req.body;
  try {
    const [result] = await db.query('UPDATE ministerio_detalhes SET nome = ?, descricao = ?, missao = ? WHERE ministerio_id = ?', [nome, descricao, missao, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Ministério não encontrado' });
    res.json({ ministerio_id: req.params.id, message: 'Detalhes atualizados' });
  } catch (error) {
    console.error('Erro ao atualizar detalhes:', error);
    res.status(500).json({ error: 'Erro ao atualizar detalhes', details: error.message });
  }
});

app.put('/api/admin/ministerios/:id/escolas', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const escolas = req.body;

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [detalhes] = await connection.query('SELECT ministerio_id FROM ministerio_detalhes WHERE LOWER(ministerio_id) = LOWER(?)', [id]);
    if (!detalhes.length) {
      await connection.rollback();
      return res.status(404).json({ error: 'Ministério não encontrado', details: `ID ${id} não existe em ministerio_detalhes` });
    }

    await connection.query('DELETE FROM ministerio_escolas_formacao WHERE ministerio_id = ?', [id]);

    const insertPromises = escolas.map((escola) =>
      connection.query('INSERT INTO ministerio_escolas_formacao (ministerio_id, data, local) VALUES (?, ?, ?)', [
        id,
        escola.data,
        escola.local,
      ])
    );
    await Promise.all(insertPromises);

    await connection.commit();
    res.json({ message: 'Escolas atualizadas com sucesso' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Erro ao atualizar escolas:', error);
    res.status(500).json({ error: 'Erro ao atualizar escolas', details: error.message });
  } finally {
    if (connection) connection.release();
  }
});

app.post('/api/admin/ministerios/:id/coordenadores', authenticateToken, upload.fields([{ name: 'foto_coordenador', maxCount: 1 }]), async (req, res) => {
  const { id } = req.params;
  const { nome, email, grupo_oracao } = req.body;
  if (!nome || !email || !grupo_oracao) return res.status(400).json({ error: 'Campos obrigatórios faltando (nome, email, grupo_oracao)' });

  const foto_coordenador = req.files?.['foto_coordenador']?.[0] ? `/ImgFotos/${req.files['foto_coordenador'][0].filename}` : null;
  try {
    const [detalhes] = await db.query('SELECT ministerio_id FROM ministerio_detalhes WHERE ministerio_id = ?', [id]);
    if (!detalhes.length) return res.status(404).json({ error: 'Ministério não encontrado' });

    const [result] = await db.query(
      'INSERT INTO ministerio_coordenadores (ministerio_id, nome, email, grupo_oracao, foto_coordenador) VALUES (?, ?, ?, ?, ?)',
      [id, nome, email, grupo_oracao, foto_coordenador]
    );
    res.json({ id: result.insertId, ministerio_id: id, message: 'Coordenador salvo', foto_coordenador });
  } catch (error) {
    console.error('Erro ao salvar coordenador:', error);
    res.status(500).json({ error: 'Erro ao salvar coordenador', details: error.message });
  }
});

app.put('/api/admin/ministerios/:id/coordenadores/:coordId', authenticateToken, upload.fields([{ name: 'foto_coordenador', maxCount: 1 }]), async (req, res) => {
  const { id, coordId } = req.params;
  const { nome, email, grupo_oracao } = req.body;
  const foto_coordenador = req.files?.['foto_coordenador']?.[0] ? `/ImgFotos/${req.files['foto_coordenador'][0].filename}` : undefined;
  try {
    const [existing] = await db.query('SELECT * FROM ministerio_coordenadores WHERE id = ?', [coordId]);
    if (!existing.length) return res.status(404).json({ error: 'Coordenador não encontrado' });
    await db.query(
      'UPDATE ministerio_coordenadores SET nome = ?, email = ?, grupo_oracao = ?, foto_coordenador = ? WHERE id = ?',
      [nome, email, grupo_oracao, foto_coordenador || existing[0].foto_coordenador, coordId]
    );
    res.json({ id: coordId, ministerio_id: id, message: 'Coordenador atualizado', foto_coordenador: foto_coordenador || existing[0].foto_coordenador });
  } catch (error) {
    console.error('Erro ao atualizar coordenador:', error);
    res.status(500).json({ error: 'Erro ao atualizar coordenador', details: error.message });
  }
});

app.delete('/api/admin/ministerios/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM ministerio_detalhes WHERE ministerio_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Ministério não encontrado' });
    await db.query('DELETE FROM ministerio_escolas_formacao WHERE ministerio_id = ?', [req.params.id]);
    await db.query('DELETE FROM ministerio_coordenadores WHERE ministerio_id = ?', [req.params.id]);
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

app.get('/noticias/:id', async (req, res) => {
  const { id } = req.params;
  const API_BASE_URL = process.env.API_BASE_URL || '';
  try {
    const response = await fetch(`${API_BASE_URL}/api/noticias_portal/all/${id}`);
    if (!response.ok) throw new Error('Notícia não encontrada');
    const noticia = await response.json();

    const imageUrl = noticia.foto
      ? `${API_BASE_URL}${noticia.foto}`
      : 'https://rcccuritiba.com.br/assets/placeholder-400x300.jpg';

      res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta property="og:title" content="${noticia.manchete}" />
      <meta property="og:description" content="${noticia.conteudo.slice(0, 200)}..." />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:url" content="https://www.rcccuritiba.com.br/noticias/${id}" />
      <meta property="og:type" content="article" />
    </head>
    <body>
      <script>window.location.href = '/noticias/${id}';</script>
    </body>
    </html>
  `);
    } catch (err) {
      res.status(404).send('Notícia não encontrada');
    }
  });

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


if (isProduction) {
  app.use(express.static(basePath));
  console.log('[DEBUG] Middleware express.static registrado para produção');
} else {
  app.use(express.static(path.join(__dirname, 'public')));
  console.log('[DEBUG] Middleware express.static registrado para desenvolvimento');
}

// Error handling for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: 'Erro no upload de arquivo', details: err.message });
  } else if (err) {
    res.status(500).json({ error: 'Erro interno', details: err.message });
  } else {
    next();
  }
});



// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT} (${isProduction ? 'produção' : 'desenvolvimento'})`);
});