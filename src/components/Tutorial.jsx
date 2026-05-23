import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const steps = [
  {
    emoji: '👋',
    title: '欢迎使用历史时光轴',
    desc: '这是一个帮助历史教学与探索的工具，献给敬爱的历史黄洁老师。',
    detail: '收录了从夏朝到新中国成立的 105 个重要历史事件，配有真实历史图片。',
  },
  {
    emoji: '🕐',
    title: '时间轴浏览',
    desc: '默认是纵向时间轴，按朝代分组展示所有历史事件。',
    detail: '点击顶部的朝代按钮可以快速跳转，也可以用搜索框查找特定事件。',
  },
  {
    emoji: '📊',
    title: '横向时间轴',
    desc: '点击「横向」按钮切换到横向视图，适合投屏教学使用。',
    detail: '左右滑动浏览，事件卡片交替排列在时间轴上下方。',
  },
  {
    emoji: '📚',
    title: '专题模式',
    desc: '点击「专题」按钮，按主题浏览历史事件。',
    detail: '分为政治制度、经济发展、思想文化、民族关系、对外关系五大专题。',
  },
  {
    emoji: '⭐',
    title: '重点标记',
    desc: '打开事件详情后，点击 ⭐ 标记为考试重点。',
    detail: '点击顶部的「重点」按钮，可以只显示标记过的事件，方便复习。',
  },
  {
    emoji: '✏️',
    title: '编辑模式',
    desc: '开启编辑模式后，可以添加自定义事件，也可以编辑已有事件。',
    detail: '点击事件弹窗中的 ✏️ 按钮，可以修改事件的图片、描述等信息，还可以从本地上传图片。',
  },
  {
    emoji: '📝',
    title: '教学笔记',
    desc: '每个事件都可以添加教学笔记，记录课堂讲解要点。',
    detail: '打开事件详情，点击「+ 添加笔记」，写下您的教学心得。',
  },
  {
    emoji: '🎲',
    title: '随机探索',
    desc: '右下角的 🎲 按钮，每次点击随机展示一个历史事件。',
    detail: '适合课堂互动或学生自主探索。',
  },
  {
    emoji: '📤',
    title: '数据导出与导入',
    desc: '您的所有修改（自定义事件、笔记、标记）都可以导出为 JSON 文件。',
    detail: '换电脑时导入即可恢复所有数据。在 exe 版本中，数据会自动保存到同目录的 history-data.json。',
  },
  {
    emoji: '🎉',
    title: '开始探索吧！',
    desc: '以上就是所有功能介绍，现在可以自由探索了。',
    detail: '祝黄洁老师教学愉快！以史为鉴，可以知兴替。',
  },
]

export default function Tutorial({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0)
  const step = steps[currentStep]

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const skip = () => onClose()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* 顶部装饰 */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-6xl mb-3"
            >
              {step.emoji}
            </motion.div>
            <h2 className="text-2xl font-bold text-white">{step.title}</h2>
          </div>

          {/* 内容 */}
          <div className="p-6 space-y-4">
            <p className="text-gray-700 text-base leading-relaxed">{step.desc}</p>
            <p className="text-gray-500 text-sm leading-relaxed bg-amber-50 p-4 rounded-xl border border-amber-100">
              💡 {step.detail}
            </p>

            {/* 进度点 */}
            <div className="flex justify-center gap-1.5 py-2">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentStep ? 'bg-amber-600 w-6' : idx < currentStep ? 'bg-amber-300' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* 按钮 */}
            <div className="flex gap-3">
              {currentStep > 0 ? (
                <button
                  onClick={prev}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  ← 上一步
                </button>
              ) : (
                <button
                  onClick={skip}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  跳过教程
                </button>
              )}

              <button
                onClick={next}
                className="flex-1 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium text-sm"
              >
                {currentStep < steps.length - 1 ? '下一步 →' : '🎉 开始使用'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
