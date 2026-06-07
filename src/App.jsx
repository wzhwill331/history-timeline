import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import historyData from './data/historyData.json'
import DynastyNav from './components/DynastyNav'
import SearchFilter from './components/SearchFilter'
import Timeline from './components/Timeline'
import HorizontalTimeline from './components/HorizontalTimeline'
import EventModal from './components/EventModal'
import TodayInHistory from './components/TodayInHistory'
import EditPanel from './components/EditPanel'
import EditEventPanel from './components/EditEventPanel'
import Tutorial from './components/Tutorial'
import TopicMode from './components/TopicMode'
import QuizMode from './components/QuizMode'
import CausalChain from './components/CausalChain'
import CompareMode from './components/CompareMode'
import MapMode from './components/MapMode'
import { useLocalStorage } from './hooks/useLocalStorage'
import { dynastyOrder } from './constants'

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeDynasty, setActiveDynasty] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [viewMode, setViewMode] = useState('vertical')
  const [pageMode, setPageMode] = useState('timeline')
  const [editMode, setEditMode] = useState(false)
  const [classroomMode, setClassroomMode] = useState(false)
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem('history-tutorial-seen')
  })
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('history-dark-mode') === 'true'
  })

  // 切换暗色模式
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev
      localStorage.setItem('history-dark-mode', String(next))
      return next
    })
  }, [])
  const dynastyRefs = useRef({})

  // 持久化数据
  const [customEvents, setCustomEvents] = useLocalStorage('history-custom-events', [])
  const [bookmarks, setBookmarks] = useLocalStorage('history-bookmarks', [])
  const [notes, setNotes] = useLocalStorage('history-notes', {})
  const [eventOverrides, setEventOverrides] = useLocalStorage('history-event-overrides', {})
  const [editingEvent, setEditingEvent] = useState(null)

  // 合并：内置事件 + 覆盖修改 + 自定义事件
  const allEvents = useMemo(() =>
    [...historyData.map(e => ({ ...e, ...(eventOverrides[e.id] || {}) })), ...customEvents],
    [eventOverrides, customEvents]
  )

  const filteredEvents = useMemo(() => allEvents.filter((event) => {
    const matchesSearch = !searchQuery ||
      event.title.includes(searchQuery) ||
      event.description.includes(searchQuery) ||
      event.figures.some((f) => f.includes(searchQuery)) ||
      event.dynasty.includes(searchQuery)
    const matchesCategory = !activeCategory || event.category === activeCategory
    const matchesBookmark = !showBookmarksOnly || bookmarks.includes(event.id)
    return matchesSearch && matchesCategory && matchesBookmark
  }), [allEvents, searchQuery, activeCategory, showBookmarksOnly, bookmarks])

  // 朝代点击跳转（支持纵向和横向）
  const handleDynastyClick = useCallback((dynasty) => {
    setActiveDynasty(dynasty)
    const ref = dynastyRefs.current[dynasty]
    if (ref) {
      if (typeof ref.scrollIntoView === 'function') {
        ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (ref.scrollIntoView) {
        // 横向模式返回的是一个带 scrollIntoView 方法的对象
        ref.scrollIntoView()
      }
    }
  }, [])

  // 关闭教程
  const handleCloseTutorial = () => {
    setShowTutorial(false)
    localStorage.setItem('history-tutorial-seen', 'true')
  }
  useEffect(() => {
    if (viewMode !== 'vertical') return
    const handleScroll = () => {
      const scrollY = window.scrollY + 120
      setShowBackToTop(window.scrollY > 400)
      for (const dynasty of dynastyOrder) {
        const el = dynastyRefs.current[dynasty]
        if (el && el.offsetTop !== undefined) {
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

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 如果正在输入，不触发快捷键
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return

      // Esc 关闭弹窗/面板
      if (e.key === 'Escape') {
        if (selectedEvent) { setSelectedEvent(null); return }
        if (showEditPanel) { setShowEditPanel(false); return }
        if (editingEvent) { setEditingEvent(null); return }
        if (showTutorial) { setShowTutorial(false); return }
      }

      // / 聚焦搜索框
      if (e.key === '/') {
        e.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="搜索"]')
        if (searchInput) searchInput.focus()
        return
      }

      // B 切换收藏当前事件
      if (e.key === 'b' || e.key === 'B') {
        if (selectedEvent) {
          handleToggleBookmark(selectedEvent.id)
          return
        }
      }

      // ← → 切换事件（当弹窗打开时）
      if (selectedEvent && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        const currentIdx = filteredEvents.findIndex(ev => ev.id === selectedEvent.id)
        if (currentIdx === -1) return
        const newIdx = e.key === 'ArrowLeft'
          ? Math.max(0, currentIdx - 1)
          : Math.min(filteredEvents.length - 1, currentIdx + 1)
        setSelectedEvent(filteredEvents[newIdx])
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedEvent, showEditPanel, editingEvent, showTutorial, filteredEvents, bookmarks])

  // 添加自定义事件
  const handleAddEvent = (newEvent) => {
    setCustomEvents([...customEvents, newEvent])
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

  // 保存事件编辑
  const handleSaveEventEdit = (eventId, updates) => {
    setEventOverrides({ ...eventOverrides, [eventId]: updates })
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
    <div className={`min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 ${darkMode ? 'dark' : ''}`}>
      {/* 顶部标题 */}
      <header className="bg-gradient-to-r from-amber-800 via-amber-700 to-orange-800 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 text-white">
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
            className="text-amber-200 dark:text-gray-300 mt-2 text-lg"
          >
            穿越千年，探索中华文明的璀璨历程
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-amber-300/60 dark:text-gray-500 mt-1 text-sm"
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
            <button
              onClick={() => setPageMode('quiz')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pageMode === 'quiz' ? 'bg-white text-amber-800 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🧠 测验
            </button>
            <button
              onClick={() => setPageMode('causal')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pageMode === 'causal' ? 'bg-white text-amber-800 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🔗 因果链
            </button>
            <button
              onClick={() => setPageMode('compare')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pageMode === 'compare' ? 'bg-white text-amber-800 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              ⚖️ 对比
            </button>
            <button
              onClick={() => setPageMode('map')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pageMode === 'map' ? 'bg-white text-amber-800 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🗺️ 地图
            </button>

            {pageMode === 'timeline' && (
              <>
                <div className="w-px h-6 bg-white/30 mx-1" />
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

            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                editMode ? 'bg-green-500 text-white shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              ✏️ 编辑{editMode ? '中' : ''}
            </button>

            <button
              onClick={() => setClassroomMode(!classroomMode)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                classroomMode ? 'bg-blue-500 text-white shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🎓 课堂
            </button>

            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                showBookmarksOnly ? 'bg-yellow-500 text-white shadow-md' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              ⭐ 重点{showBookmarksOnly ? '' : `(${bookmarks.length})`}
            </button>

            <div className="w-px h-6 bg-white/30 mx-1" />

            <button onClick={handleExport} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/20 text-white hover:bg-white/30 transition-all">
              📤 导出
            </button>
            <button onClick={handleImport} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/20 text-white hover:bg-white/30 transition-all">
              📥 导入
            </button>

            <div className="w-px h-6 bg-white/30 mx-1" />

            <button onClick={() => setShowTutorial(true)} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/20 text-white hover:bg-white/30 transition-all">
              ❓ 教程
            </button>

            <button onClick={toggleDarkMode} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/20 text-white hover:bg-white/30 transition-all" title="切换暗色模式">
              {darkMode ? '☀️' : '🌙'}
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
          <p className="text-sm text-amber-700 dark:text-amber-300">
            🔍 找到 <span className="font-bold">{filteredEvents.length}</span> 个事件
            {searchQuery && <span> · 关键词「{searchQuery}」</span>}
            {activeCategory && <span> · 类别「{activeCategory}」</span>}
            {showBookmarksOnly && <span> · 仅显示重点 ⭐</span>}
          </p>
        </motion.div>
      )}

      {/* 主内容 */}
      <main className={`relative ${classroomMode ? 'text-xl' : ''}`}>
        {pageMode === 'quiz' ? (
          <QuizMode events={allEvents} />
        ) : pageMode === 'causal' ? (
          <CausalChain events={filteredEvents} onEventClick={setSelectedEvent} />
        ) : pageMode === 'compare' ? (
          <CompareMode events={allEvents} />
        ) : pageMode === 'map' ? (
          <MapMode events={filteredEvents} onEventClick={setSelectedEvent} />
        ) : pageMode === 'topic' ? (
          <TopicMode events={filteredEvents} onEventClick={setSelectedEvent} />
        ) : filteredEvents.length > 0 ? (
          viewMode === 'vertical' ? (
            <Timeline events={filteredEvents} onEventClick={setSelectedEvent} dynastyRefs={dynastyRefs} />
          ) : (
            <HorizontalTimeline events={filteredEvents} onEventClick={setSelectedEvent} dynastyRefs={dynastyRefs} />
          )
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-amber-700 dark:text-amber-300 text-lg">没有找到匹配的历史事件</p>
            <p className="text-amber-500 dark:text-amber-400 text-sm mt-1">试试换个关键词吧</p>
          </motion.div>
        )}

        {/* 随机探索 */}
        <TodayInHistory events={allEvents} onEventClick={setSelectedEvent} />
      </main>

      {/* 回到顶部按钮 */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-30 w-12 h-12 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-700 transition-colors flex items-center justify-center text-xl"
            title="回到顶部"
          >
            ⬆️
          </motion.button>
        )}
      </AnimatePresence>

      {/* 底部 */}
      <footer className="text-center py-8 text-amber-600/60 dark:text-gray-500 text-sm border-t border-amber-200 dark:border-gray-700">
        <p>📜 历史时光轴 · 献给敬爱的历史黄洁老师</p>
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
            editMode={editMode}
            onEdit={() => { setEditingEvent(selectedEvent); setSelectedEvent(null) }}
          />
        )}
      </AnimatePresence>

      {/* 添加事件面板 */}
      {showEditPanel && (
        <EditPanel onAddEvent={handleAddEvent} onClose={() => setShowEditPanel(false)} />
      )}

      {/* 编辑已有事件面板 */}
      {editingEvent && (
        <EditEventPanel
          event={editingEvent}
          onSave={(updates) => handleSaveEventEdit(editingEvent.id, updates)}
          onClose={() => setEditingEvent(null)}
        />
      )}

      {/* 新手教程 */}
      {showTutorial && (
        <Tutorial onClose={handleCloseTutorial} />
      )}
    </div>
  )
}
