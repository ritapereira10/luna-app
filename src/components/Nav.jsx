function CalendarIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function ChartIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  )
}

export default function Nav({ view, onViewChange, onTodayLog }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center">
      <div className="w-full max-w-md">
        <div
          className="flex items-center justify-around px-6 py-3 bg-luna-cream border-t border-luna-border safe-bottom"
          style={{ paddingBottom: `calc(0.75rem + env(safe-area-inset-bottom, 0px))` }}
        >
          <NavBtn
            onClick={() => onViewChange('calendar')}
            active={view === 'calendar'}
            label="Calendar"
          >
            <CalendarIcon active={view === 'calendar'} />
          </NavBtn>

          {/* Log today — prominent center button */}
          <button
            onClick={onTodayLog}
            className="flex flex-col items-center gap-1 -mt-5 active:scale-90 transition-all"
          >
            <span className="w-14 h-14 rounded-full bg-luna-terra text-white flex items-center justify-center shadow-lg shadow-luna-terra/30">
              <PlusIcon />
            </span>
            <span className="text-xs text-luna-muted">Log today</span>
          </button>

          <NavBtn
            onClick={() => onViewChange('stats')}
            active={view === 'stats'}
            label="Stats"
          >
            <ChartIcon active={view === 'stats'} />
          </NavBtn>
        </div>
      </div>
    </div>
  )
}

function NavBtn({ onClick, active, label, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors active:scale-90 ${
        active ? 'text-luna-terra' : 'text-luna-muted'
      }`}
    >
      {children}
      <span className="text-xs">{label}</span>
    </button>
  )
}
