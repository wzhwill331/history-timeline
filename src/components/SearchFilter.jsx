import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { categories, categoryEmojis } from '../constants'

export default function SearchFilter({ onSearch, onCategoryChange, activeCategory }) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleSearch = (value) => {
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-amber-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* 搜索框 */}
        <div className="relative flex-1 w-full sm:max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜索事件、人物、朝代..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-amber-200 dark:border-gray-600 bg-amber-50/50 dark:bg-gray-800/50 text-amber-900 dark:text-gray-100 placeholder-amber-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* 类别筛选 */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(cat === '全部' ? null : cat)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${(activeCategory === null && cat === '全部') || activeCategory === cat
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-amber-50 dark:bg-gray-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-gray-600'
                }
              `}
            >
              {categoryEmojis[cat]} {cat}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
