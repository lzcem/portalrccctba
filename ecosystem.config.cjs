module.exports = {
  apps: [{
    name: 'portalrccctba',
    script: 'server.js',
    cwd: '/projetojsd/portalrccctba',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      VITE_API_BASE_URL: 'https://rcccuritiba.com.br',
      DB_HOST: '127.0.0.1',
      DB_USER: 'root',
      DB_PASSWORD: 'NovaSenha#123',
      DB_NAME: 'portalrccctba',
      JWT_SECRET: 'seu_segredo_jwt_muito_seguro'
    },
    env_file: '/projetojsd/portalrccctba/.env'
  }]
};