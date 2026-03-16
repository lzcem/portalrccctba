import { FaSitemap, FaUsers, FaPray } from "react-icons/fa";
import { Tema } from "./identidadeData";

export const organizacaoTemas: Tema[] = [
  {
    titulo: "Estrutura Nacional da RCC",
    icone: <FaSitemap className="text-red-600 text-5xl" />,
    resumo: "O Conselho Nacional e o Escritório Nacional coordenam a RCC em nível nacional.",
    conteudo: `
      A <b>Estrutura Nacional da RCC</b> é composta por órgãos que garantem a coordenação e administração do Movimento em todo o Brasil. O <b>Conselho Nacional</b> traça diretrizes e promove unidade. O <b>Escritório Nacional</b> gerencia recursos e organiza eventos.
    `,
    conteudoAprofundado: `
        <h3>1. Organização Nacional</h3>
        <p>
        A <b>Estrutura Nacional da RCC</b> no Brasil é o alicerce que sustenta a missão da Renovação Carismática Católica em todo o território nacional, garantindo unidade, coesão e eficácia na ação pastoral. Por meio dessa organização, a RCC consegue articular suas atividades, promover a formação contínua dos fiéis e manter uma comunicação sólida entre os diversos estados e grupos de oração. Essa estrutura reflete a visão de Igreja como comunhão e corresponsabilidade, em sintonia com os princípios do Concílio Vaticano II (LG 9; CIC 871–873).
        </p>

        <h4>1.1 Conselho Nacional</h4>
        <p>
        O <b>Conselho Nacional</b> é composto por presidentes estaduais, coordenadores de ministérios e representantes de comissões específicas. Este colegiado tem a responsabilidade de definir diretrizes, normatizar procedimentos, zelar pela fidelidade doutrinal e representar a RCC junto à Conferência Nacional dos Bispos do Brasil (CNBB) e demais instâncias eclesiais. Além disso, o Conselho promove o discernimento coletivo, garantindo que as decisões respeitem a diversidade dos estados e ministérios, mas mantendo a unidade espiritual e organizativa necessária para a missão.
        </p>

        <h4>1.2 Escritório Nacional</h4>
        <p>
        Sediado em Canas/SP, o <b>Escritório Nacional</b> é o centro administrativo da RCC, responsável pelo gerenciamento de recursos, organização de eventos nacionais como o <i>Congresso Nacional da RCC</i>, produção e distribuição de materiais formativos, e suporte logístico aos estados e grupos de oração. Ele atua como elo de comunicação entre as diversas instâncias, garantindo eficiência, transparência e alinhamento com as diretrizes do Conselho Nacional. Além disso, o Escritório Nacional acompanha projetos pastorais e missões especiais, promovendo a evangelização de forma estratégica e coordenada.
        </p>

        <h3>2. Gestão e Impacto</h3>
        <p>
        A estrutura nacional da RCC possibilita a articulação de milhares de grupos de oração em todo o país, promovendo formação espiritual, capacitação de líderes e evangelização em múltiplos níveis. Essa organização garante que cada ação, evento ou iniciativa esteja integrada a uma visão missionária comum, potencializando o impacto da Renovação Carismática na Igreja e na sociedade. Assim, a RCC consegue manter sua identidade carismática, em comunhão com a hierarquia eclesial, ao mesmo tempo em que expande sua presença pastoral de forma ordenada e eficaz.
        </p>

        <h4>2.1 Conselho Fiscal</h4>
        <p>
        O <b>Conselho Fiscal</b> é essencial para a credibilidade e sustentabilidade da RCC, assegurando transparência e boa gestão dos recursos financeiros. Ele supervisiona orçamentos, aprova relatórios contábeis e garante que as receitas e despesas estejam alinhadas com os objetivos eclesiais e pastorais da RCC. Essa responsabilidade fortalece a confiança dos membros e colaboradores, criando um ambiente propício para a evangelização e para o desenvolvimento de projetos de alcance nacional.
        </p>

        <h4>2.2 Ministérios Nacionais</h4>
        <p>
        Os <b>Ministérios Nacionais</b> coordenam atividades específicas dentro da RCC, como música, intercessão, juventude, família e formação espiritual. Cada ministério atua de forma integrada, fortalecendo a missão da RCC e capacitando líderes locais, enquanto promove a edificação espiritual dos fiéis. Por meio desses ministérios, a RCC mantém uma atuação diversificada e eficiente, garantindo que a espiritualidade carismática se traduza em frutos concretos de evangelização, comunhão e transformação social.
        </p>

    `,
    imagem: "/ImgFotos/estruturaNacional.png",
    bgColor: "bg-red-100",
    textColor: "text-red-800"
  },
  {
    titulo: "Estrutura Estadual e Diocesana",
    icone: <FaUsers className="text-red-600 text-5xl" />,
    resumo: "Conselhos Estaduais e Diocesanos conectam a RCC nacional às comunidades locais.",
    conteudo: `
      Os <b>Conselhos Estaduais</b> levam as diretrizes nacionais às dioceses, enquanto os <b>Conselhos Diocesanos</b> apoiam diretamente os Grupos de Oração, organizando eventos e formações.
    `,
    conteudoAprofundado: `
        <h3>1. Articulação Regional</h3>
        <p>
        A <b>Estrutura Estadual e Diocesana</b> é o elo vital que conecta a RCC nacional às realidades locais, assegurando que a espiritualidade carismática se torne relevante e contextualizada em cada região. Por meio dessa organização, a RCC consegue respeitar as especificidades culturais, sociais e pastorais de cada estado e diocese, garantindo que as diretrizes nacionais sejam implementadas de forma eficaz e adaptada às necessidades locais. Essa articulação fortalece a identidade carismática e a unidade da Igreja, permitindo que o Espírito Santo atue de forma frutífera em todas as instâncias.
        </p>

        <h4>1.1 Conselhos Estaduais</h4>
        <p>
        Os <b>Conselhos Estaduais</b> coordenam as atividades regionais, traduzindo as diretrizes nacionais para a realidade de cada estado. Eles supervisionam a organização de eventos, a formação de líderes e a integração dos grupos de oração, garantindo que os objetivos da RCC sejam alcançados sem perder a sensibilidade local. Essa atuação permite que a Renovação Carismática Católica se mantenha dinâmica e relevante, respondendo com criatividade e fidelidade às demandas pastorais de cada comunidade.
        </p>

        <h4>1.2 Conselhos Diocesanos</h4>
        <p>
        Os <b>Conselhos Diocesanos</b> trabalham em estreita parceria com bispos e párocos, assegurando que a ação carismática esteja plenamente integrada à pastoral diocesana. Eles organizam eventos significativos, como o <i>Rebanhão</i>, encontros de formação e retiros espirituais, promovendo a vivência intensa da fé e a experiência transformadora do Espírito Santo. Essa colaboração garante que a RCC não atue de forma isolada, mas em comunhão com a hierarquia eclesial, fortalecendo a unidade e a missão evangelizadora.
        </p>

        <h3>2. Impacto Local</h3>
        <p>
        A atuação dos conselhos estaduais e diocesanos reforça a espiritualidade carismática nas paróquias e comunidades locais, promovendo a vivência da fé em comunhão e a experiência dos dons do Espírito Santo. Essa presença estruturada permite que a RCC contribua para a renovação espiritual e pastoral da Igreja local, tornando-se um instrumento de unidade, alegria e evangelização efetiva.
        </p>

        <h4>2.1 Formação de Líderes</h4>
        <p>
        A formação de líderes é um dos pilares da atuação regional. Por meio de cursos, retiros e seminários, os conselhos capacitam membros para o serviço, a evangelização e a coordenação de grupos de oração, preparando-os para liderar com discernimento, fidelidade e espírito de serviço. Essa capacitação garante que a ação da RCC seja sustentável e que cada líder possa exercer seu ministério com responsabilidade e zelo pastoral.
        </p>

        <h4>2.2 Eventos Diocesanos</h4>
        <p>
        Iniciativas como o <i>Cenáculo com Maria</i> e outros encontros diocesanos atraem milhares de participantes, revitalizando a Igreja local e promovendo uma vivência intensa da fé. Esses eventos criam oportunidades para experiências profundas de oração, cura, louvor e testemunho, fortalecendo a comunhão fraterna e o compromisso missionário dos fiéis. Além disso, eles funcionam como instrumentos de evangelização, atraindo novos membros e formando uma cultura de Pentecostes nas paróquias e comunidades.
        </p>

    `,
    imagem: "/ImgFotos/estruturaEstadualDiocesana.png",
    bgColor: "bg-red-100",
    textColor: "text-red-800"
  },
  {
    titulo: "Grupos de Oração",
    icone: <FaPray className="text-red-600 text-5xl" />,
    resumo: "A célula fundamental da RCC, onde se vive a espiritualidade carismática.",
    conteudo: `
      Os <b>Grupos de Oração</b> são a célula fundamental da RCC, onde os fiéis se reúnem para orar, louvar e viver a espiritualidade carismática, coordenados por um Núcleo e apoiados por Ministérios.
    `,
    conteudoAprofundado: `
    <h3>1. Essência dos Grupos de Oração</h3>
    <p>
    Os <b>Grupos de Oração</b> constituem o coração da Renovação Carismática Católica, sendo espaços privilegiados onde a espiritualidade carismática é vivida em comunidade, em unidade com a Igreja e em sintonia com a ação do Espírito Santo. Nesses grupos, os fiéis experimentam a profundidade da vida cristã, desenvolvem sua intimidade com Deus e recebem formação para viver os dons do Espírito no cotidiano (CIC 798–801; 1302–1303). Eles funcionam como microcomunidades missionárias, fortalecendo o laço fraterno entre os membros e promovendo a edificação espiritual coletiva.
    </p>

    <h4>1.1 Estrutura</h4>
    <p>
    Cada grupo é coordenado por um <b>Núcleo</b>, responsável pela organização das atividades, acolhida dos participantes e supervisão do funcionamento do grupo. Além do Núcleo, existem Ministérios específicos, como música, intercessão, ensino e pregação, que colaboram para uma experiência carismática rica e diversificada. Essa estrutura permite que cada encontro seja uma oportunidade de crescimento espiritual, formação de líderes e aprofundamento na fé, refletindo a vivência das primeiras comunidades cristãs descritas em Atos 2,42-47.
    </p>

    <h4>1.2 Atividades</h4>
    <p>
    Os encontros semanais dos grupos de oração incluem momentos de louvor espontâneo, oração carismática, intercessão, partilha da Palavra e ensino doutrinal. Essas práticas não apenas promovem o crescimento espiritual pessoal, mas fortalecem a comunhão fraterna e a unidade da comunidade. Inspirados pelo modelo das primeiras comunidades, os participantes aprendem a viver a fé em ação, cultivando santidade, serviço e compromisso missionário.
    </p>

    <h3>2. Missão e Impacto</h3>
    <p>
    Os grupos de oração são verdadeiras "escolas de santidade", formando discípulos comprometidos com a renovação espiritual e a missão evangelizadora. Eles proporcionam um ambiente onde os fiéis são continuamente nutridos pelo Espírito Santo, desenvolvendo carismas, discernimento espiritual e coragem para testemunhar a fé em seus contextos familiares, paroquiais e sociais.
    </p>

    <h4>2.1 Seminários de Vida</h4>
    <p>
    Os <i>Seminários de Vida no Espírito</i> são instrumentos essenciais para preparar novos membros para a experiência do Batismo no Espírito Santo. Durante esses seminários, os participantes recebem ensinamentos, momentos de oração intensa, louvor e exercícios de entrega pessoal a Deus, permitindo que o Espírito Santo atue de forma profunda e transformadora em suas vidas. Essa preparação fortalece a experiência comunitária nos grupos de oração e promove frutos duradouros de fé e missão.
    </p>

    <h4>2.2 Atração de Jovens</h4>
    <p>
    Eventos como o <i>Rebanhão</i> desempenham papel estratégico na revitalização das paróquias, atraindo jovens e famílias para a experiência carismática. Esses encontros combinam louvor, adoração, pregação e momentos de formação espiritual, despertando entusiasmo, renovação e engajamento na vida da Igreja. A presença de jovens fortalece a dinâmica missionária e garante a continuidade da Renovação Carismática nas futuras gerações.
    </p>

    `,
    imagem: "/ImgFotos/gruposOracao.png",
    bgColor: "bg-red-100",
    textColor: "text-red-800"
  }
];