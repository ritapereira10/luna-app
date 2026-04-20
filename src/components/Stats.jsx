import {
  getAverageCycleLength,
  getAveragePeriodLength,
  getCycleVariation,
  getLastNCycles,
  predictNextPeriod,
  formatDate,
} from '../utils/cycle'

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-luna-warm rounded-2xl p-5 flex-1">
      <p className="text-xs text-luna-muted tracking-widest uppercase mb-1">{label}</p>
      <p className="text-3xl font-light text-luna-dark">{value}</p>
      {sub && <p className="text-xs text-luna-muted mt-1">{sub}</p>}
    </div>
  )
}

function CycleRow({ cycle, index }) {
  const isFirst = index === 0
  return (
    <div className={`flex items-center justify-between py-3.5 ${!isFirst ? 'border-t border-luna-border' : ''}`}>
      <div>
        <p className="text-sm text-luna-dark font-light">
          {formatDate(cycle.startDate)}
          {cycle.endDate ? ` – ${formatDate(cycle.endDate)}` : ' – ongoing'}
        </p>
        {cycle.periodLength && (
          <p className="text-xs text-luna-muted mt-0.5">{cycle.periodLength} day period</p>
        )}
      </div>
      <div className="text-right">
        {cycle.cycleLength ? (
          <p className="text-sm text-luna-dark">{cycle.cycleLength} days</p>
        ) : (
          <p className="text-xs text-luna-muted">current</p>
        )}
      </div>
    </div>
  )
}

export default function Stats({ data }) {
  const { periods = [], preferences = {} } = data
  const hasCycles = periods.length >= 2
  const hasPeriods = periods.length >= 1

  const avgCycle = getAverageCycleLength(periods, preferences)
  const avgPeriod = getAveragePeriodLength(periods, preferences)
  const variation = getCycleVariation(periods)
  const lastCycles = getLastNCycles(periods, 6)
  const prediction = predictNextPeriod(periods, preferences)

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="px-5 pt-12 pb-6">
        <p className="text-xs text-luna-muted tracking-widest uppercase mb-1">Your cycle</p>
        <h1 className="text-2xl font-light text-luna-dark">Insights</h1>
      </div>

      {!hasPeriods ? (
        <div className="mx-5 bg-luna-warm rounded-2xl p-6 text-center">
          <div className="text-3xl mb-3 text-luna-muted">◐</div>
          <p className="text-luna-dark font-light mb-1">Nothing to show yet</p>
          <p className="text-sm text-luna-muted">Log at least one period to start seeing your cycle stats.</p>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="px-5 flex gap-3 mb-4">
            <StatCard
              label="Avg cycle"
              value={hasCycles ? `${avgCycle}d` : '—'}
              sub={hasCycles ? 'based on your history' : 'need 2+ periods'}
            />
            <StatCard
              label="Avg period"
              value={hasPeriods ? `${avgPeriod}d` : '—'}
              sub={hasPeriods ? 'length' : null}
            />
          </div>

          <div className="px-5 flex gap-3 mb-6">
            <StatCard
              label="Variation"
              value={variation != null ? `±${variation}d` : '—'}
              sub={variation != null ? (variation <= 3 ? 'Regular' : variation <= 7 ? 'Somewhat irregular' : 'Irregular') : 'need 3+ cycles'}
            />
            {prediction && (
              <StatCard
                label="Next period"
                value={formatDate(prediction.startDate)}
                sub={`${prediction.cycleLength}-day cycle avg`}
              />
            )}
          </div>

          {/* Recent cycles */}
          {lastCycles.length > 0 && (
            <div className="mx-5 bg-luna-warm rounded-2xl px-5 mb-6">
              <div className="flex items-center justify-between pt-4 pb-2">
                <p className="text-xs text-luna-muted tracking-widest uppercase">Recent cycles</p>
                <p className="text-xs text-luna-muted">Cycle length</p>
              </div>
              {lastCycles.map((c, i) => (
                <CycleRow key={c.startDate} cycle={c} index={i} />
              ))}
            </div>
          )}

          {/* Doctor note */}
          <div className="mx-5 bg-luna-warm/60 border border-luna-border rounded-2xl p-4">
            <p className="text-xs text-luna-muted leading-relaxed">
              <span className="text-luna-dark font-medium">For your doctor:</span> A typical cycle is 21–35 days.
              A period lasting 2–7 days is considered normal. Bring this screen
              to your appointment to share your cycle history.
            </p>
          </div>

          {/* Privacy note */}
          <div className="mx-5 mt-4 pb-2">
            <p className="text-xs text-luna-muted/70 text-center leading-relaxed">
              All data stored locally on this device only.{'\n'}
              Never shared. Never uploaded.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
