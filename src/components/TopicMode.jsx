import { useState } from 'react'
import { motion } from 'framer-motion'

const topics = [
  {
    id: 'politics',
    name: '政治制度演变',
    emoji: '🏛️',
    color: 'from-red-500 to-red-700',
    tagColor: 'bg-red-100 text-red-800',
    keywords: ['政治', '变法', '改革', '制度', '统一', '建国', '起义', '革命', '成立', '政府', '政权'],
    description: '从分封制到郡县制，从帝制到共和——中国政治制度的演变历程',
  },
  {
    id: 'economy',
    name: '经济发展',
    emoji: '💰',
    color: 'from-yellow-500 to-yellow-700',
    tagColor: 'bg-yellow-100 text-yellow-800',
    keywords: ['经济', '贸易', '商业', '农业', '工业', '盛世', '税', '货币', '丝绸', '瓷器', '通商'],
    description: '从农耕文明到商业繁荣，中国经济发展的辉煌篇章',
  },
  {
    id: 'culture',
    name: '思想文化',
    emoji: '📜',
    color: 'from-purple-500 to-purple-700',
    tagColor: 'bg-purple-100 text-purple-800',
    keywords: ['文化', '思想', '文学', '艺术', '诗歌', '小说', '哲学', '儒', '道', '佛', '印刷', '教育', '科举', '学'],
    description: '百家争鸣、唐诗宋词、四大发明——中华文化的璀璨星河',
  },
  {
    id: 'ethnic',
    name: '民族关系',
    emoji: '🤝',
    color: 'from-emerald-500 to-emerald-700',
    tagColor: 'bg-emerald-100 text-emerald-800',
    keywords: ['民族', '融合', '匈奴', '鲜卑', '契丹', '女真', '蒙古', '满', '藏', '吐蕃', '倭', '抗'],
    description: '从冲突到融合，多民族国家的形成与发展',
  },
  {
    id: 'foreign',
    name: '对外关系',
    emoji: '🌍',
    color: 'from-blue-500 to-blue-700',
    tagColor: 'bg-blue-100 text-blue-800',
    keywords: ['外交', '使节', '传教', '留学', '条约', '战争', '侵略', '殖民', '通商', '航海', '西洋', '日本', '英国', '联军', '鸦片'],
    description: '从丝绸之路到近代屈辱，中国与世界的互动',
  },
]

function matchTopic(event, topic) {
  // Check by category first
  if (topic.id === 'politics' && event.category === '政治') return true
  if (topic.id === 'economy' && event.category === '经济') return true
  if (topic.id === 'culture' && event.category === '文化') return true
  if (topic.id === 'foreign' && (event.category === '战争' && ['鸦片战争', '甲午', '八国联军', '抗日', '侵华'].some(k => event.title.includes(k) || event.description.includes(k)))) return true

  // Check by keywords
  const text = event.title + event.description + event.significance
  return topic.keywords.some(kw => text.includes(kw))
}

const dynastyColors = {
  '先秦': 'bg-amber-600',
  '秦汉': 'bg-red-600',
  '三国两晋南北朝': 'bg-emerald-600',
  '隋唐': 'bg-yellow-500',
  '五代十国宋元': 'bg-cyan-600',
  '明清': 'bg-blue-700',
  '近代史': 'bg-purple-600',
}

const categoryEmojis = {
  '战争': '⚔️',
  '文化': '📜',
  '科技': '🔬',
  '政治': '🏛️',
  '经济': '💰',
}

export default function TopicMode({ events, onEventClick }) {
  const [activeTopic, setActiveTopic] = useState(null)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-amber-800 mb-6 text-center">📚 专题模式 · 按主题探索历史</h2>

      {/* 专题卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {topics.map((topic) => {
          const topicEvents = events.filter(e => matchTopic(e, topic))
          const isActive = activeTopic === topic.id
          return (
            <motion.button
              key={topic.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTopic(isActive ? null : topic.id)}
              className={`
                text-left p-4 rounded-xl border-2 transition-all
                ${isActive
                  ? 'border-amber-500 shadow-lg bg-white'
                  : 'border-transparent bg-white/80 hover:bg-white hover:shadow-md'
                }
              `}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{topic.emoji}</span>
                <h3 className="font-bold text-gray-800">{topic.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
              <span className="text-xs text-amber-600 font-medium">{topicEvents.length} 个事件</span>
            </motion.button>
          )
        })}
      </div>

      {/* 选中专题的事件列表 */}
      {activeTopic && (() => {
        const topic = topics.find(t => t.id === activeTopic)
        const topicEvents = events.filter(e => matchTopic(e, topic)).sort((a, b) => a.year - b.year)
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{topic.emoji}</span>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{topic.name}</h3>
                <p className="text-sm text-gray-600">{topic.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              {topicEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => onEventClick(event)}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-amber-50 cursor-pointer transition-colors group"
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">{categoryEmojis[event.category]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dynastyColors[event.dynasty] || 'bg-gray-400'}`} />
                      <h4 className="font-bold text-gray-800 group-hover:text-amber-700 transition-colors">{event.title}</h4>
                      <span className="text-xs text-gray-400 font-mono flex-shrink-0">
                        {event.year < 0 ? `前${Math.abs(event.year)}` : event.year}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-1">{event.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${topic.tagColor}`}>
                    {event.dynasty}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )
      })()}

      {!activeTopic && (
        <div className="text-center py-12 text-amber-500">
          <p className="text-4xl mb-3">👆</p>
          <p>点击上方专题卡片，按主题浏览历史事件</p>
        </div>
      )}
    </div>
  )
}
