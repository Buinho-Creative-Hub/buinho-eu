import { Link } from 'react-router-dom'
import './Footer.css'

const EUFlag = () => (
  <svg className="eu-flag" viewBox="0 0 90 60" aria-hidden="true">
    <rect width="90" height="60" fill="#003399"/>
    <defs>
      <polygon id="eu-star" fill="#FFCC00"
        points="0,-3 0.674,-0.927 2.853,-0.927 1.09,0.354 1.763,2.427 0,1.146 -1.763,2.427 -1.09,0.354 -2.853,-0.927 -0.674,-0.927"/>
    </defs>
    {[[45,12],[54,14.41],[60.59,21],[63,30],[60.59,39],[54,45.59],[45,48],[36,45.59],[29.41,39],[27,30],[29.41,21],[36,14.41]].map(([x,y],i) => (
      <use key={i} href="#eu-star" x={x} y={y}/>
    ))}
  </svg>
)

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cols">
          <div className="footer__brand">
            <div className="footer__logo">buinho<span>.eu</span></div>
            <p className="footer__tag">
              The European projects portfolio of Buinho Association — a rural fablab and creative residency in Messejana, Alentejo.
            </p>
          </div>
          <div>
            <div className="footer__heading">Navigate</div>
            <div className="footer__links">
              <Link to="/projects">All projects</Link>
              <Link to="/projects">Programmes</Link>
              <Link to="/projects">Partners</Link>
              <a href="https://buinho.pt" target="_blank" rel="noreferrer">About Buinho</a>
              <Link to="/contact">Press kit</Link>
            </div>
          </div>
          <div>
            <div className="footer__heading">Get in touch</div>
            <div className="footer__contact">
              <span><strong>Buinho Association</strong></span>
              <span>Rua Nova de São Brás<br/>7540-013 Messejana, Aljustrel<br/>Portugal</span>
              <span><a href="mailto:europe@buinho.pt">europe@buinho.pt</a></span>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <div className="footer__eu">
            <EUFlag />
            <span className="footer__eu-text">Co-funded by the<br/>European Union</span>
          </div>
          <span className="footer__copy">© 2026 Buinho Association · NIPC 513 287 921</span>
        </div>
      </div>
    </footer>
  )
}
