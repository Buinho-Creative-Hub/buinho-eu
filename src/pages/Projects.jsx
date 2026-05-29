import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProjects, fetchProjectCoverMap } from '../api/client'
import './Projects.css'

const FILTERS = [
  { key: 'all', label: 'All projects' },
  { key: 'erasmus', label: 'Erasmus+' },
  { key: 'creative-europe', label: 'Creative Europe' },
  { key: 'esc', label: 'ESC' },
]

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

export default function Projects() {
  const [active, setActive] = useState('all')
  const [covers, setCovers] = useState({})
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects().then((list) => {
      setProjects(list)
      setLoading(false)
    })
    fetchProjectCoverMap().then(setCovers)
  }, [])

  const filtered = active === 'all'
    ? projects
    : projects.filter(p => p.programmeKey === active)

  return (
    <main>
      <header className="projects-header">
        <div className="container">
          <div className="section-eyebrow">Portfolio</div>
          <h1 className="projects-header__title">Our European projects</h1>
          <p className="projects-header__sub">
            Funded projects in education, culture, and digital fabrication —
            led from Messejana, Portugal.
          </p>
        </div>
      </header>

      <section className="projects-body">
        <div className="container">
          <div className="filters">
            {FILTERS.map(f => (
              <button
                key={f.key}
                className={`filter-btn ${active === f.key ? 'active' : ''}`}
                onClick={() => setActive(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p style={{ padding: '40px 0', color: '#9e9e9a' }}>A carregar projectos…</p>
          ) : filtered.length === 0 ? (
            <p style={{ padding: '40px 0', color: '#9e9e9a' }}>Sem projectos nesta categoria.</p>
          ) : (
            <div className="projects-grid">
              {filtered.map(p => (
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
                      <span>{p.title}</span>
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
          )}
        </div>
      </section>
    </main>
  )
}
