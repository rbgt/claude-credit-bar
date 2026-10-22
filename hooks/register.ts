import type { Register } from 'claude-code'

type Limit = { kind: string; percentUsed: number; resetsAt?: string }

const LABELS: Record<string, string> = { five_hour: 'Session 5h', seven_day: 'Hebdo', spend_limit: 'crédit' }
const WIDTH = 10

function bar(left: number): string {
  const full = Math.round((left / 100) * WIDTH)
  return '█'.repeat(full) + '░'.repeat(WIDTH - full)
}

function resetIn(at: string | undefined, now: number): string {
  const ts = at ? Date.parse(at) : NaN
  if (!Number.isFinite(ts)) return ''
  const mins = Math.max(0, Math.round((ts - now) / 60000))
  return mins >= 60 * 24 ? ` · reset dans ${Math.round(mins / 1440)}j` : mins >= 60 ? ` · reset dans ${Math.floor(mins / 60)}h${String(mins % 60).padStart(2, '0')}` : ` · reset dans ${mins}m`
}

// claude-sonnet-5-5 -> Sonnet 5.5
function modelName(id: string): string {
  const m = /(opus|sonnet|haiku|fable)-(\d+)(?:-(\d+))?/i.exec(id)
  if (!m) return id
  const name = m[1][0].toUpperCase() + m[1].slice(1).toLowerCase()
  return `${name} ${m[2]}${m[3] ? '.' + m[3] : ''}`
}

function format(limits: Limit[], now: number, model: string): string {
  const prefix = `🤖 ${modelName(model)}  │  `
  if (limits.length === 0) return prefix + 'Crédit : en attente de la 1re réponse…'
  return prefix + limits
    .map(l => {
      const left = Math.max(0, Math.min(100, 100 - l.percentUsed))
      const icon = left <= 10 ? '🔴' : left <= 30 ? '🟠' : '🟢'
      return `${icon} ${LABELS[l.kind] ?? l.kind} ${bar(left)} ${left.toFixed(0)}% restant${resetIn(l.resetsAt, now)}`
    })
    .join('  │  ')
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    const { rateLimits } = await $.session.usage()
    $.ui.status(format(rateLimits, await $.clock.now(), await $.session.model()))
    return result
  })

  on('session.measure', async ($, e, next) => {
    $.ui.status(format(e.rateLimits, await $.clock.now(), await $.session.model()))
    return next(e)
  })
}
