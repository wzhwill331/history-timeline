import { motion, AnimatePresence } from 'framer-motion'

const dynastyColors = {
  '先秦': 'from-amber-600 to-amber-800',
  '秦汉': 'from-red-600 to-red-800',
  '三国两晋南北朝': 'from-emerald-600 to-emerald-800',
  '隋唐': 'from-yellow-500 to-yellow-700',
  '五代十国宋元': 'from-cyan-600 to-cyan-800',
  '明清': 'from-blue-700 to-blue-900',
}

const categoryEmojis = {
  '战争': '⚔️',
  '文化': '📜',
  '科技': '🔬',
  '政治': '🏛️',
  '经济': '💰',
}

export default function EventModal({ event, onClose }) {
  if (!event) return null

  const gradient = dynastyColors[event.dynasty] || 'from-gray-600 to-gray-800'
  const yearDisplay = event.year < 0 ? `公元前${Math.abs(event.year)}年` : `公元${event.year}年`

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
              <div>
                <span className="inline-block px-2 py-0.5 bg-white/20 rounded-full text-white/90 text-xs mb-2">
                  {categoryEmojis[event.category]} {event.category}
                </span>
                <h2 className="text-2xl font-bold text-white">{event.title}</h2>
                <p className="text-white/80 text-sm mt-1">{yearDisplay} · {event.dynasty}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white text-2xl leading-none p-1"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 内容 */}
          <div className="p-6 space-y-5">
            {/* 描述 */}
            <div>
              <h3 className="text-amber-800 font-semibold text-sm mb-2">📖 事件简介</h3>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>

            {/* 相关人物 */}
            {event.figures && event.figures.length > 0 && (
              <div>
                <h3 className="text-amber-800 font-semibold text-sm mb-2">👤 相关人物</h3>
                <div className="flex flex-wrap gap-2">
                  {event.figures.map((figure) => (
                    <span
                      key={figure}
                      className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-sm border border-amber-200"
                    >
                      {figure}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 历史意义 */}
            <div>
              <h3 className="text-amber-800 font-semibold text-sm mb-2">💡 历史意义</h3>
              <p className="text-gray-700 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                {event.significance}
              </p>
            </div>
          </div>

          {/* 底部 */}
          <div className="px-6 pb-6">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
            >
              关闭
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
