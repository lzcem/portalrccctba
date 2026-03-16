export const generateHTML = (noticias, emailUsuario) => {
  const noticiasHtml = noticias.map(n => `
    <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
      <h3 style="color: #1e3a8a; font-family: sans-serif;">${n.manchete}</h3>
      <p style="color: #666; font-size: 14px;">
        ${n.conteudo ? n.conteudo.replace(/<[^>]*>?/gm, '').substring(0, 150) : ''}...
      </p>
      <a href="https://www.rcccuritiba.com.br/noticias/${n.id}" style="color: #f97316; font-weight: bold; text-decoration: none;">Leia mais →</a>
    </div>
  `).join('');

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
      <div style="background: linear-gradient(to right, #1e3a8a, #16a34a); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Informativo RCC Curitiba</h1>
      </div>
      <div style="padding: 20px;">
        ${noticiasHtml}
      </div>
      <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        <p>Deseja sair da lista? <a href="https://www.rcccuritiba.com.br/api/newsletter/unsubscribe/${encodeURIComponent(emailUsuario)}">Clique aqui</a>.</p>
      </div>
    </div>
  `;
};
