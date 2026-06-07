import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getDynastyColors, categoryEmojis, formatYearFull, formatYearShort } from '../constants'

// 预设对比对
const presetComparisons = [
  { a: 11, b: 31, label: '两次大一统' },
  { a: 9, b: 47, label: '两场变法运动' },
  { a: 38, b: 70, label: '两个盛世巅峰' },
  { a: 39, b: 49, label: '两场转折之战' },
  { a: 74, b: 79, label: '两次外敌入侵' },
  { a: 80, b: 78, label: '两种救国路线' },
]

function EventSelector({ events, selected, onSelect, label }) {
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const filtered = useMemo(() => {
    if (!query) return events.slice(0, 20)
    return events.filter(e =>
      e.title.includes(query) || e.dynasty.includes(query) || e.description?.includes(query)
    ).slice(0, 20)
  }, [events, query])

  const selectedEvent = events.find(e => e.id === selected)

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
      {selectedEvent ? (
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-amber-300">
          <span className="text-lg">{categoryEmojis[selectedEvent.category]}</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 truncate">{selectedEvent.title}</p>
            <p className="text-xs text-gray-500">{selectedEvent.dynasty} · {formatYearShort(selectedEvent.year)}</p>
          </div>
          <button
            onClick={() => onSelect(null)}
            className="text-gray-400 hover:text-red-500 text-lg flex-shrink-0"
          >
            ✕
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowDropdown(true) }}
            onFocus={() => setShowDropdown(true)}
            placeholder="搜索事件..."
            className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-amber-400 focus:outline-none text-sm"
          />
          {showDropdown && (
            <div className="absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
              {filtered.map(event => {
                const colors = getDynastyColors(event.dynasty)
                return (
                  <button
                    key={event.id}
                    onClick={() => { onSelect(event.id); setShowDropdown(false); setQuery('') }}
                    className="w-full text-left px-3 py-2 hover:bg-amber-50 transition-colors flex items-center gap-2 text-sm"
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                    <span className="font-medium text-gray-800 truncate">{event.title}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{formatYearShort(event.year)}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CompareMode({ events }) {
  const [eventA, setEventA] = useState(null)
  const [eventB, setEventB] = useState(null)

  const evA = events.find(e => e.id === eventA)
  const evB = events.find(e => e.id === eventB)

  const loadPreset = (preset) => {
    setEventA(preset.a)
    setEventB(preset.b)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-amber-800 mb-2 text-center">⚖️ 事件对比</h2>
      <p className="text-gray-500 text-center mb-6 text-sm">选择两个事件，并排对比分析</p>

      {/* 预设对比 */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {presetComparisons.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => loadPreset(preset)}
            className="px-3 py-1.5 bg-white border border-amber-200 rounded-full text-sm text-amber-700 hover:bg-amber-50 hover:border-amber-400 transition-all"
          >
            ⚖️ {preset.label}
          </button>
        ))}
      </div>

      {/* 选择器 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <EventSelector events={events} selected={eventA} onSelect={setEventA} label="事件 A" />
        <EventSelector events={events} selected={eventB} onSelect={setEventB} label="事件 B" />
      </div>

      {/* 对比视图 */}
      <AnimatePresence>
        {evA && evB && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[evA, evB].map((event, idx) => {
              const colors = getDynastyColors(event.dynasty)
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* 头部 */}
                  <div className={`bg-gradient-to-r ${colors.gradient} p-4`}>
                    <span className="text-white/80 text-xs">{idx === 0 ? '事件 A' : '事件 B'}</span>
                    <h3 className="text-xl font-bold text-white mt-1">{event.title}</h3>
                    <p className="text-white/80 text-sm mt-1">{formatYearFull(event.year)} · {event.dynasty}</p>
                  </div>

                  {/* 内容 */}
                  <div className="p-4 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 mb-1">📖 事件描述</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{event.description}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-500 mb-1">👤 相关人物</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {event.figures?.map(f => (
                          <span key={f} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{f}</span>
                        ))}
                        {(!event.figures || event.figures.length === 0) && (
                          <span className="text-xs text-gray-400">无</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-500 mb-1">💡 历史意义</h4>
                      <p className="text-sm text-gray-700 leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                        {event.significance || '暂无'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <span className="text-sm">{categoryEmojis[event.category]}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${colors.tag}`}>{event.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${colors.tag}`}>{event.dynasty}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 对比分析 */}
      <AnimatePresence>
        {evA && evB && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-amber-800 mb-4">📊 对比分析</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">时间差</p>
                <p className="text-2xl font-bold text-amber-600">
                  {Math.abs(evB.year - evA.year)} 年
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">朝代</p>
                <p className="text-sm font-medium">
                  {evA.dynasty === evB.dynasty ? (
                    <span className="text-green-600">相同 · {evA.dynasty}</span>
                  ) : (
                    <span className="text-gray-700">{evA.dynasty} vs {evB.dynasty}</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">类别</p>
                <p className="text-sm font-medium">
                  {evA.category === evB.category ? (
                    <span className="text-green-600">相同 · {evA.category}</span>
                  ) : (
                    <span className="text-gray-700">{evA.category} vs {evB.category}</span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!evA && !evB && (
        <div className="text-center py-12 text-amber-500">
          <p className="text-4xl mb-3">⚖️</p>
          <p>选择两个事件，开始对比分析</p>
          <p className="text-sm text-gray-400 mt-1">或点击上方的预设对比快速开始</p>
        </div>
      )}
    </div>
  )
}
