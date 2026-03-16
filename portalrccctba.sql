-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 10/02/2026 às 14:30
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `portalrccctba`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `amo_rcc`
--

CREATE TABLE `amo_rcc` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `amo_rcc`
--

INSERT INTO `amo_rcc` (`id`, `title`, `content`, `image_path`, `updated_at`) VALUES
(1, 'Projeto Eu Amo a RCC', '<h2 class=\"ql-align-center\"><strong>Fortaleça a unidade e pertencimento à RCC em Curitiba.</strong></h2><p class=\"ql-align-center\">Participe e viva o amor de Deus!</p>', '/ImgAmoRcc/1755919738987-148566294.png', '2025-08-23 00:28:58');

-- --------------------------------------------------------

--
-- Estrutura para tabela `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `comment` text NOT NULL,
  `moderation` enum('pendente','aprovado','rejeitado') DEFAULT 'pendente',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `name` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `comments`
--

INSERT INTO `comments` (`id`, `userId`, `comment`, `moderation`, `created_at`, `name`, `city`) VALUES
(13, '', 'dvdsvs', 'rejeitado', '2025-07-20 04:40:01', 'sdvsvs', 'sdvdv'),
(14, 'af25aedb-be07-47b7-8e41-65dc5ae7f712', 'asasa', 'rejeitado', '2025-07-20 21:22:49', 'asas', 'asaa'),
(15, '68bd57f0-603f-40b2-8442-8bcbffe81890', 'Hahahah', 'rejeitado', '2025-07-20 21:23:34', 'Absnsb', 'Nsjsjej'),
(16, 'd92b7362-6faa-4747-bc63-521a64921614', 'Como compro camisetas?', 'pendente', '2025-08-18 16:50:09', 'Carlos', 'Curitiba/PR');

-- --------------------------------------------------------

--
-- Estrutura para tabela `formacao_espiritual`
--

CREATE TABLE `formacao_espiritual` (
  `id` varchar(36) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `resumo` text NOT NULL,
  `materia` text NOT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `data_publicacao` datetime NOT NULL,
  `data_inicio` datetime NOT NULL DEFAULT current_timestamp(),
  `data_fim` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `formacao_espiritual`
--

INSERT INTO `formacao_espiritual` (`id`, `titulo`, `resumo`, `materia`, `imagem`, `data_publicacao`, `data_inicio`, `data_fim`) VALUES
('6c9c683e-54b5-11f0-8ede-cec193641bb8', 'O Poder da Oração: Quando a Alma Fala com Deus, o Céu Responde', '<p>Ao longo da história da Igreja, os santos viveram intensamente essa realidade. Santa Teresa de Ávila dizia: “A oração é, a meu ver, um trato de amizade com Deus, estando muitas vezes tratando a sós com quem sabemos que nos ama.”</p>', '<p>A oração é o respiro da alma. Não é apenas uma prática devocional, mas um encontro profundo entre a criatura e o Criador.</p><p><br></p><p>Por meio dela, encontramos força no sofrimento, luz nas trevas e direção no meio das incertezas. Jesus mesmo nos ensinou: “Vigiai e orai, para que não entreis em tentação” (Mateus 26,41).</p><p><br></p><p>A oração, portanto, não é um ato opcional na vida cristã, mas uma necessidade vital. Na Sagrada Escritura, vemos exemplos incontáveis da eficácia da oração. Elias, ao clamar a Deus, fez descer fogo do céu (cf. 1Reis 18,36-38). Ana, estéril e humilhada, orou com o coração aflito e recebeu a graça de um filho, o profeta Samuel (cf. 1Samuel 1,10-20).</p><p><br></p><p>Jesus, nosso Mestre, retirava-se constantemente para orar, mesmo sendo o Filho de Deus, mostrando-nos que a intimidade com o Pai é o sustento da missão: “Ele, porém, se retirava para lugares solitários e orava” (Lucas 5,16). Ao longo da história da Igreja, os santos viveram intensamente essa realidade. Santa Teresa de Ávila dizia: “A oração é, a meu ver, um trato de amizade com Deus, estando muitas vezes tratando a sós com quem sabemos que nos ama.”</p><p><br></p><p>Já Santo Padre Pio, que passava horas em oração diante do Santíssimo, afirmava com convicção: “A oração é a melhor arma que possuímos; é a chave que abre o coração de Deus.” A oração transforma. Ela não muda apenas as circunstâncias, mas sobretudo o coração de quem reza. Nos momentos de tribulação, quando as palavras faltam, o Espírito Santo vem em auxílio da nossa fraqueza: “O próprio Espírito intercede por nós com gemidos inefáveis” (Romanos 8,26).</p><p><br></p><p>Orar é entregar, confiar, esperar. É abrir espaço para que Deus aja. É manter acesa a chama da fé quando tudo parece escuro. É um ato de humildade e, ao mesmo tempo, de poder, pois “a oração fervorosa do justo tem grande eficácia” (Tiago 5,16).</p><p><br></p><p>Seja com palavras ou no silêncio do coração, em lágrimas ou louvores, sozinho ou em comunidade, a oração sempre chega ao coração de Deus. E Ele responde — no tempo d’Ele, da maneira d’Ele, mas sempre com amor.</p><p><br></p><p>Que nunca falte em nossos lábios e em nossos corações essa ponte sagrada com o céu chamada oração.</p>', '/ImgEspiritualidade/1755919611425-158578924.jpg', '2025-07-03 18:47:00', '2025-10-27 15:19:00', '2025-11-30 09:40:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `grupo_oracao`
--

CREATE TABLE `grupo_oracao` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `grupo_oracao`
--

INSERT INTO `grupo_oracao` (`id`, `title`, `content`, `image_path`, `updated_at`, `created_at`) VALUES
(1, 'Participe de um Grupo de Oração!', '<p class=\"ql-align-center\"><strong>Venha participar de um Grupo de Oração da RCC!</strong></p><p class=\"ql-align-center\"><br></p><p class=\"ql-align-center\">Aqui você encontrará paz, esperança e libertação! Somos uma verdadeira família em Cristo e estamos de braços abertos para acolher você. Seja bem-vindo a essa linda caminhada de fé, amor e renovação no Espírito Santo!</p>', '/ImgGrupos/1754456910426-62902728.png', '2025-08-11 22:24:58', '2025-08-05 05:27:12');

-- --------------------------------------------------------

--
-- Estrutura para tabela `mensagens_coordenacao`
--

CREATE TABLE `mensagens_coordenacao` (
  `id` int(11) NOT NULL,
  `foto_coord` varchar(255) NOT NULL,
  `texto_mensagem` text NOT NULL,
  `titulo_mensagem` varchar(255) NOT NULL,
  `resumo_mensagem` varchar(500) NOT NULL,
  `data_inicio` datetime DEFAULT NULL,
  `data_fim` datetime DEFAULT NULL,
  `foto_mensagem` varchar(255) NOT NULL,
  `nome_coordenador` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `mensagens_coordenacao`
--

INSERT INTO `mensagens_coordenacao` (`id`, `foto_coord`, `texto_mensagem`, `titulo_mensagem`, `resumo_mensagem`, `data_inicio`, `data_fim`, `foto_mensagem`, `nome_coordenador`) VALUES
(1, '/ImgCoordenadores/1752008380782-20575856.png', '<p><strong>Queridos irmãos e irmãs servos da RCC Curitiba,</strong></p><p><br></p><p>Graça e paz!</p><p><br></p><p>Em nossa caminhada como servos na Renovação Carismática Católica, somos constantemente chamados a mergulhar mais profundamente na vida espiritual e a permanecer enraizados em Cristo.</p><p><br></p><p>Nesse tempo de tantas vozes e distrações, queremos recordar a centralidade da vida sacramental e da intimidade com Deus como fonte de nossa missão e sustento interior.</p><p><br></p><p><strong>A participação regular nos sacramentos</strong> – especialmente a Eucaristia e a Reconciliação – não é apenas um dever cristão, mas um dom precioso que nos fortalece, purifica e configura cada vez mais ao Coração de Jesus.</p><p><br></p><p>A missa dominical (e, se possível, durante a semana) nos alimenta com o Corpo e o Sangue do Senhor, e a confissão frequente nos cura, restaura e reaviva a chama do Espírito Santo em nós.</p><p><br></p><p>Mas os sacramentos, por si sós, não bastam se não cultivarmos uma <strong>vida interior profunda</strong>. É preciso <strong>oração pessoal diária</strong>, sincera e perseverante, onde abrimos o coração ao Senhor e deixamos que Ele nos fale. Na <strong>leitura orante da Palavra</strong>, encontramos luz para os passos e alimento para a alma.</p><p><br></p><p>A Bíblia não é apenas um livro; é o próprio Deus nos falando. Reservar momentos de silêncio para escutar a Sua voz é essencial para quem deseja servir com unção.</p><p><br></p><p>Não podemos esquecer ainda da <strong>prática do jejum e da caridade</strong>. O jejum, quando unido à oração, nos liberta dos excessos, purifica os sentidos e fortalece o espírito contra as tentações.</p><p><br></p><p>E a caridade, vivida concretamente no serviço ao irmão – seja em casa, na comunidade ou com os pobres – nos faz testemunhas vivas do amor de Deus.</p><p><br></p><p>Queridos servos, <strong>não se pode dar aquilo que não se tem</strong>. Se queremos ser canais da graça de Deus, precisamos estar cheios d’Ele.</p><p><br></p><p>Que cada um de nós, individualmente e como grupo, se comprometa a crescer espiritualmente com seriedade e ardor. Não se trata de fazer mais coisas, mas de <strong>ser mais de Deus</strong>.</p><p><br></p><p>Unamo-nos em propósito, ajudemo-nos mutuamente e sigamos firmes, com os olhos fixos em Jesus, autor e consumador da nossa fé (cf. Hb 12,2). O Senhor está conosco!</p><p><br></p><p>Com carinho e oração,</p><p><br></p><p>Laudeci Kasprzak</p><p><strong>Coordenadora</strong> <strong>da RCC Curitiba</strong></p>', 'Mensagem de Julho', '<p>Que cada um de nós, individualmente e como grupo, se comprometa a crescer espiritualmente com seriedade e ardor. Não se trata de fazer mais coisas, mas de ser mais de Deus.</p>', '2025-07-02 21:00:00', '2025-08-01 21:00:00', '/ImgMensagens/1752550282622-945450780.jpg', 'Laudeci Kasprzak '),
(2, '/ImgCoordenadores/1755919469925-606648117.png', '<p>Queridos irmãos e irmãs! Neste mês vocacional, somos chamados a renovar a nossa fé e a esperança que “não decepciona”. <strong><em>Porque o amor de Deus foi derramado em nossos corações pelo Espirito Santo que nos foi dado</em></strong> (Rm 5,5). Esta palavra norteadora nos convida a confiar que Deus continua chamando e levantando vocações santas para o Seu serviço.</p><p>Atendendo ao apelo da Igreja, quero convidar todos a intensificarmos nossa oração pelas vocações — sacerdotais, religiosas, leigas e familiares. Que o Senhor suscite vocações sólidas e enraizadas na oração, capazes de responder aos desafios do nosso tempo com santidade e fidelidade. A vocação começa no seio da família.</p><p>É em casa que aprendemos a ouvir a voz de Deus: Quando oramos juntos, rezamos o terço, agradecemos antes das refeições e meditamos a Palavra, criamos um ambiente onde Deus pode semear o chamado em nossos corações.</p><p>Por isso, quero propor alguns pontos simples, mas essenciais, para alimentarmos o espírito e discernirmos com clareza a nossa vocação:</p><p><span style=\"color: rgb(85, 85, 85);\">✔ </span><strong>Vida de oração pessoal e comunitária; </strong></p><p><span style=\"color: rgb(85, 85, 85);\">✔ </span><strong>Leitura e meditação da Palavra de Deus; </strong></p><p><span style=\"color: rgb(85, 85, 85);\">✔ </span><strong>Participação frequente na Eucaristia; </strong></p><p><span style=\"color: rgb(85, 85, 85);\">✔</span><strong>Silêncio interior e escuta da vontade de Deus; </strong></p><p><span style=\"color: rgb(85, 85, 85);\">✔ </span><strong>Fraternidade e compromisso com a comunidade. </strong></p><p>Que neste tempo jubilar e vocacional, nossas famílias se tornem verdadeiros berços de vocações santas, e que sejamos promotores da cultura vocacional em nossas comunidades.</p><p>Deus te abençoe!</p>', 'Famílias, Berços de Vocações', '<p>Atendendo ao apelo da Igreja, quero convidar todos a intensificarmos nossa oração pelas vocações — sacerdotais, religiosas, leigas e familiares.</p>', '2025-08-14 11:38:00', '2025-09-16 11:39:00', '/ImgMensagens/1755919469914-870088958.png', 'Laudeci Kasprzak'),
(3, '/ImgCoordenadores/1755133863299-947250372.png', '<p>Queridos irmãos e irmãs!</p><p><br></p><p>Neste mês vocacional, somos chamados a renovar nossa fé e a esperança que “não decepciona” Porque o amor de Deus foi derramado em nossos corações pelo Espirito Santo que nos foi dado(Rm 5,5). Esta palavra norteadora nos convida a confiar que Deus continua chamando e levantando vocações santas para o Seu serviço.</p><p><br></p><p>Atendendo ao apelo da Igreja, quero convidar todos a intensificarmos nossa oração pelas vocações — sacerdotais, religiosas, leigas e familiares. Que o Senhor suscite vocações sólidas e enraizadas na oração, capazes de responder aos desafios do nosso tempo com santidade e fidelidade.</p><p><br></p><p>A vocação começa no seio da família. É em casa que aprendemos a ouvir a voz de Deus:</p><p>Quando oramos juntos, rezamos o terço, agradecemos antes das refeições e meditamos a Palavra, criamos um ambiente onde Deus pode semear o chamado em nossos corações.</p><p><br></p><p>Por isso, quero propor alguns pontos simples, mas essenciais, para alimentarmos o espírito e discernirmos com clareza a nossa vocação:</p><p><br></p><p>* Vida de oração pessoal e comunitária</p><p>* Leitura e meditação da Palavra de Deus</p><p>* Participação frequente na Eucaristia</p><p>* Silêncio interior e escuta da vontade de Deus</p><p>* Fraternidade e compromisso com a comunidade</p><p><br></p><p>Que neste tempo jubilar e vocacional, nossas famílias se tornem verdadeiros berços de vocações santas, e que sejamos promotores da cultura vocacional em nossas comunidades.</p><p><br></p><p>Deus te abençoe!</p><p><br></p><p>Laudeci Kasprzak</p><p>Presidente da RCC Curitiba</p>', 'Carta Mês Vocacional', '<p><span style=\"color: rgb(0, 0, 0);\">Neste mês vocacional, somos chamados a renovar nossa fé e a esperança que “não decepciona” Porque o amor de Deus foi derramado em nossos corações pelo Espirito Santo que nos foi dado(Rm 5,5).</span></p>', '2025-08-13 22:08:00', '2025-08-31 22:08:00', '/ImgMensagens/1755133863298-690451792.jpg', 'Laudeci Kasprzak');

-- --------------------------------------------------------

--
-- Estrutura para tabela `metrics_views`
--

CREATE TABLE `metrics_views` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` char(36) NOT NULL,
  `view_date` date NOT NULL,
  `views` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `likes` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `comentarios` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `mil_amigos_home`
--

CREATE TABLE `mil_amigos_home` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `mil_amigos_home`
--

INSERT INTO `mil_amigos_home` (`id`, `title`, `content`, `image_path`, `updated_at`, `created_at`) VALUES
(1, 'Projeto Mil Amigos', '<p class=\"ql-align-center\"><strong>Junte-se ao Projeto Mil Amigos!</strong></p><p class=\"ql-align-center\">Sua participação é essencial para apoiar as ações missionárias da RCC Curitiba.</p>', '/ImgAmigos/1755919669086-407091720.png', '2025-08-23 03:27:49', '2025-08-06 04:14:06');

-- --------------------------------------------------------

--
-- Estrutura para tabela `ministerio_coordenadores`
--

CREATE TABLE `ministerio_coordenadores` (
  `id` int(11) NOT NULL,
  `ministerio_id` varchar(255) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `grupo_oracao` varchar(255) DEFAULT NULL,
  `foto_coordenador` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `ministerio_coordenadores`
--

INSERT INTO `ministerio_coordenadores` (`id`, `ministerio_id`, `nome`, `email`, `grupo_oracao`, `foto_coordenador`) VALUES
(1, 'intercessao', 'Luciane Aparecida Gouveia', 'lucineigouveia20092@hotmail.com', 'Magnificat - Paróquia Santa Quitéria', '/ImgFotos/1751848982340-845640284.png'),
(2, 'oracao-cura-libertacao', 'Elisabete Inês Ignachewski', 'eignachewski@gmail.com', 'N. Sra. das Dores - Paróquia N. Sra. das Dores', '/ImgFotos/1751851121775-305485424.png'),
(3, 'pregacao', 'André Marques de Souza', 'andre_mfp@outlook.com', 'Maria Mãe Amiga - Capela Senhor Bom Jesus (Paróq. São José das Famílias)', '/ImgFotos/1751849849859-891655462.png'),
(4, 'familias', 'Alexandre e Luciane', 'vsalexandre@hotmail.com', 'Canaã - Paróquia São João Bosco (Bairro Alto)', '/ImgFotos/1751848387135-155212213.png'),
(5, 'criancas-adolescentes', 'Cleide Alves  Dada', 'cleidealvesdada72@gmail.com', 'Maria Mãe da Igreja - Paróquia Maria Mãe da Igreja', '/ImgFotos/1751837771831-428103788.png'),
(6, 'formacao', 'Tatiana Orador Carvalho', 'tatianahsl@gmail.com', 'N. Sra. do Carmo - Santuário N. Sra. do Carmo', '/ImgFotos/1751850993614-419273643.png'),
(7, 'jovens', 'Bruno Henrique Takenaka Araújo', 'bhtaraujo@gmail.com', 'Jesus Renasce - Paróquia Santa Terezinha de Lisieux', '/ImgFotos/1751849270223-100662266.png'),
(8, 'fe-politica', '#', 'rcccuritiba@gmail.com', 'RCC', NULL),
(9, 'promocao-humana', 'Iolanda Aparecida Alves', 'iolandalves60@gmail.com', 'N. Sra. do Sagrado Coração - Paróquia N. Sra. do Sagrado Coração', '/ImgFotos/1751850583289-58863073.png'),
(10, 'comunicacao-social', 'Dhione Souza de Castro', 'mcsrcccuritiba@gmail.com', 'Filhos do Sagrado Coração - Paróquia Sagrado Coração de Jesus (Tatuquara)', '/ImgFotos/1751850787123-586981299.png'),
(11, 'universidades-renovadas', 'Alessandra Ana Silva de Alencar', 'cristinamarcia07@hotmail.com', 'Gou Filhos Amados', '/ImgFotos/1751851605479-844008591.png'),
(12, '894d1744-5a2f-11f0-8ede-cec193641bb8', 'Rosângela Monteiro Rificki', 'rorificki@hotmail.com', 'Divino Espírito Santo', '/ImgFotos/1751837198877-951415971.png');

-- --------------------------------------------------------

--
-- Estrutura para tabela `ministerio_detalhes`
--

CREATE TABLE `ministerio_detalhes` (
  `ministerio_id` varchar(255) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `missao` text NOT NULL,
  `icone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `ministerio_detalhes`
--

INSERT INTO `ministerio_detalhes` (`ministerio_id`, `nome`, `descricao`, `missao`, `icone`) VALUES
('894d1744-5a2f-11f0-8ede-cec193641bb8', 'Música e Artes', '<p>O <strong>Ministério de Música e Artes</strong> da Renovação Carismática Católica é um serviço de evangelização que utiliza os dons artísticos — especialmente a música, o canto, a dança, o teatro e outras expressões visuais — como instrumentos de louvor, proclamação e edificação do povo de Deus.</p><p><br></p><p>Inspirado pelo Espírito Santo, o MMA tem como missão conduzir a assembleia a uma verdadeira experiência de oração, facilitando o encontro pessoal com Jesus Cristo e favorecendo a abertura ao Batismo no Espírito Santo.</p><p><br></p><p>Mais do que animadores, os servos do Ministério de Música e Artes são ministros que, com coração adorador, vivem sua vocação com santidade, humildade, obediência e profunda comunhão com a Igreja.</p>', '<p><strong>Evangelizar através da música e das artes, conduzindo o povo de Deus a uma profunda experiência com o amor do Pai, a salvação em Jesus Cristo e a ação transformadora do Espírito Santo.</strong></p>', NULL),
('comunicacao-social', 'Comunicação Social', '<p>O Ministério de Comunicação Social da Renovação Carismática Católica é um serviço de evangelização que tem por missão anunciar Jesus Cristo e promover a cultura de Pentecostes por meio dos meios de comunicação.</p><p><br></p><p>Atuando nas diversas plataformas — redes sociais, rádio, televisão, internet, fotografia, vídeos, jornal impresso e digital — o MCS busca tornar visível a ação do Espírito Santo e a vida da RCC, sendo um canal de unidade, formação, informação e inspiração.</p><p><br></p><p>Mais do que produzir conteúdos, o comunicador do MCS é um servo que, movido pelo Espírito Santo, comunica com unção, verdade e fidelidade à Igreja, colocando seus dons a serviço da evangelização com zelo, ética e profissionalismo.</p>', '<p>Evangelizar por meio dos meios e linguagens da comunicação, tornando conhecido Jesus Cristo e sua obra de salvação, promovendo a comunhão e difundindo a cultura de Pentecostes em todos os ambientes.</p>', 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'),
('criancas-adolescentes', 'Crianças e Adolescentes', '<p>O <strong>Ministério para as Crianças e Adolescentes </strong>(MCA) da Renovação Carismática Católica é um serviço de evangelização voltado à formação integral de crianças e adolescentes à luz da experiência do Batismo no Espírito Santo.</p><p><br></p><p>Inspirado na pedagogia de Jesus e animado pela ação do Espírito Santo, o MCA busca levar os pequenos a um encontro pessoal com Cristo desde cedo, despertando neles o amor à Palavra de Deus, à oração, aos sacramentos e à vivência comunitária.</p><p><br></p><p>Através de encontros, grupos de oração, atividades lúdicas e momentos de formação, o ministério contribui para o crescimento humano e espiritual das novas gerações, preparando-as para serem discípulos e missionários firmes na fé e ativos na Igreja.</p>', '<p><strong>Evangelizar crianças e adolescentes para que, tocados pelo amor de Deus e pela força do Espírito Santo, vivam uma experiência pessoal com Jesus Cristo e se tornem protagonistas da nova geração de evangelizadores na Igreja e no mundo.</strong></p>', 'M15 19l-7-7 7-7'),
('familias', 'Famílias', '<p>O <strong>Ministério para as Famílias</strong> da Renovação Carismática Católica é um serviço de evangelização que tem como objetivo fortalecer as famílias segundo o plano de Deus, promovendo nelas a vivência do amor, da oração, da unidade e da fidelidade ao Senhor.</p><p><br></p><p>Iluminado pela experiência do Batismo no Espírito Santo, o MF trabalha para que os lares se tornem verdadeiras \"igrejas domésticas\", onde Cristo é o centro e o Espírito Santo guia as decisões, curando feridas, restaurando vínculos e conduzindo os membros da família à santidade.</p><p><br></p><p>Por meio de encontros, grupos de oração, retiros, formações e acompanhamento espiritual, o Ministério para as Famílias acolhe e evangeliza casais, pais, filhos, viúvos, separados e todas as realidades familiares, com zelo pastoral e profunda comunhão com a Igreja.</p>', '<p>Evangelizar as famílias para que, renovadas pela ação do Espírito Santo, sejam testemunhas vivas do amor de Deus, sustentadas na fé, e irradiem a presença de Cristo no seio da Igreja e da sociedade.</p>', 'M12 4.5v15m7.5-7.5h-15'),
('fe-politica', 'Fé e Política', '<p>Incentiva a participação cristã na política, promovendo valores éticos e justiça social.</p>', '<p>Formar consciências políticas alinhadas ao Evangelho.</p>', 'M8 7v10m8-10v10'),
('formacao', 'Formação', '<p>O <strong>Ministério de Formação</strong> da Renovação Carismática Católica é um serviço essencial à maturidade espiritual e ao crescimento humano dos membros do movimento.</p><p><br></p><p>Sua missão é transmitir com fidelidade os ensinamentos da Igreja e da RCC, proporcionando um itinerário formativo que conduz os fiéis a uma vida de discipulado, santidade e missão, a partir da experiência transformadora do Batismo no Espírito Santo.</p><p><br></p><p>Através de módulos, cursos, encontros, escolas e formações continuadas, o Ministério de Formação busca formar servos conscientes de sua identidade, vocação e missão, promovendo uma espiritualidade sólida, enraizada na Palavra de Deus, na doutrina católica e na vida fraterna em comunidade.</p>', '<p><strong>Formar discípulos evangelizadores, enraizados na fé católica e na experiência carismática, para que, amadurecidos na vivência do Espírito, sirvam com fidelidade, unção e comunhão na missão de renovar a face da Terra.</strong></p>', 'M5 13l4 4L19 7'),
('intercessao', 'Intercessão', '<p>O <strong>Ministério de Intercessão</strong> da Renovação Carismática Católica é um serviço de oração constante, silencioso e eficaz que sustenta espiritualmente toda a ação evangelizadora da RCC.</p><p><br></p><p>É composto por servos chamados a estar na brecha (cf. Ez 22,30), clamando pela Igreja, pelas lideranças, pelas famílias, pelas missões e por toda a humanidade, de forma perseverante, obediente e cheia de fé.</p><p><br></p><p>A intercessão carismática é feita na força do Espírito Santo, com ousadia, escuta profética, uso dos carismas e profundo amor à Igreja. O intercessor é um vigia espiritual, consagrado à oração, que combate nas regiões celestes com as armas da fé, do louvor e da Palavra de Deus.</p>', '<p><strong>Sustentar, por meio da intercessão contínua e carismática, toda a obra da RCC, clamando pela efusão do Espírito Santo sobre a Igreja e o mundo, e sendo instrumento de unidade, discernimento e combate espiritual.</strong></p>', 'M12 4v16m8-8H4'),
('jovens', 'Jovens', '<p>O <strong>Ministério Jovem</strong> da Renovação Carismática Católica é um serviço de evangelização que tem como objetivo levar os jovens a uma experiência pessoal com Jesus Cristo por meio do Batismo no Espírito Santo, formando uma nova geração de discípulos missionários cheios de fé, ousadia e amor à Igreja.</p><p><br></p><p>Com uma linguagem própria da juventude, criatividade e ardor apostólico, o MJ promove grupos de oração, encontros, missões, vigílias, formações e atividades que favorecem o crescimento humano e espiritual dos jovens.</p><p><br></p><p>O ministério é um espaço de escuta, acolhimento e discipulado, onde os jovens descobrem sua identidade em Cristo e seu chamado a transformar o mundo com a força do Espírito Santo.</p>', '<p><strong>Evangelizar a juventude, despertando-a para uma vida nova em Cristo, vivida com radicalidade, santidade e paixão pela missão, tornando cada jovem um profeta da nova geração e um sinal vivo da cultura de Pentecostes.</strong></p>', 'M12 6v12m6-6H6'),
('oracao-cura-libertacao', 'Oração por Cura e Libertação', '<p>O <strong>Ministério de Oração por Cura e Libertação</strong> da Renovação Carismática Católica é um serviço de compaixão e misericórdia que busca levar as pessoas a uma profunda experiência de restauração interior por meio do poder do Espírito Santo.</p><p><br></p><p>Atuando com discernimento espiritual, escuta, oração e uso dos carismas, o MOCL tem como objetivo principal conduzir os filhos de Deus à cura das feridas da alma, à libertação de influências espirituais e à vivência da liberdade dos filhos de Deus.</p><p><br></p><p>A missão é exercida com prudência, fidelidade à doutrina da Igreja, acompanhamento pastoral e maturidade espiritual, sendo sustentada por uma vida intensa de oração, jejum, confissão, formação e comunhão fraterna.</p><p><br></p><p>O ministério não substitui os sacramentos nem o acompanhamento terapêutico, mas os complementa na dimensão espiritual da cura e libertação.</p>', '<p><strong>Evangelizar através da oração de cura e libertação, conduzindo os filhos de Deus à restauração integral e à libertação espiritual, para que vivam em liberdade, santidade e plenitude de vida em Cristo.</strong></p>', 'M12 14l9-5-9-5-9 5 9 5z'),
('pregacao', 'Pregação', '<p>O <strong>Ministério de Pregação</strong> da Renovação Carismática Católica é um serviço de anúncio da Palavra de Deus com unção, autoridade e fidelidade à doutrina da Igreja.</p><p><br></p><p>Movido pelo Espírito Santo e fundamentado na Sagrada Escritura, este ministério tem como missão levar as pessoas a um encontro pessoal com Jesus Cristo, proclamando a verdade com ousadia e despertando corações para a conversão, a santidade e a missão.</p><p><br></p><p>O pregador carismático não apenas transmite conteúdos, mas é um <strong>instrumento vivo do Espírito</strong>, que evangeliza com a vida, com a palavra ungida, e com o testemunho.</p><p><br></p><p>A formação contínua, a intimidade com Deus, a comunhão com a RCC e com a Igreja são marcas essenciais da vida de quem exerce esse ministério.</p>', '<p><strong>Anunciar a Palavra de Deus com fidelidade, poder e unção, despertando corações para a fé, conduzindo-os à experiência do Batismo no Espírito Santo, e formando discípulos missionários para a edificação da Igreja.</strong></p>', 'M19 9l-7 7-7-7'),
('promocao-humana', 'Promoção Humana', '<p>O <strong>Ministério de Promoção Humana</strong> da Renovação Carismática Católica é um serviço de amor concreto ao próximo, que visa integrar a evangelização com ações de solidariedade, justiça e caridade, promovendo a dignidade da pessoa humana à luz do Evangelho.</p><p><br></p><p>Inspirado na compaixão de Jesus e movido pelo Espírito Santo, o MPH atua na escuta, acolhida e atendimento das necessidades físicas, emocionais e espirituais dos irmãos mais necessitados, promovendo a restauração integral da vida.</p><p><br></p><p>O ministério desenvolve ações como campanhas solidárias, apoio a pessoas em situação de vulnerabilidade, visitas missionárias, escuta fraterna, auxílio a dependentes químicos, projetos sociais e formação em cidadania, sempre com base na oração, no discernimento e na vivência do amor cristão.</p>', '<p><strong>Servir com amor e compaixão, promovendo a dignidade humana e restaurando vidas por meio da ação evangelizadora, da solidariedade e do testemunho concreto da misericórdia de Deus.</strong></p>', 'M12 8v8m-4-4h8'),
('universidades-renovadas', 'Universidades Renovadas', '<p>O <strong>Ministério Universidades Renovadas (MUR)</strong> é a expressão do carisma da Renovação Carismática Católica no ambiente universitário.</p><p><br></p><p>Sua missão é evangelizar professores, estudantes e servidores das instituições de ensino superior por meio da experiência do Batismo no Espírito Santo, formando homens e mulheres novos para uma sociedade nova, a partir de uma vivência madura da fé no contexto acadêmico.</p><p><br></p><p>Presente nas universidades por meio dos Grupos de Oração Universitários (GOUs) e Grupos de Partilha de Vida (GPVs), o MUR promove uma espiritualidade encarnada, integrando fé e razão, espiritualidade e missão, oração e ação concreta.</p><p><br></p><p>O ministério busca formar lideranças cristãs, comprometidas com a transformação da universidade e da sociedade, à luz do Evangelho.</p>', '<p><strong>Evangelizar o mundo universitário, conduzindo seus membros a uma experiência pessoal com Jesus Cristo, formando lideranças cheias do Espírito Santo e comprometidas com a renovação da cultura, da ciência e da sociedade à luz do Reino de Deus.</strong></p>', 'M4 6h16M4 12h16M4 18h16');

-- --------------------------------------------------------

--
-- Estrutura para tabela `ministerio_escolas_formacao`
--

CREATE TABLE `ministerio_escolas_formacao` (
  `id` int(11) NOT NULL,
  `ministerio_id` varchar(255) NOT NULL,
  `data` date DEFAULT NULL,
  `local` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `ministerio_escolas_formacao`
--

INSERT INTO `ministerio_escolas_formacao` (`id`, `ministerio_id`, `data`, `local`) VALUES
(42, 'oracao-cura-libertacao', '2025-08-26', 'Nos Setores'),
(44, 'promocao-humana', '2025-08-16', 'Nos Setores'),
(45, 'intercessao', '2025-08-16', 'Nos Setores'),
(46, 'formacao', '2025-08-23', 'Nos setores'),
(49, 'criancas-adolescentes', '2025-08-15', 'Anfiteatro RCC das 14h às 18h'),
(51, 'pregacao', '2025-08-23', 'Nos Setores'),
(52, 'pregacao', '2025-09-27', 'Nos setores '),
(53, '894d1744-5a2f-11f0-8ede-cec193641bb8', '2025-07-28', 'Canção Nova Curitiba às 19h30');

-- --------------------------------------------------------

--
-- Estrutura para tabela `noticias_portal`
--

CREATE TABLE `noticias_portal` (
  `id` int(11) NOT NULL,
  `manchete` varchar(255) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `conteudo` text NOT NULL,
  `data_publicacao` datetime DEFAULT current_timestamp(),
  `autor` varchar(100) DEFAULT NULL,
  `status` enum('publicado','rascunho') DEFAULT 'rascunho',
  `id_usuario` int(11) NOT NULL,
  `fotos_galeria` text DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `data_inicio` datetime NOT NULL DEFAULT current_timestamp(),
  `data_fim` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `noticias_portal`
--

INSERT INTO `noticias_portal` (`id`, `manchete`, `foto`, `conteudo`, `data_publicacao`, `autor`, `status`, `id_usuario`, `fotos_galeria`, `categoria`, `data_inicio`, `data_fim`) VALUES
(3, 'Santa Missa marca a abertura do RENASEM Sulão 2025 em Curitiba', '/ImgNoticias/1752972188429-4213776.jpg', '<p>Na noite do dia <strong>14 de julho de 2025</strong>, a <strong>Catedral Basílica Menor de Nossa Senhora da Luz dos Pinhais</strong>, em Curitiba, foi o local de um momento de grande graça e comunhão: a <strong>Santa Missa de Abertura do RENASEM Sulão</strong> — o Retiro para Seminaristas promovido pela <strong>Renovação Carismática Católica (RCC)</strong>.</p><p><br></p><p>Este evento, de importância singular para a formação espiritual dos seminaristas da região Sul do Brasil, teve sua abertura acolhida com entusiasmo pela <strong>RCC Paraná</strong>, com a <strong>RCC Curitiba</strong> como anfitriã. A Santa Missa foi celebrada em clima de profunda reverência, louvor e ação de graças, reunindo seminaristas de diversos estados do Sul, membros do clero, coordenadores da RCC e fiéis da arquidiocese.</p><p><br></p><p>O <strong>RENASEM (Retiro Nacional de Seminaristas)</strong> é uma iniciativa da RCC Brasil que visa proporcionar aos futuros sacerdotes uma experiência renovadora com o Espírito Santo, fortalecendo sua vocação e preparando-os para viver um ministério enraizado na oração, na escuta da Palavra e na abertura aos carismas.</p><p><br></p><p>A celebração eucarística, presidida com solenidade e unção, marcou o início de dias intensos de oração, formação e fraternidade entre os jovens que caminham rumo ao sacerdócio. Foi também um <strong>sinal visível da unidade eclesial entre os carismáticos e o clero</strong>, e da força da espiritualidade carismática no coração da Igreja.</p><p><br></p>', '2025-07-18 00:20:00', 'MCS', 'publicado', 1, '[]', 'Evento', '2025-07-18 00:20:00', '2025-08-30 13:30:00'),
(4, 'Encontro Arquidiocesano de Pentecostes', '/ImgNoticias/1752636329049-53908604.jpg', '<p>No último dia 8 de junho de 2025, a <strong><em>Renovação Carismática Católica da Arquidiocese de Curitiba</em></strong> promoveu o <strong>Encontro Arquidiocesano de Pentecostes</strong> na Paróquia Santa Ana, no bairro Tatuquara. O evento reuniu centenas de servos dos Grupos de Oração da arquidiocese em um dia marcado por intensa oração, unidade fraterna e poderosa manifestação do Espírito Santo.</p><p><br></p><p>O encontro, tradicionalmente celebrado pela RCC em todo o mundo, teve como centro a efusão do Espírito Santo, renovando em cada participante a graça de Pentecostes vivida pela Igreja Primitiva. Com momentos de louvor, pregações ungidas, intercessão, adoração ao Santíssimo Sacramento e a Santa Missa, os fiéis experimentaram um profundo avivamento espiritual.</p><p><br></p><p>Durante as pregações, foi destacada a importância de viver Pentecostes todos os dias, permitindo que o Espírito Santo conduza as ações e a missão evangelizadora de cada servo. A alegria, o fervor e a comunhão marcaram o dia, que também contou com a presença de lideranças arquidiocesanas, músicos e intercessores.</p><p><br></p><p>O Encontro de Pentecostes reafirmou o compromisso da RCC Curitiba com a evangelização e com a formação de homens e mulheres cheios do Espírito, dispostos a levar Jesus a todos os lugares.</p><p><br></p><p>Que os frutos deste dia se estendam por toda a Arquidiocese, renovando os Grupos de Oração e inflamando corações! Vinde, Espírito Santo!</p>', '2025-07-16 00:29:00', 'MCS', 'publicado', 1, '[\"/ImgNoticias/1752636329102-14777488.jpg\",\"/ImgNoticias/1752636329117-467193541.jpg\",\"/ImgNoticias/1752636329125-29768402.jpg\",\"/ImgNoticias/1752636329134-6898337.jpg\",\"/ImgNoticias/1752636329153-229612021.jpg\",\"/ImgNoticias/1752636329246-470541985.jpg\",\"/ImgNoticias/1752636329300-902229505.jpg\"]', 'Notícia', '2025-07-16 00:29:00', '2025-09-30 23:12:00'),
(5, 'Nossa Senhora do Carmo, a virgem do escapulário', '/ImgNoticias/1752970588247-24043968.jpg', '<p>No dia <strong>16 de julho</strong>, a Igreja se une em alegria para celebrar a memória de <strong>Nossa Senhora do Carmo</strong>, uma das manifestações mais profundas do cuidado maternal da Virgem Maria por seus filhos. Não é apenas uma data litúrgica no calendário — é um <strong>sinal do Céu</strong>, um <strong>chamado à consagração e confiança total</strong> na proteção da Mãe que intercede por nós sem cessar.</p><p><br></p><p>Foi em <strong>1251</strong>, no coração da Inglaterra, que Maria Santíssima se manifestou ao <strong>Santo Simão Stock</strong>, então superior da Ordem do Carmo. Em suas mãos puríssimas, Ela trazia um presente celestial: o <strong>Escapulário do Carmo</strong>. A promessa que acompanhou esse gesto ecoa até hoje com força no coração dos devotos: “<strong>Quem morrer com este escapulário, não padecerá o fogo eterno</strong>.”</p><p><br></p><p>Essa aparição não é apenas memória, é <strong>profecia viva</strong>! Um clamor maternal para que retornemos ao caminho da <strong>santidade, da oração constante e da confiança na providência de Deus</strong>. É como se Maria nos dissesse: “Filho, filha, <strong>reveste-te de mim, e eu te vestirei de Jesus</strong>.”</p><p><br></p><p>O título \"Nossa Senhora do Carmo\" vem do <strong>Monte Carmelo</strong>, na Terra Santa, local consagrado pela fé ardente do <strong>profeta Elias</strong>, aquele que, inflamado pelo Espírito, clamou: “<strong>Se o Senhor é Deus, segui-o!</strong>” (1Rs 18,21). Ali, sobre aquele monte, nasceu uma espiritualidade marcada por <strong>fogo, silêncio e intimidade com Deus</strong>, que depois daria origem à <strong>Ordem Carmelita</strong> — um povo orante, apaixonado pela presença de Deus e consagrado a Maria.</p><p><br></p><p>Durante séculos de perseguições, cruzadas e desafios, os <strong>carmelitas</strong> não desistiram. Foram expulsos do Oriente, mas como <strong>brasas vivas do Espírito</strong>, espalharam o fogo carmelitano pela Europa e pelo mundo. Receberam a <strong>Regra de São Alberto</strong>, viveram a radicalidade do Evangelho e mantiveram viva a chama da <strong>oração, da penitência e da contemplação</strong>.</p><p><br></p><p>E o que dizer do <strong>Escapulário</strong>? Não se trata de superstição, mas de <strong>aliança espiritual</strong>. Ele é um <strong>sinal visível da consagração a Maria</strong>, um “sim” contínuo à vontade de Deus. Usá-lo é se revestir da proteção materna, da promessa do Céu e da missão de ser <strong>sinal profético no mundo</strong>. O “<strong>privilégio sabatino</strong>”, tão querido na tradição carmelita, fala da esperança escatológica: a libertação das almas do purgatório no sábado seguinte à morte dos que morrerem piedosamente com o escapulário.</p><p><br></p><p>São João Paulo II, grande devoto do Carmo, dizia que <strong>o escapulário é uma veste mariana que nos recorda o chamado à santidade</strong>. O Papa Pio XII nos exortou a dar a ele o <strong>primeiro lugar entre as devoções marianas</strong> — porque é simples, profundo e poderosamente eficaz para quem o vive com fé.</p><p><br></p><p>Querido irmão, querida irmã, <strong>o escapulário não é um amuleto</strong>, mas uma <strong>aliança viva com Maria</strong>, uma consagração que exige de nós uma resposta: <strong>vida de oração, comunhão com Deus, afastamento do pecado e entrega radical ao Evangelho</strong>.</p><p><br></p><p><strong>Clamemos juntos</strong>:</p><blockquote>“Maria, Senhora do Carmo, cobre-nos com teu manto!</blockquote><blockquote> Ensina-nos a ouvir o Espírito,</blockquote><blockquote> a viver como Elias, com zelo ardente por Deus,</blockquote><blockquote> e a caminhar contigo até o Céu!”</blockquote><p class=\"ql-align-justify\"><span style=\"color: rgb(128, 128, 128);\">.&nbsp;</span></p><p><br></p><h2 class=\"ql-align-center\">Oração</h2><p class=\"ql-align-center\"><span style=\"color: rgb(128, 128, 128);\">“Ó Virgem do Carmo, Virgem do Escapulário,&nbsp;&nbsp;</span></p><p class=\"ql-align-center\"><span style=\"color: rgb(128, 128, 128);\">livrai-nos de todo mal, de toda doença maligna&nbsp;&nbsp;</span></p><p class=\"ql-align-center\"><span style=\"color: rgb(128, 128, 128);\">e das perseguições do inimigo.&nbsp;&nbsp;</span></p><p class=\"ql-align-center\"><span style=\"color: rgb(128, 128, 128);\">Assim como nos ajudai a viver&nbsp;&nbsp;</span></p><p class=\"ql-align-center\"><span style=\"color: rgb(128, 128, 128);\">intimamente unidos a ti e ao teu filho, Jesus.&nbsp;&nbsp;</span></p><p class=\"ql-align-center\"><span style=\"color: rgb(128, 128, 128);\">Amém!”&nbsp;</span></p><p><br></p><h2>Nossa Senhora do Carmo, rogai por nós!</h2><p><br></p>', '2025-07-19 12:00:00', 'MCS', 'publicado', 1, '[]', 'Notícia', '2025-07-19 12:00:00', '2025-08-31 21:12:00'),
(6, 'Papa Leão XIV: Um novo tempo para a Igreja', '/ImgNoticias/1752971352681-990953290.jpg', '<p>No dia <strong>8 de maio de 2025</strong>, a Igreja Católica acolheu com alegria e reverência a eleição de <strong>Leão XIV</strong>, o 267º Papa da história, sucessor de São Pedro e novo <strong>Bispo de Roma</strong>. <strong>Robert Francis Prevost</strong>, religioso da Ordem de Santo Agostinho (O.S.A.), foi escolhido pelo Colégio de Cardeais reunido em conclave após o falecimento do Papa Francisco.</p><p><br></p><p>Antes de sua eleição ao trono de Pedro, <strong>Dom Robert Prevost</strong> já era uma figura de grande importância na vida da Igreja. Religioso agostiniano norte-americano, serviu como <strong>bispo da Diocese de Chiclayo, no Peru</strong>, onde demonstrou profundo zelo pastoral, atenção aos mais pobres e uma grande capacidade de diálogo com as realidades locais da América Latina.</p><p><br></p><p>Posteriormente, foi chamado a servir à Igreja universal como <strong>Prefeito do Dicastério para os Bispos</strong>, um dos mais importantes órgãos da Cúria Romana, responsável pela nomeação dos bispos do mundo inteiro. Nessa função, atuou com sabedoria, equilíbrio e espírito de comunhão eclesial, o que lhe valeu grande respeito entre seus irmãos cardeais.</p><p><br></p><p>Ao escolher o nome <strong>Leão XIV</strong>, Robert Prevost fez referência aos Papas anteriores com esse nome — especialmente <strong>Leão XIII</strong>, conhecido por sua defesa da Doutrina Social da Igreja, e <strong>São Leão Magno</strong>, doutor da Igreja e defensor da fé no século V. A escolha do nome indica um possível desejo de unir <strong>firmeza doutrinária, diálogo com o mundo moderno e abertura ao Espírito Santo</strong>, características marcantes do novo pontificado.</p><p><br></p><p>Leão XIV é o <strong>primeiro Papa norte-americano da história</strong>, o que representa também uma nova etapa na <strong>universalidade da Igreja</strong>, que continua a expressar sua catolicidade por meio de pastores vindos de todas as nações.</p><p><br></p><p>O início de seu pontificado tem sido marcado por mensagens claras de esperança, renovação espiritual e compromisso com os mais pobres. Em sua primeira bênção “Urbi et Orbi”, o novo Papa convocou a Igreja a <strong>uma nova primavera de evangelização</strong>, enfatizando a centralidade de Jesus Cristo, a força da oração e o papel vital da família, da juventude e das comunidades eclesiais na missão evangelizadora.</p><p><br></p><p><strong>Leão XIV já despertou grande simpatia e expectativa</strong>, especialmente entre os povos latino-americanos, com quem partilhou sua missão episcopal por muitos anos. Sua simplicidade, profunda espiritualidade agostiniana e fidelidade ao magistério da Igreja indicam um pontificado voltado para o serviço, a comunhão e a renovação pastoral.</p>', '2025-05-09 00:20:00', 'MCS', 'publicado', 1, '[\"/ImgNoticias/1752971352682-311718604.jpg\",\"/ImgNoticias/1752971352682-329429018.jpg\",\"/ImgNoticias/1752971352685-543248721.jpg\"]', 'Notícia', '2025-05-09 00:20:00', NULL),
(7, 'IEAD RCCBRASIL lança curso inédito sobre Santa Elena Guerra e as raízes da Renovação Carismática Católica', '/ImgNoticias/1752970941447-807364430.jpg', '<p class=\"ql-align-justify\">Em uma iniciativa que une história, espiritualidade e a identidade do Movimento, o&nbsp;<a href=\"https://ieadrccbrasil.com.br/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: transparent; color: rgb(204, 51, 102);\">Instituto de Educação a Distância (IEAD)</a>&nbsp;da Renovação Carismática Católica do Brasil anuncia o lançamento de seu mais novo curso online: “Elena Guerra e a Renovação Carismática Católica”. Programado para estrear neste Domingo de Pentecostes, 8 de junho de 2025, o curso promete ser um marco formativo para todos os membros da RCCBRASIL e aqueles que tiverem o interesse em conhecer as origens espirituais do Movimento.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">A proposta, sugerida pela Comissão Nacional de Formação da RCCBRASIL, surge como um complemento ao livro “<a href=\"https://rccshop.com.br/loja/santa-elena-guerra-e-logo-sera-primavera-um-pentecostes-sem-fim.html\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: transparent; color: rgb(204, 51, 102);\"><strong>Santa Elena Guerra – E logo será primavera, um Pentecostes sem fim”</strong></a>&nbsp;e outros materiais já lançados sobre Santa Elena Guerra, conhecida como a “Apóstola do Espírito Santo”. O curso visa conduzir os alunos pela história, espiritualidade e missão de Santa Elena Guerra, compreendendo como sua vida e escritos influenciaram profundamente a Renovação Carismática Católica.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Santa Elena Guerra, canonizada em 20 de outubro de 2024, é reconhecida como a responsável pelo despertar da devoção moderna ao Espírito Santo, por meio de uma vida dedicada a clamar por um “retorno ao Cenáculo”. Chamado esse que foi apoiado e acolhido pelo Papa Leão XIII, por meio de correspondência enviadas por Elena Guerra, que foi fundamental para que ele publicasse documentos importantes sobre o Espírito Santo para a Igreja. Nesse sentido, o curso vai explorar em detalhes essa relação e o impacto de seus apelos.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">O curso conta com nove aulas em vídeo, acompanhadas de material de apoio em formato PDF, o curso vai oferecer uma visão ampla e abrangente sobre Elena Guerra e sua relevância para a Renovação Carismática Católica. As aulas serão ministradas por um corpo docente experiente e conhecedor do carisma e da história da Igreja. São eles: Padre Antônio José, teólogo e doutor em Teologia Sistemático-Pastoral; Reinaldo Beserra, pedagogo e pioneiro da RCCBRASIL; Daiana Rehbein, coordenadora da Comissão Nacional de Formação da RCCBRASIL e Maria Eliane Noronha, Presidente do Conselho Arquidiocesano da RCC Maceió.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">O conteúdo programático começa com sua biografia e obra, passando pela análise de sua correspondência com o Papa Leão XIII e o chamado eclesial para “voltar ao Cenáculo”. O curso aborda ainda a dimensão pessoal da vida no Espírito segundo a santa, seu processo de beatificação e canonização e traça paralelos com a redescoberta do Espírito Santo nos textos do Concílio Vaticano II. Temas como a obediência de Elena Guerra à Igreja e sua inspiração direta para a Renovação Carismática Católica também serão explorados, culminando em uma reflexão sobre a Igreja como um “Cenáculo permanente”.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Aproveitando a Solenidade de Pentecostes, o lançamento do curso vai disponibilizar neste domingo a primeira aula, “Elena Guerra: sua vida e obra”. As aulas seguintes serão liberadas semanalmente, com o intuito de possibilitar aos alunos um aprendizado progressivo e aprofundado. O acesso ao conteúdo completo do curso ficará disponível por um ano, permitindo que os inscritos revisitem as aulas e o material de apoio quantas vezes desejarem.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">As inscrições e mais informações podem ser encontradas na&nbsp;<a href=\"https://ieadrccbrasil.com.br/cursoelenaguerra/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: transparent; color: rgb(204, 51, 102);\">página oficial do curso na plataforma do IEAD RCCBRASIL</a>.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">O curso “Elena Guerra e a Renovação Carismática Católica” é um convite a todos que desejam reacender em seus corações o clamor por um novo Pentecostes, inspirados pelo exemplo e pela intercessão da Apóstola do Espírito Santo.</p><p><br></p>', '2025-07-18 00:20:00', 'MCS', 'publicado', 1, '[]', 'Formação', '2025-07-18 00:20:00', '2025-09-30 21:21:00'),
(8, 'Renovação Carismática Católica convoca fiéis para ação missionária de evangelização porta a porta', '/ImgNoticia/1751254337938-612472390.jpg', '<p class=\"ql-align-justify\">Nos dias 20 e 21 de abril, a Renovação Carismática Católica vai realizar em todo o Brasil uma grande ação missionária de evangelização porta a porta. A iniciativa faz parte do chamado da RCCBRASIL para que os carismáticos sejam a Igreja em saída, indo ao encontro do outro e propagando o Pentecostes.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">A ação, que visa motivar os grupos de oração a participarem ativamente, é coordenada pelo Conselho Nacional da RCCBRASIL, que&nbsp;<a href=\"https://rccbrasil.org.br/ondadeevangelizacao/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(204, 51, 102); background-color: transparent;\">disponibilizou um subsídio de orientações</a>&nbsp;para que os fiéis possam se preparar e realizar a evangelização de forma eficaz. Além disso, foram disponibilizadas artes para camisetas e divulgação nas instâncias da RCC, a fim de fortalecer a identidade e a unidade dos participantes.</p><p class=\"ql-align-justify\"><br></p><p>A importância da evangelização porta a porta está em sair das quatro paredes físicas das igrejas e ir ao encontro das pessoas em suas realidades. É um convite para que cada carismático se coloque em estado permanente de missão, conforme explica Sheila Damaceno, coordenadora do Ministério de Promoção Humana da RCCBRASIL.&nbsp;</p><p><br></p><blockquote>“O Papa Francisco nos diz que para a Igreja, hoje, é vital anunciar o evangelho a todos, em todos os lugares em todas as ocasiões sem demora, sem repugnâncias e sem medo. Por isso, você e eu, nós somos convidados a ser missionários audaciosos. A sermos verdadeiros arautos da misericórdia de Deus indo até as Nínives que se apresentam nas mais diversas realidades do Brasil”.</blockquote><blockquote><strong>Sheila Damaceno, coordenadora do Ministério de Promoção Humana da RCCBRASIL</strong></blockquote><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">A evangelização porta a porta promovida pela RCCBRASIL nos dias 20 e 21 de abril é um momento especial para os carismáticos espalhados pelo Brasil se unirem em missão, levando a mensagem de Pentecostes e o amor de Deus a todos. “Ser presença de Igreja, ser embaixador de Cristo mobilizando os Grupos de Oração de todas as dioceses a se colocarem em estado de saída, em estado permanente de missão atraindo as pessoas para Jesus e trazendo as pessoas para a Igreja”.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Motive seu grupo de oração a participar e acompanhe as redes sociais da RCCBRASIL para ficar por dentro de todas as informações sobre essa importante ação missionária. Acesse a área de downloads do portal, baixe o subsídio e se prepare para participar desta onda de evangelização.</p>', '2025-07-16 00:25:00', 'Luiz César', 'publicado', 1, '[\"/ImgNoticia/1751254337991-475733230.jpg\",\"/ImgNoticia/1751254338005-591422850.jpg\",\"/ImgNoticia/1751254338040-366579378.jpg\"]', 'Notícia', '2025-07-16 00:25:00', '2025-08-05 16:23:00'),
(9, 'RCCBRASIL convida a família carismática à oração de intercessão pela Assembleia Eletiva Nacional', '/ImgNoticias/1755919412646-482174871.png', '<p class=\"ql-align-justify\">A Renovação Carismática Católica do Brasil vai realizar a partir do dia 20 de julho uma grande ação nacional de oração de intercessão pela Assembleia Eletiva, que será realizada entre os dias 20 e 23 de setembro de 2025. A proposta é convocar toda a família carismática a unir-se em oração pela escolha da nova presidência do Movimento.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Inspirada no Evangelho de Lucas 6,12: “Naqueles dias, Jesus retirou-se a uma montanha para rezar, e passou aí toda a noite orando a Deus”, a iniciativa convida os fiéis a subir espiritualmente a montanha com Jesus, colocando diante de Deus cada passo do processo eletivo. O objetivo é que a decisão a ser tomada esteja inteiramente conforme a vontade divina, e que os corações estejam dóceis à condução do Espírito Santo.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">“Jesus é o nosso modelo, o nosso Mestre. Por isso, seguindo o seu exemplo, somos convocados a erguer a nossa oração, invocando o auxílio do poderoso Espírito Santo, para alcançarmos em plenitude a Sua santa vontade no meio de nós”, conforme escrito no documento oficial da ação.</p><p class=\"ql-align-justify\">Durante as nove semanas de preparação, são propostas práticas espirituais específicas:</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Aos domingos, apresentar a intenção na Santa Missa;</p><p class=\"ql-align-justify\">·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Às quintas-feiras, oração especial na Adoração ao Santíssimo Sacramento;</p><p class=\"ql-align-justify\">·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Às sextas-feiras, vivência do jejum ou de alguma penitência;</p><p class=\"ql-align-justify\">·&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Aos sábados, oração do Ofício de Nossa Senhora.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Além disso, o roteiro de intercessão sugere orações diárias como o Veni Creator Spiritus, orações espontâneas no estilo carismático, a Salve Rainha, e reflexões semanais baseadas na Palavra de Deus, com temas específicos para cada semana, incluindo louvor pelas lideranças passadas e presentes, clamor por docilidade ao Espírito Santo e súplica por um presidente segundo o coração de Deus.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">A RCCBRASIL disponibilizou um documento completo com todas as diretrizes, orações e intenções semanais para orientar a intercessão dos Grupos de Oração, Ministérios e membros de todo o país.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Faça o download do documento oficial e una-se a essa grande corrente de oração:&nbsp;<a href=\"https://www.mediafire.com/file/i8q2b99joecaj42/Intercess%C3%A3o+-+Assembleia+RCC.pdf/file\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(204, 51, 102);\">Clique aqui para baixar o documento em PDF</a></p>', '2025-07-19 20:59:00', 'MCS', 'publicado', 1, '[]', 'Notícia', '2025-07-19 20:59:00', '2025-09-14 20:59:00'),
(10, 'RCCBRASIL lança projeto para revitalizar Grupos de Oração e impulsionar missão evangelizadora', '/ImgNoticias/1755919342021-582990178.png', '<p>Diante dos desafios enfrentados atualmente pela Renovação Carismática Católica no Brasil — entre eles,&nbsp;o desvio de identidade e um certo esfriamento missionário em alguns Grupos de Oração — a RCCBRASIL propõe uma resposta concreta e ousada: o projeto <strong>“</strong><a href=\"https://materiais.rccbrasil.org.br/projeto-vem-amigo-vem\" rel=\"noopener noreferrer\" target=\"_blank\"><strong><em><u>Vem, Amigo, Vem</u></em></strong></a><strong><em><u>!</u></em>”</strong>. A iniciativa, lançada nacionalmente, busca reacender a chama da evangelização e reforçar o papel central dos Grupos de Oração como coração pulsante do Movimento.</p><p><br></p><p>Inspirado na vivência da Igreja primitiva descrita em Atos dos Apóstolos 2,47 — <em>“E o Senhor cada dia lhes ajuntava outros que estavam a caminho da salvação”</em> — o projeto tem como missão abrir as portas dos grupos para acolher novos participantes, formar discípulos e permitir que a ação do Espírito Santo transforme vidas.</p><p><br></p><blockquote>“Se há uma bênção para quem participa, ela pode alcançar vizinhos, parentes, colegas de trabalho. Todos precisam, consciente ou não, de um encontro pessoal com Jesus. E esse encontro pode acontecer no Grupo de Oração”, afirma <strong>Vinícius Simões</strong>, presidente do Conselho Nacional da RCCBRASIL.</blockquote><h3><br></h3><h3><strong>Evangelizar com formação e identidade carismática</strong></h3><p><br></p><p>Mais do que uma campanha de convite, o “<a href=\"https://materiais.rccbrasil.org.br/projeto-vem-amigo-vem\" rel=\"noopener noreferrer\" target=\"_blank\"><em><u>Vem, Amigo, Vem</u></em></a>!” une missão e formação. Como explica <strong>Daiana Rehbein</strong>, coordenadora da Comissão de Formação da RCCBRASIL, a proposta oferece bases sólidas para que a evangelização aconteça com profundidade e autenticidade. “A formação não é um fim em si mesma; ela é o caminho para que o Espírito Santo atue com liberdade através de nós”, destaca.</p><p><br></p><p>Um dos frutos concretos dessa visão foi o lançamento de um <strong>e-book nacional sobre Grupos de Oração</strong>, que reúne fundamentos da espiritualidade carismática, diretrizes de acolhimento e pastoreio, além de um roteiro prático para a abertura de novos grupos. O material é direcionado tanto para membros experientes quanto para quem está conhecendo a RCC pela primeira vez.</p><p><br></p><h3><strong>Reencontrar a essência: “Nós somos Grupo de Oração”</strong></h3><p><br></p><p>Mais do que uma frase, o lema “Nós somos Grupo de Oração” carrega um apelo profundo ao resgate da identidade original da RCC. Segundo Vinícius Simões, desde o início Deus sonhou com Grupos que atualizassem o Cenáculo de Jerusalém. “Pentecostes é hoje. O Espírito Santo continua sendo derramado, e os Grupos de Oração são os espaços privilegiados onde isso acontece”, enfatiza.</p><p><br></p><p>O projeto busca justamente essa renovação a partir das origens: grupos marcados pela oração espontânea, pelo louvor vibrante, pela escuta da Palavra, pelo exercício dos carismas, pela fraternidade e pelo envio missionário. Tudo na RCC deve, segundo o presidente, <strong>convergir pastoralmente para os Grupos de Oração</strong>.</p><p><br></p><h3><strong>Reconstruir e lançar as redes</strong></h3><p><br></p><p>Ao refletir sobre o cenário atual, Vinícius aponta que muitos grupos se desviaram da rota original, assumindo práticas alheias à identidade carismática. “Aos poucos, substituímos o Grupo de Oração por novenas, cursos e outros encontros que, embora bons, não representam o que Deus nos confiou”.</p><p><br></p><p>Por isso, uma dimensão essencial do “<a href=\"https://materiais.rccbrasil.org.br/projeto-vem-amigo-vem?_gl=1*1tjkraw*_ga*MzY3MzIyNDM3LjE3NTA4MjIwMDY.*_ga_81MRG4B1KY*czE3NTM0MTE2MzgkbzEzJGcxJHQxNzUzNDEzMzcxJGo2MCRsMCRoMA..o, Vem!\" rel=\"noopener noreferrer\" target=\"_blank\"><em><u>Vem, Amigo, Vem!</u></em></a>” é <strong>“consertar as redes”</strong> — fortalecer internamente os grupos, para que possam acolher bem os que estão chegando. O objetivo não é apenas crescer em número, mas restaurar a vitalidade espiritual e a fidelidade ao carisma original.</p><p><br></p><blockquote>“Consertar as redes dos nossos grupos significa prepará-los para pescar novamente. Trazer novos, mas também cuidar de quem já está dentro”, resume Vinícius.</blockquote><h3><br></h3><h3><strong>Visão de futuro e continuidade missionária</strong></h3><p><br></p><p>O projeto foi lançado com foco especial no segundo semestre de 2025, mas sua proposta transcende um período pontual. Segundo Vinícius, <strong>a missão de evangelizar é permanente</strong>, pois reflete o chamado da própria Igreja: anunciar Jesus a todos os povos, tempos e culturas.</p><p><br></p><p>Entre os frutos esperados estão o <strong>crescimento espiritual e numérico</strong> dos grupos, o <strong>resgate de membros afastados</strong>, a <strong>formação de novos líderes</strong> e o fortalecimento da comunhão entre os servos. O projeto também visa inspirar uma cultura de convite e acolhida, para que os Grupos de Oração voltem a ser referência de transformação de vidas.</p><p><br></p><p><span style=\"color: rgb(122, 122, 122);\">Para saber mais e acessar os materiais acesse a página oficial do projeto&nbsp;</span><a href=\"https://materiais.rccbrasil.org.br/projeto-vem-amigo-vem\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(51, 51, 102);\">“<strong><u>Vem, amigo vem</u></strong>”.</a></p>', '2025-07-24 23:53:00', 'MCS', 'publicado', 1, '[]', 'Notícia', '2025-07-24 23:53:00', NULL),
(11, 'O Júbilo na Igreja: Uma família peregrina de esperança', '/ImgNoticias/1755919290371-81180011.png', '<p><em>\"O Deus da esperança vos encha de toda a alegria e paz na vossa fé, para que pela virtude do Espírito Santo transbordeis de esperança\"</em> (Rm 15,13).</p><p><br></p><p>Esta palavra é uma declaração de fé e confiança na capacidade do Espírito Santo de trazer alegria e esperança abundante para a vida da pessoa.</p><p><br></p><p>A RCC discerniu como tema para 2025 <em>“Pela virtude do Espírito, transbordarei de esperança”</em>, embasada nessa passagem bíblica. O objetivo é unificar a caminhada espiritual, fortalecer a missão evangelizadora e orientar os Grupos de Oração. Inspirados pela Palavra de Deus, somos chamados a crescer na fé e na experiência com o Espírito Santo.</p><p><br></p><p>É uma certeza de que, pelas nossas limitações humanas, não conseguimos realizar o que é próprio do Espírito. A esperança, aqui mencionada, está diretamente ligada às Virtudes Teologais (Fé, Esperança e Caridade). Portanto, não se trata de uma capacidade humana, mas de um dom que vem de Deus.</p><p><br></p><p>Para transbordar, é preciso estar cheio. Entretanto, em nossos dias, muitos sentimentos e experiências negativas acabam ocupando o coração: decepções, frustrações, insegurança, medo, raiva, mágoa. Isso limita a ação do Espírito Santo em nossas vidas e faz com que transbordemos de tudo, menos de esperança. Por isso, este é um tempo oportuno de reflexão: o que temos permitido entrar em nosso coração? De que temos nos abastecido espiritualmente? Quais virtudes temos buscado do Espírito? Quais dons pedimos? Como temos vivido os carismas em nossa vida e em nossa família?</p><p><br></p><p>A família é, sem dúvida, <em>“a esperança da Igreja e do mundo”</em> (Papa Francisco, 9º Encontro Mundial das Famílias). Ela precisa testemunhar à sociedade a sua essência como projeto idealizado por Deus. As novas gerações necessitam enxergar as famílias como um <em>“luzeiro de esperança”</em> que aponta para Cristo. Assim, poderão descobrir não apenas a beleza de ter uma família, mas também a graça de ser uma família segundo a vontade de Deus.</p><p><br></p><p>A esperança que vem do Espírito é sustentada pela fé e nos leva a confiar inteiramente em Cristo. Mesmo diante de crises, dificuldades do cotidiano ou desafios de relacionamento, a família continua sendo uma fonte inesgotável de esperança, porque nasce do projeto de Deus.</p><p><br></p><p>Nestes dias, a RCC Curitiba também convida todos os Grupos de Oração a refletirem, em suas reuniões, sobre os temas da Semana da Família. É um momento especial para que cada grupo, como Igreja em comunhão, fortaleça a vivência da fé e o testemunho da esperança nas famílias.</p><p><br></p><p><strong>Onde tem família, tem alegria.</strong></p>', '2025-08-13 11:42:00', 'MCS', 'publicado', 1, '[]', 'Notícia', '2025-08-13 11:42:00', '2025-08-30 11:42:00'),
(12, 'Adote um Metro Quadrado e ajude a construir o Centro de Eventos da RCCBRASIL', '/ImgNoticias/1755919246379-520554042.jpg', '<p>A Renovação Carismática Católica do Brasil lançou a campanha <strong>“Adote um Metro Quadrado – Juntos Propagando a Cultura de Pentecostes”</strong>, com o propósito de viabilizar a construção do <strong>sobre piso do Centro de Eventos da Sede Nacional</strong>.</p><p><br></p><p>A iniciativa representa um marco importante para oferecer condições estruturais adequadas e permitir a realização de encontros, ainda que de pequeno porte, enquanto a obra completa não é concluída.</p><p><br></p><p><a href=\"https://rccbrasil.org.br/metroquadrado/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: transparent; color: inherit;\">Clique aqui, Adote um Metro Quadrado e ajude na construção do Centro de Eventos da RCCBRASIL!</a></p><p><br></p><p>A decisão nasceu durante o <strong>Workshop para Coordenadores Diocesanos</strong>, realizado em janeiro de 2024. Na ocasião, após a entrega da <strong>Capela Nossa Senhora de Pentecostes</strong>, os coordenadores foram consultados sobre o próximo passo das obras.</p><p><br></p><p>De forma unânime, indicaram o contrapiso do Centro de Eventos como prioridade, revelando o desejo comum de avançar e oferecer melhores espaços para acolhida e realização de atividades da RCCBRASIL.</p><p><br></p><p>A campanha tem como foco <strong>a participação de pessoas físicas</strong>, indo além das coordenações diocesanas e dos servos de grupos de oração. Todo membro da família carismática, bem como simpatizantes do Movimento, é convidado a colaborar, adotando simbolicamente um metro quadrado da obra.</p><p><br></p><p>Mais do que valores, o diferencial desta ação está na <strong>participação individual</strong>.</p><p><br></p><p>Independentemente da quantidade de grupos de oração em cada estado, o chamado é para que cada pessoa se envolva. Assim, cria-se um movimento inclusivo e solidário, em que cada contribuição fortalece o espírito comunitário e missionário da RCCBRASIL.</p><p><br></p><p>A <strong>meta inicial</strong> é levantar os recursos necessários para o sobre piso, etapa essencial para tornar o Centro de Eventos mais funcional e aproximar a obra de sua finalização. Cada metro quadrado adotado é um passo concreto rumo à realização deste sonho coletivo.</p><p><br></p><p>As doações podem ser feitas pelos <strong>canais oficiais da RCCBRASIL</strong>. Participe desta missão e ajude a construir, tijolo por tijolo, um espaço que será instrumento de evangelização e propagação da Cultura de Pentecostes.</p>', '2025-08-21 02:17:00', 'MCS', 'publicado', 1, '[\"/ImgNoticias/1755919246387-685658573.png\",\"/ImgNoticias/1755919246394-436426195.png\",\"/ImgNoticias/1755919246403-312806316.jpg\",\"/ImgNoticias/1755919246415-798344964.png\",\"/ImgNoticias/1755919246428-574169762.jpg\"]', 'Notícia', '2025-08-21 02:17:00', '2025-09-30 02:17:00'),
(13, 'A RCCBRASIL tem um novo presidente para o triênio 2026-2028!', '/ImgNoticias/1758497685234-905102847.jpg', '<p>Neste final de semana, durante a Assembleia Extraordinária do Conselho Nacional da RCCBRASIL, sob a condução do Espírito Santo, foi eleito o novo presidente nacional da Renovação Carismática Católica do Brasil.</p><p>Com grande alegria, anunciamos que&nbsp;<span style=\"color: rgb(17, 24, 39);\">Klaus Newman</span>, da&nbsp;<span style=\"color: rgb(17, 24, 39);\">Diocese de Anápolis/GO</span>, assumirá a presidência do nosso Movimento para os próximos três anos. Este é um tempo de graça, esperança e renovação, no qual cremos que o Espírito Santo continuará a nos conduzir com poder e unção.</p><p>Convidamos toda a RCC a unir-se em oração por esta nova missão, para que nosso presidente seja sempre dócil às moções de Deus e possa levar o Movimento a novos horizontes de evangelização!</p><p>💬&nbsp;<span style=\"color: rgb(17, 24, 39);\">Deixe sua mensagem de boas-vindas nos comentários e reze pelo nosso novo presidente!</span></p>', '2025-09-21 20:34:45', 'MCS', 'publicado', 1, '[]', 'Notícia', '2025-09-21 20:34:00', '2025-10-31 20:34:00'),
(14, 'Projeto teste', '/ImgNoticias/1758498914060-282267874.png', '<p>Neste final de semana, durante a Assembleia Extraordinária do Conselho Nacional da RCCBRASIL, sob a condução do Espírito Santo, foi eleito o novo presidente nacional da Renovação Carismática Católica do Brasil.</p><p>Com grande alegria, anunciamos que&nbsp;<span style=\"color: rgb(17, 24, 39);\">Klaus Newman</span>, da&nbsp;<span style=\"color: rgb(17, 24, 39);\">Diocese de Anápolis/GO</span>, assumirá a presidência do nosso Movimento para os próximos três anos. Este é um tempo de graça, esperança e renovação, no qual cremos que o Espírito Santo continuará a nos conduzir com poder e unção.</p><p>Convidamos toda a RCC a unir-se em oração por esta nova missão, para que nosso presidente seja sempre dócil às moções de Deus e possa levar o Movimento a novos horizontes de evangelização!</p><p>💬&nbsp;<span style=\"color: rgb(17, 24, 39);\">Deixe sua mensagem de boas-vindas nos comentários e reze pelo nosso novo presidente!</span></p>', '2025-09-21 20:55:14', 'MCS', 'publicado', 1, '[]', 'Notícia', '2025-09-21 20:54:00', '2025-10-21 20:54:00'),
(15, 'Cenáculo com Maria', '/ImgNoticias/1761974670837-560217612.png', '<p>A Renovação Carismática Católica de Curitiba vive neste fim de semana mais uma edição do&nbsp;<span style=\"color: rgb(17, 24, 39);\">Cenáculo com Maria</span>, um dia especial de retiro, oração e consagração, em que os servos e fiéis são convidados a mergulhar no amor materno de Maria e a contemplar, junto com Ela, os mistérios da Paixão de Nosso Senhor Jesus Cristo.</p><p>Este encontro é um convite a deixar-se envolver pela ternura da Mãe, permitindo que o coração seja renovado pelo fogo do Espírito Santo. É tempo de silêncio, escuta, meditação e entrega — um verdadeiro retorno ao coração de Deus pelas mãos de Maria.</p><p>O Cenáculo começou em profunda oração e unidade!</p><p>Com o coração aberto, os participantes meditaram os Mistérios Gozosos do Santo Rosário, contemplando a alegria da Encarnação e o “sim” generoso de Maria, que trouxe ao mundo a Salvação.</p><p>“Com Maria, queremos aprender a dizer sim a Deus todos os dias.”</p><p>Que este Cenáculo seja um tempo de graça e avivamento, para que cada coração, moldado no amor da Mãe, volte ao mundo como instrumento de paz, fé e esperança.</p>', '2025-11-01 02:24:30', 'MCS', 'publicado', 1, '[]', 'Evento', '2025-11-01 02:23:00', '2025-11-30 02:23:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `page_likes`
--

CREATE TABLE `page_likes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `gabaon` int(11) DEFAULT 0,
  `home` int(11) DEFAULT 0,
  `mil_amigos` int(11) DEFAULT 0,
  `amo_rcc` int(11) DEFAULT 0,
  `mensagem_coordenacao` int(11) DEFAULT 0,
  `espiritualidade` int(11) DEFAULT 0,
  `canal_youtube` int(11) DEFAULT 0,
  `mapa_grupos` int(11) DEFAULT 0,
  `pedidos_oracao` int(11) DEFAULT 0,
  `noticia` int(11) DEFAULT 0,
  `publicacoes` int(11) DEFAULT 0,
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `page_likes`
--

INSERT INTO `page_likes` (`id`, `gabaon`, `home`, `mil_amigos`, `amo_rcc`, `mensagem_coordenacao`, `espiritualidade`, `canal_youtube`, `mapa_grupos`, `pedidos_oracao`, `noticia`, `publicacoes`, `updated_at`) VALUES
(1, 3, 0, 0, 0, 5, 17, 0, 0, 0, 10, 8, '2025-11-02 02:59:53');

-- --------------------------------------------------------

--
-- Estrutura para tabela `portal_metrics`
--

CREATE TABLE `portal_metrics` (
  `id` int(11) NOT NULL,
  `noticias` int(11) DEFAULT 0,
  `visualizacoes` int(11) DEFAULT 0,
  `curtidas` int(11) DEFAULT 0,
  `comentarios` int(11) DEFAULT 0,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `portal_metrics`
--

INSERT INTO `portal_metrics` (`id`, `noticias`, `visualizacoes`, `curtidas`, `comentarios`, `updated_at`) VALUES
(1, 2, 870, 27, 0, '2026-02-10 13:26:34');

-- --------------------------------------------------------

--
-- Estrutura para tabela `portal_rcccta_pedido_oracao`
--

CREATE TABLE `portal_rcccta_pedido_oracao` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `cidade` varchar(100) NOT NULL,
  `mensagem` text NOT NULL,
  `moderacao` enum('pendente','aprovado','rejeitado') DEFAULT 'pendente',
  `data_envio` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `portal_rcccta_pedido_oracao`
--

INSERT INTO `portal_rcccta_pedido_oracao` (`id`, `nome`, `email`, `cidade`, `mensagem`, `moderacao`, `data_envio`) VALUES
(1, 'José Aparecido', 'joseap990@gmail.com', 'Curitiba', 'Peço orações pela minha família.', 'aprovado', '2025-07-17 16:22:08'),
(2, 'Fátima Regina', 'fatreg12cv@gmail.com', 'Curitiba', 'Peço orações pelo meu casamento', 'aprovado', '2025-06-20 06:35:22'),
(3, 'Maria da Silva', 'mariasilva456@gmail.com', 'Curitiba', 'Oração pelo mundo e pelo Brasil', 'aprovado', '2025-06-20 08:07:40'),
(4, 'Carlos Antônio', 'carlosant65@gmail.com', 'Curitiba', 'Oração pela paz no mundo.', 'aprovado', '2025-06-20 08:46:50'),
(5, 'Marta Ferreira', 'martaferr34@gmail.com', 'Curitiba', 'Oração pelo que sofrem.', 'aprovado', '2025-06-20 09:04:58'),
(7, 'Luiz César Martins', 'lzcem80@gmail.com', 'Curitiba', 'Oração pela Igreja e pela Nação', 'aprovado', '2025-06-20 09:43:59'),
(9, 'Adailson Meira Martins', 'adailsonmartins13@hotmail.com', 'Curitiba', 'Vamos orar pela Igreja', 'aprovado', '2025-06-24 14:10:24'),
(14, 'LUIZ CESAR MARTINS', 'lzcem80@gmail.com', 'Curitiba', 'Enviar pedido de oração ', 'rejeitado', '2025-08-08 03:19:27'),
(15, 'Laudeci', 'Laudecikasprzak@yahoo.com.br', 'Curitiba', 'Nesta semana da família que possamos orar pedindo vocações santas.', 'aprovado', '2025-08-11 01:58:16'),
(16, 'Glauco Genaro Rafaeli e familia', 'Glaucogenarorafaeli@gmail.com', 'Campinas ', 'Glauco genaro rafaeli \n\nMarcos paulo rafaeli\n\nMaria aparecida palmieri \n\nProsperidade , saude , proteção , abundancia financeira , fartura , sorte , felicidades em todas as areas. Livramento de pessoas falsas e invejosas . Sucesso profissional e financeiro . Paz .\n\nBom dia coloque nas oraçoes por gentileza', 'aprovado', '2025-08-12 08:36:39'),
(17, 'Marcos paulo rafaeli e familia', 'Glaucogenarorafaeli@gmail.com', 'Jacutinga', 'Glauco genaro rafaeli \n\nMarcos paulo rafaeli\n\nMaria aparecida palmieri \n\nProsperidade , saude , proteção , abundancia financeira , fartura , sorte , felicidades em todas as areas. Livramento de pessoas falsas e invejosas . Sucesso profissional e financeiro . Paz .\n\nBom dia coloque nas oraçoes por gentileza', 'aprovado', '2025-08-12 08:36:49'),
(18, 'Maria aparecida palmieri e familia', 'Glaucogenarorafaeli@gmail.com', 'Jacutinga ', 'Glauco genaro rafaeli \n\nMarcos paulo rafaeli\n\nMaria aparecida palmieri \n\nProsperidade , saude , proteção , abundancia financeira , fartura , sorte , felicidades em todas as areas. Livramento de pessoas falsas e invejosas . Sucesso profissional e financeiro . Paz .\n\nBom dia coloque nas oraçoes por gentileza', 'rejeitado', '2025-08-12 08:37:00'),
(19, 'Iracema Hanesc', 'hanesc35@gmail.com', 'CURITIBA', 'Peco orações pela cura de meu sobrinho de 11 anos  Henrique Soares Lenart', 'aprovado', '2025-08-14 13:00:26'),
(20, 'Salete Dalazen dos Santos ', 'saleteddsantos@gmail.com', 'São Lourenço do oeste SC ', 'Peço oração pela Gestação  do bebê de meu neto Winícius e esposa Flávia. Gravidez muito complicada. Está com hérnia no pulmão. Estão indo a Curitiba fazer exames.Nós confiamos em Deus e também nas orações de vocês. Amém? ', 'aprovado', '2025-08-23 01:32:53');

-- --------------------------------------------------------

--
-- Estrutura para tabela `portal_views`
--

CREATE TABLE `portal_views` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `date` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `publicacoes_portalrcccta`
--

CREATE TABLE `publicacoes_portalrcccta` (
  `id` varchar(36) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `imagem` varchar(255) NOT NULL,
  `data_publicacao` datetime NOT NULL DEFAULT current_timestamp(),
  `autor` varchar(100) DEFAULT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `responsavel` varchar(100) DEFAULT NULL,
  `status` enum('excluida','rascunho','publicada') DEFAULT 'rascunho',
  `categoria` enum('Evento','Formação','Outras') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `publicacoes_portalrcccta`
--

INSERT INTO `publicacoes_portalrcccta` (`id`, `titulo`, `descricao`, `imagem`, `data_publicacao`, `autor`, `criado_em`, `atualizado_em`, `responsavel`, `status`, `categoria`) VALUES
('026d278e-4c0a-11f0-909c-0ccc47ec25c4', 'Fórum sobre Vida Fraterna', '<p>No úLtimo Dia 8 De Junho De 2025, A RenovaçãO CarismáTica CatóLica Da Arquidiocese De Curitiba Promoveu O Encontro De Pentecostes Na ParóQuia Santa Ana, No Bairro Tatuquara.</p><p><br></p><p>O Evento Reuniu Centenas De Servos Dos Grupos De OraçãO Da Arquidiocese Em Um Dia Marcado Por Intensa OraçãO, Unidade Fraterna E Poderosa ManifestaçãO Do EspíRito Santo. O Encontro, Tradicionalmente Celebrado Pela Rcc Em Todo O Mundo, Teve Como Centro A EfusãO Do EspíRito Santo, Renovando Em Cada Participante A GraçA De Pentecostes Vivida Pela Igreja Primitiva.</p><p>Com Momentos De Louvor, PregaçõEs Ungidas, IntercessãO, AdoraçãO Ao SantíSsimo Sacramento E A Santa Missa, Os FiéIs Experimentaram Um Profundo Avivamento Espiritual.</p>', '/imgPublicacao/1750226631830-306367691.jpeg', '2025-06-18 03:03:51', NULL, '2025-06-18 03:03:51', '2025-07-19 21:45:12', 'Luiz César', 'rascunho', 'Formação'),
('0664b270-4c06-11f0-909c-0ccc47ec25c4', 'Retiro de Avivamento', '<p>dvddvdv</p>', '/imgPublicacao/1750224920480-810517660.jpeg', '2025-06-18 02:35:20', NULL, '2025-06-18 02:35:20', '2025-07-19 21:45:39', 'Retiro RCC', 'rascunho', 'Evento'),
('07dbd306-4d4c-11f0-bff3-0ccc47ec25c4', 'Rede Nacional de Intercessão/Julho 2025', '<p class=\"ql-align-center\"><strong>A Palavra de Deus: força para nossa oração, motivo do nosso anúncio!&nbsp;</strong></p><p class=\"ql-align-center\"><br></p><p class=\"ql-align-right\"><em>“Lâmpada para meus passos é a tua palavra e luz no meu caminho”&nbsp;–&nbsp;Salmo 119, 105</em>&nbsp;</p><p class=\"ql-align-right\"><br></p><p>Amados intercessores do Brasil, neste ano de 2025 o Senhor tem movido o nosso coração intercessor a olharmos e voltarmos para algumas práticas que são inerentes ao nosso chamado, e que estão diretamente atrelados ao nosso entendimento e vivência da dimensão do serviço, da missão. Se retornarmos aos temas da Rede Nacional de Intercessão (RNI) trabalhados até aqui, perceberemos que estamos sendo reconduzidos a um caminho que tem o seu início, meio e fim na&nbsp;<strong>oração</strong>.</p><p><br></p><p>Em janeiro trabalhamos&nbsp;o tema:&nbsp;<em>Intercessor, vai e anuncia-lhes o que te ordeno</em>, seguindo-se o viés da oração de louvor, um louvor verdadeiro ao nosso Deus que é único, que está vivo e é Senhor.</p><p><br></p><p>No mês de março, fomos direcionados pelo Espírito a olharmos para o combate espiritual que começa dentro de nós, e que só depois de entendê-lo e vivenciá-lo, estaremos prontos para os combates espirituais extrínseco, com o tema:&nbsp;<em>O combate pessoal e a missão de anunciar: o primeiro adversário que enfrentamos somos nós mesmos!&nbsp;</em>Em maio foi a vez de reconhecermos que o nosso anúncio tem poder e nos dobramos diante da certeza de onde vem este poder, com o tema:<em>&nbsp;</em><strong><em>O poder da oração: a força do nosso anúncio!</em>&nbsp;</strong></p><p><br></p><p>Percebamos, queridos irmãos, que todos os textos anteriormente trabalhados na Rede Nacional de Intercessão (RNI) estão fundamentados na Palavra de Deus, que é o alicerce de nossas vidas.</p><p><br></p><p>Tudo que precisamos ser está inserido na Palavra, pois o próprio Deus se fez Palavra encarnada para, não somente tocar a nossa vida, mas também viver na nossa vida. Vejam que o nosso chamado a vida no Espírito começa com a orientação da Palavra sobre onde devemos estar:&nbsp;<em>E estando com eles, ordenou-lhes que não se afastassem de Jerusalém, mas que esperassem aí o cumprimento da promessa de seu Pai, que ouvistes, disse Ele, da minha boca- At 1, 4</em>. É o fato de não nos afastar do Cenáculo que mantém a nossa vida perto do fogo que aquece o coração, a nossa vida e a vida dos irmãos também. É aqui que tem início o nosso chamado a carismaticidade, ao envio, ao anúncio, pois quando permanecemos no Cenáculo, permanecemos no Espírito.&nbsp;</p><p><br></p><p>Quando entendemos que o Cenáculo é o lugar onde precisamos estar, perceberemos, assim, a necessidade de permanecer, e encontramos aí o sentido daquilo que precisamos ser, ramo ligado a videira, pois assim nos atesta a palavra<em>: Permanecei em mim e eu permanecerei em vós. O ramo não pode dar fruto por si mesmo, se não permanecer na videira.</em>&nbsp;Jo 15, 4.</p><p><br></p><p>O Evangelho de São João nos orienta a permanecermos no Senhor, porque é Nele que nós podemos dar frutos. Santa Teresinha do Menino Jesus também nos ensina sobre permanecer Nele, sobre ter dependência Dele, quando nos diz: “O que agrada a Deus em minha pequena alma, é que eu ame a minha pequenez e minha pobreza. É a esperança cega que tenho em sua misericórdia”, é sobre entender que, somente quando nos fazemos pequenos, podemos contemplar a Sua grandeza em plenitude, irmãos, isso é saber ser ramo, isso é estar ligado a videira.</p><p><br></p><p>Quantas vezes olhamos para nossa vida de servos, para a missão, e não temos conseguido ver os frutos? Cabe aqui uma reflexão acerca de onde nós temos permanecido, onde temos nos alicerçado, quem ou o que tem sido o centro, a videira da nossa vida. Quando conseguimos responder a esses questionamentos e, como única resposta encontramos o nome de Jesus, podemos ter a certeza de sermos vitoriosos, porque assim nos narra a Sua palavra, que não basta sermos vencedores, pois Ele nos faz mais que vencedores:&nbsp;<em>Mas, em todas essas coisas, somos mais que vencedores pela virtude daquele que nos amou. Rm 8, 37</em>&nbsp;</p><p><br></p><p>Todos esses versos da Palavra de Deus aqui apresentados, e tantos outros, nos levam a compreensão de que é na Sua Palavra que encontramos a luz para os nossos caminhos, a firmeza para dar passos, a coragem de seguir pelas estradas que Ele nos chamou, e a certeza de que podemos ir seguindo as pegadas Dele.&nbsp;Assim, somos impelidos a acreditar na Palavra de Deus, a proclamá-la sobre a nossa vida e a deixarmos que ela nos oriente os passos, o caminho e a direção que precisamos seguir.</p><p><br></p><p>Conforme podemos ver no Salmo 119, o salmista nos afirma:&nbsp;<strong><em>“Lâmpada para meus passos é a tua palavra e luz no meu caminho” – Salmo 119, 105.&nbsp;</em></strong>Ter a Palavra de Deus como lâmpada para os passos é saber que, com ela, nós não erramos os caminhos, porque ela acende a luz pelas estradas que passamos e que estão em trevas, nos proporcionando tomadas de decisões mais assertivas e uma visão espiritual ampliada, nos livrando das armadilhas e ciladas do inimigo.</p><p><br></p><p>Desta forma, somos chamados a caminhar na nossa vida pela luz da Palavra de Deus. E para que a leitura orante da Palavra seja eficaz em nossa vida, lembramos aqui dos quatro passos para uma boa Lectio Divina:&nbsp;</p><p><br></p><p><strong>1º LEITURA –&nbsp;</strong>O que o texto fala?&nbsp;</p><p><strong>2º MEDITAÇÃO-&nbsp;</strong>O que o texto fala para mim?&nbsp;</p><p><strong>3º ORAÇÃO-&nbsp;</strong>O que o texto me faz responder ao Senhor?&nbsp;</p><p><strong>4º CONTEMPLAÇÃO-&nbsp;</strong>Verso que ressoou forte no meu coração.&nbsp;</p><p><br></p><p>Ao realizarmos os passos da Lectio Divina, podemos constatar que a palavra vai se enraizando em nosso coração, vai tomando forma na nossa vida, vai se estabelecendo em nossa alma sendo geradora da vida de Cristo em nós, pois assim nos afirma&nbsp;a palavra:&nbsp;<em>No princípio era o Verbo, e o Verbo estava junto de Deus e o Verbo era Deus- Jo 1,1,&nbsp;</em>e em seguida<em>: </em></p><p><br></p><p><em>E o Verbo se fez carne e habitou entre nós- Jo1,14,&nbsp;</em>e Jesus se fez palavra encarnada. Assim, Jesus deseja fazer de cada um de nós sacrários vivos da Sua palavra, palavra viva, palavra que anda, que ama, que anuncia o amor e que vive para amar.</p><p><br></p><p>A medida que vamos crescendo na leitura orante da palavra, Jesus vai crescendo em nós, vai tomando mais espaço, vai ganhando mais força, e nós vamos nos alimentando mais da palavra, e vamos nos fortalecendo, estabelecendo na fé, na missão, no serviço, em Deus, e como intercessores que somos, vamos nos assemelhando cada dia mais a Jesus que é A Palavra, e a nossa oração começa a tomar a forma da oração Dele, a nossa vida começa a retornar a imagem e semelhança a qual fomos criados e o nosso ministério vai alcançando um nível mais alto, de quem nivela por cima, porque sabe que o andar de cima é o Céu.&nbsp;</p><p><br></p><p class=\"ql-align-right\"><strong>Equipe de Apoio</strong></p><p class=\"ql-align-right\"><strong>Ministério de Intercessão RCCBRASIL</strong></p><p class=\"ql-align-right\"><br></p><h4><strong>Intenções do mês de julho</strong></h4><ul><li>Pelos Encontros Nacionais dos Ministérios para Famílias, Crianças e Adolescentes e Fé e Política, que acontecerão de 25 a 27 de julho na Sede Nacional da RCCBRASIL, em Canas/SP;&nbsp;</li><li>Pela Assembleia Ordinária e Extraordinária do Conselho Nacional, que acontecerá de 20 a 23 de setembro, em Campinas/SP;&nbsp;</li><li>Pela peregrinação ao Retiro Nacional da RCCBRASIL, em Duquesne (EUA), que acontecerá de 23 de setembro a 2 de outubro.&nbsp;</li><li>Pela conclusão da construção da Sede Nacional da RCCBRASIL;&nbsp;</li><li>Oremos pedindo para que cesse a guerra entre a Rússia e a Ucrânia;&nbsp;</li><li>Oremos pedindo para que a paz de Deus reine no Oriente Médio e em todo o mundo.&nbsp;</li></ul><h4>Intenções permanentes</h4><ol><li>Pela Santa Igreja, pelo Santo Padre, o Papa Leão XIV, pelos Bispos, pelos Sacerdotes, Diáconos, Religiosos (as) e pelos Seminaristas;&nbsp;</li><li>Por todas as vocações, para que o chamado de Deus seja assumido com amor e fidelidade;&nbsp;</li><li>Pelos membros do Serviço Internacional para a Renovação Carismática Católica – CHARIS;&nbsp;</li><li>Pelos membros do Serviço Nacional de Comunhão do CHARIS;&nbsp;</li><li>Pelos membros do Conselho Católico Carismático Latino Americano – CONCCLAT;&nbsp;</li><li>Pelo Presidente do Conselho Nacional, Vinícius Simões e sua família, e todos os membros do Conselho Nacional;&nbsp;</li><li>Pelas reuniões dos Conselhos Estaduais e Diocesanos;&nbsp;</li><li>Por todos os Grupos de Oração do Brasil;&nbsp;</li><li>Por todos os Ministérios da RCC em nível nacional, estadual, diocesano e de Grupo de Oração;&nbsp;</li><li>Pelas necessidades espirituais e financeiras dos escritórios diocesanos, estaduais e nacional da RCC;&nbsp;</li><li>Pela construção da Sede Nacional da RCC do Brasil e pelos seus colaboradores;&nbsp;</li><li>Pelos eventos de evangelização da RCC no Brasil;&nbsp;&nbsp;</li><li>Pela situação política, econômica e moral em nosso País;&nbsp;</li><li>Para que cesse a violência no Brasil e no mundo;&nbsp;</li><li>Pela erradicação dos vírus causadores da Covid, Febre Amarela, Dengue, Zika e Chikungunya.&nbsp;</li></ol>', '/imgPublicacao/1755919190807-843688485.jpg', '2025-06-19 17:28:59', NULL, '2025-06-19 17:28:59', '2025-08-23 00:19:50', 'MCS', 'publicada', 'Formação'),
('4a4ea53e-4c07-11f0-909c-0ccc47ec25c4', 'Caminhada - Jubileu da Esperança', '<p>No último dia 8 de junho de 2025, a Renovação Carismática Católica da Arquidiocese de Curitiba promoveu o Encontro de Pentecostes na Paróquia Santa Ana, no bairro Tatuquara. O evento reuniu centenas de servos dos Grupos de Oração da arquidiocese em um dia marcado por intensa oração, unidade fraterna e poderosa manifestação do Espírito Santo. O encontro, tradicionalmente celebrado pela RCC em todo o mundo, teve como centro a efusão do Espírito Santo, renovando em cada participante a graça de Pentecostes vivida pela Igreja Primitiva. Com momentos de louvor, pregações ungidas, intercessão, adoração ao Santíssimo Sacramento e a Santa Missa, os fiéis experimentaram um profundo avivamento espiritual. Durante as pregações, foi destacada a importância de viver Pentecostes todos os dias, permitindo que o Espírito Santo conduza as ações e a missão evangelizadora de cada servo. A alegria, o fervor e a comunhão marcaram o dia, que também contou com a presença de lideranças arquidiocesanas, músicos e intercessores. O Encontro de Pentecostes reafirmou o compromisso da RCC Curitiba com a evangelização e com a formação de homens e mulheres cheios do Espírito, dispostos a levar Jesus a todos os lugares. Que os frutos deste dia se estendam por toda a Arquidiocese, renovando os Grupos de Oração e inflamando corações! Vinde, Espírito Santo!</p>', '/imgPublicacao/1750816306184-309239479.jpg', '2025-06-18 02:44:23', NULL, '2025-06-18 02:44:23', '2025-07-16 11:23:35', 'Luiz César', 'publicada', 'Evento'),
('d9bf5e5b-4d4b-11f0-bff3-0ccc47ec25c4', 'Retiro de Aprofundamento', '<p>Retiro de aprofundamento Arquidiocese de Curitiba RCCCTA</p>', '/imgPublicacao/1751061289316-728045123.jpg', '2025-06-19 17:27:41', NULL, '2025-06-19 17:27:41', '2025-08-14 09:36:09', 'Luiz César', 'rascunho', 'Formação'),
('cffae99f-56a8-11f0-8ede-cec193641bb8', 'Papa Leão XIV: Novo pontífice assume o trono de Pedro com espírito missionário e sinodal', '<p class=\"ql-align-justify\">Na tarde desta quinta-feira, 8 de maio de 2025, pouco depois das 18 horas no horário de Roma, aqui no Brasil pouco mais de 13 horas, a tão esperada fumaça branca surgiu da chaminé da Capela Sistina. Era o anúncio ao mundo que o sucessor de Pedro havia sido escolhido. O Conclave elegeu o cardeal norte-americano Robert Francis Prevost como o 267º Papa da Igreja Católica após quatro escrutínios. O novo Papa escolheu o nome&nbsp;<strong>Leão XIV</strong>, tornando-se o primeiro pontífice nascido nos Estados Unidos e o primeiro papa pertencente à Ordem Agostiniana.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Nascido em Chicago, Illinois, em 14 de setembro de 1955, o novo Papa tem uma bagagem espiritual fortalecida e estruturada tanto nas periferias do Peru quanto nos corredores do Vaticano. Assim, a eleição de Leão XIV representa a escolha de um líder de perfil pastoral, com uma trajetória missionária e aberto ao diálogo entre culturas.</p><p class=\"ql-align-justify\"><br></p><p><strong>Um Papa missionário e global</strong></p><p><br></p><p class=\"ql-align-justify\">Leão XIV ganhou muito destaque por sua atuação missionária no Peru, onde viveu por décadas e desempenhou múltiplas funções: pároco, professor, formador, vigário judicial e bispo da Diocese de Chiclayo. Essa experiência e vivência no Peru o aproximou da realidade dos povos latino-americanos moldando sua sensibilidade pastoral voltada aos pobres, migrantes e excluídos. Perfil este que está muito próximo dos ensinamentos de seu antecessor, Papa Francisco, a quem ele fez questão de agradecer em seu primeiro discurso.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Em um gesto inédito na história dos pronunciamentos papais, Leão XIV falou não apenas em italiano, como é tradição, mas também em espanhol, momento em que o Papa evidenciou a importância de uma Igreja&nbsp;<strong>“missionária e sinodal”</strong>, voltada ao encontro e ao diálogo.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">A escolha do nome Leão XIV foi muito celebrada e evidenciada. O último papa com esse nome foi&nbsp;<strong>Leão XIII (1878–1903)</strong>, reconhecido por lançar as bases da&nbsp;<strong>Doutrina Social da Igreja</strong>. Ao adotar esse nome, o novo pontífice pode estar expressando sua intenção de atualizar os pilares dessa doutrina, voltada à dignidade do trabalho e à justiça social, e de fortalecer a abertura à ação do Espírito Santo na vida da Igreja.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Leão XIII foi um grande incentivador da devoção ao Espírito Santo, atendendo aos apelos de Santa Elena Guerra, e escreveu a encíclica&nbsp;<em>Divinum Illud Munus</em>, a primeira dedicada exclusivamente à Terceira Pessoa da Santíssima Trindade. Em um gesto profético, na noite de 31 de dezembro de 1900, entoou o hino&nbsp;<em>Veni Creator Spiritus</em>&nbsp;e consagrou o século XX ao Espírito Santo. Esse ato é considerado um marco espiritual que antecedeu o surgimento da Renovação Carismática Católica no mundo, florescendo décadas depois como expressão viva da efusão do Espírito na Igreja.</p><p class=\"ql-align-justify\"><br></p><h4><strong>Um construtor de pontes</strong></h4><p><br></p><p class=\"ql-align-justify\">Robert Francis Prevost ingressou na Ordem de Santo Agostinho em 1977 e foi ordenado sacerdote em 1982. Sua formação inclui bacharelado em Ciências Matemáticas pela Universidade Villanova, mestrado em Teologia, e doutorado em Direito Canônico pelo Pontifício Colégio São Tomás de Aquino, em Roma.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Em sua trajetória, atuou como prior provincial da Ordem Agostiniana nos Estados Unidos e, em seguida, também foi eleito prior geral, cargo que ocupou por dois mandatos entre 2001 e 2013. Retornando ao Peru, foi nomeado administrador apostólico e posteriormente bispo de Chiclayo. Sua liderança junto à Conferência Episcopal Peruana, especialmente durante momentos críticos da política nacional, demonstrou sua capacidade de articulação e compromisso com a estabilidade e o bem comum.</p><p class=\"ql-align-justify\"><br></p><h4><strong>Ascensão ao Vaticano</strong></h4><p><br></p><p class=\"ql-align-justify\">Em janeiro de 2023, o Papa Francisco o nomeou prefeito do Dicastério para os Bispos, órgão responsável pela nomeação episcopal em todo o mundo, ou seja, um dos cargos mais estratégicos da Cúria Romana. Em setembro do mesmo ano, foi elevado ao cardinalato e assumiu a Igreja Titular de Albano. Até a morte de Francisco, Prevost foi membro de sete dicastérios e da Comissão para o Governatorato (Comissão para a Governança) do Estado da Cidade do Vaticano.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Reconhecido por sua humildade e simplicidade, Prevost chegou a afirmar, ainda como cardeal, que “o bispo não deveria ser um pequeno príncipe sentado em seu reino”, defendendo uma liderança eclesial próxima do povo, servidora e despojada.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Com um coração agostiniano, alma missionária e mente aberta ao diálogo, Papa Leão XIV assume o trono de Pedro com a missão de conduzir a barca da Igreja rumo às novas margens da história.</p>', '/imgPublicacao/1751394349226-248974530.jpg', '2025-07-01 15:25:49', NULL, '2025-07-01 15:25:49', '2025-08-15 14:21:21', 'Luiz César', 'publicada', 'Formação'),
('10125223-6412-11f0-8ede-cec193641bb8', 'RCC Curitiba abre inscrições para a Caravana rumo ao ENF 2026', '<p>A Renovação Carismática Católica de Curitiba já abriu as inscrições para a caravana que participará do <strong>ENF 2026 – Encontro Nacional de Formação</strong>, o maior evento de formação da RCC no Brasil.</p><p><br></p><p>O <strong>ENF 2026</strong> acontecerá nos dias <strong>21 a 25/01/2026</strong> na Canção Nova em <strong>Cacheira Paulista - SP.</strong></p><p><br></p><p>O ENF é um momento forte de unidade, escuta profética e direcionamento espiritual, onde são apresentados o <strong>tema anual</strong>, os <strong>itinerários de formação</strong> e as <strong>orientações pastorais</strong> que guiarão a caminhada da RCC em todo o país ao longo do ano.</p><p><br></p><p>A participação nesse encontro é uma grande oportunidade para todos os servos e lideranças das diversas expressões da Renovação se fortalecerem na missão e na espiritualidade carismática, além de vivenciar a comunhão com irmãos de todas as dioceses do Brasil.</p><p><br></p><p>👉 <strong>Garanta sua vaga na caravana da RCC Curitiba!</strong></p><p><br></p><p> Entre em contato com o <strong>Escritório Arquidiocesano</strong> pelo fone (41) 3222-9332 para mais informações, valores e orientações sobre hospedagem e transporte.</p><p>Vamos juntos viver esse tempo de graça e formação!</p><p><br></p><p> <strong>#ENF2026 #RCCCWB #UnidosNoEspírito</strong></p>', '/imgPublicacao/1752868918968-90844304.png', '2025-07-18 17:01:59', NULL, '2025-07-18 17:01:59', '2025-07-18 17:01:59', 'MCS', 'publicada', 'Evento'),
('2edd5fad-784f-11f0-8ede-cec193641bb8', 'Estão abertas as inscrições para a 3ª Conferência Nacional CHARIS-BRASIL', '<p><strong>Servos da RCC Curitiba, atenção a este convite especial!</strong></p><p>De <strong>7 a 9 de novembro de 2025</strong>, a cidade de <strong>Cachoeira Paulista (SP)</strong> será o cenário da <strong>3ª Conferência Nacional CHARIS-BRASIL</strong>, com o tema inspirador:</p><h3><br></h3><h3><strong>“Espírito Santo, nossa esperança!”</strong></h3><h3><br></h3><h3>O encontro, sediado na <strong>Comunidade Canção Nova </strong>(Cachoeira Paulista - SP), promete ser um tempo de <strong>profunda comunhão fraterna, formação sólida e escuta profética</strong>, conduzido pela ação viva do Espírito Santo.</h3><h3><br></h3><h3>Durante os três dias, viveremos <strong>momentos intensos de oração, pregação, partilha e celebração da fé</strong>, fortalecendo nosso <strong>espírito missionário</strong> e a <strong>unidade</strong> que nos identifica como Renovação Carismática Católica.</h3><h3><br></h3><h3>Entre os pregadores e convidados, estarão grandes líderes da Igreja no Brasil:</h3><h3><br></h3><h3><strong style=\"color: yellow;\">● </strong>Cardeal <strong>Dom Orani Tempesta</strong> – Arcebispo do Rio de Janeiro</h3><h3><strong style=\"color: yellow;\">● </strong><strong>Dom José Rui</strong> – Bispo da Diocese de Caruaru</h3><h3><strong style=\"color: yellow;\">● </strong><strong>Dom Mário Spaki</strong> – Bispo referencial do CHARIS-BRASIL</h3><h3><strong style=\"color: yellow;\">● </strong>Pe. <strong>Emanuel Maria</strong> – Instituto Hesed</h3><h3><strong style=\"color: yellow;\">● </strong>Pe. <strong>André Moraes</strong> – Comunidade Mar a Dentro</h3><h3><strong style=\"color: yellow;\">● </strong>Pe. <strong>Reginaldo Manzotti</strong></h3><h3><strong style=\"color: yellow;\">● </strong><strong>Reinaldo Bezerra</strong></h3><h3><br></h3><h3>Esta conferência será <strong>uma oportunidade única</strong> para <strong>renovar nossa experiência pessoal com Deus</strong>, receber <strong>formações que edificam</strong> e sermos <strong>inflamados para a missão</strong>, deixando-nos conduzir pelo Espírito Santo.</h3><h3><br></h3><h3><strong>📌 Inscrições já abertas – Lote 1 até 31 de agosto de 2025 ou enquanto houver vagas</strong></h3><h3>Inscrição CHARIS-BRASIL: <strong>R$ 35,00</strong></h3><h3>Inscrição + Doação R$ 10,00: <strong>R$ 45,00</strong></h3><h3>Inscrição + Doação R$ 20,00: <strong>R$ 55,00</strong></h3><h3>Inscrição + Doação R$ 50,00: <strong>R$ 85,00</strong></h3><h3><br></h3><h3>Servos da RCC Curitiba, <strong>não deixemos passar esta graça</strong>! Vamos juntos, como família carismática, viver este tempo de avivamento e unidade, proclamando que <strong>o Espírito Santo é a nossa esperança!</strong></h3><h3><br></h3><h3>Para garantir a participação, basta acessar o&nbsp;<a href=\"https://charisbrasil.org.br/evento/3-conferencia-nacional-charis-brasil\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(204, 51, 102); background-color: transparent;\">portal oficial do CHARIS-BRASIL</a>&nbsp;e realizar a inscrição.</h3>', '/imgPublicacao/1755919122573-618791544.png', '2025-08-13 11:09:53', NULL, '2025-08-13 11:09:53', '2025-08-23 00:18:42', 'MCS', 'publicada', 'Evento'),
('c12be0da-7dfd-11f0-8ede-cec193641bb8', 'CONGRESSO ESTADUAL DA RCC PARANÁ', '<p>A RCC Curitiba convida todos os servos e membros dos Grupos de Oração a participarem do <strong>Congresso Estadual da Renovação Carismática Católica do Paraná</strong>, que acontecerá pela primeira vez em Guarapuava, de <strong>29 a 31 de agosto de 2025</strong>, no Centro de Eventos Cidade dos Lagos.</p><p><br></p><p>Será um final de semana marcado por grandes momentos de oração, pregações inspiradas, Santa Missa e a alegria de viver a unidade com irmãos de todo o estado. Entre os destaques estão a presença de pregadores reconhecidos nacionalmente e o show com o cantor Eugênio Jorge no sábado à noite.</p><p><br></p><p>Para facilitar a participação da nossa Arquidiocese, teremos <strong>ônibus organizados em caravana da RCC Curitiba</strong>.</p><p><br></p><p>Todos os servos estão chamados a viver esta experiência de avivamento e graça!</p><p><br></p><p>As informações e inscrições para a caravana podem ser feitas diretamente no <strong>escritório arquidiocesano da RCC Curitiba</strong>.</p><p><br></p><p>Não fique de fora deste grande mover de Deus para o nosso estado – é tempo de responder com generosidade ao chamado do Espírito Santo!</p><p><br></p><h2><strong>Programação</strong></h2><p><br></p><p><strong>SEXTA-FEIRA | 29 DE AGOSTO</strong></p><ul><li>18:30 – Credenciamento e Acolhida</li><li>19:30 – Santa Missa</li><li>20:30 – Adoração ao Santíssimo Sacramento</li><li>21:30 – Encerramento</li></ul><p><br></p><p><strong>SÁBADO | 30 DE AGOSTO</strong></p><ul><li>06:30 – Credenciamento e Acolhida</li><li>07:30 – Santo Terço Mariano</li><li>08:00 – Animação e Oração</li><li>08:30 – Entrada de Nossa Senhora do Rocio e Acolhida das (Arqui)Dioceses</li><li>08:50 – Pregação 1 – Quem nos separará do amor de Cristo? (Rm 8,31-39)</li><li>09:50 – Comunicação de Palco</li><li>10:00 – Intervalo</li><li>10:30 – Animação e Oração</li><li>10:45 – Pregação 2 – Onde abundou o pecado, superabundou a graça (Rm 5,17-21)</li><li>11:30 – Momento de Oração com a Cruz</li><li>11:55 – Comunicação de Palco</li><li>12:00 – Almoço</li><li>13:20 – Retorno</li><li>13:30 – Projetos de Arrecadação</li><li>14:00 – Santa Missa</li><li>15:10 – Pregação 3 – Discerni qual é a vontade de Deus, o que é bom, o que lhe agrada e o que é perfeito (Rm 12,2b)</li><li>16:00 – Adoração ao Santíssimo Sacramento</li><li>16:30 – Intervalo</li><li>17:00 – Animação</li><li>17:15 – Pregação 4 – Pela virtude do Espírito Santo transbordareis de esperança (Rm 15,13b)</li><li>18:15 – Comunicação de Palco</li><li>18:20 – Jantar</li><li>19:40 – Apresentação de Teatro [Ministério de Música e Artes]</li><li>20:00 – Noite Carismática [Mensagem Brasil]</li><li>21:30 – Noite Carismática [Ministério Fogo do Alto]</li><li>23:00 – Encerramento</li></ul><p><br></p><p><strong>DOMINGO | 31 DE AGOSTO</strong></p><ul><li>07:00 – Credenciamento e Acolhida</li><li>70:30 – Terço ao Espírito Santo</li><li>08:00 – Animação e Oração</li><li>08:30 – Pregação 5 – Jesus disse ao discípulo: eis aí a tua mãe. E dessa hora em diante o discípulo a levou para sua casa. (Jo 19.27)</li><li>09:15 – Comunicação de Palco</li><li>09:20 – Intervalo</li><li>09:50 – Animação</li><li>10:00 – Momento de Oração por Cura e Libertação</li><li>11:10 – Intervalo</li><li>11:30 – Santa Missa</li><li>13:00 – Encerramento</li></ul>', '/imgPublicacao/1755919069418-688562007.png', '2025-08-20 16:42:06', NULL, '2025-08-20 16:42:06', '2025-10-28 00:07:33', 'MCS', 'publicada', 'Evento'),
('b647db81-9444-11f0-a55f-0ccc47ec25c4', 'Retiro para casais', '<p>Retiro para casais</p>', '/imgPublicacao/1758170232613-865271569.png', '2025-09-18 01:05:28', NULL, '2025-09-18 01:05:28', '2025-10-27 19:51:17', 'MCS', 'rascunho', 'Evento');

-- --------------------------------------------------------

--
-- Estrutura para tabela `user_likes`
--

CREATE TABLE `user_likes` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `user_likes`
--

INSERT INTO `user_likes` (`id`, `user_id`, `created_at`) VALUES
(7, '1b52225e-7812-4441-badd-0ab2c17e509a', '2025-07-01 21:47:30'),
(10, '6d0b3924-0ad6-4c8b-8cc4-6c80f665775c', '2025-07-02 03:48:22'),
(11, '140573f3-8c04-4f02-8b7a-903cf001d47e', '2025-07-02 04:39:01'),
(12, 'ed8c78fc-8324-4bde-8a52-bd572aef824c', '2025-07-02 14:38:32'),
(13, 'dd3b1e79-677b-4bd1-a719-796082284e98', '2025-07-03 00:04:47'),
(14, '8f9a2e6b-60a2-447d-ba91-61fee80fd9a2', '2025-07-09 20:43:47'),
(15, 'c74ceffe-b7e8-4dab-89ad-05c3f49829b5', '2025-07-14 05:01:05'),
(18, 'af25aedb-be07-47b7-8e41-65dc5ae7f712', '2025-07-20 20:12:54'),
(20, '68bd57f0-603f-40b2-8442-8bcbffe81890', '2025-07-20 20:41:08'),
(21, '28d4ae5f-ff1f-4025-93ee-faaeb7bba3bc', '2025-07-22 03:57:19'),
(22, '3001cda2-02e8-4f3b-8002-b8f019ef3ae3', '2025-07-23 14:30:40'),
(23, 'a02839e0-8155-4540-941a-ed8a9e08d6a8', '2025-07-24 14:18:28'),
(24, '8428acd5-5de6-4829-8c21-f91e797d002c', '2025-07-25 03:24:27'),
(26, '66ade49d-1049-4beb-bb35-c10ac3850da5', '2025-07-30 22:32:00'),
(27, '979ba7b8-6be0-47b4-9819-337c1910c2be', '2025-08-01 22:28:05'),
(29, 'f9175125-37ab-4851-8c41-81a19b6864e7', '2025-08-11 01:58:45'),
(30, '512f9610-2b58-46ed-bac3-1a7e6ce1ab7c', '2025-08-13 01:22:02'),
(31, '83e423f1-4cac-412a-a43c-c3ee363e2643', '2025-08-16 19:14:50'),
(32, '23c558e8-6d60-4dbd-af55-c618e0519716', '2025-08-17 11:29:37'),
(33, '11d55def-1c45-4da4-8294-5994d0d87bdc', '2025-08-18 05:38:37'),
(34, '843ec0ef-95f5-49d1-bd5c-dcc2542a23fb', '2025-08-18 06:39:03'),
(35, '6343f479-6597-40ec-b31a-6197dc85a62b', '2025-08-18 20:45:27'),
(36, 'd61d4f2b-a99c-4dbd-b9fc-72992207df01', '2025-08-18 21:11:31'),
(37, '4b8feb36-7a16-42d1-80d3-5c7067b46d73', '2025-08-18 21:11:36'),
(38, '6dfa2b93-219e-46e7-aa93-e89edc28bccf', '2025-08-20 13:21:21'),
(39, '3e65a96d-a3a8-4aa3-9959-a2aab4324094', '2025-08-22 05:55:49'),
(40, 'df175e45-7687-4b17-b56e-5001bccafc89', '2025-10-27 22:54:38');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios_portal`
--

CREATE TABLE `usuarios_portal` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `data_criacao` datetime DEFAULT current_timestamp(),
  `status` enum('ativo','inativo') DEFAULT 'ativo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios_portal`
--

INSERT INTO `usuarios_portal` (`id`, `nome`, `email`, `senha`, `data_criacao`, `status`) VALUES
(1, 'Admin', 'admin@rcccta.com', '$2b$10$zezxrTOrUwPC/QnT7d6EluMbd4UlHagJNDq8/ymwEQNMBu8dbjMI2', '2025-06-16 20:50:08', 'ativo');

-- --------------------------------------------------------

--
-- Estrutura para tabela `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `video_url` varchar(255) NOT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `upload_date` datetime DEFAULT current_timestamp(),
  `views` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `videos`
--

INSERT INTO `videos` (`id`, `title`, `description`, `video_url`, `thumbnail_url`, `upload_date`, `views`) VALUES
(5, 'Gerenciamento de Escolas de Ministérios', 'Neste vídeo, você vai aprender como utilizar a plataforma de cadastro para gerenciar as Escolas de Formação dos Ministérios. O passo a passo inclui como criar novas escolas, adicionar e editar alunos, definir datas de início e término da formação, concluir uma escola, registrar frequências e muito mais. Um guia completo para facilitar a organização e o acompanhamento das formações na sua diocese ou grupo de serviço. Assista e aproveite todos os recursos disponíveis!', '/videos/1754724165522-72797728.mp4', '/videos/1754724165512-381747872.png', '2025-08-09 04:22:57', 9);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `amo_rcc`
--
ALTER TABLE `amo_rcc`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `formacao_espiritual`
--
ALTER TABLE `formacao_espiritual`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_data_publicacao` (`data_publicacao`);

--
-- Índices de tabela `grupo_oracao`
--
ALTER TABLE `grupo_oracao`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `mensagens_coordenacao`
--
ALTER TABLE `mensagens_coordenacao`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `metrics_views`
--
ALTER TABLE `metrics_views`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_view` (`user_id`,`view_date`);

--
-- Índices de tabela `mil_amigos_home`
--
ALTER TABLE `mil_amigos_home`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `ministerio_coordenadores`
--
ALTER TABLE `ministerio_coordenadores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ministerio_id` (`ministerio_id`);

--
-- Índices de tabela `ministerio_detalhes`
--
ALTER TABLE `ministerio_detalhes`
  ADD PRIMARY KEY (`ministerio_id`);

--
-- Índices de tabela `ministerio_escolas_formacao`
--
ALTER TABLE `ministerio_escolas_formacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ministerio_escolas_formacao_ibfk_1` (`ministerio_id`);

--
-- Índices de tabela `noticias_portal`
--
ALTER TABLE `noticias_portal`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `page_likes`
--
ALTER TABLE `page_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Índices de tabela `portal_metrics`
--
ALTER TABLE `portal_metrics`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `portal_rcccta_pedido_oracao`
--
ALTER TABLE `portal_rcccta_pedido_oracao`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `portal_views`
--
ALTER TABLE `portal_views`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_view` (`user_id`);

--
-- Índices de tabela `user_likes`
--
ALTER TABLE `user_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user` (`user_id`);

--
-- Índices de tabela `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `amo_rcc`
--
ALTER TABLE `amo_rcc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de tabela `grupo_oracao`
--
ALTER TABLE `grupo_oracao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `mensagens_coordenacao`
--
ALTER TABLE `mensagens_coordenacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de tabela `metrics_views`
--
ALTER TABLE `metrics_views`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `mil_amigos_home`
--
ALTER TABLE `mil_amigos_home`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `ministerio_coordenadores`
--
ALTER TABLE `ministerio_coordenadores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de tabela `ministerio_escolas_formacao`
--
ALTER TABLE `ministerio_escolas_formacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT de tabela `noticias_portal`
--
ALTER TABLE `noticias_portal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de tabela `page_likes`
--
ALTER TABLE `page_likes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `portal_metrics`
--
ALTER TABLE `portal_metrics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `portal_rcccta_pedido_oracao`
--
ALTER TABLE `portal_rcccta_pedido_oracao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `portal_views`
--
ALTER TABLE `portal_views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `user_likes`
--
ALTER TABLE `user_likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de tabela `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `ministerio_coordenadores`
--
ALTER TABLE `ministerio_coordenadores`
  ADD CONSTRAINT `ministerio_coordenadores_ibfk_1` FOREIGN KEY (`ministerio_id`) REFERENCES `ministerio_detalhes` (`ministerio_id`);

--
-- Restrições para tabelas `ministerio_escolas_formacao`
--
ALTER TABLE `ministerio_escolas_formacao`
  ADD CONSTRAINT `ministerio_escolas_formacao_ibfk_1` FOREIGN KEY (`ministerio_id`) REFERENCES `ministerio_detalhes` (`ministerio_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
