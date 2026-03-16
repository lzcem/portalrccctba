<?php

header("Access-Control-Allow-Origin: https://rcccuritiba.com");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Recolha os dados do formulário
$nome = $_POST['nome'];
$email = $_POST['email'];
$telefone = $_POST['telefone'];

// Configurações do email
$para = "lzcem80@gmail.com, rcccuritiba@gmail.com";
$assunto = "Novo Cadastro para o Projeto Mil Amigos";
$mensagem = "Nome: $nome\n";
$mensagem .= "Email: $email\n";
$mensagem .= "Telefone: $telefone\n";

$headers = "From: rcccuritiba@rcccuritiba.online\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-type: text/plain; charset=UTF-8\r\n";

if (mail($para, $assunto, $mensagem, $headers)) {
    http_response_code(200);
    echo "Mensagem enviada com sucesso.";
} else {
    http_response_code(500);
    echo "Erro ao enviar a mensagem.";
}
