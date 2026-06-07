import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getDynastyColors, categoryEmojis, formatYearShort } from '../constants'

// 预定义因果链（基于历史事件数据）
const causalChains = [
  {
    id: 'qin-unification',
    title: '秦国崛起与统一',
    emoji: '⚔️',
    description: '从变法到统一六国的崛起之路',
    eventIds: [9, 11, 12, 13],
  },
  {
    id: 'sui-tang-rise',
    title: '隋唐盛世之路',
    emoji: '🏯',
    description: '从统一到鼎盛的王朝崛起',
    eventIds: [31, 32, 33, 34, 35, 37, 38],
  },
  {
    id: 'tang-decline',
    title: '唐朝由盛转衰',
    emoji: '📉',
    description: '从开元盛世到藩镇割据',
    eventIds: [38, 39, 42],
  },
  {
    id: 'song-crisis',
    title: '宋朝边患与变法',
    emoji: '🗡️',
    description: '外患内忧下的改革尝试',
    eventIds: [43, 44, 45, 47, 49, 50],
  },
  {
    id: 'modern-humiliation',
    title: '近代屈辱与探索',
    emoji: '🔥',
    description: '从鸦片战争到救亡图存',
    eventIds: [73, 74, 75, 76, 77, 78, 79, 80, 81],
  },
  {
    id: 'revolution-path',
    title: '革命探索之路',
    emoji: '🌟',
    description: '从辛亥革命到新中国成立',
    eventIds: [83, 84, 85, 86, 87, 88, 90, 91, 93, 94, 103, 105],
  },
  {
    id: 'anti-japan',
    title: '抗日战争历程',
    emoji: '🇨🇳',
    description: '从局部抗战到全面胜利',
    eventIds: [92, 95, 96, 97, 98, 99, 101],
  },
  {
    id: 'tech-progress',
    title: '科技发展脉络',
    emoji: '🔬',
    description: '四大发明与科技成就',
    eventIds: [20, 30, 41, 46, 48, 55, 63],
  },
]

function ChainCard({ chain, events, onSelect, isActive }) {
  const chainEvents = chain.eventIds
    .map(id => events.find(e => e.id === id))
    .filter(Boolean)

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(chain)}
      className={`
        text-left w-full p-4 rounded-xl border-2 transition-all
        ${isActive
          ? 'border-amber-500 shadow-lg bg-white'
          : 'border-transparent bg-white/80 hover:bg-white hover:shadow-md'
        }
      `}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{chain.emoji}</span>
        <div>
          <h3 className="font-bold text-gray-800">{chain.title}</h3>
          <p className="text-xs text-gray-500">{chain.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2 flex-wrap">
        <span className="text-xs text-amber-600">{chainEvents.length} 个事件</span>
        <span className="text-xs text-gray-400">·</span>
        <span className="text-xs text-gray-400">
          {formatYearShort(chainEvents[0]?.year)} → {formatYearShort(chainEvents[chainEvents.length - 1]?.year)}
        </span>
      </div>
    </motion.button>
  )
}

export default function CausalChain({ events, onEventClick }) {
  const [selectedChain, setSelectedChain] = useState(null)

  // 将事件 id 映射为事件对象
  const getChainEvents = (chain) => {
    return chain.eventIds
      .map(id => events.find(e => e.id === id))
      .filter(Boolean)
  }

  const chainEvents = selectedChain ? getChainEvents(selectedChain) : []

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-amber-800 mb-2 text-center">🔗 因果关系链</h2>
      <p className="text-gray-500 text-center mb-8 text-sm">探索历史事件之间的因果与时间关系</p>

      {/* 链条选择 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {causalChains.map(chain => (
          <ChainCard
            key={chain.id}
            chain={chain}
            events={events}
            onSelect={(c) => setSelectedChain(selectedChain?.id === c.id ? null : c)}
            isActive={selectedChain?.id === chain.id}
          />
        ))}
      </div>

      {/* 因果链可视化 */}
      <AnimatePresence mode="wait">
        {selectedChain && chainEvents.length > 0 && (
          <motion.div
            key={selectedChain.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{selectedChain.emoji}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedChain.title}</h3>
                <p className="text-sm text-gray-500">{selectedChain.description}</p>
              </div>
            </div>

            {/* 因果链 */}
            <div className="relative">
              <div className="flex items-start gap-0 overflow-x-auto pb-4">
                {chainEvents.map((event, idx) => {
                  const colors = getDynastyColors(event.dynasty)
                  const isLast = idx === chainEvents.length - 1
                  return (
                    <div key={event.id} className="flex items-start flex-shrink-0">
                      {/* 事件节点 */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col items-center cursor-pointer group"
                        style={{ width: '160px' }}
                        onClick={() => onEventClick(event)}
                      >
                        {/* 年份标签 */}
                        <span className={`text-xs font-mono font-bold ${colors.accent} mb-2`}>
                          {formatYearShort(event.year)}
                        </span>

                        {/* 圆点 */}
                        <div className={`w-5 h-5 rounded-full ${colors.dot} ring-4 ring-white shadow-md z-10 group-hover:scale-125 transition-transform`} />

                        {/* 连接线 */}
                        {!isLast && (
                          <div className="absolute h-0.5 bg-gray-300" style={{ width: '60px', marginTop: '10px' }} />
                        )}

                        {/* 卡片 */}
                        <div className={`mt-3 p-3 rounded-xl border-l-3 ${colors.card} bg-white shadow-sm group-hover:shadow-md transition-all w-full`}>
                          <p className="text-xs font-bold text-gray-800 line-clamp-2">{event.title}</p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <span className="text-xs">{categoryEmojis[event.category]}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${colors.tag}`}>{event.dynasty}</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* 箭头 */}
                      {!isLast && (
                        <div className="flex items-center mt-4 flex-shrink-0 px-1">
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 + 0.15 }}
                            className="text-amber-400 text-xl"
                          >
                            →
                          </motion.div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 时间跨度 */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <span>起点：{formatYearShort(chainEvents[0].year)}</span>
              <span className="text-amber-600 font-medium">
                跨度 {Math.abs(chainEvents[chainEvents.length - 1].year - chainEvents[0].year)} 年
              </span>
              <span>终点：{formatYearShort(chainEvents[chainEvents.length - 1].year)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedChain && (
        <div className="text-center py-12 text-amber-500">
          <p className="text-4xl mb-3">👆</p>
          <p>选择上方的主题，查看历史事件的因果关系链</p>
        </div>
      )}
    </div>
  )
}
