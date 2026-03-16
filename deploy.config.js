// deploy.config.js
export default {
  host: '191.252.182.105',
  port: '22',
  username: 'root',
  password: 'Senha#123', // ou use chave privada, se preferir
  remotePath: '/projetonodejs/portalrccctba',
  files: [
    'dist/**',
    'server.js',
    'package.json',
    'package-lock.json'
  ],
  removeRemoteFiles: false,
};
