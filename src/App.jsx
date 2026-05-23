import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import historyData from './data/historyData.json'
import DynastyNav from './components/DynastyNav'
import SearchFilter from './components/SearchFilter'
import Timeline from './components/Timeline'
import EventModal from './components/EventModal'
import TodayInHistory from './components/TodayInHistory'

const dynastyOrder = ['先秦', '秦汉', '三国两晋南北朝', '隋唐', '五代十国宋元', '明清']

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeDynasty, setActiveDynasty] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const dynastyRefs = useRef({})

  // 搜索和筛选
  const filteredEvents = historyData.filter((event) => {
    const matchesSearch = !searchQuery ||
      event.title.includes(searchQuery) ||
      event.description.includes(searchQuery) ||
      event.figures.some((f) => f.includes(searchQuery)) ||
      event.dynasty.includes(searchQuery)

    const matchesCategory = !activeCategory || event.category === activeCategory

    return matchesSearch && matchesCategory
  })

  // 朝代点击跳转
  const handleDynastyClick = useCallback((dynasty) => {
    setActiveDynasty(dynasty)
    const el = dynastyRefs.current[dynasty]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  // 监听滚动，更新当前朝代
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120
      for (const dynasty of dynastyOrder) {
        const el = dynastyRefs.current[dynasty]
        if (el) {
          const { offsetTop, offsetHeight } = el
          if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
            setActiveDynasty(dynasty)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* 顶部标题 */}
      <header className="bg-gradient-to-r from-amber-800 via-amber-700 to-orange-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-wide"
          >
            📜 历史时光轴
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-amber-200 mt-2 text-lg"
          >
            穿越千年，探索中华文明的璀璨历程
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-amber-300/60 mt-1 text-sm"
          >
            共收录 {historyData.length} 个重要历史事件 · 从夏朝到晚清
          </motion.p>
        </div>
      </header>

      {/* 朝代导航 */}
      <DynastyNav
        dynasties={dynastyOrder}
        activeDynasty={activeDynasty}
        onDynastyClick={handleDynastyClick}
      />

      {/* 搜索筛选 */}
      <SearchFilter
        onSearch={setSearchQuery}
        onCategoryChange={setActiveCategory}
        activeCategory={activeCategory}
      />

      {/* 结果统计 */}
      {(searchQuery || activeCategory) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="max-w-7xl mx-auto px-4 py-2"
        >
          <p className="text-sm text-amber-700">
            🔍 找到 <span className="font-bold">{filteredEvents.length}</span> 个事件
            {searchQuery && <span> · 关键词「{searchQuery}」</span>}
            {activeCategory && <span> · 类别「{activeCategory}」</span>}
          </p>
        </motion.div>
      )}

      {/* 主内容 */}
      <main className="relative">
        {filteredEvents.length > 0 ? (
          <Timeline
            events={filteredEvents}
            onEventClick={setSelectedEvent}
            dynastyRefs={dynastyRefs}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-amber-700 text-lg">没有找到匹配的历史事件</p>
            <p className="text-amber-500 text-sm mt-1">试试换个关键词吧</p>
          </motion.div>
        )}

        {/* 随机探索 */}
        <TodayInHistory
          events={historyData}
          onEventClick={setSelectedEvent}
        />
      </main>

      {/* 底部 */}
      <footer className="text-center py-8 text-amber-600/60 text-sm border-t border-amber-200">
        <p>📜 历史时光轴 · 送给最敬爱的历史老师</p>
        <p className="mt-1">以史为鉴，可以知兴替</p>
      </footer>

      {/* 事件详情弹窗 */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
