import SftpClient from 'ssh2-sftp-client';
import path from 'path';
import fs from 'fs';
import readline from 'readline';
import { execSync } from 'child_process';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const config = {
    host: '191.252.182.105',
    port: 22,
    username: 'root',
    password: 'Senha#123', // substitua por senha segura
};
async function ask(question) {
    return new Promise(resolve => rl.question(question, resolve));
}
(async () => {
    try {
        const arquivoLocal = await ask('Digite o caminho do arquivo local para deploy: ');
        rl.close();
        if (!fs.existsSync(arquivoLocal)) {
            console.error(`❌ Arquivo local não encontrado: ${arquivoLocal}`);
            process.exit(1);
        }
        const sftp = new SftpClient();
        // Diretório remoto padrão para deploy (ajuste se quiser)
        const remoteDir = '/var/www/html/portalrccctba';
        await sftp.connect(config);
        console.log('✅ Conectado ao servidor via SFTP.');
        // Garante que o diretório remoto exista
        await sftp.mkdir(remoteDir, true);
        console.log(`📂 Diretório remoto garantido: ${remoteDir}`);
        const nomeArquivo = path.basename(arquivoLocal);
        const remoteFilePath = path.posix.join(remoteDir, nomeArquivo);
        // Envia o arquivo único
        await sftp.put(arquivoLocal, remoteFilePath);
        console.log(`✅ Arquivo enviado: ${nomeArquivo}`);
        await sftp.end();
        // Ajusta permissões do arquivo enviado (opcional)
        console.log('🔧 Ajustando permissões do arquivo remoto...');
        execSync(`ssh root@${config.host} "chown www-data:www-data ${remoteFilePath} && chmod 644 ${remoteFilePath}"`, { stdio: 'inherit' });
        console.log('✅ Deploy de arquivo único finalizado com sucesso!');
    }
    catch (err) {
        console.error('❌ Erro no deploy:', err.message || err);
        process.exit(1);
    }
})();
