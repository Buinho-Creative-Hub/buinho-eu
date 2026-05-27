import { Link, useLocation } from 'react-router-dom'
import './Nav.css'

export default function Nav() {
  const { pathname } = useLocation()
  const active = pathname === '/' ? 'projects' : pathname.includes('about') ? 'about' : pathname.includes('contact') ? 'contact' : 'projects'

  return (
    <nav className="nav">
      <div className="container nav__inner">
        <Link to="/" className="nav__logo">buinho<span>.eu</span></Link>
        <div className="nav__links">
          <Link to="/" className={active === 'projects' ? 'active' : ''}>Projects</Link>
          <Link to="/about" className={active === 'about' ? 'active' : ''}>About</Link>
          <Link to="/contact" className={active === 'contact' ? 'active' : ''}>Contact</Link>
          <span className="nav__lang"><strong>EN</strong> / PT</span>
        </div>
      </div>
    </nav>
  )
}
