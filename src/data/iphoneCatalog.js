const ORIGINAL_MODEL = '/models/iphone_1st_generation.glb'
const LATEST_MODEL = '/models/iphone-18-pro-max.glb'
const DUO_MODEL = '/models/iphone-duo.glb'

const definitions = [
  ['iphone-original', 'iPhone', 2007, 'A primeira geração combinou telefone, iPod e internet em uma nova experiência touchscreen.', 'Interface multitoque e Safari móvel'],
  ['iphone-3g', 'iPhone 3G', 2008, 'A conectividade 3G e a App Store ampliaram o alcance do iPhone.', '3G, GPS e App Store'],
  ['iphone-3gs', 'iPhone 3GS', 2009, 'Mais velocidade e a primeira câmera do iPhone capaz de gravar vídeo.', 'Desempenho e vídeo'],
  ['iphone-4', 'iPhone 4', 2010, 'Vidro e aço trouxeram uma nova linguagem visual para o iPhone.', 'Retina Display e FaceTime'],
  ['iphone-4s', 'iPhone 4S', 2011, 'Uma câmera melhor e uma nova forma de interagir chegaram ao iPhone.', 'Siri'],
  ['iphone-5', 'iPhone 5', 2012, 'Mais fino e leve, com tela maior e uma nova conexão.', 'Lightning e LTE'],
  ['iphone-5c', 'iPhone 5c', 2013, 'O acabamento colorido levou a personalidade do iPhone para uma nova carcaça.', 'Cores vibrantes'],
  ['iphone-5s', 'iPhone 5s', 2013, 'Biometria e arquitetura de 64 bits marcaram a geração.', 'Touch ID e chip de 64 bits'],
  ['iphone-6', 'iPhone 6', 2014, 'O desenho ficou mais fino, arredondado e ganhou telas maiores.', 'NFC e Apple Pay'],
  ['iphone-6-plus', 'iPhone 6 Plus', 2014, 'A tela grande levou o iPhone para uma nova escala de uso.', 'Primeiro formato Plus'],
  ['iphone-6s', 'iPhone 6s', 2015, 'Uma evolução focada em pressão, câmera e potência.', '3D Touch e vídeo 4K'],
  ['iphone-6s-plus', 'iPhone 6s Plus', 2015, 'O formato Plus recebeu a mesma arquitetura de desempenho da geração S.', 'Tela grande e 3D Touch'],
  ['iphone-se-1', 'iPhone SE', 2016, 'Desempenho moderno encontrou o formato compacto clássico.', 'Potência em formato compacto'],
  ['iphone-7', 'iPhone 7', 2016, 'Resistência à água e uma nova abordagem para áudio e câmeras.', 'IP67 e câmera aprimorada'],
  ['iphone-7-plus', 'iPhone 7 Plus', 2016, 'O formato Plus ganhou um sistema de câmera dupla.', 'Câmera dupla e Modo Retrato'],
  ['iphone-8', 'iPhone 8', 2017, 'O vidro retornou à traseira para viabilizar o carregamento sem fio.', 'Qi e A11 Bionic'],
  ['iphone-8-plus', 'iPhone 8 Plus', 2017, 'O formato Plus combinou vidro, potência e câmera dupla.', 'Retrato com iluminação'],
  ['iphone-x', 'iPhone X', 2017, 'Uma tela quase inteira inaugurou uma nova linguagem de interação.', 'Face ID e OLED'],
  ['iphone-xr', 'iPhone XR', 2018, 'Cor e autonomia trouxeram a experiência de tela inteira para mais pessoas.', 'Liquid Retina e cores'],
  ['iphone-xs', 'iPhone XS', 2018, 'A construção premium evoluiu com mais potência e fotografia computacional.', 'A12 Bionic'],
  ['iphone-xs-max', 'iPhone XS Max', 2018, 'O maior display da família XS levou a experiência premium ao formato Max.', 'Tela Super Retina maior'],
  ['iphone-11', 'iPhone 11', 2019, 'Duas câmeras e o Modo Noturno tornaram a fotografia mais versátil.', 'Ultra grande angular e Modo Noturno'],
  ['iphone-11-pro', 'iPhone 11 Pro', 2019, 'O sistema Pro reuniu três câmeras em uma traseira de vidro texturizado.', 'Sistema de câmeras Pro'],
  ['iphone-11-pro-max', 'iPhone 11 Pro Max', 2019, 'Mais tela e autonomia no maior formato da geração Pro.', 'Autonomia e tela Super Retina XDR'],
  ['iphone-se-2', 'iPhone SE (2ª geração)', 2020, 'O formato conhecido recebeu o chip da geração mais avançada.', 'A13 Bionic em formato compacto'],
  ['iphone-12', 'iPhone 12', 2020, 'O desenho plano voltou acompanhado de OLED, 5G e MagSafe.', '5G e MagSafe'],
  ['iphone-12-mini', 'iPhone 12 mini', 2020, 'A experiência de tela inteira coube em um corpo compacto.', 'Tela inteira em formato mini'],
  ['iphone-12-pro', 'iPhone 12 Pro', 2020, 'A linha Pro ganhou LiDAR e uma construção em aço mais refinada.', 'LiDAR e fotografia Pro'],
  ['iphone-12-pro-max', 'iPhone 12 Pro Max', 2020, 'O maior sensor da geração levou o sistema Pro a outra escala.', 'Sensor principal maior'],
  ['iphone-13', 'iPhone 13', 2021, 'Mais autonomia e recursos de cinema amadureceram o desenho familiar.', 'Modo Cinema'],
  ['iphone-13-mini', 'iPhone 13 mini', 2021, 'A experiência completa permaneceu disponível no menor formato.', 'Desempenho em formato mini'],
  ['iphone-13-pro', 'iPhone 13 Pro', 2021, 'ProMotion e macrofotografia elevaram a tela e as câmeras.', 'ProMotion e macro'],
  ['iphone-13-pro-max', 'iPhone 13 Pro Max', 2021, 'O maior Pro combinou tela de 120 Hz e autonomia de referência.', 'ProMotion no formato Max'],
  ['iphone-se-3', 'iPhone SE (3ª geração)', 2022, 'O clássico compacto recebeu conectividade 5G e o chip A15.', '5G e A15 Bionic'],
  ['iphone-14', 'iPhone 14', 2022, 'Segurança e fotografia computacional ganharam protagonismo.', 'Detecção de colisão e SOS via satélite'],
  ['iphone-14-plus', 'iPhone 14 Plus', 2022, 'O formato grande voltou à linha padrão com mais autonomia.', 'Tela grande na linha padrão'],
  ['iphone-14-pro', 'iPhone 14 Pro', 2022, 'A Dynamic Island transformou o espaço da câmera frontal em interface.', 'Dynamic Island e câmera de 48 MP'],
  ['iphone-14-pro-max', 'iPhone 14 Pro Max', 2022, 'O maior Pro combinou o novo recorte dinâmico com a câmera principal de alta resolução.', 'Always-On e tela ProMotion'],
  ['iphone-15', 'iPhone 15', 2023, 'USB-C e Dynamic Island chegaram à linha padrão.', 'USB-C e Dynamic Island'],
  ['iphone-15-plus', 'iPhone 15 Plus', 2023, 'O formato Plus combinou tela ampla, leveza e USB-C.', 'Tela grande e USB-C'],
  ['iphone-15-pro', 'iPhone 15 Pro', 2023, 'Titânio, USB-C e um botão Action redesenharam a experiência Pro.', 'Titânio e Action button'],
  ['iphone-15-pro-max', 'iPhone 15 Pro Max', 2023, 'O zoom tetraprisma marcou a câmera do maior Pro.', 'Zoom óptico de 5x'],
  ['iphone-16', 'iPhone 16', 2024, 'Controles dedicados aproximaram a câmera e as ações do usuário.', 'Camera Control e botão Action'],
  ['iphone-16-plus', 'iPhone 16 Plus', 2024, 'O formato grande recebeu o novo desenho de câmeras e controles.', 'Apple Intelligence e tela grande'],
  ['iphone-16-pro', 'iPhone 16 Pro', 2024, 'Mais tela, titânio e vídeo avançado definiram a geração Pro.', 'Câmera Fusion de 48 MP'],
  ['iphone-16-pro-max', 'iPhone 16 Pro Max', 2024, 'O maior Pro combinou autonomia excepcional e captura de vídeo profissional.', 'Autonomia e vídeo 4K a 120 fps'],
  ['iphone-16e', 'iPhone 16e', 2025, 'O modelo essencial trouxe a geração 16 para uma experiência mais acessível.', 'Apple Intelligence e modem C1'],
  ['iphone-17', 'iPhone 17', 2025, 'ProMotion chegou ao modelo padrão junto de uma câmera frontal Center Stage.', 'Tela ProMotion de 120 Hz'],
  ['iphone-air', 'iPhone Air', 2025, 'Um desenho extremamente fino combinou leveza e desempenho Pro.', 'Novo formato Air'],
  ['iphone-17-pro', 'iPhone 17 Pro', 2025, 'A linha Pro avançou em desempenho e no sistema de câmeras.', 'Desempenho Pro e câmera Fusion'],
  ['iphone-17-pro-max', 'iPhone 17 Pro Max', 2025, 'O maior Pro levou a autonomia e a captura avançada ainda mais longe.', 'Formato Max e câmeras Pro'],
  ['iphone-17e', 'iPhone 17e', 2026, 'A linha essencial atualizou o formato acessível com a plataforma mais recente.', 'Desempenho e valor'],
  ['iphone-duo', 'iPhone Duo', 2026, 'A primeira experiência dobrável da linha amplia o iPhone para um novo formato.', 'Tela dobrável e modo posável'],
  ['iphone-18-pro', 'iPhone 18 Pro', 2026, 'A geração Pro de 2026 avançou em câmera, tela e inteligência pessoal.', 'Câmera principal com abertura variável'],
  ['iphone-18-pro-max', 'iPhone 18 Pro Max', 2026, 'O modelo mais recente da linha convencional reúne o maior espaço de tela e o sistema Pro completo.', 'Apex da evolução do iPhone'],
]

const getImagePath = (id, side) => `/images/iphones/${id}-${side}.svg`

function getDeviceProfile(year) {
  if (year <= 2009) return { display: '3,5" LCD', processor: 'Plataforma ARM', camera: 'Câmera traseira única', weight: 'Design compacto', thickness: 'Corpo espesso' }
  if (year <= 2013) return { display: 'Retina LCD', processor: 'Apple Silicon', camera: 'Câmera traseira aprimorada', weight: 'Corpo leve', thickness: 'Design fino' }
  if (year <= 2017) return { display: 'Retina HD', processor: 'Apple Silicon', camera: 'Câmera avançada', weight: 'Alumínio e vidro', thickness: 'Design refinado' }
  if (year <= 2020) return { display: 'Super Retina OLED', processor: 'Apple Silicon', camera: 'Sistema de câmeras múltiplas', weight: 'Vidro e alumínio/aço', thickness: 'Tela inteira' }
  if (year <= 2024) return { display: 'Super Retina XDR OLED', processor: 'Apple Silicon', camera: 'Sistema de câmeras avançado', weight: 'Vidro e alumínio/titânio', thickness: 'Tela inteira' }
  return { display: 'Super Retina XDR OLED', processor: 'Apple Silicon de nova geração', camera: 'Sistema de câmeras Fusion/Pro', weight: 'Materiais de última geração', thickness: 'Design contemporâneo' }
}

export const iphoneCatalog = definitions.map(([id, name, year, description, innovation], index) => {
  const isOriginal = id === 'iphone-original'
  const isLatest3d = id === 'iphone-18-pro-max'
  const isDuo = id === 'iphone-duo'
  const is3d = isOriginal || isLatest3d || isDuo
  const profile = getDeviceProfile(year)

  return {
    id,
    name,
    year,
    generation: index,
    type: is3d ? '3d' : 'image',
    description,
    innovation,
    ...profile,
    modelPath: isOriginal ? ORIGINAL_MODEL : isLatest3d ? LATEST_MODEL : isDuo ? DUO_MODEL : undefined,
    front: is3d ? undefined : getImagePath(id, 'front'),
    back: is3d ? undefined : getImagePath(id, 'back'),
    image: is3d ? undefined : getImagePath(id, 'front'),
    timelineHighlight: true,
    highlights: [],
    storage: 'Varia conforme a configuração',
    connectivity: year >= 2020 ? '5G / Wi-Fi' : year >= 2012 ? 'LTE / Wi-Fi' : 'Rede móvel / Wi-Fi',
  }
})

export const getIphoneById = (id) => iphoneCatalog.find((device) => device.id === id)

export default iphoneCatalog