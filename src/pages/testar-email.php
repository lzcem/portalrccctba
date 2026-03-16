<?php
$para = "lzcem80@gmail.com";
$assunto = "Teste de Envio de E-mail";
$mensagem = "Este é um teste de envio de e-mail.";
$headers = "From: rcccuritiba@rcccuritiba.online\r\n";
$headers .= "Content-type: text/plain; charset=UTF-8\r\n";

if (mail($para, $assunto, $mensagem, $headers)) {
    echo "E-mail enviado com sucesso.";
} else {
    echo "Erro ao enviar o e-mail.";
}
?>