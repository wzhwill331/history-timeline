import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const dynastyColors = {
  '先秦': { dot: 'bg-amber-600', line: 'bg-amber-300', card: 'border-amber-400 hover:border-amber-600', tag: 'bg-amber-100 text-amber-800', accent: 'text-amber-700' },
  '秦汉': { dot: 'bg-red-600', line: 'bg-red-300', card: 'border-red-400 hover:border-red-600', tag: 'bg-red-100 text-red-800', accent: 'text-red-700' },
  '三国两晋南北朝': { dot: 'bg-emerald-600', line: 'bg-emerald-300', card: 'border-emerald-400 hover:border-emerald-600', tag: 'bg-emerald-100 text-emerald-800', accent: 'text-emerald-700' },
  '隋唐': { dot: 'bg-yellow-500', line: 'bg-yellow-300', card: 'border-yellow-400 hover:border-yellow-500', tag: 'bg-yellow-100 text-yellow-800', accent: 'text-yellow-700' },
  '五代十国宋元': { dot: 'bg-cyan-600', line: 'bg-cyan-300', card: 'border-cyan-400 hover:border-cyan-600', tag: 'bg-cyan-100 text-cyan-800', accent: 'text-cyan-700' },
  '明清': { dot: 'bg-blue-700', line: 'bg-blue-300', card: 'border-blue-400 hover:border-blue-700', tag: 'bg-blue-100 text-blue-800', accent: 'text-blue-700' },
  '近代史': { dot: 'bg-purple-600', line: 'bg-purple-300', card: 'border-purple-400 hover:border-purple-600', tag: 'bg-purple-100 text-purple-800', accent: 'text-purple-700' },
}

const categoryEmojis = {
  '战争': '⚔️',
  '文化': '📜',
  '科技': '🔬',
  '政治': '🏛️',
  '经济': '💰',
}

function formatYear(year) {
  return year < 0 ? `公元前${Math.abs(year)}` : `${year}`
}

function DynastyHeader({ dynasty }) {
  const colors = dynastyColors[dynasty] || dynastyColors['先秦']
  return (
    <div className="flex items-center gap-3 py-4" id={`dynasty-${dynasty}`}>
      <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
      <h2 className={`text-xl font-bold ${colors.accent}`}>{dynasty}</h2>
      <div className={`flex-1 h-px ${colors.line}`} />
    </div>
  )
}

function EventCard({ event, index, onClick }) {
  const colors = dynastyColors[event.dynasty] || dynastyColors['先秦']
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
          flex-1 p-4 bg-white rounded-xl border-l-4 shadow-sm cursor-pointer
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
            <h3 className="font-bold text-gray-800 text-lg">{event.title}</h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{event.description}</p>
          </div>
          <span className="text-lg flex-shrink-0">{categoryEmojis[event.category]}</span>
        </div>

        {event.figures && event.figures.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {event.figures.slice(0, 3).map((figure) => (
              <span key={figure} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
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

  const dynastyOrder = ['先秦', '秦汉', '三国两晋南北朝', '隋唐', '五代十国宋元', '明清', '近代史']

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
