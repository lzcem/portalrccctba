import { FaDove, FaPray, FaUsers } from "react-icons/fa"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Tema {
  titulo: string;
  icone: JSX.Element;
  resumo: string;
  conteudo: string;
  conteudoAprofundado: string;
  imagem: string;
  bgColor: string;
  textColor: string;
}




export const temas: Tema[] = [
  {
    titulo: "Batismo no Espírito Santo",
    icone: <FaDove className="text-yellow-700 text-5xl" />,
    resumo: "Uma experiência transformadora que renova a fé e capacita para a missão.",
    conteudo: `
      O <b>Batismo no Espírito Santo</b> é uma experiência transformadora que renova a graça dos sacramentos do batismo e da crisma. Não é um novo sacramento, mas uma efusão do Espírito que aprofunda a comunhão com Deus, reaviva o fervor missionário e capacita os fiéis com carismas para o serviço. Prometido no Antigo Testamento (cf. Joel 3), o derramamento do Espírito Santo sobre a Igreja primitiva aconteceu em Pentecostes (cf. Atos 2). A RCC acredita que o Espírito continua batizando aqueles que se abrem a essa graça.  

      Essa experiência é marcada por um encontro pessoal com o amor de Deus, recebido através da submissão ao senhorio de Jesus Cristo. Como relatado por uma participante do fim de semana de Duquesne: <i>“Não sei exatamente como aconteceu, mas durante aquele momento os meus sapatos se soltaram dos meus pés. Mais tarde, percebi que, assim como Moisés diante da sarça ardente, eu estava de fato em solo santo. Deitada ali, fui inundada, dos dedos das mãos aos dedos dos pés, com um profundo sentimento do amor pessoal de Deus por mim, do Seu amor misericordioso.”</i>  

      O Batismo no Espírito Santo equipa os fiéis com dons como oração em línguas (glossolália), coragem e discernimento, permitindo-lhes transformar a cultura ao seu redor, como os apóstolos fizeram após Pentecostes.
    `,
    conteudoAprofundado: `
   <h2>1. Origem e Significado do Batismo no Espírito Santo</h2>
      <p>O <strong>Batismo no Espírito Santo</strong> é um marco central na espiritualidade da Renovação Carismática Católica (RCC). Não se trata de um “novo sacramento”, mas de uma experiência de renovação pessoal e comunitária da fé cristã, muitas vezes chamada de <em>efusão do Espírito</em>. Esse encontro atualiza as graças do batismo e da crisma, fazendo com que o fiel viva de modo mais consciente, ardoroso e disponível à ação do Espírito Santo. É o início de um processo contínuo de transformação, que conduz à conversão, à santidade e ao engajamento missionário na Igreja.</p>

      <h3>1.1 Promessa Bíblica</h3>
      <p>A raiz do Batismo no Espírito Santo está nas promessas divinas reveladas nas Escrituras. O profeta Joel anuncia: “Derramarei o meu Espírito sobre toda carne” (Jl 3,1-2). Essa profecia se cumpre em <strong>Pentecostes</strong> (At 2), quando o Espírito desce sobre os apóstolos, concedendo-lhes coragem e dons extraordinários para a missão. A RCC entende que esta promessa não se limitou ao início da Igreja, mas permanece viva, sendo um verdadeiro <em>“novo Pentecostes”</em> disponível para cada geração de cristãos.</p>

      <h3>1.2 Experiência Pessoal</h3>
      <p>O Batismo no Espírito Santo geralmente é precedido por momentos de preparação espiritual, como o <strong>Seminário de Vida no Espírito</strong>, no qual os participantes recebem ensinamentos sobre a fé, vivem a oração comunitária e são convidados a entregar-se inteiramente a Cristo. Durante essa caminhada, muitos testemunham experiências de <em>cura interior</em>, perdão, libertação de vícios, renovação da fé e profunda alegria espiritual. Trata-se de um encontro existencial com o amor de Deus, que passa da teoria à experiência transformadora.</p>

      <h2>2. Impacto na Vida do Cristão</h2>
      <p>Do ponto de vista teológico, o Batismo no Espírito Santo não acrescenta algo novo aos sacramentos do batismo e da crisma, mas <strong>reativa e atualiza suas graças</strong>. Como ensina o <em>Catecismo da Igreja Católica</em> (CIC 1302-1303), o Espírito Santo fortalece os fiéis, concede dons para edificação da Igreja e os impulsiona para a missão. Assim, a experiência carismática não substitui a vida sacramental, mas a aprofunda e dinamiza, tornando-a mais frutuosa.</p>

      <h3>2.1 Carismas</h3>
      <p>Os <strong>dons carismáticos</strong> são manifestações visíveis da ação do Espírito Santo, dados para a edificação do Corpo de Cristo. Alguns deles são:</p>
      <ul>
        <li><strong>Profecia:</strong> Palavra de encorajamento, direção e discernimento dada por Deus para fortalecer a comunidade.</li>
        <li><strong>Cura:</strong> Graça especial para restaurar a saúde física, emocional e espiritual, sinalizando a compaixão divina.</li>
        <li><strong>Glossolália:</strong> O dom das línguas, usado tanto em oração pessoal como em intercessão e louvor, que expressa a total abertura do coração ao Espírito.</li>
      </ul>

      <h3>2.2 Missão Evangelizadora</h3>
      <p>Os carismas não são fins em si mesmos, mas instrumentos para a missão. Assim como os apóstolos, fortalecidos pelo Espírito em Pentecostes, anunciaram o Evangelho com ousadia, os membros da RCC são chamados a proclamar Cristo em todos os ambientes da sociedade. Esse impulso evangelizador é essencial para a identidade da RCC, que busca não apenas renovar a vida espiritual dos fiéis, mas também <strong>transformar a cultura</strong> com a força do Espírito, testemunhando uma fé viva, alegre e comprometida com a Igreja.</p>
    `,
    imagem: "/ImgFotos/batismoEspSanto.png",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800"
  },
  {
    titulo: "Prática dos Carismas",
    icone: <FaPray className="text-yellow-600 text-5xl" />,
    resumo: "Dons do Espírito Santo para edificação da Igreja e evangelização.",
    conteudo: `
      A <b>Prática dos Carismas</b> é uma característica central da Renovação Carismática Católica, que busca uma vivência intensa da fé através dos dons do Espírito Santo. Esses carismas, descritos por São Paulo (cf. 1 Cor 12), incluem profecia, línguas, cura, discernimento, sabedoria e conhecimento, entre outros. A RCC acredita que esses dons são atuais e essenciais para a missão evangelizadora.  

      Os fiéis são encorajados a buscar uma relação pessoal com o Espírito Santo, permitindo Sua ação em momentos de oração, louvor e adoração. A prática dos carismas fortalece a comunidade cristã, promovendo unidade, amor fraterno e renovação espiritual.
    `,
    conteudoAprofundado: `
   <h2>1. Natureza dos Carismas</h2>
    <p>
    A prática dos carismas é um pilar essencial da Renovação Carismática Católica (RCC), que reconhece os dons do Espírito Santo como instrumentos dados para a <em>edificação da Igreja</em> e para o <em>bem comum</em>. Como ensina São Paulo: 
    <strong>“Há diversidade de dons, mas o Espírito é o mesmo”</strong> (1Cor 12,4). 
    O Catecismo da Igreja Católica também ressalta que os carismas “são graças especiais do Espírito Santo, concedidas a cada fiel, segundo sua capacidade, para a utilidade da Igreja” (CIC 799-801).
    </p>

    <h3>1.1 Tipos de Carismas</h3>
    <ul>
      <li>
        <strong>Palavra de Sabedoria:</strong> Dom que ilumina situações complexas à luz do Espírito Santo, oferecendo direção espiritual e clareza no discernimento. O Catecismo afirma que estes dons servem “para renovar e santificar a Igreja” (CIC 799).
      </li>
      <li>
        <strong>Palavra de Ciência (Conhecimento):</strong> Capacidade de compreender realidades espirituais ou humanas ocultas, revelando a verdade de Deus. É frequentemente associada à cura interior e à pregação eficaz.
      </li>
      <li>
        <strong>Fé Carismática:</strong> Uma confiança sobrenatural que permite crer na ação imediata de Deus em situações específicas, além da fé comum do batizado (cf. CIC 2003).
      </li>
      <li>
        <strong>Dons de Cura:</strong> Graça para restaurar a saúde física, emocional ou espiritual, testemunhando a compaixão de Cristo, que continua a agir na Igreja (cf. CIC 1508).
      </li>
      <li>
        <strong>Operação de Milagres:</strong> Intervenções extraordinárias de Deus que ultrapassam as leis naturais, confirmando a pregação e fortalecendo a fé dos fiéis (cf. CIC 547-548).
      </li>
      <li>
        <strong>Profecia:</strong> Palavra inspirada pelo Espírito Santo para edificação, encorajamento e correção da comunidade (cf. 1Cor 14,3). O Catecismo reconhece os profetas como porta-vozes de Deus na história da salvação (CIC 64).
      </li>
      <li>
        <strong>Discernimento dos Espíritos:</strong> Capacidade de distinguir o que vem do Espírito de Deus, do espírito humano ou de forças contrárias. É essencial para proteger a comunidade contra erros e falsas inspirações (cf. 1Jo 4,1).
      </li>
      <li>
        <strong>Variedade de Línguas (Glossolália):</strong> Dom de orar ou louvar em línguas desconhecidas, que expressa uma entrega total a Deus e favorece a oração pessoal e comunitária (cf. 1Cor 14,2).
      </li>
      <li>
        <strong>Interpretação das Línguas:</strong> Complementa a glossolália, permitindo que a comunidade compreenda a mensagem espiritual transmitida, garantindo que o dom edifique a todos (cf. 1Cor 14,5).
      </li>
    </ul>

    <h3>1.2 Contexto de Uso</h3>
    <p>
    Na RCC, os carismas são vivenciados principalmente nos <strong>grupos de oração</strong>, espaços de louvor, partilha e escuta do Espírito Santo. São Paulo exorta: <em>“Aspirai aos dons espirituais, principalmente o de profetizar”</em> (1Cor 14,1). 
    O Catecismo orienta que os carismas devem ser acolhidos com gratidão, mas sempre discernidos pela Igreja, pois “o seu exercício está subordinado à caridade e ao juízo dos pastores” (CIC 801).
    </p>

    <h2>2. Formação e Exercício</h2>
    <p>
    A vivência dos carismas requer formação, humildade e discernimento. A RCC promove retiros e encontros, como o <em>Seminário de Vida no Espírito</em>, para ajudar os fiéis a reconhecer e exercitar esses dons de forma responsável. 
    Os carismas não pertencem a indivíduos isolados, mas são dados para o serviço da comunidade e da missão da Igreja.
    </p>

    <h3>2.1 Ministério de Cura</h3>
    <p>
    Um exemplo concreto é o <strong>ministério de cura</strong>, onde intercessores oram pela restauração dos irmãos, confiando na promessa de Jesus: 
    <em>“Imporão as mãos sobre os enfermos, e eles ficarão curados”</em> (Mc 16,18). 
    O Catecismo lembra que, embora nem todos sejam curados fisicamente, toda oração feita em fé comunica a presença redentora de Cristo (CIC 1509).
    </p>

    <h3>2.2 Impacto Missionário</h3>
    <p>
    Os carismas não são um fim em si mesmos, mas instrumentos para a <strong>missão evangelizadora</strong>. 
    Assim como os apóstolos, após Pentecostes, saíram cheios de coragem para anunciar o Evangelho, também hoje os carismas capacitam os fiéis a testemunharem Cristo no mundo. 
    São João Paulo II afirmou que a RCC é “uma chance para a Igreja e para o mundo” porque reaviva a consciência da ação atual do Espírito Santo. 
    </p>

    `,
    imagem: "/ImgFotos/carismas.png",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-800"
  },
  {
    titulo: "Comunhão Fraterna",
    icone: <FaUsers className="text-blue-500 text-5xl" />,
    resumo: "Viver como família espiritual, refletindo o amor de Deus.",
    conteudo: `
      A <b>Comunhão Fraterna</b> é um pilar essencial da Renovação Carismática Católica, que valoriza o amor fraterno como reflexo do amor trinitário de Deus. Os membros da RCC são chamados a viver como uma família espiritual, cultivando respeito, acolhida, partilha e solidariedade. Inspirada nas primeiras comunidades cristãs (cf. Atos 2, 42-47), essa comunhão é vivida em grupos de oração, retiros e encontros.
    `,
    conteudoAprofundado: `
    <h2>1. Fundamento da Comunhão Fraterna</h2>
    <p>
    A Comunhão Fraterna é um dos pilares da vida cristã, expressando o chamado de Jesus para que seus discípulos vivam em unidade: 
    <i>“Que todos sejam um, como Tu, Pai, estás em mim e eu em Ti”</i> (Jo 17,21). 
    Na Renovação Carismática Católica (RCC), essa dimensão da fé é vivida de maneira intensa, inspirada nas primeiras comunidades cristãs descritas em Atos 2,42-47, 
    onde os fiéis perseveravam <i>“na doutrina dos apóstolos, na comunhão, no partir do pão e nas orações”</i>. 
    Assim, a fraternidade não é apenas uma dimensão humana de amizade, mas um reflexo do amor trinitário, no qual o Espírito Santo une os corações em Cristo.
    </p>

    <h3>1.1 Espiritualidade Comunitária</h3>
    <p>
    A vida comunitária na RCC se manifesta especialmente nos <b>grupos de oração</b>, considerados o coração do movimento. 
    Nesses encontros semanais, os membros se reúnem para louvar, ouvir a Palavra de Deus, interceder uns pelos outros e partilhar suas experiências de fé. 
    O Catecismo da Igreja Católica ensina que a vida cristã não pode ser vivida isoladamente, pois <i>“o amor do próximo é inseparável do amor a Deus”</i> (CIC 1878). 
    A comunhão fraterna, portanto, é expressão concreta da vida no Espírito, fortalecendo os vínculos de unidade e promovendo a santificação dos fiéis.
    </p>

    <h3>1.2 Atos de Partilha</h3>
    <p>
    A fraternidade se concretiza também em <b>gestos de caridade e solidariedade</b>. 
    Tal como nas comunidades apostólicas, onde <i>“ninguém passava necessidade”</i> (At 4,34), a RCC busca acolher novos membros, apoiar os necessitados e sustentar obras evangelizadoras. 
    O Catecismo lembra que <i>“tudo o que temos e possuímos é de algum modo comum, porque deve aproveitar a todos”</i> (CIC 952). 
    Assim, a partilha fraterna vai além de uma ajuda material: é sinal da comunhão espiritual que une os cristãos como um só corpo (1Cor 12,12-27).
    </p>

    <h2>2. Impacto na Missão</h2>
    <p>
    A comunhão fraterna tem também uma dimensão missionária. 
    Não se trata apenas de cuidar internamente dos membros do grupo, mas de ser um <b>sinal de unidade e reconciliação</b> para o mundo. 
    O Documento de Aparecida recorda que a comunidade cristã deve ser <i>“casa e escola de comunhão”</i> (DAp 170), formando discípulos missionários que testemunham o amor de Cristo. 
    Na RCC, a vida fraterna cria um ambiente onde o Espírito Santo pode agir, curando feridas, reconciliando corações e inspirando o ardor missionário.
    </p>

    <h3>2.1 Eventos de Unidade</h3>
    <p>
    Os grandes eventos da RCC, como <b>retiros, encontros regionais, congressos e confraternizações</b>, são expressões visíveis da comunhão fraterna. 
    Neles, os participantes experimentam o senso de pertença a uma família espiritual maior, que se estende além das fronteiras geográficas e culturais. 
    Esses momentos reforçam a unidade do movimento e confirmam o que o Concílio Vaticano II declarou: 
    <i>“Deus não quis salvar os homens isoladamente, mas constituí-los em um povo que O confessasse em verdade e O servisse em santidade”</i> (LG 9).
    </p>

    <h3>2.2 Testemunho Vivo</h3>
    <p>
    A comunhão fraterna é em si mesma um testemunho evangelizador. 
    Jesus afirmou: <i>“Nisto todos conhecerão que sois meus discípulos, se vos amardes uns aos outros”</i> (Jo 13,35). 
    Quando a RCC vive relações de perdão, acolhida e unidade, ela manifesta ao mundo a presença do Reino de Deus. 
    Esse testemunho concreto tem poder de atrair pessoas para Cristo, pois revela uma comunidade onde o amor é mais forte que as divisões. 
    Assim, a comunhão fraterna não é apenas um valor interno da RCC, mas um chamado a <b>transformar o mundo</b> pela vivência do amor evangélico.
    </p>
    `,
    imagem: "/ImgFotos/ComunhaoFraterna.png",
    bgColor: "bg-gray-100",
    textColor: "text-gray-800"
  }
];