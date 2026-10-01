# iPhone Evolution

Experiência web interativa de portfólio mostrando a evolução do iPhone, com foco em uma experiência visual limpa, navegação por timeline e capítulos 3D selecionados.

Projeto original, não afiliado, endossado ou patrocinado pela Apple Inc. Os dados técnicos exibidos são baseados em informações públicas. Texto, direção de arte, código e composição visual são autorais.

**Tecnologias:** React + Vite (JavaScript) · Three.js · React Three Fiber · @react-three/drei · GSAP · Zustand

## Projeto online

🔗 **[Acessar o iPhone Evolution](https://iphone-evolution-five.vercel.app/)**

## Sobre o projeto

O projeto começou com uma proposta mais ampla, com diversos produtos e experiências 3D. Durante o desenvolvimento, o escopo foi simplificado para concentrar a experiência na evolução do iPhone e no capítulo do iPhone Duo.

Essa decisão tornou a aplicação mais prática, limpa e performática, mantendo o 3D como parte importante da experiência sem depender excessivamente desse recurso.

## Experiência

* **Início:** apresentação do projeto e acesso às principais seções.
* **Evolução:** timeline visual mostrando a evolução do iPhone de 2007 até a atualidade.
* **Último lançamento:** capítulo dedicado ao iPhone Duo, com experiência 3D.
* **Comparar:** comparação entre modelos selecionados.

## Rodando localmente

Clone o repositório e instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

A aplicação será disponibilizada pelo Vite no endereço local informado no terminal.

## Estrutura do projeto

```text
public/
└── models/
    ├── modelos 3D otimizados
    └── MODEL_LICENSES.md

src/
├── components/
│   ├── layout/
│   ├── sections/
│   ├── shared/
│   ├── timeline/
│   └── phone/
├── data/
├── store/
├── App.jsx
├── App.css
├── index.css
└── main.jsx

models-source/
└── arquivos originais dos modelos 3D

scripts/
└── scripts relacionados à otimização dos modelos
```

## Performance

Como o projeto utiliza modelos 3D, alguns cuidados foram adotados para evitar carregamentos desnecessários:

* carregamento dos modelos 3D conforme a necessidade da experiência;
* uso de `Suspense` para controlar o carregamento dos componentes 3D;
* carregamento baseado na proximidade da seção com a área visível;
* cache do `GLTFLoader` para evitar carregamentos repetidos;
* preload controlado dos modelos;
* descarte de geometrias, materiais e texturas quando necessário;
* divisão dos principais pacotes em chunks no build do Vite;
* modelos 3D otimizados para reduzir o tamanho dos arquivos.

A ideia foi manter o visual 3D sem deixar que ele prejudicasse o carregamento e a navegação da aplicação.

## Modelos 3D

Os modelos utilizados no projeto foram organizados separando os arquivos originais dos arquivos preparados para uso na aplicação.

Os arquivos originais ficam em:

```text
models-source/
```

Os modelos utilizados pela aplicação ficam em:

```text
public/models/
```

Para otimizar os modelos disponíveis, o projeto possui um script específico:

```bash
npm run optimize:models
```

As informações de licença e atribuição dos modelos utilizados estão disponíveis em:

```text
public/models/MODEL_LICENSES.md
```

## Tecnologias utilizadas

### React

Utilizado para construir a interface e organizar a aplicação em componentes reutilizáveis.

### Vite

Utilizado como ferramenta de desenvolvimento e build do projeto.

### Three.js

Utilizado para trabalhar com os modelos e elementos 3D.

### React Three Fiber

Utilizado para integrar o Three.js à estrutura de componentes do React.

### @react-three/drei

Utilizado para recursos e componentes auxiliares da experiência 3D.

### GSAP

Utilizado para animações e transições da interface.

### Zustand

Utilizado para controlar estados compartilhados da experiência.

## Objetivo do projeto

O projeto foi desenvolvido como parte do meu portfólio para praticar e demonstrar conhecimentos em desenvolvimento Front-end, principalmente com React, JavaScript, animações e experiências 3D para a web.

Durante o desenvolvimento, também foi um exercício de organização de código, otimização de assets e definição de escopo para uma aplicação mais leve e funcional.

## Aviso

Este é um projeto independente desenvolvido para fins educacionais e de portfólio.

iPhone e demais marcas relacionadas são propriedades de seus respectivos titulares. Este projeto não possui vínculo, afiliação, patrocínio ou endosso da Apple Inc.
