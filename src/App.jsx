import { useState, useEffect } from 'react'
import Welcome from './components/Welcome'
import Calendar from './components/Calendar'
import DaySheet from './components/DaySheet'
import Stats from './components/Stats'
import Nav from './components/Nav'
import { loadData, saveData } from './utils/storage'
import { today } from './utils/cycle'

export default function App() {
  const [data, setData] = useState(null)
  const [view, setView] = useState('calendar')
  const [selectedDay, setSelectedDay] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    setData(loadData())
  }, [])

  if (data === null) {
    return <div className="min-h-screen bg-luna-cream" />
  }

  if (!data.username) {
    return (
      <Welcome
        onComplete={({ name, preferences, periods }) => {
          const fresh = { username: name, preferences, periods, dayLogs: {} }
          saveData(fresh)
          setData(fresh)
        }}
      />
    )
  }

  function updateData(next) {
    saveData(next)
    setData(next)
  }

  return (
    <div className="min-h-screen bg-luna-cream flex justify-center">
      <div className="w-full max-w-md flex flex-col min-h-screen relative">
        {view === 'calendar' && (
          <Calendar
            data={data}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            onDaySelect={setSelectedDay}
          />
        )}
        {view === 'stats' && <Stats data={data} />}

        <Nav
          view={view}
          onViewChange={setView}
          onTodayLog={() => setSelectedDay(today())}
        />

        {selectedDay && (
          <DaySheet
            date={selectedDay}
            data={data}
            onUpdate={updateData}
            onClose={() => setSelectedDay(null)}
          />
        )}
      </div>
    </div>
  )
}
