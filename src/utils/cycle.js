export function toDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function today() {
  return toDateStr(new Date())
}

export function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return toDateStr(d)
}

export function getDaysBetween(a, b) {
  const d1 = new Date(a + 'T00:00:00')
  const d2 = new Date(b + 'T00:00:00')
  return Math.round((d2 - d1) / 86400000)
}

export function formatDate(dateStr, opts = {}) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...opts })
}

export function formatDateLong(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function getSortedPeriods(periods) {
  return [...periods]
    .filter(p => p.startDate)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}

export function getPeriodLength(period) {
  if (!period.endDate) return null
  return getDaysBetween(period.startDate, period.endDate) + 1
}

export function getCycleLengths(periods) {
  const sorted = getSortedPeriods(periods)
  const lengths = []
  for (let i = 1; i < sorted.length; i++) {
    const len = getDaysBetween(sorted[i - 1].startDate, sorted[i].startDate)
    if (len >= 15 && len <= 60) lengths.push(len)
  }
  return lengths
}

function rollingAvg(arr, n = 6) {
  const recent = arr.slice(-n)
  if (!recent.length) return null
  return Math.round(recent.reduce((a, b) => a + b, 0) / recent.length)
}

export function getAverageCycleLength(periods, preferences = {}) {
  return rollingAvg(getCycleLengths(periods)) ?? preferences.typicalCycleLength ?? 28
}

export function getAveragePeriodLength(periods, preferences = {}) {
  const lengths = periods.filter(p => p.endDate).map(getPeriodLength).filter(Boolean)
  return rollingAvg(lengths) ?? preferences.typicalPeriodLength ?? 5
}

export function getCycleVariation(periods) {
  const lengths = getCycleLengths(periods)
  if (lengths.length < 2) return null
  const recent = lengths.slice(-6)
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length
  const variance = recent.reduce((s, l) => s + Math.pow(l - avg, 2), 0) / recent.length
  return Math.round(Math.sqrt(variance))
}

export function predictNextPeriod(periods, preferences = {}) {
  const sorted = getSortedPeriods(periods)
  if (!sorted.length) return null
  const last = sorted[sorted.length - 1]
  const avgCycle = getAverageCycleLength(periods, preferences)
  const avgPeriod = getAveragePeriodLength(periods, preferences)
  const startDate = addDays(last.startDate, avgCycle)
  return {
    startDate,
    endDate: addDays(startDate, avgPeriod - 1),
    cycleLength: avgCycle,
    confidence: getCycleLengths(periods).length >= 3 ? 'medium' : 'low',
  }
}

export function getFertileWindow(periods, preferences = {}) {
  const prediction = predictNextPeriod(periods, preferences)
  if (!prediction) return null
  const ovulation = addDays(prediction.startDate, -14)
  return {
    start: addDays(ovulation, -5),
    end: addDays(ovulation, 1),
    ovulation,
  }
}

export function isDayInPeriod(dateStr, periods) {
  return periods.some(p => {
    const end = p.endDate || p.startDate
    return dateStr >= p.startDate && dateStr <= end
  })
}

export function isDayPredicted(dateStr, periods, preferences = {}) {
  const pred = predictNextPeriod(periods, preferences)
  if (!pred) return false
  return dateStr >= pred.startDate && dateStr <= pred.endDate
}

export function isDayFertile(dateStr, periods, preferences = {}) {
  const fw = getFertileWindow(periods, preferences)
  if (!fw) return false
  return dateStr >= fw.start && dateStr <= fw.end
}

export function getPeriodForDay(dateStr, periods) {
  return periods.find(p => {
    const end = p.endDate || p.startDate
    return dateStr >= p.startDate && dateStr <= end
  }) ?? null
}

export function getActivePeriod(periods) {
  const sorted = getSortedPeriods(periods)
  return sorted.findLast(p => !p.endDate) ?? null
}

export function getLastNCycles(periods, n = 6) {
  const sorted = getSortedPeriods(periods)
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    const p = sorted[i]
    const next = sorted[i + 1]
    result.push({
      startDate: p.startDate,
      endDate: p.endDate,
      periodLength: getPeriodLength(p),
      cycleLength: next ? getDaysBetween(p.startDate, next.startDate) : null,
    })
  }
  return result.slice(-n).reverse()
}
