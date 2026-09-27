const QUICK = {
  "cards": [
    {
      "id": "pancreas",
      "title": "Pâncreas: dois destinos",
      "track": "histo",
      "image": "h14",
      "see": "Ilhotas mais claras entre muitos ácinos escuros.",
      "why": "Ácinos → enzimas para o duodeno. Ilhotas → hormônios para o sangue.",
      "contrast": "Parótida também tem ácinos serosos, mas tem ductos estriados e não tem ilhotas. Pâncreas tem células centroacinares, não ductos estriados.",
      "question": "Na imagem, o agrupamento celular mais claro no centro corresponde a qual componente?",
      "options": [
        "Ácinos exócrinos",
        "Ilhota endócrina",
        "Ducto estriado",
        "Folículo linfoide"
      ],
      "answer": 1,
      "explain": "É uma ilhota: grupo mais pálido entre ácinos. Seu produto vai ao sangue. Células alfa e beta não são diferenciadas com segurança só pela posição/cor em HE.",
      "core": true,
      "diagram": "pancreas",
      "testImage": true,
      "source": "h5"
    },
    {
      "id": "figado",
      "title": "Fígado: sangue e bile se separam",
      "track": "histo",
      "image": "s5_histo_figado_pancreas-p011",
      "see": "No espaço porta: vaso amplo de parede fina + artéria pequena + ducto com epitélio cúbico.",
      "why": "Sangue segue pelos sinusoides até a veia central; bile segue dos hepatócitos para os ductos nos espaços-porta.",
      "contrast": "Veia central não vem acompanhada de artéria e ducto. Zona 3, perto dela, recebe menos oxigênio e é vulnerável à hipóxia.",
      "question": "Em um espaço porta, qual pista identifica o ducto biliar?",
      "options": ["Luz ampla e parede muito fina, sem músculo","Parede muscular espessa sem epitélio cúbico","Revestimento de células cúbicas bem definidas","Cordões de hepatócitos ao redor da veia central"],
      "answer": 2,
      "explain": "O ducto tem epitélio cúbico. Vasos têm endotélio pavimentoso; hemácias ajudam, mas sua ausência isolada não prova que seja ducto.",
      "core": true,
      "diagram": "liver",
      "testImage": false,
      "source": "h5"
    },
    {
      "id": "delgado",
      "title": "Duodeno, jejuno ou íleo?",
      "track": "histo",
      "image": "s4_histo_tgi_inferior-p028",
      "see": "Vilosidades indicam intestino delgado. Procure um segundo marcador para localizar o segmento.",
      "why": "Brunner neutraliza o quimo; vilos ampliam absorção; placas de Peyer fazem vigilância imune.",
      "contrast": "Brunner na submucosa → duodeno. Peyer agregada → íleo. Jejuno: pregas/vilos desenvolvidos, sem marcador exclusivo; ausência numa foto pequena não basta.",
      "question": "Há vilosidades e glândulas mucosas abaixo da muscular da mucosa. Qual segmento é favorecido?",
      "options": [
        "Duodeno",
        "Jejuno",
        "Íleo",
        "Cólon"
      ],
      "answer": 0,
      "explain": "A localização submucosa das glândulas de Brunner é decisiva. Glândulas pilóricas ficam na mucosa e o estômago não possui vilosidades.",
      "core": true,
      "diagram": "gut",
      "testImage": false,
      "source": "h4"
    },
    {
      "id": "colon",
      "title": "Cólon: criptas, sem vilos",
      "track": "histo",
      "image": "h09",
      "see": "Superfície sem vilosidades; criptas tubulares retas, com muitas células caliciformes claras.",
      "why": "Muco lubrifica o conteúdo fecal; o epitélio também absorve água e eletrólitos.",
      "contrast": "Apêndice também não tem vilos: procure muito tecido linfoide e a organização de todo o corte. Uma cripta isolada não identifica o órgão.",
      "question": "Qual combinação explica melhor esta mucosa?",
      "options": ["Vilosidades + absorção no delgado","Glândulas submucosas + neutralização","Ácinos serosos + secreção de enzimas","Criptas sem vilos + muito muco"],
      "answer": 3,
      "explain": "As criptas descem para dentro da mucosa; não são projeções para a luz. As células claras são principalmente caliciformes, produtoras de mucinas.",
      "core": true,
      "diagram": null,
      "testImage": true,
      "source": "h4"
    },
    {
      "id": "estomago",
      "title": "Estômago: proteína ou ácido?",
      "track": "histo",
      "image": "s3_histo_digestorio_alto-p063",
      "see": "Na mucosa de corpo/fundo: células parietais grandes e eosinofílicas; principais mais basófilas, sobretudo na base das glândulas.",
      "why": "Parietais → HCl e fator intrínseco. Principais → pepsinogênio. Basofilia basal se relaciona ao retículo rugoso para síntese proteica.",
      "contrast": "Fovéola é invaginação, não vilosidade. No piloro predominam glândulas mucosas; não espere a mesma distribuição do corpo/fundo.",
      "question": "A perda de células parietais reduz diretamente qual dupla?",
      "options": ["Pepsinogênio e muco protetor","Ácido clorídrico e fator intrínseco","Insulina e glucagon pancreáticos","Bicarbonato e defensinas locais"],
      "answer": 1,
      "explain": "Parietal produz HCl e fator intrínseco, necessário à absorção de B12 no íleo. Pepsinogênio vem das células principais.",
      "core": true,
      "diagram": null,
      "testImage": false,
      "source": "h3"
    },
    {
      "id": "saliva",
      "title": "Salivares: leia claro × escuro",
      "track": "histo",
      "image": "s3_histo_digestorio_alto-p028",
      "see": "Serosas: mais escuras, núcleos arredondados. Mucosas: citoplasma pálido e núcleos basais achatados.",
      "why": "Serosas fabricam proteínas; mucosas fabricam mucinas. Ductos estriados modificam a composição iônica da saliva.",
      "contrast": "Parótida: serosa. Submandibular: mista, mais serosa. Sublingual: mista, mais mucosa. “Mista” aqui não significa exócrina + endócrina.",
      "question": "Predominam unidades claras, com núcleos achatados na base. Qual glândula salivar é favorecida?",
      "options": [
        "Parótida",
        "Pâncreas",
        "Sublingual",
        "Submandibular"
      ],
      "answer": 2,
      "explain": "O predomínio mucoso favorece sublingual. Submandibular é mista, mas predominantemente serosa; pâncreas tem ácinos serosos e ilhotas.",
      "core": true,
      "diagram": null,
      "testImage": false,
      "source": "h5"
    },
    {
      "id": "testiculo",
      "title": "Testículo: dentro × entre",
      "track": "histo",
      "image": "h16",
      "see": "Túbulos com várias gerações de células germinativas. No interstício, entre túbulos, ficam células de Leydig.",
      "why": "Sertoli sustenta a linhagem e forma a barreira hematotesticular. Leydig produz testosterona. Maturação avança da base para o lúmen.",
      "contrast": "Epidídimo tem ductos com epitélio pseudoestratificado e estereocílios; não reproduz as camadas de maturação do túbulo seminífero.",
      "question": "Qual associação entre localização e função está correta?",
      "options": [
        "Leydig entre túbulos → testosterona",
        "Leydig no lúmen → barreira hematotesticular",
        "Sertoli no interstício → testosterona",
        "Sertoli na cápsula → transporte de espermatozoides"
      ],
      "answer": 0,
      "explain": "Leydig fica no interstício. Sertoli está no epitélio seminífero e suas junções formam a barreira hematotesticular.",
      "core": true,
      "diagram": null,
      "testImage": false,
      "source": "h2"
    },
    {
      "id": "utero",
      "title": "Endométrio: crescer ou secretar?",
      "track": "histo",
      "image": "h19",
      "see": "Proliferativo: glândulas mais retas. Secretor: glândulas tortuosas, luz irregular e atividade secretora.",
      "why": "Estrogênios promovem proliferação; progesterona do corpo lúteo favorece transformação secretora.",
      "contrast": "Endométrio é mucosa; miométrio é músculo liso. A aparência depende do momento do ciclo, não de uma doença obrigatória.",
      "question": "Glândulas endometriais tortuosas e secretoras sugerem predomínio de qual influência?",
      "options": [
        "FSH diretamente sobre as glândulas",
        "AMH produzido por Sertoli",
        "Testosterona produzida por Leydig",
        "Progesterona produzida pelo corpo lúteo"
      ],
      "answer": 3,
      "explain": "A progesterona transforma o endométrio em secretor após a ovulação. A fase proliferativa anterior é estimulada principalmente por estrogênios.",
      "core": true,
      "diagram": null,
      "testImage": false,
      "source": "h2"
    },
    {
      "id": "camadas",
      "title": "Parede digestiva: ache o andar",
      "track": "histo",
      "image": "s3_histo_digestorio_alto-p047",
      "see": "Da luz para fora: mucosa → submucosa → muscular externa → serosa/adventícia.",
      "why": "Mucosa faz contato e secreção/absorção; muscular externa move o conteúdo. A posição da estrutura ajuda a inferir sua função.",
      "contrast": "Mucosa = epitélio + lâmina própria + muscular da mucosa. Meissner na submucosa; Auerbach entre camadas da muscular externa.",
      "question": "Um plexo está entre as camadas circular e longitudinal da muscular externa. É qual?",
      "options": [
        "Plexo submucoso de Meissner",
        "Plexo mioentérico de Auerbach",
        "Plexo venoso do espaço porta",
        "Plexo da lâmina própria"
      ],
      "answer": 1,
      "explain": "Auerbach regula principalmente a motilidade. Meissner é submucoso e participa da regulação local da secreção e do fluxo sanguíneo.",
      "core": false,
      "diagram": "wall",
      "testImage": false,
      "source": "h4"
    },
    {
      "id": "esofago",
      "title": "Esôfago: proteção contra atrito",
      "track": "histo",
      "image": "h03",
      "see": "Epitélio pavimentoso estratificado não queratinizado, com várias camadas de células.",
      "why": "A estratificação protege contra atrito da passagem do bolo alimentar.",
      "contrast": "Estômago tem epitélio simples colunar e fovéolas. No esôfago, glândulas podem estar na submucosa; não são Brunner sem o contexto do duodeno.",
      "question": "Por que o esôfago apresenta epitélio com várias camadas?",
      "options": [
        "Para ampliar absorção por vilosidades",
        "Para liberar ácido clorídrico",
        "Para resistir ao atrito mecânico",
        "Para produzir hormônios pancreáticos"
      ],
      "answer": 2,
      "explain": "Proteção mecânica é a relação central. Um epitélio simples favorece trocas/absorção; múltiplas camadas resistem melhor à abrasão.",
      "core": false,
      "diagram": null,
      "testImage": false,
      "source": "h3"
    },
    {
      "id": "vesicula",
      "title": "Vesícula: pregas não são vilos",
      "track": "histo",
      "image": "s5_histo_figado_pancreas-p020",
      "see": "Mucosa muito pregueada e epitélio simples colunar. Não há muscular da mucosa nem submucosa.",
      "why": "Absorve água e eletrólitos para concentrar a bile produzida no fígado.",
      "contrast": "As pregas podem lembrar intestino, mas o plano da parede e a ausência de criptas intestinais ajudam a diferenciar.",
      "question": "Qual descrição combina com vesícula biliar?",
      "options": [
        "Glândulas de Brunner na submucosa",
        "Criptas retas e muitas placas de Peyer",
        "Muscular da mucosa muito espessa",
        "Mucosa pregueada sem submucosa"
      ],
      "answer": 3,
      "explain": "A vesícula não tem submucosa nem muscular da mucosa. Sua musculatura lisa tem organização menos regular que as duas camadas típicas do intestino.",
      "core": false,
      "diagram": null,
      "testImage": false,
      "source": "h5"
    },
    {
      "id": "adrenal",
      "title": "Suprarrenal: de fora para dentro",
      "track": "histo",
      "image": "h15",
      "see": "Córtex em zonas; medula central. Fasciculada: células claras em cordões relativamente retos.",
      "why": "Glomerulosa → aldosterona. Fasciculada → cortisol. Reticular → andrógenos. Medula → catecolaminas.",
      "contrast": "G–F–R é a ordem cortical. O córtex deriva do mesoderma; a medula deriva da crista neural.",
      "question": "Qual zona cortical produz principalmente cortisol?",
      "options": [
        "Glomerulosa",
        "Fasciculada",
        "Reticular",
        "Medula"
      ],
      "answer": 1,
      "explain": "Fasciculada → glicocorticoides, incluindo cortisol. Células claras refletem conteúdo lipídico/processamento, associado à síntese de esteroides.",
      "core": true,
      "diagram": "adrenal",
      "testImage": false,
      "source": "h5"
    },
    {
      "id": "ovario",
      "title": "Ovário: procure o folículo",
      "track": "histo",
      "image": "h18",
      "see": "Ovócito envolvido por células foliculares/granulosa; com o crescimento aparece o antro.",
      "why": "Folículo sustenta o ovócito e participa da produção hormonal; após ovular, forma-se o corpo lúteo.",
      "contrast": "Primordial: células achatadas. Primário: cúbicas. Antral: cavidade com líquido. Teca responde a LH; granulosa a FSH.",
      "question": "Qual achado define o aparecimento de um folículo antral?",
      "options": [
        "Cavidade com líquido entre células da granulosa",
        "Camada única de células achatadas",
        "Substituição de todo o folículo por colágeno",
        "Túbulo com espermatozoides no lúmen"
      ],
      "answer": 0,
      "explain": "O antro é a cavidade preenchida por líquido folicular. Nomes como secundário variam entre classificações; descreva o que vê.",
      "core": false,
      "diagram": null,
      "testImage": false,
      "source": "h2"
    },
    {
      "id": "tuba",
      "title": "Tuba: uma luz, muitas pregas",
      "track": "histo",
      "image": "h20",
      "see": "Uma luz muito recortada por pregas da mucosa, envolvida por parede muscular.",
      "why": "Células ciliadas, secreção e contrações contribuem para o transporte tubário.",
      "contrast": "Pregas ramificadas não equivalem a várias glândulas isoladas. Estereocílios do epidídimo não são cílios móveis.",
      "question": "Esta imagem mostra uma luz muito pregueada. Qual órgão é mais compatível?",
      "options": [
        "Ducto deferente",
        "Esôfago",
        "Tuba uterina",
        "Cólon"
      ],
      "answer": 2,
      "explain": "A arquitetura ramificada da mucosa favorece tuba uterina. A imagem de pequeno aumento não permite identificar cílios individuais com segurança.",
      "core": false,
      "diagram": null,
      "testImage": true,
      "source": "h2"
    },
    {
      "id": "colo",
      "title": "Colo uterino: dois revestimentos",
      "track": "histo",
      "image": "h21",
      "see": "Ectocérvice: pavimentoso estratificado. Endocérvice: colunar simples mucossecretor.",
      "why": "O revestimento externo resiste ao atrito; o canal secreta muco.",
      "contrast": "A junção escamocolunar e a zona de transformação são referências importantes; não confunda colo uterino com corpo do útero.",
      "question": "Qual associação de revestimentos está correta?",
      "options": ["Ectocérvice colunar; endocérvice pavimentosa","Ambas pavimentosas queratinizadas","Ambas colunares ciliadas, sem muco","Ectocérvice pavimentosa; endocérvice colunar"],
      "answer": 3,
      "explain": "Os dois territórios têm funções e epitélios diferentes. O padrão normal deve ser reconhecido antes de interpretar alterações.",
      "core": false,
      "diagram": null,
      "testImage": false,
      "source": "h2"
    },
    {
      "id": "gastrula",
      "title": "Gastrulação: a origem comum",
      "track": "embrio",
      "image": "e02",
      "see": "Epiblasto → três folhetos definitivos, na gastrulação da terceira semana.",
      "why": "Células migram pela linha primitiva, substituem hipoblasto e formam endoderma; outras formam mesoderma; as remanescentes formam ectoderma.",
      "contrast": "Hipoblasto não é a origem do endoderma definitivo do embrião. “Três folhetos” não significa três origens independentes.",
      "question": "De qual população derivam os três folhetos embrionários definitivos?",
      "options": [
        "Hipoblasto",
        "Epiblasto",
        "Citotrofoblasto",
        "Sinciciotrofoblasto"
      ],
      "answer": 1,
      "explain": "Todos derivam do epiblasto. Hipoblasto contribui para estruturas extraembrionárias, como o revestimento da vesícula vitelínica.",
      "core": true,
      "diagram": "germ",
      "testImage": false,
      "source": "e1"
    },
    {
      "id": "neural",
      "title": "Neurulação: fechar e migrar",
      "track": "embrio",
      "image": "e04",
      "see": "Placa neural → pregas → tubo neural. Células da crista neural se destacam e migram.",
      "why": "Tubo neural origina o SNC; crista neural contribui, entre outros derivados, para gânglios periféricos e sistema nervoso entérico.",
      "contrast": "Mielomeningocele envolve meninges e tecido neural. Meningocele envolve meninges; nem toda espinha bífida expõe tecido neural.",
      "question": "Um defeito aberto contém meninges e tecido neural. Qual termo é mais adequado?",
      "options": [
        "Mielomeningocele",
        "Meningocele isolada",
        "Onfalocele",
        "Divertículo de Meckel"
      ],
      "answer": 0,
      "explain": "Mielo = tecido neural; meningo = meninges. A distinção descreve o conteúdo do defeito, além da falha do desenvolvimento neuraxial.",
      "core": true,
      "diagram": "neural",
      "testImage": false,
      "source": "e1"
    },
    {
      "id": "origens",
      "title": "Intestino: quem constrói o quê?",
      "track": "embrio",
      "image": "e03",
      "see": "Dobrar o embrião incorpora parte da vesícula vitelínica e forma o tubo intestinal.",
      "why": "Endoderma → epitélio e parênquima de glândulas anexas. Mesoderma esplâncnico → músculo liso, conjuntivo e mesotélio.",
      "contrast": "Plexos entéricos vêm da crista neural. Extremidades oral/anal têm contribuição ectodérmica: o tubo não é todo de um único folheto.",
      "question": "Qual origem corresponde aos neurônios dos plexos entéricos?",
      "options": [
        "Endoderma do tubo intestinal",
        "Mesoderma esplâncnico",
        "Crista neural",
        "Hipoblasto da vesícula vitelínica"
      ],
      "answer": 2,
      "explain": "Os neurônios entéricos derivam de células da crista neural que migram para a parede do tubo. A musculatura lisa é mesodérmica.",
      "core": true,
      "diagram": "origins",
      "testImage": false,
      "source": "e3"
    },
    {
      "id": "rotacao",
      "title": "Movimento certo, consequência certa",
      "track": "embrio",
      "image": "e07",
      "see": "Estômago: aproximadamente 90° no eixo longitudinal. Intestino médio: 270° anti-horários em torno da AMS, vistos de frente.",
      "why": "Crescimento, herniação fisiológica, rotação e retorno posicionam as alças; recanalização restaura a luz em segmentos que a obliteraram.",
      "contrast": "Não troque rotação por recanalização. Persistência do ducto vitelino pode deixar divertículo de Meckel; malrotação altera a disposição/fixação das alças.",
      "question": "Qual associação de movimento está correta?",
      "options": [
        "Estômago 270°; intestino médio 90°",
        "Estômago 90°; intestino médio 90°",
        "Estômago 270°; intestino médio 270°",
        "Estômago 90°; intestino médio 270°"
      ],
      "answer": 3,
      "explain": "São movimentos distintos. Os 270° do intestino médio ocorrem em torno da artéria mesentérica superior, no sentido anti-horário visto anteriormente.",
      "core": true,
      "diagram": null,
      "testImage": false,
      "source": "e3"
    },
    {
      "id": "brotos",
      "title": "Pâncreas: dois brotos se encontram",
      "track": "embrio",
      "image": "pptx_pf-image2",
      "see": "Brotos pancreáticos dorsal e ventral, de origem endodérmica, aproximam-se com os movimentos do duodeno.",
      "why": "Ventral → processo uncinado e parte inferior da cabeça. Dorsal → restante da cabeça, corpo e cauda.",
      "contrast": "Pâncreas anular envolve desenvolvimento anômalo do broto ventral ao redor do duodeno. Não confunda com falha de recanalização duodenal.",
      "question": "O processo uncinado deriva principalmente de qual broto?",
      "options": [
        "Ventral",
        "Dorsal",
        "Hepático cranial",
        "Mesonéfrico"
      ],
      "answer": 0,
      "explain": "O broto ventral contribui para o processo uncinado e a região inferior da cabeça; o dorsal forma a maior parte do órgão.",
      "core": true,
      "diagram": null,
      "testImage": false,
      "source": "e3"
    },
    {
      "id": "sexual",
      "title": "Sertoli e Leydig: sinais diferentes",
      "track": "embrio",
      "image": "e08",
      "see": "No testículo fetal: Sertoli → AMH; Leydig → testosterona.",
      "why": "AMH favorece regressão de Müller. Testosterona mantém Wolff. DHT participa da diferenciação da genitália externa masculina e da próstata.",
      "contrast": "Müller → tubas, útero e porção superior da vagina na descrição clássica da aula. Wolff → epidídimo, deferente, vesículas seminais e ductos ejaculatórios.",
      "question": "A manutenção dos ductos de Wolff depende principalmente de qual sinal?",
      "options": [
        "AMH de Sertoli",
        "FSH da hipófise",
        "Testosterona de Leydig",
        "Progesterona do corpo lúteo"
      ],
      "answer": 2,
      "explain": "Testosterona mantém e diferencia Wolff. AMH atua em Müller, provocando sua regressão; não são sinais intercambiáveis.",
      "core": true,
      "diagram": "sex",
      "testImage": false,
      "source": "h2"
    },
    {
      "id": "implantacao",
      "title": "Primeiras semanas: separar papéis",
      "track": "embrio",
      "image": "e01",
      "see": "Clivagem → mórula → blastocisto → implantação. Embrioblasto e trofoblasto assumem papéis diferentes.",
      "why": "Embrioblasto contribui para o embrião. Sinciciotrofoblasto invade o endométrio e produz hCG, mantendo inicialmente o corpo lúteo.",
      "contrast": "Epiblasto + hipoblasto = disco bilaminar. A gastrulação forma o trilaminar. Clivagem aumenta o número de células sem crescimento global proporcional.",
      "question": "Qual componente produz hCG no início da implantação?",
      "options": [
        "Epiblasto",
        "Sinciciotrofoblasto",
        "Hipoblasto",
        "Mesoderma intermediário"
      ],
      "answer": 1,
      "explain": "hCG é produzido pelo sinciciotrofoblasto e sustenta o corpo lúteo no início da gestação. Não é função do hipoblasto.",
      "core": false,
      "diagram": null,
      "testImage": false,
      "source": "e1"
    },
    {
      "id": "meiose",
      "title": "Ovócito: duas pausas",
      "track": "embrio",
      "image": "s2_histo_genital-p033",
      "see": "Ovócito primário: prófase I. Ovócito secundário ovulado: metáfase II.",
      "why": "O estímulo pré-ovulatório permite completar a meiose I. A fecundação desencadeia o término da meiose II.",
      "contrast": "Espermiogênese muda a forma da espermátide; não é uma nova divisão meiótica. CGPs são especificadas no epiblasto e migram até as gônadas.",
      "question": "Qual pausa corresponde ao ovócito secundário no momento habitual da ovulação?",
      "options": [
        "Prófase I",
        "Metáfase I",
        "Prófase II",
        "Metáfase II"
      ],
      "answer": 3,
      "explain": "O ovócito secundário permanece em metáfase II até a fecundação. A longa pausa em prófase I é do ovócito primário.",
      "core": false,
      "diagram": null,
      "testImage": false,
      "source": "h2"
    },
    {
      "id": "cloaca",
      "title": "Cloaca: separar duas saídas",
      "track": "embrio",
      "image": "s1_embriologia_bases-p040",
      "see": "A cloaca é uma cavidade terminal comum no início do desenvolvimento.",
      "why": "O septo urorretal separa o canal anorretal posterior do seio urogenital anterior.",
      "contrast": "Falhas de separação podem gerar comunicações anormais. Isso difere de falhas de fusão dos processos da face e do palato.",
      "question": "Após a separação da cloaca, qual estrutura fica anteriormente?",
      "options": [
        "Canal anorretal",
        "Tubo neural",
        "Seio urogenital",
        "Intestino médio"
      ],
      "answer": 2,
      "explain": "Seio urogenital anterior; canal anorretal posterior. A relação espacial ajuda a entender fístulas anorretais congênitas.",
      "core": false,
      "diagram": null,
      "testImage": false,
      "source": "e3"
    }
  ],
  "images": {
    "h03": {
      "src": "assets/images/h03.jpg",
      "title": "Esôfago: epitélio estratificado pavimentoso e glândulas esofágicas",
      "source": "Wikimedia Commons — File:Esophagus SEC Пищевод.jpg",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Esophagus_SEC_%D0%9F%D0%B8%D1%89%D0%B5%D0%B2%D0%BE%D0%B4.jpg",
      "author": "Molecularu",
      "license": "CC BY-SA 4.0",
      "w": 820,
      "h": 656
    },
    "s5_histo_figado_pancreas-p020": {
      "src": "assets/images/s5_histo_figado_pancreas-p020.jpg",
      "title": "Parede da vesícula biliar (HE)",
      "source": "Slide 20 — Histologia: fígado, pâncreas e adrenal (31/08, Ricardo)",
      "sourceUrl": "",
      "author": "",
      "license": "material de aula (uso interno da turma)",
      "w": 820,
      "h": 429
    },
    "s3_histo_digestorio_alto-p047": {
      "src": "assets/images/s3_histo_digestorio_alto-p047.jpg",
      "title": "Parede esofágica: as quatro camadas",
      "source": "Slide 47 — Histologia: boca, faringe, esôfago e estômago (17/08, Ricardo)",
      "sourceUrl": "",
      "author": "",
      "license": "material de aula (uso interno da turma)",
      "w": 820,
      "h": 417
    },
    "s3_histo_digestorio_alto-p063": {
      "src": "assets/images/s3_histo_digestorio_alto-p063.jpg",
      "title": "Glândula gástrica: células parietais e principais",
      "source": "Slide 63 — Histologia: boca, faringe, esôfago e estômago (17/08, Ricardo)",
      "sourceUrl": "",
      "author": "",
      "license": "material de aula (uso interno da turma)",
      "w": 820,
      "h": 444
    },
    "s5_histo_figado_pancreas-p011": {
      "src": "assets/images/s5_histo_figado_pancreas-p011.jpg",
      "title": "Tríade portal no fígado (HE)",
      "source": "Slide 11 — Histologia: fígado, pâncreas e adrenal (31/08, Ricardo)",
      "sourceUrl": "",
      "author": "",
      "license": "material de aula (uso interno da turma)",
      "w": 820,
      "h": 430
    },
    "h14": {
      "src": "assets/images/h14.jpg",
      "title": "Pâncreas: ácinos e ilhota pancreática (H&E)",
      "source": "Wikimedia Commons — File:Encapsulated Islet of Langerhans (47725287851).jpg",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Encapsulated_Islet_of_Langerhans_(47725287851).jpg",
      "author": "Berkshire Community College Bioscience Image Library",
      "license": "CC0",
      "w": 820,
      "h": 462
    },
    "h09": {
      "src": "assets/images/h09.jpg",
      "title": "Cólon: criptas intestinais e células caliciformes (H&E)",
      "source": "Wikimedia Commons — File:Colon, intermed. mag.jpg",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Colon,_intermed._mag.jpg",
      "author": "CoRus13",
      "license": "CC BY-SA 4.0",
      "w": 820,
      "h": 546
    },
    "h19": {
      "src": "assets/images/h19.jpg",
      "title": "Endométrio: fase proliferativa e fase secretora (H&E)",
      "source": "Wikimedia Commons — File:Histology of proliferative endometrium.jpg (A) + File:Histology of secretory endometrium.jpg (B)",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Histology_of_proliferative_endometrium.jpg",
      "author": "Douglas A. Gibson, Ioannis Simitsidellis, Frances Collins and Philippa T. K. Sau",
      "license": "CC BY 4.0",
      "w": 820,
      "h": 574
    },
    "e03": {
      "src": "assets/images/e03.jpg",
      "title": "Dobramento do embrião e formação do intestino primitivo",
      "source": "Wikimedia Commons — File:2913 Embryonic Folding.jpg",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:2913_Embryonic_Folding.jpg",
      "author": "OpenStax College",
      "license": "CC BY 3.0",
      "w": 820,
      "h": 751
    },
    "h15": {
      "src": "assets/images/h15.jpg",
      "title": "Suprarrenal: zonas do córtex e medula (rotulada)",
      "source": "Wikimedia Commons — File:Adrenal cortex labelled.jpg",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Adrenal_cortex_labelled.jpg",
      "author": "Jpogi",
      "license": "CC0",
      "w": 820,
      "h": 615
    },
    "s4_histo_tgi_inferior-p028": {
      "src": "assets/images/s4_histo_tgi_inferior-p028.jpg",
      "title": "Duodeno x jejuno x íleo: identificação regional em H&E",
      "source": "Slide 28 — Histologia: intestino delgado, grosso e reto (24/08, Ricardo)",
      "sourceUrl": "",
      "author": "",
      "license": "material de aula (uso interno da turma)",
      "w": 820,
      "h": 451
    },
    "h21": {
      "src": "assets/images/h21.jpg",
      "title": "Colo uterino: junção escamocolunar (H&E)",
      "source": "Wikimedia Commons — File:Cervix Uteri Normal Squamocolumnar Junction (4796821432).jpg",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Cervix_Uteri_Normal_Squamocolumnar_Junction_(4796821432).jpg",
      "author": "Ed Uthman from Houston, TX, USA",
      "license": "CC BY 2.0",
      "w": 820,
      "h": 544
    },
    "pptx_pf-image2": {
      "src": "assets/images/pptx_pf-image2.jpg",
      "title": "Embriologia do pâncreas e das vias biliares (32 a 42 dias)",
      "source": "Imagens do PowerPoint \"pâncreas, fígado etc.\" (31/08, Hojaij)",
      "sourceUrl": "",
      "author": "",
      "license": "material de aula (uso interno da turma)",
      "w": 820,
      "h": 700
    },
    "h16": {
      "src": "assets/images/h16.jpg",
      "title": "Testículo: túbulo seminífero e células de Leydig (H&E)",
      "source": "Wikimedia Commons — File:Seminiferous tubule and sperm low mag.jpg",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Seminiferous_tubule_and_sperm_low_mag.jpg",
      "author": "Nephron",
      "license": "CC BY-SA 3.0",
      "w": 820,
      "h": 974
    },
    "s2_histo_genital-p033": {
      "src": "assets/images/s2_histo_genital-p033.jpg",
      "title": "Ovário: panorâmica com folículos em vários estágios",
      "source": "Slide 33 — Histologia: testículo, ovário e útero (10/08, Ricardo)",
      "sourceUrl": "",
      "author": "",
      "license": "material de aula (uso interno da turma)",
      "w": 820,
      "h": 360
    },
    "h20": {
      "src": "assets/images/h20.jpg",
      "title": "Tuba uterina: pregas da mucosa (H&E)",
      "source": "Wikimedia Commons — File:Normal Fallopian tube, cross section (3884871084).jpg",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Normal_Fallopian_tube,_cross_section_(3884871084).jpg",
      "author": "Ed Uthman from Houston, TX, USA",
      "license": "CC BY 2.0",
      "w": 820,
      "h": 739
    },
    "s1_embriologia_bases-p040": {
      "src": "assets/images/s1_embriologia_bases-p040.jpg",
      "title": "Dobramento lateral: intestino anterior, médio e posterior",
      "source": "Slide 40 — Bases da Embriologia (03/08, Ricardo)",
      "sourceUrl": "",
      "author": "",
      "license": "material de aula (uso interno da turma)",
      "w": 820,
      "h": 343
    },
    "s3_histo_digestorio_alto-p028": {
      "src": "assets/images/s3_histo_digestorio_alto-p028.jpg",
      "title": "Ácinos serosos, mucosos e mistos das glândulas salivares",
      "source": "Slide 28 — Histologia: boca, faringe, esôfago e estômago (17/08, Ricardo)",
      "sourceUrl": "",
      "author": "",
      "license": "material de aula (uso interno da turma)",
      "w": 820,
      "h": 420
    },
    "e04": {
      "src": "assets/images/e04.jpg",
      "title": "Neurulação e fechamento do tubo neural",
      "source": "Wikimedia Commons — File:2912 Neurulation-02.jpg",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:2912_Neurulation-02.jpg",
      "author": "OpenStax College",
      "license": "CC BY 3.0",
      "w": 820,
      "h": 947
    },
    "e07": {
      "src": "assets/images/e07.jpg",
      "title": "Rotação do intestino médio",
      "source": "Wikimedia Commons — File:Rotation of the midgut around the superior mesenteric artery.png",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Rotation_of_the_midgut_around_the_superior_mesenteric_artery.png",
      "author": "Danowitz M, Solounias N.",
      "license": "CC BY 4.0",
      "w": 820,
      "h": 1148
    },
    "e08": {
      "src": "assets/images/e08.jpg",
      "title": "Ductos paramesonéfricos (Müller) e mesonéfricos (Wolff) no seio urogenital",
      "source": "Wikimedia Commons — File:Gray1109.png",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Gray1109.png",
      "author": "Henry Vandyke Carter",
      "license": "Public domain",
      "w": 745,
      "h": 787
    },
    "e01": {
      "src": "assets/images/e01.jpg",
      "title": "Blastocisto e implantação",
      "source": "Wikimedia Commons — File:2905 Implantation.jpg",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:2905_Implantation.jpg",
      "author": "OpenStax College",
      "license": "CC BY 3.0",
      "w": 820,
      "h": 1025
    },
    "h18": {
      "src": "assets/images/h18.jpg",
      "title": "Ovário: folículos em vários estágios (H&E)",
      "source": "Wikimedia Commons — File:Ovarian cortex in a rhesus monkey.jpg (A) + File:Graafian Follicle Cumulus Oophorus in Human Ovary (6032619828).jpg (B)",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ovarian_cortex_in_a_rhesus_monkey.jpg",
      "author": "Tulemo (A); Ed Uthman (B)",
      "license": "CC BY-SA 4.0 (A); CC BY 2.0 (B)",
      "w": 820,
      "h": 303
    },
    "e02": {
      "src": "assets/images/e02.jpg",
      "title": "Gastrulação e disco trilaminar",
      "source": "Wikimedia Commons — File:2908 Germ Layers-02.jpg",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:2908_Germ_Layers-02.jpg",
      "author": "OpenStax College",
      "license": "CC BY 3.0",
      "w": 820,
      "h": 732
    }
  },
  "sources": {
    "h5": {
      "title": "Aula 31/08 · glândulas, fígado, vesícula, pâncreas e suprarrenal",
      "ref": "https://histology.oit.duke.edu/MBS/SysSci/SS-GIglands/SS-GIglands.html"
    },
    "h4": {
      "title": "Aula 24/08 · Histologia do TGI inferior",
      "ref": "https://histologyguide.com/about-us/sorenson-atlas-of-human-histology-chapter-14.pdf"
    },
    "h3": {
      "title": "Aula 17/08 e roteiro · Digestório superior",
      "ref": "https://histologyguide.com/about-us/sorenson-atlas-of-human-histology-chapter-14.pdf"
    },
    "h2": {
      "title": "Aula 10/08 · Embriologia e histologia reprodutiva",
      "ref": null
    },
    "e1": {
      "title": "Aula 03/08 · Bases da embriologia; APS de mielomeningocele",
      "ref": null
    },
    "e3": {
      "title": "Aula 17/08 · Embriologia digestória; aula de pâncreas",
      "ref": "https://embryology.med.unsw.edu.au/embryology/index.php/Gastrointestinal_Tract_Development"
    }
  }
};
