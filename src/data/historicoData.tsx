import { FaHistory, FaExpand, FaStar } from "react-icons/fa";
import { Tema } from "./identidadeData";

export const historicoTemas: Tema[] = [
  {
    titulo: "Introdução",
    icone: <FaHistory className="text-green-600 text-5xl" />,
    resumo: "Contexto histórico da Renovação Carismática e sua relação com o Concílio Vaticano II.",
    conteudo: `
      A Igreja tem presenciado “despertares” e movimentos de renovação. O Concílio Vaticano II (1962-1965) marcou a Igreja como um <i>“verdadeiro Pentecostes”</i>, destacando sua natureza carismática (<i>Lumen Gentium</i>).
    `,
    conteudoAprofundado: `
      <h2>1. Contexto Histórico</h2>
      <p>A Renovação Carismática Católica (RCC) emerge como fruto de um amplo processo de renovação espiritual vivido ao longo do século XX. Um marco importante foi a encíclica <em>Divinum Illud Munus</em> (1897), do Papa Leão XIII, dedicada ao Espírito Santo, encorajando a Igreja a redescobrir a ação do Paráclito e a rezar pela sua efusão.</p>
      
      <p><strong>Nota histórica:</strong> Em 1º de janeiro de 1901, Leão XIII invocou solenemente o Espírito Santo sobre o novo século — gesto frequentemente lembrado como sinal precursor da efusão que marcaria a RCC décadas depois.</p>
      <p>Esses sinais preparatórios apontam para uma continuidade entre o despertar pneumatológico do fim do século XIX e as experiências de efusão que ganharam força a partir de 1967.</p>
      
      <h3>1.1 Influência do Concílio</h3>
      <p>O <strong>Concílio Vaticano II (1962–1965)</strong>, convocado por São João XXIII, foi apresentado como um “<em>novo Pentecostes</em>”. Seu impulso missionário e dialogal (cf. <em>Ad Gentes</em>; <em>Gaudium et Spes</em>) abriu espaço para formas renovadas de vida cristã. A RCC, surgida em 1967, é amplamente compreendida como uma expressão concreta desse aggiornamento conciliar.</p>
      <p>“Abrir as janelas da Igreja para que entre ar novo” — a imagem de João XXIII sintetiza o clima espiritual que favoreceu a acolhida dos carismas.</p>
      
      <h3>1.2 Natureza Carismática</h3>
      <p>A constituição <em>Lumen Gentium</em> destaca que o Espírito Santo conduz a Igreja por meio de <strong>dons hierárquicos</strong> e <strong>dons carismáticos</strong> (cf. LG 4). Os carismas — como profecia, cura, línguas e discernimento — são graças livres concedidas para edificação do Corpo de Cristo, não restritas aos tempos apostólicos.</p>
      <ul>
        <li><strong>Dons hierárquicos:</strong> vinculados ao ministério ordenado e à estrutura de serviço.</li>
        <li><strong>Dons carismáticos:</strong> graças distribuídas livremente para o bem comum (cf. 1Cor 12).</li>
      </ul>
      <p>Desse modo, a RCC valoriza e atualiza a dimensão carismática permanente da Igreja.</p>
      
      <h2>2. Preparação para a RCC</h2>
      <p>O Vaticano II criou um <strong>ambiente teológico e pastoral</strong> propício à renovação espiritual. Quando, em 1967, estudantes e professores católicos (Universidade de Duquesne, EUA) experimentaram a “efusão do Espírito Santo”, sua vivência encontrou na eclesiologia conciliar a moldura para florescer e se difundir de modo eclesial.</p>
      <p>Assim, a RCC aparece como resposta a um <em>itinerário providencial</em> de décadas, no qual Deus semeou sinais de renovação que amadureceram no tempo oportuno.</p>
      
      <h3>2.1 Movimentos Prévios</h3>
      <ul>
        <li><strong>Movimento Litúrgico:</strong> incentivou participação ativa e consciente na liturgia, culminando na <em>Sacrosanctum Concilium</em> e em uma espiritualidade mais comunitária e celebrativa.</li>
        <li><strong>Movimento Bíblico:</strong> promoveu o acesso direto à Sagrada Escritura, fomentando grupos de estudo e oração, pilar da vida carismática.</li>
        <li><strong>Movimento Ecumênico:</strong> favoreceu o diálogo com outras tradições cristãs; a aproximação com experiências pentecostais ajudou a discernir e acolher os carismas no contexto católico.</li>
      </ul>
      <p>Esses movimentos criaram o <strong>terreno fértil</strong> para que a RCC se estruturasse com ênfase em oração, louvor, carismas e centralidade da Palavra.</p>
      
      <h3>2.2 Impacto Global</h3>
      <p>Desde 1967, a RCC se expandiu pelos cinco continentes, alcançando milhões de fiéis. Seu impacto manifesta-se na evangelização, na formação de leigos, na música e nos diversos ministérios (cura, intercessão, pregação, jovens, etc.).</p>
      <p>Em nível internacional, estruturas de serviço como o antigo <strong>ICCRS</strong> e, desde 2019, a <strong>CHARIS</strong> (organismo de serviço pedido pelo Papa Francisco) contribuem para a comunhão e o discernimento, evidenciando a RCC como <em>corrente de graça</em> a serviço da renovação conciliar.</p>
      
    `,
    imagem: "/ImgFotos/introducaoRCC.png",
    bgColor: "bg-green-100",
    textColor: "text-green-800"
  },
  {
    titulo: "O Nascimento da Renovação Carismática Católica",
    icone: <FaStar className="text-green-600 text-5xl" />,
    resumo: "O marco inicial da RCC no retiro de Duquesne em 1967.",
    conteudo: `
      A RCC teve origem em um retiro em Duquesne (1967), onde estudantes experimentaram o Batismo no Espírito Santo, marcando o início de um movimento global.
    `,
    conteudoAprofundado: `
      <h2>1. O Fim de Semana de Duquesne</h2> 
      <p>Em fevereiro de 1967, um grupo de estudantes e professores católicos da Universidade de Duquesne, em Pittsburgh (EUA), participou de um retiro espiritual que entraria para a história. Movidos pelo desejo de experimentar a vitalidade da Igreja primitiva descrita em <em>Atos dos Apóstolos</em> e inspirados pela leitura do best-seller evangélico <em>A Cruz e o Punhal</em>, de David Wilkerson, esses jovens se abriram de forma radical à ação do Espírito Santo. No sábado à noite, durante um momento de oração, muitos foram tomados por uma experiência que eles mesmos descreveram como um verdadeiro <strong>Batismo no Espírito Santo</strong>. Esse acontecimento deu origem ao que hoje conhecemos como Renovação Carismática Católica (RCC).</p> 
      
      <h3>1.1 Experiência Transformadora</h3> 
      <p>Os participantes relataram um <strong>encontro direto e pessoal com o amor de Deus</strong>, algo que ultrapassava uma compreensão meramente intelectual da fé. Eles experimentaram manifestações espirituais semelhantes às descritas no Novo Testamento: oração em línguas, louvor espontâneo, lágrimas de arrependimento e profundo desejo de santidade. Esse acontecimento trouxe uma vitalidade inédita à vida espiritual dos envolvidos, despertando neles a convicção de que a fé cristã deveria ser vivida de forma mais <em>viva, experiencial e comunitária</em>. Muitos testemunharam que, a partir desse momento, suas vidas foram transformadas em direção à missão e à evangelização.</p> 
      
      <h3>1.2 Expansão Inicial</h3> 
      <p>O que ocorreu em Duquesne não ficou restrito a um pequeno grupo. Logo, a experiência se difundiu entre universidades católicas, comunidades religiosas e paróquias em diferentes regiões dos Estados Unidos. Conventos e mosteiros também foram impactados, quando religiosos começaram a viver a efusão do Espírito e a introduzi-la em suas comunidades. Em pouco tempo, grupos de oração carismática se formaram, reunindo fiéis de diversas idades e estados de vida. Essa expansão inicial revelou que o que havia acontecido em Duquesne não era um episódio isolado, mas o início de uma <strong>corrente de graça</strong> destinada a se espalhar pela Igreja inteira.</p> 
      
      <h2>2. Contexto Mais Amplo</h2> 
      <p>O surgimento da RCC em Duquesne deve ser entendido dentro de um <strong>movimento mais amplo do Espírito Santo</strong>, que já se manifestava em diferentes partes do mundo. Havia uma efervescência espiritual na Igreja Católica do pós-Concílio Vaticano II: jovens buscavam experiências de oração mais autênticas, comunidades religiosas estavam em processo de renovação, e até mesmo contatos com cristãos pentecostais despertavam uma redescoberta dos carismas. Esse contexto indica que Duquesne foi mais do que um evento local — foi um sinal de uma ação coordenada do Espírito Santo, preparando a Igreja para um novo tempo de evangelização.</p> 
      
      <h3>2.1 Apoio Eclesial</h3> 
      <p>Um marco decisivo para a credibilidade da RCC foi o apoio de figuras importantes da Igreja. O Cardeal Léon-Joseph Suenens, um dos moderadores do Concílio Vaticano II, reconheceu a legitimidade espiritual do movimento. Ele compreendeu a RCC como <strong>um sinal concreto da renovação desejada pelo Concílio</strong>, que pedia uma Igreja mais aberta ao Espírito, missionária e capaz de dialogar com os desafios do mundo moderno. Seu discernimento ajudou a RCC a não se tornar um movimento paralelo ou marginal, mas a encontrar o seu lugar dentro da vida e da missão da Igreja Católica.</p> 
      
      <h3>2.2 Legado</h3> 
      <p>O Fim de Semana de Duquesne é considerado o “<strong>Pentecostes da Igreja Católica contemporânea</strong>”. A partir dele, a RCC se expandiu por todos os continentes, alcançando hoje mais de 100 milhões de católicos no mundo. Seu legado inclui a redescoberta da centralidade da oração pessoal, do louvor comunitário, da leitura orante da Palavra de Deus, dos ministérios carismáticos e da evangelização kerigmática. Duquesne não foi apenas o início de um movimento, but o marco de uma <strong>espiritualidade pentecostal católica</strong>, que continua a revitalizar a Igreja e a impulsioná-la a viver um novo ardor missionário, em sintonia com o chamado do Concílio Vaticano II.</p> 
      
    `,
    imagem: "/ImgFotos/nascimentoRCC.png",
    bgColor: "bg-green-100",
    textColor: "text-green-800"
  },
  {
    titulo: "A Expansão da Renovação Carismática Católica",
    icone: <FaExpand className="text-green-600 text-5xl" />,
    resumo: "O crescimento global da RCC e sua estrutura organizacional.",
    conteudo: `
      A RCC expandiu-se rapidamente após 1967, alcançando 235 países com 148.000 grupos de oração até 2000. Organiza-se em grupos de oração, comunidades e estruturas internacionais como o ICCRS.
    `,
    conteudoAprofundado: `
    <h3>1. Crescimento Global</h3>
    <p>
    A Renovação Carismática Católica (RCC) passou de 100 participantes em 1968 para aproximadamente 119,9 milhões de fiéis no ano 2000, marcando uma presença consolidada em 235 países. Esse crescimento exponencial reflete a capacidade do Espírito Santo de atuar universalmente, renovando a fé dos cristãos em diferentes culturas e contextos sociais. O movimento não se limita a uma experiência pessoal, mas promove uma espiritualidade comunitária e missionária, transformando paróquias, comunidades e movimentos eclesiais em centros de evangelização e testemunho carismático.
    </p>

    <h4>1.1 Congressos Iniciais</h4>
    <p>
    Os primeiros congressos internacionais, realizados nos Estados Unidos e em Roma durante a década de 1970, foram marcos decisivos na expansão da RCC. Eles reuniram líderes e representantes de dezenas de países, permitindo a troca de experiências, a difusão de metodologias de formação e a consolidação de redes de apoio. Esses encontros ajudaram a estruturar o movimento global, promovendo unidade doutrinal, espiritual e pastoral, além de inspirar novas lideranças em todo o mundo.
    </p>

    <h4>1.2 Comunidades Carismáticas</h4>
    <p>
    Comunidades carismáticas como <i>Word of God</i> (Estados Unidos) e <i>Emmanuel</i> (França) desempenharam papel fundamental na disseminação da espiritualidade pentecostal católica. Elas atuaram como laboratórios de evangelização e formação, oferecendo retiros, encontros de oração e atividades de integração social, e se tornaram referências de fidelidade doutrinal e compromisso missionário. Essas comunidades ajudaram a consolidar a RCC como um movimento global, promovendo intercâmbio cultural e espiritual entre os diversos continentes.
    </p>

    <h3>2. Organização do Movimento</h3>
    <p>
    A RCC global combina autonomia local com coordenação internacional, garantindo flexibilidade para atender às realidades culturais de cada país, ao mesmo tempo em que preserva unidade doutrinal e pastoral. Essa organização permite que o movimento se adapte às necessidades locais sem perder a identidade carismática, fomentando uma espiritualidade vivida de forma comunitária e missionária.
    </p>

    <h4>2.1 ICCRS e CHARIS</h4>
    <p>
    O <i>International Catholic Charismatic Renewal Service</i> (ICCRS) foi fundado na década de 1970 como serviço internacional da RCC, reconhecido oficialmente pela Santa Sé em 1993, com a missão de coordenar atividades globais, promover diretrizes comuns, formar líderes e articular eventos internacionais. O ICCRS garantia que os carismas fossem exercidos de forma responsável e em conformidade com a doutrina católica, fortalecendo a unidade do movimento em todos os continentes e apoiando a missão evangelizadora da Igreja universal.
    </p>
    <p>
    Em 9 de junho de 2019, durante a solenidade de Pentecostes, o Papa Francisco instituiu o <i>CHARIS</i> (<i>Catholic Charismatic Renewal International Service</i>), substituindo o ICCRS e a Catholic Fraternity of Charismatic Covenant Communities and Fellowships (CF). O CHARIS promove e fortalece a comunhão entre todas as expressões da RCC – incluindo grupos de oração, comunidades, redes, escolas de evangelização, institutos religiosos, editoras, ministérios e iniciativas ecumênicas – e inicia uma nova fase de serviço para a RCC como corrente de graça no coração da Igreja.
    </p>
    <p>
    O CHARIS é subordinado ao Dicastério para os Leigos, a Família e a Vida, com o objetivo de aprofundar e promover a graça do Batismo no Espírito Santo em toda a Igreja, incentivando o exercício dos carismas não apenas na RCC, mas em toda a comunidade católica. Com sua criação, a RCC entra em uma fase de maior unidade, comunhão e dinamismo missionário, refletindo o desejo do Papa Francisco de fortalecer a ação do Espírito Santo em toda a Igreja.
    </p>

    <h4>2.2 CONCCLAT</h4>
    <p>
    Na América Latina, o <b>CONCCLAT</b> (Conselho Nacional da RCC Latino-Americana) promove o <i>Encontro Carismático Católico Latino-Americano</i> (ECCLA), reunindo líderes e membros de diferentes países para formação, partilha de experiências e estratégias missionárias. Essa articulação regional fortalece a presença carismática no continente, promove intercâmbio de boas práticas e incentiva a unidade pastoral, permitindo que a RCC atue de maneira coesa e eficaz em contextos culturais diversos.
    </p>

    `,
    imagem: "/ImgFotos/expansaoRCC.png",
    bgColor: "bg-green-100",
    textColor: "text-green-800"
  }
];