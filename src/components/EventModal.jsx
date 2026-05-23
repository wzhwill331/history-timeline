import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const dynastyColors = {
  '先秦': 'from-amber-600 to-amber-800',
  '秦汉': 'from-red-600 to-red-800',
  '三国两晋南北朝': 'from-emerald-600 to-emerald-800',
  '隋唐': 'from-yellow-500 to-yellow-700',
  '五代十国宋元': 'from-cyan-600 to-cyan-800',
  '明清': 'from-blue-700 to-blue-900',
  '近代史': 'from-purple-600 to-purple-800',
}

const categoryEmojis = {
  '战争': '⚔️', '文化': '📜', '科技': '🔬', '政治': '🏛️', '经济': '💰',
}

export default function EventModal({ event, onClose, isBookmarked, onToggleBookmark, note, onSaveNote, editMode, onEdit }) {
  const [editingNote, setEditingNote] = useState(false)
  const [noteText, setNoteText] = useState(note || '')
  const [imgError, setImgError] = useState(false)
  const [imgExpanded, setImgExpanded] = useState(false)

  if (!event) return null

  const gradient = dynastyColors[event.dynasty] || 'from-gray-600 to-gray-800'
  const yearDisplay = event.year < 0 ? `公元前${Math.abs(event.year)}年` : `公元${event.year}年`

  const handleSaveNote = () => {
    onSaveNote(noteText)
    setEditingNote(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 顶部彩色条 */}
          <div className={`bg-gradient-to-r ${gradient} p-6 rounded-t-2xl`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block px-2 py-0.5 bg-white/20 rounded-full text-white/90 text-xs">
                    {categoryEmojis[event.category]} {event.category}
                  </span>
                  {event.isCustom && (
                    <span className="inline-block px-2 py-0.5 bg-white/30 rounded-full text-white text-xs">
                      ✏️ 自定义
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white">{event.title}</h2>
                <p className="text-white/80 text-sm mt-1">{yearDisplay} · {event.dynasty}</p>
              </div>
              <div className="flex items-center gap-2">
                {editMode && onEdit && (
                  <button onClick={onEdit} className="text-white/70 hover:text-white text-lg px-2 py-1 rounded-lg hover:bg-white/20" title="编辑此事件">✏️</button>
                )}
                <button
                  onClick={() => onToggleBookmark()}
                  className={`text-2xl transition-transform hover:scale-110 ${isBookmarked ? '' : 'opacity-50 grayscale'}`}
                >
                  ⭐
                </button>
                <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none p-1">✕</button>
              </div>
            </div>
          </div>

          {/* 图片 — 完整展示，点击可放大 */}
          {event.image && !imgError && (
            <div className="px-6 pt-4">
              <div
                className={`rounded-xl overflow-hidden bg-gray-100 cursor-pointer transition-all ${imgExpanded ? 'max-h-none' : 'max-h-64'}`}
                onClick={() => setImgExpanded(!imgExpanded)}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full object-contain"
                  style={{ maxHeight: imgExpanded ? 'none' : '256px' }}
                  onError={() => setImgError(true)}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-center">
                {imgExpanded ? '点击收起' : '点击展开查看完整图片'}
              </p>
            </div>
          )}

          {/* 内容 */}
          <div className="p-6 space-y-5">
            <div>
              <h3 className="text-amber-800 font-semibold text-sm mb-2">📖 事件简介</h3>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>

            {event.figures && event.figures.length > 0 && (
              <div>
                <h3 className="text-amber-800 font-semibold text-sm mb-2">👤 相关人物</h3>
                <div className="flex flex-wrap gap-2">
                  {event.figures.map((figure) => (
                    <span key={figure} className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-sm border border-amber-200">
                      {figure}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {event.significance && (
              <div>
                <h3 className="text-amber-800 font-semibold text-sm mb-2">💡 历史意义</h3>
                <p className="text-gray-700 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  {event.significance}
                </p>
              </div>
            )}

            {/* 教学笔记 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-amber-800 font-semibold text-sm">📝 教学笔记</h3>
                {!editingNote && (
                  <button onClick={() => setEditingNote(true)} className="text-xs text-amber-600 hover:text-amber-800">
                    {note ? '编辑' : '+ 添加笔记'}
                  </button>
                )}
              </div>

              {editingNote ? (
                <div className="space-y-2">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="写下课堂讲解要点、学生易错点..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none text-sm"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => { setEditingNote(false); setNoteText(note || '') }} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">取消</button>
                    <button onClick={handleSaveNote} className="px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700">保存</button>
                  </div>
                </div>
              ) : note ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{note}</p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">还没有添加教学笔记</p>
              )}
            </div>
          </div>

          <div className="px-6 pb-6">
            <button onClick={onClose} className="w-full py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium">
              关闭
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* 图片放大弹窗 */}
      <AnimatePresence>
        {imgExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-8 bg-black/80"
            onClick={() => setImgExpanded(false)}
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={event.image}
              alt={event.title}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setImgExpanded(false)}
              className="absolute top-6 right-6 text-white/80 hover:text-white text-3xl"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}
