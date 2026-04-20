import { useState, useEffect } from 'react'
import {
  formatDateLong,
  today,
  isDayInPeriod,
  getPeriodForDay,
  getActivePeriod,
} from '../utils/cycle'

const FLOW_OPTIONS = [
  { value: 'spotting', label: 'Spotting' },
  { value: 'light', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'heavy', label: 'Heavy' },
]

const MOOD_OPTIONS = [
  { value: 'good', label: '😊 Good' },
  { value: 'neutral', label: '😐 Neutral' },
  { value: 'low', label: '😔 Low' },
  { value: 'anxious', label: '😟 Anxious' },
]

const CRAMP_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'mild', label: 'Mild' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'severe', label: 'Severe' },
]

const SEX_DRIVE_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
]

const DISCHARGE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'dry', label: 'Dry' },
  { value: 'sticky', label: 'Sticky' },
  { value: 'creamy', label: 'Creamy' },
  { value: 'watery', label: 'Watery' },
  { value: 'egg_white', label: 'Egg white' },
]

function PillPicker({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(value === opt.value ? null : opt.value)}
          className={`px-3 py-1.5 rounded-full text-sm transition-all active:scale-95 ${
            value === opt.value
              ? 'bg-luna-terra text-white'
              : 'bg-luna-warm text-luna-dark'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function NumberScale({ max, value, onChange, color = 'luna-terra' }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: max }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          onClick={() => onChange(value === n ? null : n)}
          className={`w-10 h-10 rounded-full text-sm font-medium transition-all active:scale-90 ${
            value === n
              ? `bg-luna-terra text-white`
              : 'bg-luna-warm text-luna-dark'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {[
        { v: true, label: 'Yes' },
        { v: false, label: 'No' },
      ].map(({ v, label }) => (
        <button
          key={label}
          onClick={() => onChange(value === v ? null : v)}
          className={`px-4 py-1.5 rounded-full text-sm transition-all active:scale-95 ${
            value === v ? 'bg-luna-terra text-white' : 'bg-luna-warm text-luna-dark'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <p className="text-xs text-luna-muted tracking-widest uppercase mb-3">{title}</p>
      {children}
    </div>
  )
}

export default function DaySheet({ date, data, onUpdate, onClose }) {
  const todayStr = today()
  const isFuture = date > todayStr
  const { periods = [], dayLogs = {} } = data
  const existingLog = dayLogs[date] ?? {}

  const [flow, setFlow] = useState(existingLog.flow ?? null)
  const [mood, setMood] = useState(existingLog.mood ?? null)
  const [cramps, setCramps] = useState(existingLog.cramps ?? null)
  const [energy, setEnergy] = useState(existingLog.energy ?? null)
  const [headache, setHeadache] = useState(existingLog.headache ?? null)
  const [bloating, setBloating] = useState(existingLog.bloating ?? null)
  const [sleepQuality, setSleepQuality] = useState(existingLog.sleepQuality ?? null)
  const [sexDrive, setSexDrive] = useState(existingLog.sexDrive ?? null)
  const [discharge, setDischarge] = useState(existingLog.discharge ?? null)

  const inPeriod = isDayInPeriod(date, periods)
  const periodForDay = getPeriodForDay(date, periods)
  const activePeriod = getActivePeriod(periods)

  function handleStartPeriod() {
    const newPeriod = { id: crypto.randomUUID(), startDate: date, endDate: null }
    onUpdate({ ...data, periods: [...periods, newPeriod] })
  }

  function handleEndPeriod() {
    if (!activePeriod) return
    const updated = periods.map(p =>
      p.id === activePeriod.id ? { ...p, endDate: date } : p
    )
    onUpdate({ ...data, periods: updated })
  }

  function handleRemovePeriodStart() {
    if (!periodForDay) return
    if (window.confirm('Remove this period entry?')) {
      const updated = periods.filter(p => p.id !== periodForDay.id)
      onUpdate({ ...data, periods: updated })
    }
  }

  function handleSave() {
    const log = {}
    if (flow !== null) log.flow = flow
    if (mood !== null) log.mood = mood
    if (cramps !== null) log.cramps = cramps
    if (energy !== null) log.energy = energy
    if (headache !== null) log.headache = headache
    if (bloating !== null) log.bloating = bloating
    if (sleepQuality !== null) log.sleepQuality = sleepQuality
    if (sexDrive !== null) log.sexDrive = sexDrive
    if (discharge !== null) log.discharge = discharge

    const newLogs = { ...dayLogs }
    if (Object.keys(log).length > 0) {
      newLogs[date] = log
    } else {
      delete newLogs[date]
    }

    onUpdate({ ...data, dayLogs: newLogs })
    onClose()
  }

  const canStartPeriod = !inPeriod && date <= todayStr
  const canEndPeriod = activePeriod && date >= activePeriod.startDate && date <= todayStr && !activePeriod.endDate
  const isPeriodStart = periodForDay?.startDate === date

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end animate-fade-in"
      style={{ background: 'rgba(61,53,48,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-luna-cream rounded-t-3xl max-h-[92vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-luna-border" />
        </div>

        {/* Date header */}
        <div className="px-6 pt-3 pb-5 border-b border-luna-border">
          <p className="text-xs text-luna-muted tracking-widest uppercase mb-0.5">
            {date === todayStr ? 'Today' : date > todayStr ? 'Upcoming' : 'Past day'}
          </p>
          <h2 className="text-xl font-light text-luna-dark">{formatDateLong(date)}</h2>
        </div>

        <div className="px-6 py-5">
          {isFuture ? (
            <div className="text-center py-8">
              <p className="text-luna-muted text-sm">You can&apos;t log a future day yet.</p>
              <p className="text-luna-muted/60 text-xs mt-1">Come back on {formatDateLong(date)}.</p>
            </div>
          ) : (
            <>
              {/* Period section */}
              <Section title="Period">
                <div className="space-y-3">
                  {canStartPeriod && (
                    <button
                      onClick={handleStartPeriod}
                      className="flex items-center gap-3 w-full text-left py-2.5 px-4 bg-luna-terra/10 border border-luna-terra/30 rounded-xl text-sm text-luna-terra font-medium active:scale-[0.98] transition-all"
                    >
                      <span className="text-lg">◐</span>
                      Mark period start
                    </button>
                  )}

                  {inPeriod && (
                    <div className="flex items-center gap-2 py-2 px-4 bg-luna-terra/10 rounded-xl">
                      <span className="text-luna-terra text-lg">◉</span>
                      <span className="text-sm text-luna-terra flex-1">Period day</span>
                      {isPeriodStart && (
                        <button
                          onClick={handleRemovePeriodStart}
                          className="text-xs text-luna-muted/70 underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}

                  {canEndPeriod && (
                    <button
                      onClick={handleEndPeriod}
                      className="flex items-center gap-3 w-full text-left py-2.5 px-4 bg-luna-warm border border-luna-border rounded-xl text-sm text-luna-muted active:scale-[0.98] transition-all"
                    >
                      <span className="text-lg">○</span>
                      End period today
                    </button>
                  )}

                  {(inPeriod || (date <= todayStr)) && (
                    <div>
                      <p className="text-xs text-luna-muted mb-2">Flow</p>
                      <PillPicker options={FLOW_OPTIONS} value={flow} onChange={setFlow} />
                    </div>
                  )}
                </div>
              </Section>

              {/* Symptoms */}
              <Section title="Mood">
                <PillPicker options={MOOD_OPTIONS} value={mood} onChange={setMood} />
              </Section>

              <Section title="Cramps">
                <PillPicker options={CRAMP_OPTIONS} value={cramps} onChange={setCramps} />
              </Section>

              <Section title="Energy (1–5)">
                <NumberScale max={5} value={energy} onChange={setEnergy} />
              </Section>

              <Section title="Sleep quality (1–5)">
                <NumberScale max={5} value={sleepQuality} onChange={setSleepQuality} />
              </Section>

              <Section title="Headache">
                <Toggle value={headache} onChange={setHeadache} />
              </Section>

              <Section title="Bloating">
                <Toggle value={bloating} onChange={setBloating} />
              </Section>

              <Section title="Sex drive">
                <PillPicker options={SEX_DRIVE_OPTIONS} value={sexDrive} onChange={setSexDrive} />
              </Section>

              <Section title="Discharge">
                <PillPicker options={DISCHARGE_OPTIONS} value={discharge} onChange={setDischarge} />
              </Section>

              {/* Actions */}
              <div className="flex gap-3 pt-2 pb-6">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl border border-luna-border text-luna-muted text-sm active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 rounded-2xl bg-luna-terra text-white text-sm font-medium active:scale-[0.98] transition-all"
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
