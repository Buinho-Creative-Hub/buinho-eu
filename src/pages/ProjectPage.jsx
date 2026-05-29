import { useParams, Link, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchProjectBySlug, fetchProjectPhotos, uploadUrl } from '../api/client'
import './ProjectPage.css'

const PROGRAMME_BADGE = {
  'erasmus': '',
  'creative-europe': 'badge--red',
  'esc': 'badge--yellow',
}

export default function ProjectPage() {
  const { slug } = useParams()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetchProjectBySlug(slug).then((p) => {
      if (p) setProject(p)
      else setNotFound(true)
      setLoading(false)
    })
    fetchProjectPhotos(slug).then(setPhotos)
  }, [slug])

  if (loading) {
    return (
      <main>
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <p>A carregar projecto…</p>
        </div>
      </main>
    )
  }

  if (notFound || !project) return <Navigate to="/projects" replace />

  const badgeMod = PROGRAMME_BADGE[project.programmeKey] || ''
  const statusMod = `status--${project.status}`
  const hasObjectives = project.objectives && project.objectives.length > 0
  const hasOutputs = project.outputs && project.outputs.length > 0
  const hasPartners = project.partners && project.partners.length > 0

  return (
    <main>
      {/* PAGE HEADER */}
      <header className="projhead">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/projects">Projects</Link>
            <span>/</span>
            <strong>{project.title}</strong>
          </div>
          <h1 className="projhead__title">
            {project.title}{project.subtitle ? ` — ${project.subtitle}` : ''}
          </h1>
          <div className="projhead__meta">
            <span className={`badge ${badgeMod}`}>{project.programme} {project.action}</span>
            {project.period && <span className="projhead__years">{project.period}</span>}
            {project.status && (
              <span className={`status ${statusMod}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            )}
            {project.ref && (
              <span className="projhead__ref">Ref. <strong>{project.ref}</strong></span>
            )}
          </div>
        </div>
      </header>

      {/* BODY */}
      <section className="projbody">
        <div className="container">
          <div className="projbody__grid">
            <div className="projbody__main">
              {project.description && <p className="projbody__lead">{project.description}</p>}

              {hasObjectives && (
                <>
                  <h2>Objectives</h2>
                  <ul className="bullets">
                    {project.objectives.map((obj, i) => (
                      <li key={i}><strong>{obj.title}</strong> {obj.text}</li>
                    ))}
                  </ul>
                </>
              )}

              {hasOutputs && (
                <>
                  <h2>Outputs &amp; results</h2>
                  <ul className="bullets bullets--red">
                    {project.outputs.map((out, i) => (
                      <li key={i}><strong>{out.ref} — {out.title}</strong> · {out.text}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <aside className="sidebar">
              <div className="sidebar__section">
                <div className="sidebar__label">Project details</div>
                <dl className="sidebar__rows">
                  <div className="sidebar__row"><dt>Programme</dt><dd>{project.programme} {project.action}</dd></div>
                  {project.ref && <div className="sidebar__row"><dt>Reference</dt><dd className="sidebar__ref">{project.ref}</dd></div>}
                  {project.period && <div className="sidebar__row"><dt>Period</dt><dd>{project.period}</dd></div>}
                  {project.role && <div className="sidebar__row"><dt>Buinho role</dt><dd>{project.role}</dd></div>}
                  {project.budget && <div className="sidebar__row"><dt>Total budget</dt><dd>{project.budget}</dd></div>}
                  {project.buinhoBudget && <div className="sidebar__row"><dt>Buinho budget</dt><dd>{project.buinhoBudget}</dd></div>}
                </dl>
              </div>
              {hasPartners && (
                <div className="sidebar__section">
                  <div className="sidebar__label">Consortium</div>
                  <div className="sidebar__partners">
                    {project.partners.map((p, i) => (
                      <div key={i} className="sidebar__partner">
                        {p.code && <span className="flag">{p.code}</span>}
                        <div>
                          <div className="sidebar__partner__name">{p.name}</div>
                          {(p.country || p.role) && (
                            <div className="sidebar__partner__meta">
                              {[p.country, p.role].filter(Boolean).join(' · ')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* GALLERY — fotos reais do CMS */}
      {photos.length > 0 && (
        <section className="gallery">
          <div className="container">
            <div className="section-head" style={{ marginBottom: 40 }}>
              <div>
                <div className="section-eyebrow">Gallery</div>
                <h2>From the project.</h2>
              </div>
              {photos.length > 5 && <span className="section-link">{photos.length} photos</span>}
            </div>
            <div className="gallery-grid">
              {photos.slice(0, 5).map((photo, i) => (
                <div
                  key={photo.id}
                  className={`gallery-photo gallery-photo--g${i + 1}`}
                  style={{
                    backgroundImage: `url(${uploadUrl(photo.filename)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {photo.caption_en && <span className="sr-only">{photo.caption_en}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONSORTIUM */}
      {hasPartners && (
        <section className="consortium">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-eyebrow">Consortium</div>
                <h2>{project.partners.length} partners.</h2>
              </div>
              <Link to="/projects" className="section-link">All projects →</Link>
            </div>
            <div className="consortium__grid">
              {project.partners.map((p, i) => (
                <article key={i} className="partner-card">
                  {p.code && <span className="flag partner-card__flag">{p.code}</span>}
                  <div className="partner-card__name">{p.name}</div>
                  {p.role && <div className="partner-card__role">{p.role}</div>}
                  {p.country && <div className="partner-card__country">{p.country}</div>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
