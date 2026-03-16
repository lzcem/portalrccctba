import db from '../config/database.js';

export const registrarLog = async (usuarioId, usuarioNome, acao, modulo, req) => {
  try {
    const ip = req?.headers?.['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';
    const ua = req?.headers?.['user-agent'] || 'Sistema Automático';
    await db.query(
      'INSERT INTO admin_logs (usuario_id, usuario_nome, acao, modulo, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
      [usuarioId, usuarioNome, acao, modulo, ip, ua]
    );
  } catch (err) {
    console.error('Falha ao gravar log:', err);
  }
};
