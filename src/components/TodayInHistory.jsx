import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getDynastyColors, categoryEmojis, formatYearFull } from '../constants'

export default function TodayInHistory({ events, onEventClick }) {
  const [randomEvent, setRandomEvent] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const pickRandom = () => {
    const idx = Math.floor(Math.random() * events.length)
    setRandomEvent(events[idx])
    setIsExpanded(true)
  }

  useEffect(() => {
    pickRandom()
  }, [])

  if (!randomEvent) return null

  const yearDisplay = formatYearFull(randomEvent.year)
  const dc = getDynastyColors(randomEvent.dynasty)
  const borderClass = `${dc.borderLeft} ${dc.solidBg}`

  return (
    <div className="fixed bottom-6 right-6 z-30 max-w-sm">
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            key={randomEvent.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`mb-3 p-4 rounded-2xl border-l-4 shadow-lg bg-white cursor-pointer hover:shadow-xl transition-shadow ${borderClass}`}
            onClick={() => onEventClick(randomEvent)}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-500">🎲 随机探索</span>
              <button
                onClick={(e) => { e.stopPropagation(); setIsExpanded(false) }}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </div>
            <h4 className="font-bold text-gray-800 text-lg">{randomEvent.title}</h4>
            <p className="text-sm text-gray-500 mt-1">{yearDisplay} · {randomEvent.dynasty}</p>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{randomEvent.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs">{categoryEmojis[randomEvent.category]}</span>
              <span className="text-xs text-gray-400">{randomEvent.category}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 刷新按钮 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9, rotate: 180 }}
        onClick={pickRandom}
        className="w-14 h-14 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-700 transition-colors flex items-center justify-center text-xl ml-auto"
        title="换一个历史事件"
      >
        🎲
      </motion.button>
    </div>
  )
}
