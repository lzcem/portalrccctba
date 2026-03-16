import nodemailer from 'nodemailer';
import db from '../config/database.js'; 
import { generateHTML } from '../utils/newsletterTemplate.js';

// Configuração do Transporter (Configurado para Locaweb/SSL)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: process.env.EMAIL_PORT === '465', // true para 465, false para outras
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Necessário para VPS não ter erro de certificado
  },
  debug: true,   
  logger: true  
});

export const enviarNewsletterSemanario = async () => {
  console.log('[SERVICE] Iniciando processo de envio...');
  
  try {
    // 1. Busca as notícias (Filtro ajustado para garantir que retorne conteúdo no teste)
    const [noticias] = await db.query(
      'SELECT id, manchete, conteudo FROM noticias_portal WHERE status IN ("publicada", "publicado") ORDER BY data_publicacao DESC LIMIT 5'
    );
    console.log(`[SERVICE] Notícias encontradas: ${noticias.length}`);

    // 2. Busca os inscritos do tipo email
    const [inscritos] = await db.query(
      'SELECT contato as email FROM newsletter_inscritos WHERE tipo = "email"'
    );
    console.log(`[SERVICE] Destinatários encontrados: ${inscritos.length}`);

    // 3. Validação de segurança: se não houver notícias ou inscritos, interrompe aqui
    if (noticias.length === 0 || inscritos.length === 0) {
      console.log('[SERVICE] Abortando: Faltam notícias ou inscritos na base de dados.');
      return { 
        message: "Envio não realizado por falta de dados.", 
        noticias: noticias.length, 
        inscritos: inscritos.length 
      };
    }

    // 4. Loop de envio para os inscritos
    let enviadosComSucesso = 0;
    let falhas = 0;

    for (const inscrito of inscritos) {
      try {
        console.log(`[MAIL] Tentando enviar para: ${inscrito.email}`);
        
        await transporter.sendMail({
          from: `"RCC Curitiba" <${process.env.EMAIL_USER}>`,
          to: inscrito.email,
          subject: '🔥 Informativo Semanal - RCC Curitiba',
          html: generateHTML(noticias, inscrito.email),
        });

        enviadosComSucesso++;
        console.log(`[OK] Sucesso: ${inscrito.email}`);
      } catch (sendError) {
        falhas++;
        console.error(`[ERR] Falha ao enviar para ${inscrito.email}:`, sendError.message);
      }
    }

    console.log(`[SERVICE] Fim do processamento. Sucessos: ${enviadosComSucesso}, Falhas: ${falhas}`);
    
    return { 
      success: true, 
      totalEnviados: enviadosComSucesso, 
      totalFalhas: falhas 
    };

  } catch (error) {
    console.error('[SERVICE CRITICAL ERROR]:', error);
    throw error;
  }
};