import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const dynastyOptions = ['先秦', '秦汉', '三国两晋南北朝', '隋唐', '五代十国宋元', '明清', '近代史']
const categoryOptions = ['战争', '文化', '科技', '政治', '经济']

const isElectron = typeof window !== 'undefined' && window.electronAPI

export default function EditPanel({ onAddEvent, onClose }) {
  const [form, setForm] = useState({
    title: '',
    year: '',
    dynasty: '先秦',
    category: '政治',
    description: '',
    figures: '',
    significance: '',
    image: '',
  })
  const [imagePreview, setImagePreview] = useState(null)

  // 从本地选择图片
  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    // 验证文件大小 (限制 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('图片文件不能超过 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      setImagePreview(dataUrl)
      setForm({ ...form, image: dataUrl })
    }
    reader.readAsDataURL(file)
  }

  // 清除已选图片
  const handleClearImage = () => {
    setImagePreview(null)
    setForm({ ...form, image: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title || !form.year || !form.description) return

    const newEvent = {
      id: Date.now(),
      title: form.title,
      year: parseInt(form.year),
      dynasty: form.dynasty,
      category: form.category,
      description: form.description,
      figures: form.figures ? form.figures.split(/[,，、]/).map(f => f.trim()).filter(Boolean) : [],
      significance: form.significance || '',
      image: form.image || '',
      isCustom: true,
    }

    onAddEvent(newEvent)
    setForm({ title: '', year: '', dynasty: '先秦', category: '政治', description: '', figures: '', significance: '', image: '' })
    setImagePreview(null)
    onClose()
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
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">✏️ 添加自定义事件</h2>
              <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">✕</button>
            </div>
            <p className="text-amber-100 text-sm mt-1">添加您课堂上讲解的历史事件</p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* 事件名称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">事件名称 *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="例：张骞第二次出使西域"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                required
              />
            </div>

            {/* 年份 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">年份 * (公元前用负数)</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="例：-119 或 1840"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                required
              />
            </div>

            {/* 朝代和类别 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">朝代</label>
                <select
                  value={form.dynasty}
                  onChange={(e) => setForm({ ...form, dynasty: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-amber-400"
                >
                  {dynastyOptions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">类别</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-amber-400"
                >
                  {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* 事件描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">事件描述 *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="简要描述事件经过..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* 相关人物 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">相关人物 (用逗号分隔)</label>
              <input
                type="text"
                value={form.figures}
                onChange={(e) => setForm({ ...form, figures: e.target.value })}
                placeholder="例：张骞, 汉武帝"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            {/* 历史意义 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">历史意义 / 教学要点</label>
              <textarea
                value={form.significance}
                onChange={(e) => setForm({ ...form, significance: e.target.value })}
                placeholder="这个事件的历史意义或您想强调的教学要点..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
              />
            </div>

            {/* 图片上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">📷 添加图片 (可选)</label>

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="预览"
                    className="w-full max-h-48 object-contain rounded-lg bg-gray-50 border"
                  />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                  <p className="text-xs text-gray-400 mt-1">图片将以 Base64 格式保存在数据中</p>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-400 hover:bg-amber-50/50 transition-colors">
                  <span className="text-3xl mb-1">📁</span>
                  <span className="text-sm text-gray-500">点击选择本地图片</span>
                  <span className="text-xs text-gray-400 mt-1">支持 JPG、PNG、GIF，最大 2MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* 提交按钮 */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
              >
                ✅ 添加事件
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
