import { useMemo, useRef, useState } from 'react'
import './App.css'

function App() {
  const year = 2022
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const [currentMonth, setCurrentMonth] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState('next')
  const [transitionPhase, setTransitionPhase] = useState('idle')
  const [rangeStart, setRangeStart] = useState(null)
  const [rangeEnd, setRangeEnd] = useState(null)
  const swipeStartX = useRef(null)
  const isSwiping = useRef(false)
  const fallbackPhoto =
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80'

  const monthImages = useMemo(() => {
    const assetMap = import.meta.glob('./assets/*', { eager: true, import: 'default' })
    return Object.entries(assetMap)
      .filter(([path]) => !path.endsWith('.svg') && !path.endsWith('hero.png'))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, src]) => src)
      .slice(0, 12)
  }, [])

  const currentMonthPhoto = monthImages[currentMonth] ?? fallbackPhoto

  const dates = useMemo(() => {
    const firstDayInMonth = new Date(year, currentMonth, 1)
    const firstDayOffset = (firstDayInMonth.getDay() + 6) % 7
    const firstGridDate = new Date(year, currentMonth, 1 - firstDayOffset)

    return Array.from({ length: 42 }, (_, offset) => {
      const date = new Date(firstGridDate)
      date.setDate(firstGridDate.getDate() + offset)

      const isCurrentMonth = date.getMonth() === currentMonth
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      let type = 'normal'

      if (!isCurrentMonth) {
        type = date < firstDayInMonth ? 'muted' : 'next'
      } else if (isWeekend) {
        type = 'weekend'
      }

      return {
        day: date.getDate(),
        type,
        time: new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(),
      }
    })
  }, [currentMonth])

  const handleDateClick = (dateTime) => {
    if (rangeStart === null || rangeEnd !== null) {
      setRangeStart(dateTime)
      setRangeEnd(null)
      return
    }

    if (dateTime < rangeStart) {
      setRangeEnd(rangeStart)
      setRangeStart(dateTime)
      return
    }

    setRangeEnd(dateTime)
  }

  const minRange = rangeStart !== null && rangeEnd !== null ? Math.min(rangeStart, rangeEnd) : null
  const maxRange = rangeStart !== null && rangeEnd !== null ? Math.max(rangeStart, rangeEnd) : null

  const handleMonthFlip = (direction) => {
    if (isFlipping) {
      return
    }

    setFlipDirection(direction)
    setIsFlipping(true)
    setTransitionPhase('out')

    setTimeout(() => {
      setCurrentMonth((prevMonth) => {
        if (direction === 'next') {
          return (prevMonth + 1) % 12
        }
        return (prevMonth + 11) % 12
      })

      setTransitionPhase('in-start')

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionPhase('in-active')
        })
      })
    }, 340)

    setTimeout(() => {
      setIsFlipping(false)
      setTransitionPhase('idle')
    }, 700)
  }

  const startSwipe = (clientX) => {
    swipeStartX.current = clientX
    isSwiping.current = true
  }

  const completeSwipe = (clientX) => {
    if (!isSwiping.current || swipeStartX.current === null) {
      return
    }

    const deltaX = clientX - swipeStartX.current
    swipeStartX.current = null
    isSwiping.current = false

    if (Math.abs(deltaX) < 40) {
      return
    }

    if (deltaX > 0) {
      handleMonthFlip('prev')
      return
    }

    handleMonthFlip('next')
  }

  const handleTouchStart = (event) => {
    startSwipe(event.changedTouches[0].clientX)
  }

  const handleTouchEnd = (event) => {
    completeSwipe(event.changedTouches[0].clientX)
  }

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return
    }

    startSwipe(event.clientX)
  }

  const handlePointerUp = (event) => {
    completeSwipe(event.clientX)
  }

  const handlePointerCancel = () => {
    swipeStartX.current = null
    isSwiping.current = false
  }

  const clearRangeSelection = () => {
    setRangeStart(null)
    setRangeEnd(null)
  }

  const handleSceneClick = (event) => {
    if (event.target.closest('.day')) {
      return
    }

    if (rangeStart !== null || rangeEnd !== null) {
      clearRangeSelection()
    }
  }

  const flipClass = isFlipping ? `is-flipping ${transitionPhase} ${flipDirection}` : ''

  return (
    <main className="scene" onClick={handleSceneClick}>
      <article
        className="calendar-sheet"
        aria-label="Wall calendar with month flip animation"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <header
          className={`photo-panel ${flipClass}`}
          aria-hidden="true"
          style={{
            backgroundImage: `linear-gradient(rgba(72, 95, 122, 0.24), rgba(40, 47, 58, 0.2)), url(${currentMonthPhoto})`,
          }}
        >
          <div className="cut-layer cut-left" />
          <div className="cut-layer cut-right" />
        </header>

        <section className={`calendar-content ${flipClass}`}>
          <aside className="notes-panel" aria-label="Notes section">
            <h2>Notes</h2>
            <textarea
              className="notes-input"
              rows="8"
              placeholder="Write your notes here..."
              onPointerDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
            />
          </aside>

          <section className="dates-panel" aria-label="Month view">
            <div className="month-title">
              <p>{year}</p>
              <h1>{monthNames[currentMonth]}</h1>
            </div>
            <p className="range-help">Select start and end dates on the grid.</p>

            <div className="weekdays" aria-hidden="true">
              {weekDays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="day-grid">
              {dates.map((date, index) => {
                const isStart = rangeStart === date.time
                const isEnd = rangeEnd === date.time
                const isInRange = minRange !== null && maxRange !== null && date.time > minRange && date.time < maxRange

                const rangeClass = [
                  isStart ? 'range-start' : '',
                  isEnd ? 'range-end' : '',
                  isInRange ? 'range-in' : '',
                ]
                  .filter(Boolean)
                  .join(' ')

                return (
                  <button
                    key={`${date.time}-${index}`}
                    type="button"
                    className={`day ${date.type} ${rangeClass}`.trim()}
                    onClick={() => handleDateClick(date.time)}
                    aria-label={`Select ${date.day} as range date`}
                  >
                    {date.day}
                  </button>
                )
              })}
            </div>
            <p className="swipe-hint">Swipe right for previous month and left for next month.</p>
          </section>
        </section>
      </article>
    </main>
  )
}

export default App
