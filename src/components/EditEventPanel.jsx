import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function EditEventPanel({ event, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    significance: '',
    image: '',
    figures: '',
  })
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title || '',
        description: event.description || '',
        significance: event.significance || '',
        image: event.image || '',
        figures: (event.figures || []).join('、'),
      })
      if (event.image) setImagePreview(event.image)
    }
  }, [event])

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('请选择图片文件'); return }
    if (file.size > 2 * 1024 * 1024) { alert('图片不能超过 2MB'); return }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      setImagePreview(dataUrl)
      setForm({ ...form, image: dataUrl })
    }
    reader.readAsDataURL(file)
  }

  const handleClearImage = () => {
    setImagePreview(null)
    setForm({ ...form, image: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      title: form.title,
      description: form.description,
      significance: form.significance,
      image: form.image,
      figures: form.figures ? form.figures.split(/[,，、]/).map(f => f.trim()).filter(Boolean) : event.figures,
    })
    onClose()
  }

  if (!event) return null

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
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">✏️ 编辑事件</h2>
                <p className="text-green-100 text-sm mt-1">{event.title} · {event.dynasty}</p>
              </div>
              <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">✕</button>
            </div>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* 事件名称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">事件名称</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>

            {/* 事件描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">事件描述</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
              />
            </div>

            {/* 相关人物 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">相关人物 (用顿号分隔)</label>
              <input
                type="text"
                value={form.figures}
                onChange={(e) => setForm({ ...form, figures: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>

            {/* 历史意义 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">历史意义</label>
              <textarea
                value={form.significance}
                onChange={(e) => setForm({ ...form, significance: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
              />
            </div>

            {/* 图片 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">📷 事件图片</label>

              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="预览" className="w-full max-h-48 object-contain rounded-lg bg-gray-50 border" />
                  <div className="flex gap-2 mt-2">
                    <label className="flex-1 text-center py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm cursor-pointer hover:bg-amber-200">
                      🔄 更换图片
                      <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    </label>
                    <button type="button" onClick={handleClearImage} className="flex-1 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200">
                      🗑️ 移除图片
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-colors">
                  <span className="text-3xl mb-1">📁</span>
                  <span className="text-sm text-gray-500">点击选择本地图片</span>
                  <span className="text-xs text-gray-400 mt-1">JPG、PNG、GIF，最大 2MB</span>
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                </label>
              )}
            </div>

            {/* 提交 */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                取消
              </button>
              <button type="submit" className="flex-1 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium">
                ✅ 保存修改
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
