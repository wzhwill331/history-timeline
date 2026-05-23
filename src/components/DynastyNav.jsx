import { motion } from 'framer-motion'

const dynastyColors = {
  '先秦': { bg: 'bg-amber-700', text: 'text-amber-100', hover: 'hover:bg-amber-600', ring: 'ring-amber-500' },
  '秦汉': { bg: 'bg-red-700', text: 'text-red-100', hover: 'hover:bg-red-600', ring: 'ring-red-500' },
  '三国两晋南北朝': { bg: 'bg-emerald-700', text: 'text-emerald-100', hover: 'hover:bg-emerald-600', ring: 'ring-emerald-500' },
  '隋唐': { bg: 'bg-yellow-600', text: 'text-yellow-100', hover: 'hover:bg-yellow-500', ring: 'ring-yellow-400' },
  '五代十国宋元': { bg: 'bg-cyan-700', text: 'text-cyan-100', hover: 'hover:bg-cyan-600', ring: 'ring-cyan-500' },
  '明清': { bg: 'bg-blue-800', text: 'text-blue-100', hover: 'hover:bg-blue-700', ring: 'ring-blue-500' },
}

export default function DynastyNav({ dynasties, activeDynasty, onDynastyClick }) {
  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <span className="text-amber-800 font-bold text-sm whitespace-nowrap mr-2">📍 朝代</span>
        {dynasties.map((dynasty) => {
          const colors = dynastyColors[dynasty] || { bg: 'bg-gray-600', text: 'text-gray-100', hover: 'hover:bg-gray-500', ring: 'ring-gray-400' }
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
