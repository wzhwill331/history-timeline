import { motion } from 'framer-motion'
import { getDynastyNavColors } from '../constants'

export default function DynastyNav({ dynasties, activeDynasty, onDynastyClick }) {
  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-amber-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <span className="text-amber-800 dark:text-amber-300 font-bold text-sm whitespace-nowrap mr-2">📍 朝代</span>
        {dynasties.map((dynasty) => {
          const colors = getDynastyNavColors(dynasty)
          const isActive = activeDynasty === dynasty
          return (
            <motion.button
              key={dynasty}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDynastyClick(dynasty)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                ${isActive
                  ? `${colors.bg} ${colors.text} ring-2 ${colors.ring} shadow-md`
                  : `bg-amber-50 text-amber-800 ${colors.hover} hover:text-white`
                }
              `}
            >
              {dynasty}
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
