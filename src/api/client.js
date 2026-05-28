// API client — buinho.eu frontend
// Consome o CMS backend em buinho-eu-cms.onrender.com (ou api.buinho.eu quando CNAME estiver activo)

const API_BASE = import.meta.env.VITE_API_URL || 'https://buinho-eu-cms.onrender.com'

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
