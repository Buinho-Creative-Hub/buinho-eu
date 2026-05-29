// API client — buinho.eu frontend
// Fonte única de dados: o CMS em api.buinho.eu (Webtuga, produção).
// Os projectos já não vivem em src/data/projects.js — tudo vem da API.

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.buinho.eu'

export const PROGRAMME_LABELS = {
  'erasmus': 'Erasmus+',
  'creative-europe': 'Creative Europe',
  'esc': 'European Solidarity Corps',
}

/**
 * Deriva a programme_key (cor do badge) a partir do texto do programa,
 * usada como fallback quando o campo não está preenchido no CMS.
 */
function deriveProgrammeKey(program) {
  const prog = (program || '').toLowerCase()
  if (prog.includes('esc') || prog.includes('solidarity')) return 'esc'
  if (prog.includes('creative') || prog.includes('criativa')) return 'creative-europe'
  return 'erasmus'
}

/**
 * Normaliza uma row de projecto do CMS para a forma usada pelos componentes.
 * O CMS já devolve countries/objectives/outputs/partners_struct como arrays
 * (desserializados no backend). Campos vazios ficam com defaults seguros.
 */
function normalizeProject(p) {
  if (!p || p.error) return null
  const programmeKey = p.programme_key || deriveProgrammeKey(p.program)

  // Parceiros: preferir os estruturados; se não houver, derivar da string legado.
  let partners = Array.isArray(p.partners_struct) ? p.partners_struct : []
  if (partners.length === 0 && p.partners) {
    partners = String(p.partners)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(name => ({ code: '', name, country: '', role: '' }))
  }

  return {
    slug: p.slug,
    title: p.title_pt || p.title_en || p.slug,
    subtitle: p.subtitle || '',
    description: p.desc_pt || p.desc_en || '',
    programme: p.program || '',
    action: p.action || '',
    programmeKey,
    ref: p.ref || null,
    period: p.dates || '',
    periodStart: p.period_start || '',
    periodEnd: p.period_end || '',
    status: p.status || 'submitted',
    role: p.role || '',
    budget: p.budget || null,
    buinhoBudget: p.buinho_budget || null,
    lead: p.lead || '',
    accentKey: p.accent_key || '',
    featured: !!p.featured,
    countries: Array.isArray(p.countries) ? p.countries : [],
    objectives: Array.isArray(p.objectives) ? p.objectives : [],
    outputs: Array.isArray(p.outputs) ? p.outputs : [],
    partners,
  }
}

/**
 * Busca todos os projectos públicos (active/submitted/archived) já normalizados.
 * Devolve [] em caso de erro.
 */
export async function fetchProjects() {
  try {
    const res = await fetch(`${API_BASE}/api/projects`, { cache: 'no-store' })
    if (!res.ok) return []
    const rows = await res.json()
    return rows.map(normalizeProject).filter(Boolean)
  } catch {
    return []
  }
}

/**
 * Busca UM projecto por slug, normalizado. Devolve null se não existir.
 */
export async function fetchProjectBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE}/api/projects/${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    return normalizeProject(await res.json())
  } catch {
    return null
  }
}

/**
 * Busca as fotos de um projecto pelo slug. Devolve [] se não houver.
 */
export async function fetchProjectPhotos(slug) {
  try {
    const res = await fetch(`${API_BASE}/api/projects/${slug}/photos`, { cache: 'no-store' })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

/**
 * Mapa slug → URL da primeira foto, para as capas dos cards.
 */
export async function fetchProjectCoverMap() {
  try {
    const res = await fetch(`${API_BASE}/api/projects`, { cache: 'no-store' })
    if (!res.ok) return {}
    const projects = await res.json()
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

export function uploadUrl(filename) {
  return `${API_BASE}/uploads/${filename}`
}
