# iPhone Evolution

Experiência web interativa (portfólio) mostrando a evolução de produtos Apple,
com foco no iPhone e em dois capítulos 3D principais. Projeto
original — não afiliado, endossado ou patrocinado pela Apple Inc. Dados
técnicos exibidos são fatos públicos; texto, direção de arte, código e
composição visual são autorais.

Stack: React + Vite (JavaScript) · Three.js · React Three Fiber ·
@react-three/drei · GSAP · Zustand.

## Rodando localmente

```bash
npm install
npm run dev
```

## Estrutura do projeto

```
public/
  models/            → modelos GLB existentes e registro de licenças

src/
  main.jsx           → ponto de entrada; monta <App /> no #root
  App.jsx             → layout raiz: Início, Evolução (primeiro iPhone e
                       iPhone 18 Pro Max), Último lançamento (iPhone Duo)
                       e Comparar
  App.css / index.css → App.css só resolve o layout raiz; index.css tem o
                       reset global e os tokens de design (cores, fontes)

  data/
    devices.js         → especificações históricas do iPhone
    iphoneCatalog.js   → catálogo visual cronológico do iPhone
    appleProducts.js   → iPhones em 3D (1ª geração, 18 Pro Max, Duo) com
                         ficha técnica confirmada

  store/
    useExperienceStore.js → estado global (Zustand): qual geração está
                             ativa. Deliberadamente enxuto — nada que muda
                             a cada frame vive aqui (ver comentário no
                             arquivo).

  components/
    layout/
      Navigation.jsx/.css → cabeçalho fixo com âncoras para as seções
      Footer.jsx/.css      → rodapé com crédito e nota de originalidade

    sections/
      Hero.jsx/.css                  → abertura da página, com CTA e animação GSAP
      EvolutionOverview.jsx/.css     → evolução resumida do iPhone
      FeaturedIphoneSection.jsx/.css → primeiro iPhone e iPhone 18 Pro Max em 3D
      LatestLaunchSection.jsx/.css   → Último lançamento: iPhone Duo em 3D
      CompareSection.jsx/.css        → comparação lado a lado com slider

    shared/
      SpecList.jsx/.css → ficha técnica (confirmado × não divulgado)

    timeline/
      Timeline.jsx/.css → trilha clicável com um marcador por geração;
                          lê/escreve o índice ativo no store

    phone/
      PhoneViewer.jsx/.css → viewer interativo baseado em PhoneScene
      Product3D.jsx/.css   → adaptador 3D reutilizável por categoria
      PhoneModel.jsx        → renderiza um GLB com enquadramento automático
```

## Estado atual

- **Experiência**: Início, Evolução (2007 à atualidade, primeiro iPhone e
  iPhone 18 Pro Max), Último lançamento (iPhone Duo) e Comparar.
- **3D**: o componente `Product3D` reutiliza `PhoneScene` e aceita qualquer
  produto com `modelPath`. Os capítulos 3D só montam o Canvas quando entram
  perto da viewport.
- **Performance**: `Suspense`, `useInView`, cache do GLTFLoader, preload
  controlado e descarte explícito de geometrias, materiais e texturas.
- **Assets**: 4 modelos ativos (logo, iPhone 1ª geração, iPhone 18 Pro Max,
  iPhone Duo), servidos otimizados. Originais em `models-source/`; para
  regerar: `npm run optimize:models` (texturas WebP exigem `sharp`
  instalado localmente: `npm i -D sharp`).
- **Licenças**: consulte `public/models/MODEL_LICENSES.md` antes de publicar
  ou adicionar novos modelos.
