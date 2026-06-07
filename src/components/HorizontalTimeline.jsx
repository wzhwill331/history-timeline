import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { dynastyOrder, getDynastyColors, categoryEmojis, formatYearShort } from '../constants'

// 布局常量
const LINE_Y = 200       // 主线 Y 坐标
const TOP_GAP = 20       // 上方卡片底部到主线的间距
const BOTTOM_GAP = 20    // 下方卡片顶部到主线的间距

export default function HorizontalTimeline({ events, onEventClick, dynastyRefs }) {
  const scrollRef = useRef(null)

  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.dynasty]) acc[event.dynasty] = []
    acc[event.dynasty].push(event)
    return acc
  }, {})

  useEffect(() => {
    if (dynastyRefs) {
      dynastyRefs.current = {}
      dynastyOrder.forEach(dynasty => {
        dynastyRefs.current[dynasty] = {
          scrollIntoView: () => {
            const el = document.getElementById(`h-dynasty-${dynasty}`)
            if (el && scrollRef.current) {
              const container = scrollRef.current
              const targetLeft = el.offsetLeft - container.offsetLeft - 40
              container.scrollTo({ left: targetLeft, behavior: 'smooth' })
            }
          }
        }
      })
    }
  }, [events])

  let globalIdx = 0

  return (
    <div className="py-6">
      <div ref={scrollRef} className="overflow-x-auto pb-4 px-6 scrollbar-thin">
        <div className="relative" style={{ minWidth: 'max-content' }}>

          {/* 朝代色带 */}
          <div className="flex h-10 mb-2">
            {dynastyOrder.map((dynasty) => {
              const de = groupedEvents[dynasty]
              if (!de || de.length === 0) return null
              const colors = getDynastyColors(dynasty)
              const w = Math.max(de.length * 140, 180)
              return (
                <div key={dynasty} id={`h-dynasty-${dynasty}`}
                  className={`${colors.bg} text-white flex items-center justify-center text-sm font-bold rounded-t-lg`}
                  style={{ width: `${w}px` }}>
                  {dynasty} ({de.length})
                </div>
              )
            })}
          </div>

          {/* 主区域 */}
          <div className="relative" style={{ height: '440px' }}>

            {/* 主线 */}
            <div className="absolute left-0 right-0 h-[3px] rounded-full"
              style={{ top: `${LINE_Y}px`, background: 'linear-gradient(to right, #d97706, #dc2626, #eab308, #059669, #0891b2, #1d4ed8, #9333ea)' }} />

            {/* 起止标注 */}
            <div className="absolute left-3 text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full"
              style={{ top: `${LINE_Y + 10}px` }}>前2070年</div>
            <div className="absolute right-3 text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full"
              style={{ top: `${LINE_Y + 10}px` }}>1949年</div>

            {/* 事件 */}
            <div className="flex h-full">
              {dynastyOrder.map((dynasty) => {
                const de = groupedEvents[dynasty]
                if (!de || de.length === 0) return null
                const colors = getDynastyColors(dynasty)
                const w = Math.max(de.length * 140, 180)

                return (
                  <div key={dynasty} style={{ width: `${w}px` }} className="relative">
                    {de.sort((a, b) => a.year - b.year).map((event, idx) => {
                      const isTop = globalIdx % 2 === 0
                      globalIdx++

                      const cx = idx * 140 + 75  // 卡片中心 X

                      return (
                        <div key={event.id}>
                          {/* 节点圆点 — 精确在主线上 */}
                          <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            className={`absolute w-3.5 h-3.5 rounded-full ${colors.bg} ring-2 ring-white shadow-md z-20 cursor-pointer hover:scale-150 transition-transform`}
                            style={{ left: `${cx - 7}px`, top: `${LINE_Y - 7}px` }}
                            onClick={() => onEventClick(event)}
                          />

                          {/* 连接线 — 从节点到卡片 */}
                          <div
                            className="absolute w-[2px] bg-gray-300 z-10"
                            style={{
                              left: `${cx - 1}px`,
                              ...(isTop
                                ? { bottom: `${440 - LINE_Y + 7}px`, height: `${TOP_GAP}px` }
                                : { top: `${LINE_Y + 7}px`, height: `${BOTTOM_GAP}px` }
                              ),
                            }}
                          />

                          {/* 卡片 */}
                          <motion.div
                            initial={{ opacity: 0, y: isTop ? -15 : 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.03 }}
                            className="absolute cursor-pointer group"
                            style={{
                              left: `${idx * 140 + 10}px`,
                              ...(isTop
                                ? { bottom: `${440 - LINE_Y + TOP_GAP + 7}px` }
                                : { top: `${LINE_Y + BOTTOM_GAP + 7}px` }
                              ),
                              width: '130px',
                            }}
                            onClick={() => onEventClick(event)}
                          >
                            <div className={`p-3 rounded-xl border-l-[3px] ${colors.border} bg-white shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all`}>
                              <p className={`text-[10px] font-mono ${colors.text} font-bold`}>{formatYearShort(event.year)}</p>
                              <p className="text-xs font-bold text-gray-800 mt-0.5 line-clamp-2 leading-tight">{event.title}</p>
                              <div className="flex items-center gap-1 mt-1.5">
                                <span className="text-xs">{categoryEmojis[event.category]}</span>
                                {event.figures?.length > 0 && (
                                  <span className="text-[9px] text-gray-400 truncate">{event.figures[0]}</span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-amber-500 mt-2">← 左右滑动浏览 →</p>
    </div>
  )
}
