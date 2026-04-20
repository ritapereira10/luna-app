import { useState } from 'react'
import DatePicker from './DatePicker'
import { addDays } from '../utils/cycle'

const CYCLE_OPTIONS = [21, 24, 26, 28, 30, 32, 35]
const PERIOD_OPTIONS = [2, 3, 4, 5, 6, 7, 8]

function ProgressDots({ step, total }) {
  return (
    <div className="flex gap-1.5 justify-center mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all ${
            i < step ? 'w-4 h-1.5 bg-luna-terra' : i === step ? 'w-4 h-1.5 bg-luna-terra' : 'w-1.5 h-1.5 bg-luna-border'
          }`}
        />
      ))}
    </div>
  )
}

function StepShell({ step, total, children }) {
  return (
    <div className="min-h-screen bg-luna-cream flex flex-col px-6 pt-14 pb-10">
      <ProgressDots step={step} total={total} />
      {children}
    </div>
  )
}

export default function Welcome({ onComplete }) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [lastPeriodDate, setLastPeriodDate] = useState(null)
  const [cycleLength, setCycleLength] = useState(28)
  const [periodLength, setPeriodLength] = useState(5)
  const [skipPeriod, setSkipPeriod] = useState(false)

  function finish() {
    const preferences = { typicalCycleLength: cycleLength, typicalPeriodLength: periodLength }
    const periods = []
    if (lastPeriodDate && !skipPeriod) {
      periods.push({
        id: crypto.randomUUID(),
        startDate: lastPeriodDate,
        endDate: addDays(lastPeriodDate, periodLength - 1),
      })
    }
    onComplete({ name: name.trim(), preferences, periods })
  }

  // Step 0: Landing
  if (step === 0) {
    return (
      <div className="min-h-screen bg-luna-cream flex flex-col items-center justify-between px-6 pt-16 pb-10">
        <div />
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="26" fill="#F0EBE5" />
              <path d="M28 2C28 2 54 14 54 28C54 42 28 54 28 54C28 54 14 46 9 35C6 29 6 23 9 17C14 6 28 2 28 2Z" fill="#C4836A" opacity="0.55" />
            </svg>
          </div>
          <h1 className="text-5xl font-light text-luna-dark tracking-widest mb-2">Luna</h1>
          <p className="text-luna-muted text-sm italic tracking-wide">Your cycle, quietly.</p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <div className="bg-luna-warm rounded-2xl p-5 space-y-3">
            <div className="flex gap-3">
              <span className="text-luna-terra mt-0.5">◐</span>
              <p className="text-sm text-luna-dark leading-relaxed">Your data lives only on this device — never sent to any server, never shared.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-luna-sage mt-0.5">◐</span>
              <p className="text-sm text-luna-dark leading-relaxed">No account, no email, no tracking. Completely free, always.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-luna-lav mt-0.5">◐</span>
              <p className="text-sm text-luna-dark leading-relaxed">Predictions are estimates to help you plan — not medical advice or contraception.</p>
            </div>
          </div>
          <button
            onClick={() => setStep(1)}
            className="w-full bg-luna-terra text-white py-3.5 rounded-2xl text-sm font-medium tracking-wide active:scale-[0.98] transition-all"
          >
            Get started
          </button>
        </div>
      </div>
    )
  }

  // Step 1: Name
  if (step === 1) {
    return (
      <StepShell step={0} total={4}>
        <div className="flex-1">
          <p className="text-xs text-luna-muted tracking-widest uppercase mb-6">Step 1 of 4</p>
          <h2 className="text-2xl font-light text-luna-dark mb-2">What should we call you?</h2>
          <p className="text-luna-muted text-sm mb-10">Just a name — no account needed.</p>
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)}
            placeholder="Your name"
            maxLength={32}
            className="w-full text-center text-xl font-light text-luna-dark bg-transparent border-b-2 border-luna-border focus:border-luna-terra py-2 transition-colors placeholder:text-luna-border"
          />
        </div>
        <button
          onClick={() => setStep(2)}
          disabled={!name.trim()}
          className="w-full bg-luna-terra text-white py-3.5 rounded-2xl text-sm font-medium disabled:opacity-30 active:scale-[0.98] transition-all"
        >
          Continue
        </button>
      </StepShell>
    )
  }

  // Step 2: Last period date
  if (step === 2) {
    return (
      <StepShell step={1} total={4}>
        <div className="flex-1">
          <p className="text-xs text-luna-muted tracking-widest uppercase mb-6">Step 2 of 4</p>
          <h2 className="text-2xl font-light text-luna-dark mb-1">When did your last period start?</h2>
          <p className="text-luna-muted text-sm mb-6">This lets Luna predict your next cycle right away.</p>

          {!skipPeriod && (
            <DatePicker value={lastPeriodDate} onChange={setLastPeriodDate} maxMonthsBack={3} />
          )}

          {skipPeriod && (
            <div className="bg-luna-warm rounded-2xl p-4 text-center">
              <p className="text-sm text-luna-muted">You can log your first period from the calendar whenever you&apos;re ready.</p>
            </div>
          )}

          <button
            onClick={() => { setSkipPeriod(!skipPeriod); setLastPeriodDate(null) }}
            className="mt-4 text-xs text-luna-muted underline w-full text-center"
          >
            {skipPeriod ? 'Actually, I know the date' : 'I don\'t remember / skip for now'}
          </button>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setStep(1)}
            className="flex-1 py-3 rounded-2xl border border-luna-border text-luna-muted text-sm active:scale-[0.98] transition-all"
          >
            Back
          </button>
          <button
            onClick={() => setStep(3)}
            disabled={!skipPeriod && !lastPeriodDate}
            className="flex-1 py-3 rounded-2xl bg-luna-terra text-white text-sm font-medium disabled:opacity-30 active:scale-[0.98] transition-all"
          >
            Continue
          </button>
        </div>
      </StepShell>
    )
  }

  // Step 3: Cycle length
  if (step === 3) {
    return (
      <StepShell step={2} total={4}>
        <div className="flex-1">
          <p className="text-xs text-luna-muted tracking-widest uppercase mb-6">Step 3 of 4</p>
          <h2 className="text-2xl font-light text-luna-dark mb-1">How long is your typical cycle?</h2>
          <p className="text-luna-muted text-sm mb-2">From the first day of one period to the first day of the next.</p>
          <p className="text-luna-muted/60 text-xs mb-8">The average is 28 days — Luna will refine this over time.</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {CYCLE_OPTIONS.map(n => (
              <button
                key={n}
                onClick={() => setCycleLength(n)}
                className={`px-4 py-2 rounded-full text-sm transition-all active:scale-95 ${
                  cycleLength === n ? 'bg-luna-terra text-white' : 'bg-luna-warm text-luna-dark'
                }`}
              >
                {n} days
              </button>
            ))}
          </div>

          <div className="bg-luna-warm rounded-2xl p-4">
            <p className="text-xs text-luna-muted mb-2">Or enter a specific number</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={15}
                max={60}
                value={cycleLength}
                onChange={e => {
                  const v = parseInt(e.target.value)
                  if (v >= 15 && v <= 60) setCycleLength(v)
                }}
                className="w-20 text-center text-lg font-light text-luna-dark bg-transparent border-b-2 border-luna-border focus:border-luna-terra transition-colors"
              />
              <span className="text-sm text-luna-muted">days</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setStep(2)}
            className="flex-1 py-3 rounded-2xl border border-luna-border text-luna-muted text-sm active:scale-[0.98] transition-all"
          >
            Back
          </button>
          <button
            onClick={() => setStep(4)}
            className="flex-1 py-3 rounded-2xl bg-luna-terra text-white text-sm font-medium active:scale-[0.98] transition-all"
          >
            Continue
          </button>
        </div>
      </StepShell>
    )
  }

  // Step 4: Period length
  return (
    <StepShell step={3} total={4}>
      <div className="flex-1">
        <p className="text-xs text-luna-muted tracking-widest uppercase mb-6">Step 4 of 4</p>
        <h2 className="text-2xl font-light text-luna-dark mb-1">How long does your period usually last?</h2>
        <p className="text-luna-muted text-sm mb-8">This helps Luna predict when each period will end.</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {PERIOD_OPTIONS.map(n => (
            <button
              key={n}
              onClick={() => setPeriodLength(n)}
              className={`px-4 py-2 rounded-full text-sm transition-all active:scale-95 ${
                periodLength === n ? 'bg-luna-terra text-white' : 'bg-luna-warm text-luna-dark'
              }`}
            >
              {n} days
            </button>
          ))}
        </div>

        <div className="bg-luna-warm/60 border border-luna-border rounded-2xl p-4">
          <p className="text-xs text-luna-muted leading-relaxed">
            2–7 days is considered normal. Luna will update this automatically as you log more cycles.
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setStep(3)}
          className="flex-1 py-3 rounded-2xl border border-luna-border text-luna-muted text-sm active:scale-[0.98] transition-all"
        >
          Back
        </button>
        <button
          onClick={finish}
          className="flex-1 py-3 rounded-2xl bg-luna-terra text-white text-sm font-medium active:scale-[0.98] transition-all"
        >
          Start tracking
        </button>
      </div>
    </StepShell>
  )
}
