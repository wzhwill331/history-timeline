import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { dynastyOrder, getDynastyColors, categoryEmojis, formatYear } from '../constants'

function DynastyHeader({ dynasty }) {
  const colors = getDynastyColors(dynasty)
  return (
    <div className="flex items-center gap-3 py-4" id={`dynasty-${dynasty}`}>
      <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
      <h2 className={`text-xl font-bold ${colors.accent}`}>{dynasty}</h2>
      <div className={`flex-1 h-px ${colors.line}`} />
    </div>
  )
}

function EventCard({ event, index, onClick }) {
  const colors = getDynastyColors(event.dynasty)
  const isLeft = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className={`relative flex items-start gap-4 ${isLeft ? '' : 'flex-row-reverse'}`}
    >
      {/* 时间轴节点 */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-4 h-4 rounded-full ${colors.dot} ring-4 ring-white shadow-md`} />
        <div className={`w-0.5 h-full ${colors.line} min-h-[20px]`} />
      </div>

      {/* 卡片 */}
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        onClick={() => onClick(event)}
        className={`
          flex-1 p-4 bg-white dark:bg-gray-800 rounded-xl border-l-4 shadow-sm cursor-pointer
          hover:shadow-md transition-all duration-200 mb-4
          ${colors.card}
        `}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-mono ${colors.accent}`}>{formatYear(event.year)}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${colors.tag}`}>{event.dynasty}</span>
            </div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{event.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{event.description}</p>
          </div>
          <span className="text-lg flex-shrink-0">{categoryEmojis[event.category]}</span>
        </div>

        {event.figures && event.figures.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {event.figures.slice(0, 3).map((figure) => (
              <span key={figure} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                {figure}
              </span>
            ))}
            {event.figures.length > 3 && (
              <span className="text-xs text-gray-400">+{event.figures.length - 3}</span>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Timeline({ events, onEventClick, dynastyRefs }) {
  // 按朝代分组
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.dynasty]) acc[event.dynasty] = []
    acc[event.dynasty].push(event)
    return acc
  }, {})

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="relative">
        {/* 中间竖线 */}
        <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-amber-200" />

        {dynastyOrder.map((dynasty) => {
          const dynastyEvents = groupedEvents[dynasty]
          if (!dynastyEvents || dynastyEvents.length === 0) return null

          return (
            <div key={dynasty} ref={(el) => { if (dynastyRefs) dynastyRefs.current[dynasty] = el }}>
              <DynastyHeader dynasty={dynasty} />
              {dynastyEvents
                .sort((a, b) => a.year - b.year)
                .map((event, idx) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    index={idx}
                    onClick={onEventClick}
                  />
                ))}
            </div>
          )
        })}

        {/* 结尾 */}
        <div className="flex items-center gap-3 py-8">
          <div className="w-4 h-4 rounded-full bg-amber-400 ring-4 ring-white shadow-md" />
          <p className="text-amber-600 font-medium">🌟 历史长河，源远流长</p>
        </div>
      </div>
    </div>
  )
}
