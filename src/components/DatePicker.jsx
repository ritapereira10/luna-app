import { useState, useMemo } from 'react'
import { toDateStr, today } from '../utils/cycle'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

export default function DatePicker({ value, onChange, maxMonthsBack = 3 }) {
  const todayStr = today()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const minDate = new Date(now.getFullYear(), now.getMonth() - maxMonthsBack, 1)

  const grid = useMemo(() => getGrid(year, month), [year, month])

  function prevMonth() {
    const prev = new Date(year, month - 1, 1)
    if (prev >= minDate) { setYear(prev.getFullYear()); setMonth(prev.getMonth()) }
  }
  function nextMonth() {
    const next = new Date(year, month + 1, 1)
    if (next <= new Date(now.getFullYear(), now.getMonth(), 1)) {
      setYear(next.getFullYear()); setMonth(next.getMonth())
    }
  }

  const canGoPrev = new Date(year, month - 1, 1) >= minDate
  const canGoNext = new Date(year, month + 1, 1) <= new Date(now.getFullYear(), now.getMonth(), 1)

  return (
    <div className="w-full">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-luna-warm text-luna-muted disabled:opacity-30 active:scale-90 transition-all"
        >
          ‹
        </button>
        <p className="text-sm font-medium text-luna-dark">
          {MONTHS[month]} {year}
        </p>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-luna-warm text-luna-muted disabled:opacity-30 active:scale-90 transition-all"
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs text-luna-muted py-1">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {grid.map((day, i) => {
          if (!day) return <div key={i} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isFuture = dateStr > todayStr
          const isSelected = dateStr === value
          const isToday = dateStr === todayStr

          return (
            <button
              key={i}
              disabled={isFuture}
              onClick={() => onChange(dateStr)}
              className={`aspect-square rounded-full flex items-center justify-center text-sm transition-all active:scale-90
                ${isSelected ? 'bg-luna-terra text-white' : ''}
                ${isToday && !isSelected ? 'ring-2 ring-luna-dark text-luna-dark' : ''}
                ${!isSelected && !isToday ? 'text-luna-dark' : ''}
                ${isFuture ? 'text-luna-border pointer-events-none' : ''}
              `}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
