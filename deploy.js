import { execSync } from 'child_process';
import SftpClient from 'ssh2-sftp-client';
import path from 'path';
import fs from 'fs';
import os from 'os';

console.log('🚀 Iniciando deploy profissional...');

////////////////////////////////////////////////////////////
// CONFIGURAÇÃO SSH ROBUSTA
////////////////////////////////////////////////////////////
const config = {
  host: '191.252.182.105',
  port: 22,
  username: 'deploy',
  privateKey: fs.readFileSync(
    path.join(os.homedir(), '.ssh', 'id_ed25519')
  ),

  // 🔥 AQUI ESTÁ A CORREÇÃO DO TIMEOUT
  readyTimeout: 60000,          // 60 segundos para handshake
  keepaliveInterval: 10000,     // mantém conexão viva
  keepaliveCountMax: 10
};

const remoteFrontendPath = '/var/www/html/portalrccctba';
const remoteBackendPath = '/projetojsd/portalrccctba';

////////////////////////////////////////////////////////////
// BUILD
////////////////////////////////////////////////////////////
try {
  console.log('🔧 Executando build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build concluído!');
} catch (err) {
  console.error('❌ Erro no build:', err.message);
  process.exit(1);
}

////////////////////////////////////////////////////////////
// IGNORAR public/videos e public/radio
////////////////////////////////////////////////////////////
function shouldUpload(itemPath) {
  const normalized = itemPath.replace(/\\/g, '/').toLowerCase();

  // Lista de padrões e pastas para ignorar
  const blackList = [
    '/public/videos',
    '/videos/',
    '/public/radio',
    '/radio/',
    '/public/audiospaodiario', // Pasta de áudios do Pão Diário
    '/public/imgmensagens',
    '/public/imgcoordenadores',
    '/public/imgfotos',
    '/public/imgnoticias',
    '/public/imgpublicacao',
    '/public/imgespiritualidade',
    '/public/imggrupos',
    '/public/imgamigos',
    '/public/imgamorcc',
    '/node_modules',
    '/.git',
    '.env'
  ];

  // Verifica se o caminho atual contém algum item da lista negra
  const isExcluded = blackList.some(excluded => normalized.includes(excluded.toLowerCase()));

  if (isExcluded) {
    console.log(`⏭️ Ignorando item protegido: ${itemPath}`);
    return false;
  }

  return true;
}

////////////////////////////////////////////////////////////
// FUNÇÃO COM RETRY AUTOMÁTICO
////////////////////////////////////////////////////////////
async function connectWithRetry(sftp, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔌 Tentando conectar (tentativa ${attempt})...`);
      await sftp.connect(config);
      console.log('✅ Conectado!');
      return;
    } catch (err) {
      console.log(`⚠️ Falha na tentativa ${attempt}: ${err.message}`);

      if (attempt === retries) {
        throw err;
      }

      console.log('⏳ Aguardando 5 segundos antes de tentar novamente...');
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

////////////////////////////////////////////////////////////
// DEPLOY
////////////////////////////////////////////////////////////
(async () => {
  const sftp = new SftpClient();

  try {
    await connectWithRetry(sftp);

    ////////////////////////////////////////////////////////////
    // FRONTEND
    ////////////////////////////////////////////////////////////
    console.log('📁 Criando diretório frontend...');
    await sftp.mkdir(remoteFrontendPath, true);

    console.log('📤 Enviando frontend...');
    await sftp.uploadDir('dist', remoteFrontendPath, {
      filter: shouldUpload
    });

    console.log('✅ Frontend enviado!');

    ////////////////////////////////////////////////////////////
    // BACKEND
    ////////////////////////////////////////////////////////////
    console.log('📁 Criando diretório backend...');
    await sftp.mkdir(remoteBackendPath, true);

    const backendFiles = ['server.js', 'package.json'];

    for (const file of backendFiles) {
      if (fs.existsSync(file)) {
        await sftp.put(
          path.join(process.cwd(), file),
          path.posix.join(remoteBackendPath, file)
        );
        console.log(`📄 Backend enviado: ${file}`);
      }
    }

    await sftp.end();
    console.log('✅ Upload finalizado!');

    ////////////////////////////////////////////////////////////
    // PM2 RESTART
    ////////////////////////////////////////////////////////////
    console.log('🔄 Reiniciando aplicação...');

    execSync(
      `ssh deploy@191.252.182.105 "pm2 restart portalrccctba || pm2 start ${remoteBackendPath}/server.js --name portalrccctba && pm2 save"`,
      { stdio: 'inherit' }
    );

    console.log('🎉 Deploy concluído com sucesso!');
  } catch (err) {
    console.error('❌ Erro no deploy:', err.message);
    try {
      await sftp.end();
    } catch {}
    process.exit(1);
  }
})();