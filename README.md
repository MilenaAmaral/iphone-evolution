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
  App.jsx             → layout raiz: abertura, evolução resumida, capítulos
                       do iPhone e Produtos Apple
  App.css / index.css → App.css só resolve o layout raiz; index.css tem o
                       reset global e os tokens de design (cores, fontes)

  data/
    devices.js         → especificações históricas do iPhone
    iphoneCatalog.js   → catálogo visual cronológico do iPhone
    appleProducts.js   → primeiro/último produto por categoria Apple

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
      FeaturedIphoneSection.jsx/.css → primeiro e último iPhone em 3D
      AppleProductsSection.jsx/.css  → comparação entre categorias Apple

    timeline/
      Timeline.jsx/.css → trilha clicável com um marcador por geração;
                          lê/escreve o índice ativo no store

    phone/
      PhoneViewer.jsx/.css → viewer interativo baseado em PhoneScene
      Product3D.jsx/.css   → adaptador 3D reutilizável por categoria
      PhoneModel.jsx        → renderiza um GLB com enquadramento automático
```

## Estado atual

- **Experiência**: Início, evolução resumida de 2007 à atualidade, primeiro
  iPhone, último iPhone e Produtos Apple.
- **3D**: o componente `Product3D` reutiliza `PhoneScene` e aceita qualquer
  produto com `modelPath`. Os capítulos 3D só montam o Canvas quando entram
  perto da viewport.
- **Performance**: `Suspense`, `useInView`, cache do GLTFLoader, preload
  controlado e descarte explícito de geometrias, materiais e texturas.
- **Assets**: apenas modelos com arquivo local disponível são renderizados.
  Apple Watch, iPad, MacBook e AirPods permanecem em estado pendente até que
  exista uma fonte e uma licença de redistribuição verificáveis.
- **Licenças**: consulte `public/models/MODEL_LICENSES.md` antes de publicar
  ou adicionar novos modelos.
