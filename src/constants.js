// 朝代顺序
export const dynastyOrder = ['先秦', '秦汉', '三国两晋南北朝', '隋唐', '五代十国宋元', '明清', '近代史']

// 朝代颜色配置（完整版，各组件共用）
export const dynastyColors = {
  '先秦': {
    dot: 'bg-amber-600', line: 'bg-amber-300', card: 'border-amber-400 hover:border-amber-600',
    tag: 'bg-amber-100 text-amber-800', accent: 'text-amber-700',
    bg: 'bg-amber-600', text: 'text-amber-800', border: 'border-amber-400',
    nav: { bg: 'bg-amber-700', text: 'text-amber-100', hover: 'hover:bg-amber-600', ring: 'ring-amber-500' },
    gradient: 'from-amber-600 to-amber-800',
    solidBg: 'bg-amber-50',
    borderLeft: 'border-amber-600',
  },
  '秦汉': {
    dot: 'bg-red-600', line: 'bg-red-300', card: 'border-red-400 hover:border-red-600',
    tag: 'bg-red-100 text-red-800', accent: 'text-red-700',
    bg: 'bg-red-600', text: 'text-red-800', border: 'border-red-400',
    nav: { bg: 'bg-red-700', text: 'text-red-100', hover: 'hover:bg-red-600', ring: 'ring-red-500' },
    gradient: 'from-red-600 to-red-800',
    solidBg: 'bg-red-50',
    borderLeft: 'border-red-600',
  },
  '三国两晋南北朝': {
    dot: 'bg-emerald-600', line: 'bg-emerald-300', card: 'border-emerald-400 hover:border-emerald-600',
    tag: 'bg-emerald-100 text-emerald-800', accent: 'text-emerald-700',
    bg: 'bg-emerald-600', text: 'text-emerald-800', border: 'border-emerald-400',
    nav: { bg: 'bg-emerald-700', text: 'text-emerald-100', hover: 'hover:bg-emerald-600', ring: 'ring-emerald-500' },
    gradient: 'from-emerald-600 to-emerald-800',
    solidBg: 'bg-emerald-50',
    borderLeft: 'border-emerald-600',
  },
  '隋唐': {
    dot: 'bg-yellow-500', line: 'bg-yellow-300', card: 'border-yellow-400 hover:border-yellow-500',
    tag: 'bg-yellow-100 text-yellow-800', accent: 'text-yellow-700',
    bg: 'bg-yellow-500', text: 'text-yellow-800', border: 'border-yellow-400',
    nav: { bg: 'bg-yellow-600', text: 'text-yellow-100', hover: 'hover:bg-yellow-500', ring: 'ring-yellow-400' },
    gradient: 'from-yellow-500 to-yellow-700',
    solidBg: 'bg-yellow-50',
    borderLeft: 'border-yellow-500',
  },
  '五代十国宋元': {
    dot: 'bg-cyan-600', line: 'bg-cyan-300', card: 'border-cyan-400 hover:border-cyan-600',
    tag: 'bg-cyan-100 text-cyan-800', accent: 'text-cyan-700',
    bg: 'bg-cyan-600', text: 'text-cyan-800', border: 'border-cyan-400',
    nav: { bg: 'bg-cyan-700', text: 'text-cyan-100', hover: 'hover:bg-cyan-600', ring: 'ring-cyan-500' },
    gradient: 'from-cyan-600 to-cyan-800',
    solidBg: 'bg-cyan-50',
    borderLeft: 'border-cyan-600',
  },
  '明清': {
    dot: 'bg-blue-700', line: 'bg-blue-300', card: 'border-blue-400 hover:border-blue-700',
    tag: 'bg-blue-100 text-blue-800', accent: 'text-blue-700',
    bg: 'bg-blue-700', text: 'text-blue-800', border: 'border-blue-400',
    nav: { bg: 'bg-blue-800', text: 'text-blue-100', hover: 'hover:bg-blue-700', ring: 'ring-blue-500' },
    gradient: 'from-blue-700 to-blue-900',
    solidBg: 'bg-blue-50',
    borderLeft: 'border-blue-700',
  },
  '近代史': {
    dot: 'bg-purple-600', line: 'bg-purple-300', card: 'border-purple-400 hover:border-purple-600',
    tag: 'bg-purple-100 text-purple-800', accent: 'text-purple-700',
    bg: 'bg-purple-600', text: 'text-purple-800', border: 'border-purple-400',
    nav: { bg: 'bg-purple-700', text: 'text-purple-100', hover: 'hover:bg-purple-600', ring: 'ring-purple-500' },
    gradient: 'from-purple-600 to-purple-800',
    solidBg: 'bg-purple-50',
    borderLeft: 'border-purple-600',
  },
}

// 类别 emoji
export const categoryEmojis = {
  '战争': '⚔️',
  '文化': '📜',
  '科技': '🔬',
  '政治': '🏛️',
  '经济': '💰',
}

// 类别列表（含"全部"）
export const categories = ['全部', '战争', '文化', '科技', '政治', '经济']

// 获取朝代颜色（带默认值）
export function getDynastyColors(dynasty) {
  return dynastyColors[dynasty] || dynastyColors['先秦']
}

// 获取朝代导航颜色（带默认值）
export function getDynastyNavColors(dynasty) {
  return dynastyColors[dynasty]?.nav || { bg: 'bg-gray-600', text: 'text-gray-100', hover: 'hover:bg-gray-500', ring: 'ring-gray-400' }
}

// 格式化年份
export function formatYear(year) {
  return year < 0 ? `公元前${Math.abs(year)}` : `${year}`
}

// 格式化年份（短版，横向时间轴用）
export function formatYearShort(year) {
  return year < 0 ? `前${Math.abs(year)}` : `${year}`
}

// 格式化年份（带"年"字）
export function formatYearFull(year) {
  return year < 0 ? `公元前${Math.abs(year)}年` : `公元${year}年`
}
