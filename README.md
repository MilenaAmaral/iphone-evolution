# iPhone Evolution

Experiência web interativa (portfólio) mostrando a evolução de design do
iPhone, do modelo original de 2007 ao iPhone 18 Pro Max de 2026. Projeto
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

## Modelos 3D utilizados

A interface utiliza somente dois modelos 3D reais:

- `public/models/iphone_1st_generation.glb` — iPhone original, 2007
- `public/models/iphone-18-pro-max.glb` — iPhone 18 Pro Max, 2026

As gerações intermediárias aparecem exclusivamente como conteúdo textual na
timeline. Outros arquivos `.glb` podem permanecer em `public/models`, mas não
são importados, pré-carregados ou renderizados pela interface.

Validação rápida:

```bash
npm run check:models
```

Esse script confirma se os dois modelos ativos da experiência existem na pasta pública.

## Estrutura do projeto

```
public/
  models/            → arquivos GLB preservados; somente o primeiro iPhone
                       e o iPhone 18 Pro Max são usados pela interface

src/
  main.jsx           → ponto de entrada; monta <App /> no #root
  App.jsx             → layout raiz: abertura, timeline interativa e
                       comparação final
  App.css / index.css → App.css só resolve o layout raiz; index.css tem o
                       reset global e os tokens de design (cores, fontes)

  data/
    devices.js         → especificações técnicas históricas verificadas
    evolutionGenerations.js → dados estruturados da timeline de 2007 a 2026

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
      Hero.jsx/.css             → abertura da página
      RealIphonesSection.jsx/.css → timeline textual, informações e viewer
                   sob demanda dos dois extremos
      CompareSection.jsx/.css   → comparação final entre 2007 e 2026

    timeline/
      Timeline.jsx/.css → trilha clicável com um marcador por geração;
                          lê/escreve o índice ativo no store

    phone/
      IphoneViewer.jsx/.css → Canvas do React Three Fiber com OrbitControls,
              Suspense, iluminação e pixel ratio controlado
      IphoneModel.jsx        → enquadra e renderiza um dos dois GLBs ativos
      PhoneInfo.jsx/.css    → painel com ano, nome e destaques do aparelho ativo
```

## Estado atual

- **Timeline**: 20 gerações textuais, com seleção, transição Motion e scroll
  horizontal suave para manter o item ativo visível.
- **3D**: o primeiro iPhone é carregado no início. O iPhone 18 Pro Max só é
  solicitado quando 2026 é selecionado ou quando a comparação final entra em
  cena.
- **Performance**: o viewer usa `Suspense`, `frameloop="demand"`, pixel ratio
  máximo de 1.5 e desmontagem quando a timeline sai do viewport. Os GLBs
  intermediários não são pré-carregados nem renderizados.
- **Dados**: informações ausentes no dataset aparecem como "Não disponível no
  projeto", sem valores estimados.
