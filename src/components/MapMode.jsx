import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getDynastyColors, categoryEmojis, formatYearShort } from '../constants'
import { chinaProvinces } from '../data/chinaPaths'

// 事件地理坐标 [经度, 纬度]
const eventLocations = {
  1: [112.4, 34.7],   2: [114.3, 34.8],   3: [114.3, 36.1],   4: [108.9, 34.2],
  5: [108.9, 34.2],   6: [108.9, 34.2],   7: [108.9, 34.2],   8: [116.9, 36.6],
  9: [108.9, 34.2],   10: [114.0, 33.0],  11: [108.9, 34.2],  12: [108.9, 34.2],
  13: [109.8, 40.6],  14: [116.8, 33.9],  15: [108.9, 34.2],  16: [108.9, 34.2],
  17: [103.8, 36.0],  18: [108.9, 34.2],  19: [108.9, 34.2],  20: [112.0, 32.0],
  21: [112.5, 32.7],  22: [114.0, 36.0],  23: [113.8, 29.7],  24: [114.3, 30.5],
  25: [106.6, 32.6],  26: [108.9, 34.2],  27: [108.9, 34.2],  28: [116.7, 32.6],
  29: [112.4, 34.7],  30: [118.7, 32.0],  31: [108.9, 34.2],  32: [116.4, 39.9],
  33: [108.9, 34.2],  34: [108.9, 34.2],  35: [108.9, 34.2],  36: [116.4, 39.9],
  37: [108.9, 34.2],  38: [108.9, 34.2],  39: [116.4, 39.9],  40: [108.9, 34.2],
  41: [108.9, 34.2],  42: [108.9, 34.2],  43: [114.3, 34.8],  44: [114.3, 34.8],
  45: [115.8, 36.1],  46: [112.9, 28.2],  47: [116.4, 39.9],  48: [114.3, 30.5],
  49: [114.3, 34.8],  50: [114.3, 30.5],  51: [87.6, 43.8],   52: [116.4, 39.9],
  53: [116.4, 39.9],  54: [116.4, 39.9],  55: [116.4, 39.9],  56: [112.5, 32.7],
  57: [118.7, 32.0],  58: [118.7, 32.0],  59: [116.4, 39.9],  60: [116.4, 39.9],
  61: [108.9, 34.2],  62: [119.3, 26.1],  63: [114.3, 30.5],  64: [108.9, 34.2],
  65: [123.4, 41.8],  66: [116.4, 39.9],  67: [116.4, 39.9],  68: [121.5, 25.0],
  69: [116.4, 39.9],  70: [116.4, 39.9],  71: [116.4, 39.9],  72: [113.3, 23.1],
  73: [113.3, 23.1],  74: [113.3, 23.1],  75: [118.7, 32.0],  76: [112.5, 28.2],
  77: [116.4, 39.9],  78: [116.4, 39.9],  79: [121.5, 39.0],  80: [116.4, 39.9],
  81: [116.4, 39.9],  82: [116.4, 39.9],  83: [121.5, 31.2],  84: [114.3, 30.5],
  85: [118.7, 32.0],  86: [112.9, 28.2],  87: [116.4, 39.9],  88: [121.5, 31.2],
  89: [113.3, 23.1],  90: [115.9, 28.7],  91: [114.0, 29.2],  92: [123.4, 41.8],
  93: [106.5, 29.5],  94: [106.9, 27.7],  95: [108.9, 34.2],  96: [116.1, 39.9],
  97: [118.7, 32.0],  98: [117.3, 34.3],  99: [112.5, 37.8],  100: [109.5, 36.6],
  101: [116.4, 39.9], 102: [106.5, 29.5], 103: [123.4, 41.8], 104: [118.7, 32.0],
  105: [116.4, 39.9],
}

// 经纬度转 SVG 坐标
function geoToSvg(lng, lat) {
  const x = (lng - 73) / (135 - 73) * 800 + 50
  const y = (53 - lat) / (53 - 18) * 600 + 30
  return [x, y]
}

// 朝代对应颜色 fill 值
const dynastyFillColors = {
  '先秦': '#d97706', '秦汉': '#dc2626', '三国两晋南北朝': '#059669',
  '隋唐': '#eab308', '五代十国宋元': '#0891b2', '明清': '#1d4ed8', '近代史': '#9333ea',
}

export default function MapMode({ events, onEventClick }) {
  const [hoveredEvent, setHoveredEvent] = useState(null)
  const [selectedDynasty, setSelectedDynasty] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const mapEvents = useMemo(() => {
    return events
      .filter(e => eventLocations[e.id])
      .filter(e => !selectedDynasty || e.dynasty === selectedDynasty)
      .map(e => {
        const [lng, lat] = eventLocations[e.id]
        const [x, y] = geoToSvg(lng, lat)
        return { ...e, svgX: x, svgY: y }
      })
  }, [events, selectedDynasty])

  const dynastyOrder = ['先秦', '秦汉', '三国两晋南北朝', '隋唐', '五代十国宋元', '明清', '近代史']

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-amber-800 dark:text-amber-300 mb-2 text-center">🗺️ 历史地图</h2>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-4 text-sm">每个光点代表一个历史事件，点击查看详情</p>

      {/* 朝代筛选 */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <button
          onClick={() => setSelectedDynasty(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            !selectedDynasty ? 'bg-amber-600 text-white shadow-md' : 'bg-white dark:bg-gray-700 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-gray-600 hover:bg-amber-50 dark:hover:bg-gray-600'
          }`}
        >
          全部 ({events.filter(e => eventLocations[e.id]).length})
        </button>
        {dynastyOrder.map(d => {
          const count = events.filter(e => e.dynasty === d && eventLocations[e.id]).length
          if (count === 0) return null
          const colors = getDynastyColors(d)
          return (
            <button
              key={d}
              onClick={() => setSelectedDynasty(selectedDynasty === d ? null : d)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedDynasty === d
                  ? `${colors.bg} text-white shadow-md`
                  : `bg-white dark:bg-gray-700 ${colors.accent} dark:text-gray-300 border border-amber-200 dark:border-gray-600 hover:bg-amber-50 dark:hover:bg-gray-600`
              }`}
            >
              {d} ({count})
            </button>
          )
        })}
      </div>

      {/* 地图 */}
      <div className="relative bg-gradient-to-br from-blue-50 via-blue-100 to-green-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-lg overflow-hidden border border-amber-200 dark:border-gray-700">
        <svg viewBox="0 0 900 680" className="w-full h-auto">
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <filter id="blur-light">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <filter id="blur-glow">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>

          {/* 省份轮廓 */}
          {chinaProvinces.map((province, idx) => (
            <path
              key={idx}
              d={province.path}
              fill="#fef3c7"
              stroke="#d97706"
              strokeWidth="0.8"
              opacity="0.85"
              className="hover:fill-amber-100 transition-colors"
            />
          ))}

          {/* 事件光点 - 外层光晕 */}
          {mapEvents.map(event => (
            <circle
              key={`glow-${event.id}`}
              cx={event.svgX}
              cy={event.svgY}
              r="10"
              fill="url(#glow)"
              filter="url(#blur-glow)"
              opacity="0.4"
              className="pointer-events-none"
            />
          ))}

          {/* 事件光点 - 呼吸动画 */}
          {mapEvents.map(event => {
            const fillColor = dynastyFillColors[event.dynasty] || '#d97706'
            return (
              <circle
                key={`pulse-${event.id}`}
                cx={event.svgX}
                cy={event.svgY}
                r="3"
                fill="none"
                stroke={fillColor}
                strokeWidth="1"
                opacity="0"
                className="pointer-events-none"
              >
                <animate attributeName="r" values="3;12" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0" dur="2.5s" repeatCount="indefinite" />
              </circle>
            )
          })}

          {/* 事件光点 - 核心点 */}
          {mapEvents.map(event => {
            const fillColor = dynastyFillColors[event.dynasty] || '#d97706'
            const isHovered = hoveredEvent?.id === event.id
            return (
              <circle
                key={event.id}
                cx={event.svgX}
                cy={event.svgY}
                r={isHovered ? "6" : "3.5"}
                fill={fillColor}
                stroke="white"
                strokeWidth={isHovered ? "2" : "1"}
                className="cursor-pointer transition-all"
                style={{ filter: isHovered ? `drop-shadow(0 0 6px ${fillColor})` : 'none' }}
                onMouseEnter={(e) => {
                  setHoveredEvent(event)
                  const rect = e.target.closest('svg').getBoundingClientRect()
                  const svgWidth = rect.width
                  const svgHeight = rect.height
                  setTooltipPos({
                    x: (e.clientX - rect.left) / svgWidth * 900,
                    y: (e.clientY - rect.top) / svgHeight * 680
                  })
                }}
                onMouseLeave={() => setHoveredEvent(null)}
                onClick={() => onEventClick(event)}
              />
            )
          })}

          {/* 主要城市标注 */}
          {[
            { name: '北京', x: 620, y: 140 }, { name: '西安', x: 410, y: 215 },
            { name: '南京', x: 590, y: 265 }, { name: '洛阳', x: 470, y: 225 },
            { name: '杭州', x: 600, y: 295 }, { name: '成都', x: 370, y: 315 },
            { name: '广州', x: 530, y: 435 }, { name: '武汉', x: 520, y: 295 },
            { name: '上海', x: 630, y: 285 }, { name: '拉萨', x: 260, y: 370 },
          ].map(city => (
            <text
              key={city.name}
              x={city.x}
              y={city.y}
              textAnchor="middle"
              className="text-[9px] fill-gray-400 dark:fill-gray-500 font-medium select-none"
            >
              {city.name}
            </text>
          ))}
        </svg>

        {/* 悬浮提示框 */}
        <AnimatePresence>
          {hoveredEvent && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute pointer-events-none z-20 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-amber-200 dark:border-gray-600 p-3 max-w-[220px]"
              style={{
                left: `${Math.min((tooltipPos.x / 900) * 100, 70)}%`,
                top: `${Math.max((tooltipPos.y / 680) * 100 - 15, 5)}%`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{categoryEmojis[hoveredEvent.category]}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${getDynastyColors(hoveredEvent.dynasty).tag}`}>
                  {hoveredEvent.dynasty}
                </span>
              </div>
              <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{hoveredEvent.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{formatYearShort(hoveredEvent.year)}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{hoveredEvent.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部统计 */}
      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span>📍 共 {mapEvents.length} 个事件标注</span>
        <span>·</span>
        <span>点击光点查看详情</span>
      </div>
    </div>
  )
}
