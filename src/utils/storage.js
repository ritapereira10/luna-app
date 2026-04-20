const KEY = 'luna-data'

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { username: null, periods: [], dayLogs: {} }
    return JSON.parse(raw)
  } catch {
    return { username: null, periods: [], dayLogs: {} }
  }
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}
