import './Navigation.css'

// Navigation: cabeçalho fixo com o nome do projeto e âncoras para as
// seções principais. Componente puro de DOM, sem estado próprio.
const LINKS = [
  { href: '#topo', label: 'Início' },
  { href: '#evolucao', label: 'Evolução' },
  { href: '#specs', label: 'Ficha técnica' },
]

function Navigation() {
  return (
    <header className="navigation">
      <a className="navigation__logo" href="#topo">
        iPhone Evolution
      </a>
      <nav aria-label="Navegação principal">
        <ul className="navigation__links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Navigation
