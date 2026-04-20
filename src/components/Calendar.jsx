import { useMemo } from 'react'
import {
  toDateStr,
  today,
  isDayInPeriod,
  isDayPredicted,
  isDayFertile,
  predictNextPeriod,
  getFertileWindow,
  getAverageCycleLength,
} from '../utils/cycle'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

function CalendarDay({ day, month, year, periods, preferences, dayLogs, todayStr, onSelect }) {
  if (!day) return <div />

  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const isToday = dateStr === todayStr
  const isFuture = dateStr > todayStr

  const inPeriod = isDayInPeriod(dateStr, periods)
  const predicted = !inPeriod && isDayPredicted(dateStr, periods, preferences)
  const fertile = !inPeriod && !predicted && isDayFertile(dateStr, periods, preferences)
  const hasLog = !!dayLogs[dateStr]

  let bg = ''
  let textColor = isFuture ? 'text-luna-muted' : 'text-luna-dark'
  let ring = ''
  let extraRing = ''

  if (inPeriod) {
    bg = 'bg-luna-terra'
    textColor = 'text-white'
  } else if (predicted) {
    bg = 'bg-luna-lav/60'
    textColor = 'text-luna-dark'
  } else if (fertile) {
    extraRing = 'ring-1 ring-luna-sage'
    textColor = isFuture ? 'text-luna-sage/60' : 'text-luna-sage'
  }

  if (isToday) ring = 'ring-2 ring-luna-dark ring-offset-1'

  return (
    <button
      onClick={() => onSelect(dateStr)}
      className={`relative flex flex-col items-center justify-center aspect-square rounded-full text-sm font-light transition-all active:scale-90 ${bg} ${textColor} ${ring} ${extraRing}`}
    >
      <span>{day}</span>
      {hasLog && !inPeriod && (
        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-luna-muted/60" />
      )}
    </button>
  )
}

export default function Calendar({ data, currentMonth, onMonthChange, onDaySelect }) {
  const { periods = [], dayLogs = {}, preferences = {} } = data
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const todayStr = today()

  const grid = useMemo(() => getCalendarGrid(year, month), [year, month])

  const prediction = useMemo(() => predictNextPeriod(periods, preferences), [periods, preferences])
  const fertileWindow = useMemo(() => getFertileWindow(periods, preferences), [periods, preferences])

  function prevMonth() {
    onMonthChange(new Date(year, month - 1, 1))
  }
  function nextMonth() {
    onMonthChange(new Date(year, month + 1, 1))
  }

  const noPeriods = periods.length === 0

  return (
    <div className="flex flex-col flex-1 overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <div>
          <p className="text-xs text-luna-muted tracking-widest uppercase">
            {data.username}&apos;s cycle
          </p>
          <h1 className="text-2xl font-light text-luna-dark">
            {MONTHS[month]} {year}
          </h1>
        </div>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-luna-warm text-luna-muted hover:text-luna-dark transition-colors active:scale-90"
          >
            ‹
          </button>
          <button
            onClick={nextMonth}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-luna-warm text-luna-muted hover:text-luna-dark transition-colors active:scale-90"
          >
            ›
          </button>
        </div>
      </div>

      {/* Prompt if no periods logged */}
      {noPeriods && (
        <div className="mx-5 mb-4 bg-luna-terra/10 border border-luna-terra/20 rounded-2xl px-4 py-3">
          <p className="text-sm text-luna-dark leading-relaxed">
            Tap today to log your period start — Luna will use this to predict your next cycle.
          </p>
        </div>
      )}

      {/* Day headers */}
      <div className="grid grid-cols-7 px-4 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs text-luna-muted py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1 px-4">
        {grid.map((day, i) => (
          <CalendarDay
            key={i}
            day={day}
            month={month}
            year={year}
            periods={periods}
            preferences={preferences}
            dayLogs={dayLogs}
            todayStr={todayStr}
            onSelect={onDaySelect}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 justify-center mt-5 px-5">
        <LegendItem color="bg-luna-terra" label="Period" />
        {prediction && <LegendItem color="bg-luna-lav/60" label="Predicted" />}
        {fertileWindow && <LegendItem ring="ring-1 ring-luna-sage" label="Fertile" />}
      </div>

      {/* Next period prediction card */}
      {prediction && (
        <div className="mx-5 mt-5 bg-luna-warm rounded-2xl p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-luna-muted tracking-wide uppercase mb-1">Next period</p>
              <p className="text-luna-dark font-light text-lg">
                {formatPredictionDate(prediction.startDate)}
              </p>
              <p className="text-xs text-luna-muted mt-0.5">
                {getAverageCycleLength(periods)}-day avg cycle
              </p>
            </div>
            {fertileWindow && (
              <div className="text-right">
                <p className="text-xs text-luna-muted tracking-wide uppercase mb-1">Fertile window</p>
                <p className="text-luna-sage font-light">
                  {formatPredictionDate(fertileWindow.start)} – {formatPredictionDate(fertileWindow.end)}
                </p>
              </div>
            )}
          </div>
          <p className="text-xs text-luna-muted/80 mt-3 leading-relaxed">
            Estimates only — not contraception guidance.
          </p>
        </div>
      )}
    </div>
  )
}

function LegendItem({ color, ring, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-3 h-3 rounded-full ${color ?? ''} ${ring ?? ''}`} />
      <span className="text-xs text-luna-muted">{label}</span>
    </div>
  )
}

function formatPredictionDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
