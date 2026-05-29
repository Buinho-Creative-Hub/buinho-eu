// API client — buinho.eu frontend
// Consome o CMS backend em api.buinho.eu (Webtuga, produção)

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.buinho.eu'

/**
 * Busca as fotos de um projecto pelo slug.
 * Devolve [] se o projecto não existir no CMS ou houver erro de rede.
 */
export async function fetchProjectPhotos(slug) {
  try {
    const res = await fetch(`${API_BASE}/api/projects/${slug}/photos`)
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

/**
 * Busca todos os projectos do CMS.
 * Usado para obter a foto de capa de cada projecto nos cards.
 * Devolve {} (mapa slug → primeira foto) ou {} em caso de erro.
 */
export async function fetchProjectCoverMap() {
  try {
    const res = await fetch(`${API_BASE}/api/projects`)
    if (!res.ok) return {}
    const projects = await res.json()

    // Para cada projecto que tem fotos, buscar a primeira
    const map = {}
    await Promise.all(
      projects.map(async (p) => {
        const photos = await fetchProjectPhotos(p.slug)
        if (photos.length > 0) {
          map[p.slug] = `${API_BASE}/uploads/${photos[0].filename}`
        }
      })
    )
    return map
  } catch {
    return {}
  }
}

/**
 * URL base para construir links de uploads directamente
 */
export function uploadUrl(filename) {
  return `${API_BASE}/uploads/${filename}`
}

/**
 * Busca a lista de projectos do CMS (estado active/submitted) e mapeia
 * para a forma de card usada na página de Projectos.
 * Devolve [] em caso de erro — a página funciona na mesma só com os estáticos.
 */
export async function fetchCmsProjects() {
  try {
    const res = await fetch(`${API_BASE}/api/projects`)
    if (!res.ok) return []
    const rows = await res.json()
    return rows.map((p) => {
      const prog = (p.program || '').toLowerCase()
      let programmeKey = 'erasmus'
      if (prog.includes('esc') || prog.includes('solidarity')) programmeKey = 'esc'
      else if (prog.includes('creative') || prog.includes('criativa')) programmeKey = 'creative-europe'
      return {
        slug: p.slug,
        title: p.title_pt || p.title_en || p.slug,
        subtitle: p.desc_pt || p.desc_en || '',
        programme: p.program || '',
        action: '',
        programmeKey,
        period: p.dates || '',
        countries: [],
        _fromCms: true,
      }
    })
  } catch {
    return []
  }
}
