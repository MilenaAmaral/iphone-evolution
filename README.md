# iPhone Evolution

Experiência web interativa de portfólio mostrando a evolução do iPhone, com foco em uma experiência visual limpa, navegação por timeline e capítulos 3D selecionados.

Projeto original, não afiliado, endossado ou patrocinado pela Apple Inc. Os dados técnicos exibidos são baseados em informações públicas. Texto, direção de arte, código e composição visual são autorais.

Stack: React + Vite (JavaScript) · Three.js · React Three Fiber · @react-three/drei · GSAP · Zustand.

## Sobre o projeto

O projeto começou com uma proposta mais ampla, com diversos produtos e experiências 3D. Durante o desenvolvimento, o escopo foi simplificado para concentrar a experiência na evolução do iPhone e no capítulo do iPhone Duo.

Essa decisão tornou a aplicação mais prática, limpa e performática, mantendo o 3D como parte importante da experiência sem depender excessivamente desse recurso.

## Rodando localmente

```bash
npm install
npm run dev
```

## Estrutura do projeto

```text
public/
└── models/
    └── modelos GLB existentes e registro de licenças

src/
├── main.jsx
├── App.jsx
├── App.css
├── index.css
│
├── data/
│   ├── devices.js
│   ├── iphoneCatalog.js
│   └── appleProducts.js
│
├── store/
│   └── useExperienceStore.js
│
└── components/
    ├── layout/
    │   ├── Navigation.jsx/.css
    │   └── Footer.jsx/.css
    │
    ├── sections/
    │   ├── Hero.jsx/.css
    │   ├── EvolutionOverview.jsx/.css
    │   ├── FeaturedIphoneSection.jsx/.css
    │   ├── LatestLaunchSection.jsx/.css
    │   └── CompareSection.jsx/.css
    │
    ├── shared/
    │   └── SpecList.jsx/.css
    │
    ├── timeline/
    │   └── Timeline.jsx/.css
    │
    └── phone/
        ├── PhoneViewer.jsx/.css
        ├── Product3D.jsx/.css
        └── PhoneModel.jsx
```

## Estado atual

* **Experiência:** Início, Evolução da história do iPhone, Último lançamento com iPhone Duo e Comparar.

* **Evolução:** timeline visual mostrando a evolução do iPhone de 2007 até a atualidade.

* **3D:** modelos 3D utilizados de forma pontual nos principais momentos da experiência, evitando carregar elementos 3D sem necessidade.

* **Performance:** `Suspense`, `useInView`, cache do GLTFLoader, preload controlado e descarte explícito de geometrias, materiais e texturas.

* **Assets:** modelos 3D otimizados e organizados em `public/models/`. Os arquivos originais ficam em `models-source/`.

Para regerar os modelos otimizados:

```bash
npm run optimize:models
```

A otimização de texturas WebP exige o `sharp` instalado localmente:

```bash
npm i -D sharp
```

* **Licenças:** consulte `public/models/MODEL_LICENSES.md` antes de publicar o projeto ou adicionar novos modelos.

## Performance

O projeto foi desenvolvido considerando o impacto dos modelos 3D no carregamento da página.

Os recursos 3D são carregados conforme a necessidade da experiência, evitando que todos os modelos sejam inicializados logo no primeiro carregamento.

Também foi utilizada divisão de chunks para separar dependências maiores, como React, Zustand, Three.js e GSAP.

## Tecnologias utilizadas

* React
* Vite
* JavaScript
* Three.js
* React Three Fiber
* @react-three/drei
* GSAP
* Zustand

## Licença e uso dos modelos

Antes de publicar ou adicionar novos modelos 3D, consulte:

```text
public/models/MODEL_LICENSES.md
```

Os modelos utilizados no projeto podem possuir licenças e condições de uso específicas.

## Aviso

Apple, iPhone e demais marcas relacionadas são propriedades de seus respectivos detentores.

Este projeto é independente e não possui afiliação, endosso ou patrocínio da Apple Inc.
