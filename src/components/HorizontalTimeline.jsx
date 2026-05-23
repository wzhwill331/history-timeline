import { motion } from 'framer-motion'

const dynastyColors = {
  '先秦': { bg: 'bg-amber-600', text: 'text-amber-100', border: 'border-amber-400' },
  '秦汉': { bg: 'bg-red-600', text: 'text-red-100', border: 'border-red-400' },
  '三国两晋南北朝': { bg: 'bg-emerald-600', text: 'text-emerald-100', border: 'border-emerald-400' },
  '隋唐': { bg: 'bg-yellow-500', text: 'text-yellow-100', border: 'border-yellow-400' },
  '五代十国宋元': { bg: 'bg-cyan-600', text: 'text-cyan-100', border: 'border-cyan-400' },
  '明清': { bg: 'bg-blue-700', text: 'text-blue-100', border: 'border-blue-400' },
  '近代史': { bg: 'bg-purple-600', text: 'text-purple-100', border: 'border-purple-400' },
}

const categoryEmojis = {
  '战争': '⚔️',
  '文化': '📜',
  '科技': '🔬',
  '政治': '🏛️',
  '经济': '💰',
}

function formatYear(year) {
  return year < 0 ? `前${Math.abs(year)}` : `${year}`
}

export default function HorizontalTimeline({ events, onEventClick }) {
  // 按朝代分组
  const dynastyOrder = ['先秦', '秦汉', '三国两晋南北朝', '隋唐', '五代十国宋元', '明清', '近代史']
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.dynasty]) acc[event.dynasty] = []
    acc[event.dynasty].push(event)
    return acc
  }, {})

  return (
    <div className="overflow-x-auto pb-6 px-4">
      <div className="min-w-max">
        {/* 朝代行 */}
        <div className="flex gap-0 mb-2">
          {dynastyOrder.map((dynasty) => {
            const dynastyEvents = groupedEvents[dynasty]
            if (!dynastyEvents || dynastyEvents.length === 0) return null
            const colors = dynastyColors[dynasty] || dynastyColors['先秦']
            return (
              <div
                key={dynasty}
                className={`${colors.bg} ${colors.text} px-4 py-2 text-sm font-bold text-center`}
                style={{ minWidth: `${Math.max(dynastyEvents.length * 120, 150)}px` }}
              >
                {dynasty} ({dynastyEvents.length})
              </div>
            )
          })}
        </div>

        {/* 时间轴主线 */}
        <div className="relative">
          {/* 横线 */}
          <div className="absolute top-4 left-0 right-0 h-1 bg-amber-300" />

          {/* 事件行 */}
          <div className="flex gap-0">
            {dynastyOrder.map((dynasty) => {
              const dynastyEvents = groupedEvents[dynasty]
              if (!dynastyEvents || dynastyEvents.length === 0) return null
              const colors = dynastyColors[dynasty] || dynastyColors['先秦']

              return (
                <div key={dynasty} className="flex">
                  {dynastyEvents
                    .sort((a, b) => a.year - b.year)
                    .map((event, idx) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.02 }}
                        className="flex flex-col items-center cursor-pointer group"
                        style={{ width: '120px' }}
                        onClick={() => onEventClick(event)}
                      >
                        {/* 节点 */}
                        <div className={`w-3 h-3 rounded-full ${colors.bg} ring-2 ring-white shadow-sm group-hover:scale-150 transition-transform z-10 mt-3`} />

                        {/* 连接线 */}
                        <div className={`w-px h-4 ${colors.bg} opacity-50`} />

                        {/* 卡片 */}
                        <div className={`
                          w-[110px] p-2 rounded-lg border-l-2 ${colors.border} bg-white shadow-sm
                          group-hover:shadow-md group-hover:-translate-y-1 transition-all
                          text-center
                        `}>
                          <p className={`text-[10px] font-mono ${colors.text.replace('100', '700')}`}>{formatYear(event.year)}</p>
                          <p className="text-xs font-bold text-gray-800 mt-0.5 line-clamp-2">{event.title}</p>
                          <span className="text-xs">{categoryEmojis[event.category]}</span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* 底部时间刻度 */}
        <div className="flex justify-between text-xs text-amber-500 mt-4 px-4">
          <span>公元前2070年</span>
          <span>公元前</span>
          <span>公元元年</span>
          <span>公元后</span>
          <span>1949年</span>
        </div>
      </div>
    </div>
  )
}
