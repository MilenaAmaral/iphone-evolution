# iPhone Evolution

Experiência web interativa (portfólio) mostrando a evolução de design do
iPhone, geração a geração, com modelos 3D navegados por scroll. Projeto
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
  models/            → um .glb por geração (19 no total), gerados por
                       scripts/generate-device-models.mjs — ver "Estado
                       atual" abaixo

src/
  main.jsx           → ponto de entrada; monta <App /> no #root
  App.jsx             → layout raiz: posiciona o Canvas 3D (PhoneViewer)
                       fixo atrás das seções DOM e as encaixa em ordem
  App.css / index.css → App.css só resolve o layout raiz; index.css tem o
                       reset global e os tokens de design (cores, fontes)

  data/
    devices.js         → dataset canônico: um objeto por geração de iPhone
                          (specs, cores, destaques históricos, caminho do
                          modelo 3D). Fonte de verdade única dos dados.

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
      Hero.jsx/.css            → abertura da página, com animação GSAP de entrada
      EvolutionSection.jsx/.css → seção onde o usuário navega pelas gerações
                                  (Timeline + PhoneInfo), com reveal GSAP
      SpecsSection.jsx/.css     → ficha técnica completa do aparelho ativo

    timeline/
      Timeline.jsx/.css → trilha clicável com um marcador por geração;
                          lê/escreve o índice ativo no store

    phone/
      PhoneViewer.jsx/.css → dono do <Canvas> do React Three Fiber; luz,
                              ambiente e sombra de contato da cena
      PhoneModel.jsx        → renderiza o modelo 3D do aparelho ativo (.glb
                              gerado — ver "Estado atual" abaixo)
      PhoneInfo.jsx/.css    → painel com ano, nome e destaques do aparelho ativo
```

## Estado atual (o que ainda é placeholder)

- **Modelos 3D**: os 19 aparelhos têm cada um o seu `.glb` real, gerado por
  `scripts/generate-device-models.mjs` a partir de campos já verificados de
  `devices.js` (tamanho ← tela real, espessura ← espessura real, cor ←
  primeira cor de lançamento, nº de "lentes" ← contagem real de câmeras).
  São modelos deliberadamente ESTILIZADOS e ABSTRATOS — um corpo
  retangular simples, sem tentar copiar a curvatura, o acabamento ou o
  desenho exato de nenhum iPhone real — não fotorrealistas, não feitos por
  um artista 3D, não traçados de fotos da Apple. Isso ainda cumpre parte
  da Fase 0 do roadmap do documento de arquitetura do projeto; o passo
  seguinte (opcional, futuro) é trocar cada `.glb` por um modelo definitivo
  (fotogrametria real ou trabalho de um artista 3D) sem precisar mudar
  nenhum componente React, já que `PhoneModel.jsx` só lê o caminho do
  arquivo (ver comentário de `modelPath` em `devices.js`).
- **Navegação**: a troca de geração hoje é por clique na Timeline. O
  scroll ainda não dirige a câmera 3D nem a troca automática de aparelho
  — isso entra nas fases seguintes do roadmap (ScrollControls + GSAP
  ScrollTrigger orquestrando câmera e conteúdo juntos).
- **Dados**: todos os campos de `devices.js` são especificações técnicas
  reais e verificadas (ano, tela, processador, câmera, peso, espessura,
  cores, fatos históricos). Nenhum valor foi inventado. Os dois únicos
  campos sem confirmação oficial da Apple (abertura da câmera do iPhone 3G
  e do 3GS) dizem isso explicitamente no próprio texto, em vez de estimar
  um número.
