export const site = {
  name: "Bruno Monteiro",
  fullName: "Bruno Maletta Monteiro",
  role: "PhD student at Peking University 北大",
  roleShort: "PhD student, PKU",
  location: "Beijing",
  lattes: "http://lattes.cnpq.br/0082041478569822",
  orcid: "https://orcid.org/0009-0009-9435-5323",
  socials: [
    { label: "Codeforces", href: "https://codeforces.com/profile/brunomont" },
    { label: "GitHub", href: "https://github.com/brunomaletta" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/brunomont/" },
  ],
  bio: "I study algorithms, mostly strings and data structures. Before Peking University I was a software engineer at Google in Belo Horizonte, and I still write contest code, maintain an ICPC library, and go on very long runs.",
  nav: [
    { href: "/", label: "Home" },
    { href: "/cv", label: "CV" },
    { href: "/research", label: "Research" },
    { href: "/writing", label: "Writing" },
    { href: "/problems", label: "Problems" },
    { href: "/projects", label: "Projects" },
    { href: "/influences", label: "Influences" },
    { href: "/running", label: "Running" },
  ],
};

export const education = [
  {
    title: "PhD, Computer Science",
    place: "Peking University",
    dates: "2026–2030",
    detail: "Beijing",
  },
  {
    title: "Master's, Computer Science",
    place: "Federal University of Minas Gerais (UFMG)",
    dates: "2021–2024",
    detail: "Advisor Vinicius Fernandes dos Santos. Grade 93/100.",
  },
  {
    title: "Bachelor's, Computer Science",
    place: "Federal University of Minas Gerais (UFMG)",
    dates: "2017–2021",
    detail: "Grade 95/100.",
  },
];

export const work = [
  {
    title: "Software Engineer",
    place: "Google",
    dates: "August 2022–2026",
    detail: "Search, Belo Horizonte. End-to-end features on the Search page.",
  },
  {
    title: "Strategist intern",
    place: "Goldman Sachs",
    dates: "May–August 2021",
    detail: "",
  },
  {
    title: "Undergraduate researcher",
    place: "UFMG",
    dates: "June 2018–August 2019",
    detail: "Algorithms and graph theory.",
  },
];

export const teaching = [
  {
    title: "AddisCoder",
    place: "Ethiopia",
    dates: "2026",
    detail:
      "Teaching assistant. Intensive algorithms camp for high-school students founded by Jelani Nelson.",
  },
  {
    title: "JamCoders",
    place: "Jamaica",
    dates: "2025",
    detail:
      "Teaching assistant. Intensive algorithms camp for high-school students founded by Jelani Nelson.",
  },
  {
    title: "Advanced Algorithms",
    place: "UFMG",
    dates: "2022–",
    detail:
      "Undergraduate course I designed and taught (about 30 students). Assignments and lecture notes on Drive are in Portuguese.",
    links: [
      { label: "Syllabus", href: "/papers/advanced-algorithms-syllabus.pdf" },
      {
        label: "Materials (pt-BR)",
        href: "https://drive.google.com/drive/folders/16dgAwVo54psGm7IyR7jLHvIBWIt0oMTb?usp=sharing",
      },
    ],
  },
  {
    title: "Maratona de Verão / IOI selectives",
    place: "UNICAMP",
    dates: "2022, 2025",
    detail: "Instructor. Strings, geometry, data structures, graphs.",
  },
  {
    title: "Samsung Software Development Training",
    place: "Remote",
    dates: "December 2021–February 2022",
    detail: "",
  },
];

export const contests = [
  {
    title: "ICPC World Finals 2020, Moscow",
    detail: "55th of 117 with UFMG Rábalabaxúrias (best UFMG finish at the time).",
    href: "https://cphof.org/profile/codeforces:brunomont",
  },
  {
    title: "ICPC Brazilian Finals 2022 and 2023",
    detail: "Gold medals, 2nd nationally (Humuhumunukunukuapua'a; Summergimurne?). World Finals in Egypt.",
    href: "http://maratona.sbc.org.br/hist/2021/resultados21/reports/brbr/score.html",
  },
  {
    title: "ICPC coach",
    detail: "Coached a UFMG team that won the Latin American Finals and qualified to the World Finals.",
    href: "",
  },
  {
    title: "IX Maratona Mineira de Programação, 2022",
    detail: "Gold, 1st of 51 with pãO(queijo).",
    href: "https://maratona.algartelecom.com.br/portal/wp-content/uploads/2022/05/4-Mineira2022_Maratona_Mineira_Placar_Final.pdf",
  },
  {
    title: "Codeforces",
    detail: "Master brunomont. Rating 2142, max 2245.",
    href: "https://codeforces.com/profile/brunomont",
  },
  {
    title: "Judge",
    detail: "Maratona Mineira and ICPC sub-regional.",
    href: "",
  },
];

export const publications = [
  {
    kind: "paper",
    title: "String Matching with a Dynamic Pattern",
    authors: "Bruno Monteiro, Vinicius dos Santos",
    venue: "SPIRE 2025",
    href: "https://link.springer.com/chapter/10.1007/978-3-032-05228-5_17",
    extra: "https://github.com/brunomaletta/DynamicPatternMatching",
    links: [
      { label: "SPIRE 2025", href: "https://link.springer.com/chapter/10.1007/978-3-032-05228-5_17" },
      { label: "arXiv:2506.11318", href: "https://arxiv.org/abs/2506.11318" },
    ],
    blurb:
      "String matching when the pattern is edited: insert and delete characters, then count occurrences in a static text. Using suffix arrays we get O(log |T|) updates after O(|T|) preprocess, and the same bounds for substring delete, transpose, and copy, plus an online text.",
  },
  {
    kind: "paper",
    title: "Equitable Partition of Graphs into Independent Sets and Cliques",
    authors: "Bruno Monteiro, Vinicius dos Santos",
    venue: "ETC 2019",
    href: "https://sol.sbc.org.br/index.php/etc/article/view/6392",
    links: [
      { label: "ETC 2019", href: "https://sol.sbc.org.br/index.php/etc/article/view/6392" },
      { label: "PDF", href: "https://sol.sbc.org.br/index.php/etc/article/download/6392/6288" },
    ],
    blurb:
      "A graph is (k, ℓ) if its vertices can be partitioned into k independent sets and ℓ cliques. Deciding an equitable such partition is polynomial when max(k, ℓ) ≤ 2, and NP-complete otherwise.",
  },
  {
    kind: "masters",
    title: "String Matching with a Dynamic Pattern",
    authors: "Bruno Maletta Monteiro",
    venue: "Master's thesis, UFMG, 2024. Advisor Vinicius Fernandes dos Santos. Committee: Victor Campos, Felipe Alves da Louza.",
    href: "/papers/masters-thesis.pdf",
    extra: "https://github.com/brunomaletta/DynamicPatternMatching",
    links: [
      { label: "PDF", href: "/papers/masters-thesis.pdf" },
    ],
  },
  {
    kind: "bachelors",
    title: "Efficient Operations on Dynamic Arrays",
    original: "Operações Eficientes em Arrays Dinâmicos",
    authors: "Bruno Monteiro",
    venue: "Bachelor's thesis, UFMG, 2021. Advisor Vinicius dos Santos.",
    href: "/papers/bachelor-thesis.pdf",
    extra: "https://github.com/brunomaletta/DynamicArray",
    links: [
      { label: "PDF", href: "/papers/bachelor-thesis.pdf" },
    ],
  },
];

export type Project = {
  name: string;
  blurb: string;
  href: string;
  lang: string;
  docs?: string;
  related?: string;
};

export const projects: Project[] = [
  {
    name: "biblioteca",
    blurb: "Algorithms, data structures, and primitives for UFMG ICPC teams. Maintained since 2018.",
    href: "https://github.com/brunomaletta/biblioteca",
    docs: "https://brunomaletta.github.io/biblioteca/",
    lang: "C++",
  },
  {
    name: "tgen",
    blurb: "Single-header C++ library for random and adversarial testcase generation.",
    href: "https://github.com/brunomaletta/tgen",
    related: "/writing/introducing-tgen",
    lang: "C++",
  },
  {
    name: "contorno",
    blurb: "Chinese Postman route through every street inside Belo Horizonte's Avenida do Contorno.",
    href: "https://github.com/brunomaletta/contorno",
    related: "/writing/chinese-postman-contorno",
    lang: "C++",
  },
  {
    name: "DynamicPatternMatching",
    blurb: "Code for the master's thesis: suffix-array matching under a dynamic pattern.",
    href: "https://github.com/brunomaletta/DynamicPatternMatching",
    related: "/research",
    lang: "C++",
  },
  {
    name: "DynamicArray",
    blurb: "Code for the bachelor's thesis: integer sets and block-sorted arrays.",
    href: "https://github.com/brunomaletta/DynamicArray",
    related: "/research",
    lang: "C++",
  },
  {
    name: "manim_splay",
    blurb: "Splay-tree animations.",
    href: "https://github.com/brunomaletta/manim_splay",
    lang: "Python",
  },
];

export const races = [
  {
    name: "Todas as ruas dentro da Contorno",
    detail: "Chinese Postman tour of every street inside BH's Contorno. About 180 km, 33 hours.",
    href: "https://www.strava.com/activities/13074215849",
  },
  {
    name: "5 voltas na Contorno",
    detail: "Five laps of Avenida do Contorno.",
    href: "https://www.strava.com/activities/12974143765",
  },
  {
    name: "Caminhos de Rosa 250k",
    detail: "DNF after about 210 km in the sertão of Minas.",
    href: "https://www.strava.com/activities/12348027773",
  },
  {
    name: "Rota das Capitais",
    detail: "Supported FKT, 160 km, 1d 14h 43m 23s. Belo Horizonte → Ouro Preto → Mariana.",
    href: "https://www.strava.com/activities/11443962971",
    fkt: "https://fastestknowntime.com/fkt/bruno-monteiro-rota-das-capitais-2024-05-19",
  },
  {
    name: "Melhor BH → OP",
    detail: "Belo Horizonte to Ouro Preto.",
    href: "https://www.strava.com/activities/12704268944",
  },
  {
    name: "Boi Preto",
    detail: "Trail ultra in the mountains near Belo Horizonte.",
    href: "https://www.strava.com/activities/10390975665",
  },
  {
    name: "Rotatória",
    detail: "About 45 km and 150 laps of a roundabout in Anchieta.",
    href: "https://www.strava.com/activities/11076663147",
  },
  {
    name: "Maior subida",
    detail: "Mount Pilatus.",
    href: "https://www.strava.com/activities/12514970872",
  },
];

export const pbs = [
  { dist: "5k", time: "19:30", note: "3:54/km", href: "https://www.strava.com/activities/10806443050" },
  { dist: "10k", time: "41:00", note: "4:06/km", href: "https://www.strava.com/activities/10720147503" },
  { dist: "Half", time: "1:32:33", note: "4:23/km", href: "https://www.strava.com/activities/11178934994" },
  { dist: "Marathon", time: "3:24:49", note: "4:51/km", href: "https://www.strava.com/activities/10979710801" },
];

export const film = {
  title: "Rota das Capitais",
  youtube: "https://www.youtube.com/embed/ApCRBn9fX2g",
  watch: "https://www.youtube.com/watch?v=ApCRBn9fX2g",
  blurb:
    "A film of the Fastest Known Time on a 160 km route connecting three former capitals of Minas Gerais: Belo Horizonte, Ouro Preto, and Mariana. 1 day, 14 hours, 43 minutes, 23 seconds.",
};

export const people = [
  {
    name: "Leonhard Euler",
    years: "1707–1783",
    photo: "/people/euler.jpg",
    note: "Invented much of modern mathematics: complex numbers, graph theory, and tools we still use every day.",
  },
  {
    name: "Charles Darwin",
    years: "1809–1882",
    photo: "/people/darwin.jpg",
    note: "Gave the living world a simple mechanism: evolution by natural selection.",
  },
  {
    name: "Vladimir Lenin",
    years: "1870–1924",
    photo: "/people/lenin.jpg",
    note: "Organized and led the first lasting socialist revolution.",
  },
  {
    name: "Alan Turing",
    years: "1912–1954",
    photo: "/people/turing.jpg",
    note: "Defined the Turing machine and, with it, the idea of computation itself.",
  },
  {
    name: "Robert Tarjan",
    years: "1948–",
    photo: "/people/tarjan.jpg",
    note: "Invented splay trees, union-find, strongly connected components, and a lot of what we still teach as basic data structures.",
  },
];

export const other = [
  {
    title: "Started coding at the age of 6 months",
    detail: "Photographic evidence.",
    href: "/codando.jpg",
  },
  {
    title: "Rubik's Cube",
    detail: "Single 10.65 s. Average of 5: 13.45.",
  },
  {
    title: "Breath hold",
    detail: "3 min 4 s, underwater.",
  },
];
