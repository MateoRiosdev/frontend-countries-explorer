// ── Utilidades para gestión de posts locales en localStorage ─────────────────
// IDs de Date.now() tienen 13 dígitos. IDs legibles: ≤ 4 dígitos (1–9999).
export const isTimestampId = (id) => id > 9999

/**
 * Migra posts con IDs tipo Date.now() a IDs secuenciales legibles (101, 102…).
 * También mueve sus ediciones y comentarios al nuevo ID.
 * Seguro de llamar múltiples veces (no-op si ya está migrado).
 */
export function migrateLocalPosts() {
  try {
    const saved = JSON.parse(localStorage.getItem('local-posts') || '[]')
    if (!saved.some(p => isTimestampId(p.id))) return // nada que migrar

    let nextId = 101
    const migrated = saved.map(p => {
      if (!isTimestampId(p.id)) { nextId = Math.max(nextId, p.id + 1); return p }

      // Reasignar ediciones y comentarios al nuevo ID
      try {
        const edits = JSON.parse(localStorage.getItem('post-edits') || '{}')
        if (edits[String(p.id)]) {
          edits[String(nextId)] = edits[String(p.id)]
          delete edits[String(p.id)]
          localStorage.setItem('post-edits', JSON.stringify(edits))
        }
        const comments = localStorage.getItem(`post-comments-${p.id}`)
        if (comments) {
          localStorage.setItem(`post-comments-${nextId}`, comments)
          localStorage.removeItem(`post-comments-${p.id}`)
        }
      } catch { /* no interrumpir la migración */ }

      return { ...p, id: nextId++ }
    })
    localStorage.setItem('local-posts', JSON.stringify(migrated))
  } catch { /* no interrumpir el arranque */ }
}

/**
 * Genera el próximo ID local secuencial (101, 102…).
 * Ignora IDs tipo Date.now() por si quedara alguno sin migrar.
 */
export function nextLocalId() {
  const saved = JSON.parse(localStorage.getItem('local-posts') || '[]')
  const cleanIds = saved.map(p => p.id).filter(id => !isTimestampId(id))
  return Math.max(...cleanIds, 100) + 1
}
