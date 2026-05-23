import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import historyData from './data/historyData.json'
import DynastyNav from './components/DynastyNav'
import SearchFilter from './components/SearchFilter'
import Timeline from './components/Timeline'
import HorizontalTimeline from './components/HorizontalTimeline'
import EventModal from './components/EventModal'
import TodayInHistory from './components/TodayInHistory'
import EditPanel from './components/EditPanel'
import TopicMode from './components/TopicMode'
import { useLocalStorage } from './hooks/useLocalStorage'

const dynastyOrder = ['先秦', '秦汉', '三国两晋南北朝', '隋唐', '五代十国宋元', '明清', '近代史']

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeDynasty, setActiveDynasty] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [viewMode, setViewMode] = useState('vertical')
  const [pageMode, setPageMode] = useState('timeline') // 'timeline' | 'topic'
  const [editMode, setEditMode] = useState(false)
  const [classroomMode, setClassroomMode] = useState(false)
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)
  const dynastyRefs = useRef({})

  // 持久化数据
  const [customEvents, setCustomEvents] = useLocalStorage('history-custom-events', [])
  const [bookmarks, setBookmarks] = useLocalStorage('history-bookmarks', [])
  const [notes, setNotes] = useLocalStorage('history-notes', {})

  // 合并内置事件和自定义事件
  const allEvents = [...historyData, ...customEvents]

  // 搜索和筛选
  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch = !searchQuery ||
      event.title.includes(searchQuery) ||
      event.description.includes(searchQuery) ||
      event.figures.some((f) => f.includes(searchQuery)) ||
      event.dynasty.includes(searchQuery)

    const matchesCategory = !activeCategory || event.category === activeCategory
    const matchesBookmark = !showBookmarksOnly || bookmarks.includes(event.id)

    return matchesSearch && matchesCategory && matchesBookmark
  })

  // 朝代点击跳转
  const handleDynastyClick = useCallback((dynasty) => {
    setActiveDynasty(dynasty)
    if (viewMode === 'vertical') {
      const el = dynastyRefs.current[dynasty]
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [viewMode])

  // 监听滚动
  useEffect(() => {
    if (viewMode !== 'vertical') return
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
  }, [viewMode])

  // 添加自定义事件
  const handleAddEvent = (newEvent) => {
    setCustomEvents([...customEvents, newEvent])
  }

  // 删除自定义事件
  const handleDeleteEvent = (eventId) => {
    setCustomEvents(customEvents.filter(e => e.id !== eventId))
  }

  // 切换收藏
  const handleToggleBookmark = (eventId) => {
    if (bookmarks.includes(eventId)) {
      setBookmarks(bookmarks.filter(id => id !== eventId))
    } else {
      setBookmarks([...bookmarks, eventId])
    }
  }

  // 保存笔记
  const handleSaveNote = (eventId, noteText) => {
    setNotes({ ...notes, [eventId]: noteText })
  }

  // 导出数据
  const handleExport = () => {
    const exportData = { customEvents, bookmarks, notes }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '历史时光轴-教学数据.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // 导入数据
  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          if (data.customEvents) setCustomEvents(data.customEvents)
          if (data.bookmarks) setBookmarks(data.bookmarks)
          if (data.notes) setNotes(data.notes)
          alert('导入成功！')
        } catch {
          alert('导入失败，请检查文件格式')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

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
            共收录 {allEvents.length} 个重要历史事件 · 从夏朝到新中国成立
          </motion.p>

          {/* 控制按钮组 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 flex flex-wrap justify-center gap-2"
          >
            {/* 页面模式切换 */}
            <button
              onClick={() => setPageMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pageMode === 'timeline' ? 'bg-white text-amber-800 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🕐 时间轴
            </button>
            <button
              onClick={() => setPageMode('topic')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pageMode === 'topic' ? 'bg-white text-amber-800 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              📚 专题
            </button>

            {pageMode === 'timeline' && (
              <>
                <div className="w-px h-6 bg-white/30 mx-1" />

                {/* 视图切换 */}
                <button
                  onClick={() => setViewMode('vertical')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'vertical' ? 'bg-white text-amber-800 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  📋 纵向
                </button>
                <button
                  onClick={() => setViewMode('horizontal')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'horizontal' ? 'bg-white text-amber-800 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  📊 横向
                </button>
              </>
            )}

            <div className="w-px h-6 bg-white/30 mx-1" />

            {/* 编辑模式 */}
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                editMode ? 'bg-green-500 text-white shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              ✏️ 编辑{editMode ? '中' : ''}
            </button>

            {/* 课堂模式 */}
            <button
              onClick={() => setClassroomMode(!classroomMode)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                classroomMode ? 'bg-blue-500 text-white shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🎓 课堂
            </button>

            {/* 重点筛选 */}
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                showBookmarksOnly ? 'bg-yellow-500 text-white shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              ⭐ 重点{showBookmarksOnly ? '' : `(${bookmarks.length})`}
            </button>

            <div className="w-px h-6 bg-white/30 mx-1" />

            {/* 导入导出 */}
            <button onClick={handleExport} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/20 text-white hover:bg-white/30 transition-all">
              📤 导出
            </button>
            <button onClick={handleImport} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/20 text-white hover:bg-white/30 transition-all">
              📥 导入
            </button>
          </motion.div>
        </div>
      </header>

      {/* 朝代导航 */}
      <DynastyNav dynasties={dynastyOrder} activeDynasty={activeDynasty} onDynastyClick={handleDynastyClick} />

      {/* 搜索筛选 */}
      <SearchFilter onSearch={setSearchQuery} onCategoryChange={setActiveCategory} activeCategory={activeCategory} />

      {/* 编辑模式工具栏 */}
      {editMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-green-50 border-b border-green-200"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            <span className="text-green-700 text-sm font-medium">✏️ 编辑模式已开启</span>
            <button
              onClick={() => setShowEditPanel(true)}
              className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              + 添加自定义事件
            </button>
            {customEvents.length > 0 && (
              <span className="text-green-600 text-sm">已添加 {customEvents.length} 个自定义事件</span>
            )}
          </div>
        </motion.div>
      )}

      {/* 结果统计 */}
      {(searchQuery || activeCategory || showBookmarksOnly) && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="max-w-7xl mx-auto px-4 py-2">
          <p className="text-sm text-amber-700">
            🔍 找到 <span className="font-bold">{filteredEvents.length}</span> 个事件
            {searchQuery && <span> · 关键词「{searchQuery}」</span>}
            {activeCategory && <span> · 类别「{activeCategory}」</span>}
            {showBookmarksOnly && <span> · 仅显示重点 ⭐</span>}
          </p>
        </motion.div>
      )}

      {/* 主内容 */}
      <main className={`relative ${classroomMode ? 'text-xl' : ''}`}>
        {pageMode === 'topic' ? (
          <TopicMode events={filteredEvents} onEventClick={setSelectedEvent} />
        ) : filteredEvents.length > 0 ? (
          viewMode === 'vertical' ? (
            <Timeline events={filteredEvents} onEventClick={setSelectedEvent} dynastyRefs={dynastyRefs} />
          ) : (
            <HorizontalTimeline events={filteredEvents} onEventClick={setSelectedEvent} />
          )
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-amber-700 text-lg">没有找到匹配的历史事件</p>
            <p className="text-amber-500 text-sm mt-1">试试换个关键词吧</p>
          </motion.div>
        )}

        {/* 随机探索 */}
        <TodayInHistory events={allEvents} onEventClick={setSelectedEvent} />
      </main>

      {/* 底部 */}
      <footer className="text-center py-8 text-amber-600/60 text-sm border-t border-amber-200">
        <p>📜 历史时光轴 · 献给敬爱的历史黄老师</p>
        <p className="mt-1">以史为鉴，可以知兴替</p>
      </footer>

      {/* 事件详情弹窗 */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            isBookmarked={bookmarks.includes(selectedEvent.id)}
            onToggleBookmark={() => handleToggleBookmark(selectedEvent.id)}
            note={notes[selectedEvent.id]}
            onSaveNote={(text) => handleSaveNote(selectedEvent.id, text)}
          />
        )}
      </AnimatePresence>

      {/* 添加事件面板 */}
      {showEditPanel && (
        <EditPanel onAddEvent={handleAddEvent} onClose={() => setShowEditPanel(false)} />
      )}
    </div>
  )
}
