import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchProjects, fetchProjectCoverMap } from '../api/client'
import './Home.css'

const PROGRAMME_BADGE = {
  'erasmus': '',
  'creative-europe': 'badge--red',
  'esc': 'badge--yellow',
}

const CARD_ACCENT = {
  'erasmus': '',
  'creative-europe': 'card--red',
  'esc': 'card--yellow',
}

const STATS = [
  { num: '9', label: 'European projects' },
  { num: '15+', label: 'Partner organisations' },
  { num: '6', label: 'Countries' },
]

export default function Home() {
  const [covers, setCovers] = useState({})
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    fetchProjects().then((list) => {
      setFeatured(list.filter(p => p.featured))
    })
    fetchProjectCoverMap().then(setCovers)
  }, [])

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero__inner container">
          <div className="hero__eyebrow">European Projects · buinho.eu</div>
          <h1 className="hero__headline">
            A rural fablab,<br/>
            building Europe.
          </h1>
          <p className="hero__sub">
            Nine European-funded projects in education, culture and digital fabrication —
            with fifteen partners across six countries.
          </p>
          <Link to="/projects" className="hero__cta">
            Explore our projects <span>→</span>
          </Link>
        </div>
        <div className="hero__chip-row container">
          <span><strong>Erasmus+</strong></span>
          <span className="hero__dot">·</span>
          <span><strong>Creative Europe</strong></span>
          <span className="hero__dot">·</span>
          <span><strong>European Solidarity Corps</strong></span>
          <span className="hero__cobranded">Co-funded by the European Union</span>
        </div>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="container">
          <div className="stats__row">
            {STATS.map((s, i) => (
              <div key={i} className="stats__item">
                <div className="stats__num">{s.num}</div>
                <div className="stats__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="featured">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Featured</div>
              <h2 className="featured__title">Featured projects</h2>
            </div>
            <Link to="/projects" className="section-link">View all projects →</Link>
          </div>
          <div className="cards">
            {featured.map(p => (
              <article key={p.slug} className={`card ${CARD_ACCENT[p.programmeKey] || ''}`}>
                {covers[p.slug] ? (
                  <div
                    className="card__photo"
                    style={{
                      backgroundImage: `url(${covers[p.slug]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      aspectRatio: '16/9',
                    }}
                    role="img"
                    aria-label={p.title}
                  />
                ) : (
                  <div className="bui-photo bui-photo--16x9 card__photo">
                    <span>{p.title} · photo placeholder</span>
                  </div>
                )}
                <div className="card__body">
                  <span className={`badge ${PROGRAMME_BADGE[p.programmeKey] || ''}`}>
                    {p.programme} {p.action}
                  </span>
                  <div>
                    <div className="card__title">{p.title}</div>
                    <div className="card__year">{p.period}</div>
                  </div>
                  <p className="card__desc">{p.subtitle || p.description}</p>
                  <div className="card__footer">
                    <div className="flags">
                      {p.countries.map(c => <span key={c} className="flag">{c}</span>)}
                    </div>
                    <Link to={`/projects/${p.slug}`} className="card__link">Learn more →</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMMES STRIP */}
      <section className="programmes">
        <div className="container">
          <div className="programmes__row">
            <div className="programmes__title">Funded through</div>
            <div className="programmes__list">
              {[
                { name: 'Erasmus+', sub: 'EU programme for education, training, youth and sport' },
                { name: 'Creative Europe', sub: 'Culture and creative industries strand' },
                { name: 'European Solidarity Corps', sub: 'Volunteering placements & solidarity projects' },
              ].map(pr => (
                <div key={pr.name} className="programmes__item">
                  <strong>{pr.name}</strong>
                  <span>{pr.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT STRIP */}
      <section className="about-strip">
        <div className="about-strip__inner">
          <div className="about-strip__sentence">
            A FabLab, an artist residency, and a laboratory for <em>European futures</em> — in the heart of Alentejo.
          </div>
          <div className="about-strip__sub">Messejana, Portugal · since 2015</div>
        </div>
      </section>
    </main>
  )
}
