import { useParams, Link, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getProject } from '../data/projects'
import { fetchProjectPhotos, uploadUrl } from '../api/client'
import './ProjectPage.css'

const PROGRAMME_BADGE = {
  'erasmus': '',
  'creative-europe': 'badge--red',
  'esc': 'badge--yellow',
}

export default function ProjectPage() {
  const { slug } = useParams()
  const project = getProject(slug)
  const [photos, setPhotos] = useState([])
  const [photosLoading, setPhotosLoading] = useState(true)

  useEffect(() => {
    setPhotosLoading(true)
    fetchProjectPhotos(slug).then(data => {
      setPhotos(data)
      setPhotosLoading(false)
    })
  }, [slug])

  if (!project) return <Navigate to="/" replace />

  const badgeMod = PROGRAMME_BADGE[project.programmeKey] || ''
  const statusMod = `status--${project.status}`

  return (
    <main>
      {/* PAGE HEADER */}
      <header className="projhead">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Projects</Link>
            <span>/</span>
            <strong>{project.title}</strong>
          </div>
          <h1 className="projhead__title">{project.title} — {project.subtitle}</h1>
          <div className="projhead__meta">
            <span className={`badge ${badgeMod}`}>{project.programme} {project.action}</span>
            <span className="projhead__years">{project.period}</span>
            <span className={`status ${statusMod}`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
            {project.ref && (
              <span className="projhead__ref">
                Ref. <strong>{project.ref}</strong>
              </span>
            )}
          </div>
        </div>
      </header>

      {/* BODY */}
      <section className="projbody">
        <div className="container">
          <div className="projbody__grid">
            <div className="projbody__main">
              <p className="projbody__lead">{project.description}</p>

              <h2>Objectives</h2>
              <ul className="bullets">
                {project.objectives.map((obj, i) => (
                  <li key={i}>
                    <strong>{obj.title}</strong> {obj.text}
                  </li>
                ))}
              </ul>

              <h2>Outputs &amp; results</h2>
              <ul className="bullets bullets--red">
                {project.outputs.map((out, i) => (
                  <li key={i}>
                    <strong>{out.ref} — {out.title}</strong> · {out.text}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="sidebar">
              <div className="sidebar__section">
                <div className="sidebar__label">Project details</div>
                <dl className="sidebar__rows">
                  <div className="sidebar__row"><dt>Programme</dt><dd>{project.programme} {project.action}</dd></div>
                  {project.ref && <div className="sidebar__row"><dt>Reference</dt><dd className="sidebar__ref">{project.ref}</dd></div>}
                  <div className="sidebar__row"><dt>Period</dt><dd>{project.period}</dd></div>
                  <div className="sidebar__row"><dt>Buinho role</dt><dd>{project.role}</dd></div>
                  {project.budget && <div className="sidebar__row"><dt>Total budget</dt><dd>{project.budget}</dd></div>}
                  {project.buinhoBudget && <div className="sidebar__row"><dt>Buinho budget</dt><dd>{project.buinhoBudget}</dd></div>}
                </dl>
              </div>
              <div className="sidebar__section">
                <div className="sidebar__label">Consortium</div>
                <div className="sidebar__partners">
                  {project.partners.map((p, i) => (
                    <div key={i} className="sidebar__partner">
                      <span className="flag">{p.code}</span>
                      <div>
                        <div className="sidebar__partner__name">{p.name}</div>
                        <div className="sidebar__partner__meta">{p.country} · {p.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="sidebar__section sidebar__section--last">
                <div className="sidebar__label">External links</div>
                <div className="sidebar__extlinks">
                  <a className="sidebar__extlink"><span>EU Project Results Platform</span><span>↗</span></a>
                  <a className="sidebar__extlink"><span>Press kit</span><span>↗</span></a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* GALLERY — real photos from CMS */}
      {!photosLoading && photos.length > 0 && (
        <section className="gallery">
          <div className="container">
            <div className="section-head" style={{ marginBottom: 40 }}>
              <div>
                <div className="section-eyebrow">Gallery</div>
                <h2>From the project.</h2>
              </div>
              {photos.length > 5 && (
                <span className="section-link">{photos.length} photos</span>
              )}
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
                  {/* caption acessível mas invisível visualmente */}
                  {photo.caption_en && (
                    <span className="sr-only">{photo.caption_en}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONSORTIUM */}
      <section className="consortium">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Consortium</div>
              <h2>{project.partners.length} partners. {[...new Set(project.partners.map(p => p.code))].length} countries.</h2>
            </div>
            <Link to="/" className="section-link">All partners across projects →</Link>
          </div>
          <div className="consortium__grid">
            {project.partners.map((p, i) => (
              <article key={i} className="partner-card">
                <span className="flag partner-card__flag">{p.code}</span>
                <div className="partner-card__name">{p.name}</div>
                <div className="partner-card__role">{p.role}</div>
                <div className="partner-card__country">{p.country}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
