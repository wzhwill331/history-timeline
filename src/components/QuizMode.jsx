import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getDynastyColors, categoryEmojis, formatYearFull } from '../constants'

// 从数组中随机取 N 个
function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

// 生成选择题：给描述选事件名
function generateChoiceQuestions(events, count = 5) {
  const validEvents = events.filter(e => e.description && e.title)
  const picked = pickRandom(validEvents, count)
  return picked.map(event => {
    const wrongOptions = pickRandom(
      validEvents.filter(e => e.id !== event.id),
      3
    ).map(e => e.title)
    const options = [...wrongOptions, event.title].sort(() => Math.random() - 0.5)
    return {
      type: 'choice',
      question: event.description,
      answer: event.title,
      options,
      event,
      hint: `${event.dynasty} · ${formatYearFull(event.year)}`,
    }
  })
}

// 生成填空题：给事件名填年份
function generateYearQuestions(events, count = 5) {
  const validEvents = events.filter(e => e.title && e.year !== undefined)
  const picked = pickRandom(validEvents, count)
  return picked.map(event => ({
    type: 'year',
    question: event.title,
    answer: event.year,
    event,
    dynasty: event.dynasty,
    hint: event.description?.slice(0, 30) + '...',
  }))
}

// 生成人物题：给事件选相关人物
function generateFigureQuestions(events, count = 5) {
  const validEvents = events.filter(e => e.figures?.length >= 2)
  const picked = pickRandom(validEvents, count)
  return picked.map(event => {
    const correctFigure = event.figures[0]
    const wrongFigures = pickRandom(
      events.filter(e => e.id !== event.id && e.figures?.length > 0)
        .flatMap(e => e.figures)
        .filter(f => f !== correctFigure),
      3
    )
    const options = [...wrongFigures, correctFigure].sort(() => Math.random() - 0.5)
    return {
      type: 'figure',
      question: `「${event.title}」的核心人物是？`,
      answer: correctFigure,
      options,
      event,
      hint: `${event.dynasty} · ${formatYearFull(event.year)}`,
    }
  })
}

export default function QuizMode({ events }) {
  const [quizType, setQuizType] = useState(null) // 'choice' | 'year' | 'figure'
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)

  const startQuiz = useCallback((type) => {
    setQuizType(type)
    setCurrentIdx(0)
    setScore(0)
    setWrongAnswers([])
    setShowResult(false)
    setAnswered(false)
    setUserAnswer('')
    if (type === 'choice') setQuestions(generateChoiceQuestions(events, 10))
    else if (type === 'year') setQuestions(generateYearQuestions(events, 10))
    else if (type === 'figure') setQuestions(generateFigureQuestions(events, 10))
  }, [events])

  const currentQuestion = questions[currentIdx]

  const checkAnswer = (answer) => {
    if (answered) return
    setUserAnswer(answer)
    setAnswered(true)

    let correct = false
    if (currentQuestion.type === 'year') {
      correct = Math.abs(Number(answer) - currentQuestion.answer) <= 5 // 允许误差5年
    } else {
      correct = answer === currentQuestion.answer
    }

    setIsCorrect(correct)
    if (correct) {
      setScore(s => s + 1)
    } else {
      setWrongAnswers(w => [...w, { ...currentQuestion, userAnswer: answer }])
    }
  }

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1)
      setAnswered(false)
      setUserAnswer('')
      setIsCorrect(false)
    } else {
      setShowResult(true)
    }
  }

  // 结果页面
  if (showResult) {
    const total = questions.length
    const pct = Math.round((score / total) * 100)
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <p className="text-6xl mb-4">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {pct >= 80 ? '太棒了！' : pct >= 60 ? '不错！' : '继续加油！'}
          </h2>
          <p className="text-5xl font-bold text-amber-600 my-4">{score}/{total}</p>
          <p className="text-gray-500 mb-6">正确率 {pct}%</p>

          {wrongAnswers.length > 0 && (
            <div className="text-left mb-6">
              <h3 className="font-bold text-red-700 mb-3">❌ 错题回顾</h3>
              <div className="space-y-2">
                {wrongAnswers.map((wa, idx) => (
                  <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                    <p className="text-gray-800 font-medium">
                      {wa.type === 'year' ? wa.question : wa.question.slice(0, 40) + '...'}
                    </p>
                    <p className="text-red-600 mt-1">
                      你的答案：<span className="font-medium">{wa.userAnswer}</span>
                      {' · '}
                      正确答案：<span className="font-medium">
                        {wa.type === 'year' ? formatYearFull(wa.answer) : wa.answer}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => startQuiz(quizType)}
              className="px-6 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
            >
              🔄 再来一轮
            </button>
            <button
              onClick={() => { setQuizType(null); setShowResult(false) }}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              📚 换个题型
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // 题型选择
  if (!quizType) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-amber-800 mb-2 text-center">🧠 历史测验</h2>
        <p className="text-gray-500 text-center mb-8">选择题型，检验你的历史知识！</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { type: 'choice', emoji: '📝', title: '描述猜事件', desc: '根据历史描述，选出正确的事件名称', color: 'from-amber-500 to-orange-500' },
            { type: 'year', emoji: '📅', title: '年份填空', desc: '根据事件名称，填写对应的年份', color: 'from-blue-500 to-indigo-500' },
            { type: 'figure', emoji: '👤', title: '人物辨识', desc: '根据事件名称，选出核心相关人物', color: 'from-emerald-500 to-teal-500' },
          ].map(({ type, emoji, title, desc, color }) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => startQuiz(type)}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden text-left"
            >
              <div className={`bg-gradient-to-r ${color} p-4 text-center`}>
                <span className="text-4xl">{emoji}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{desc}</p>
                <p className="text-xs text-amber-600 mt-2">共 10 题</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  // 答题界面
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">第 {currentIdx + 1} / {questions.length} 题</span>
          <span className="text-sm font-medium text-amber-600">得分: {score}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-amber-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          {/* 题目 */}
          <div className="mb-6">
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
              {currentQuestion.type === 'choice' ? '📝 描述猜事件' : currentQuestion.type === 'year' ? '📅 年份填空' : '👤 人物辨识'}
            </span>
            <p className="text-lg font-bold text-gray-800 mt-3 leading-relaxed">
              {currentQuestion.question}
            </p>
            {currentQuestion.hint && (
              <p className="text-xs text-gray-400 mt-2">💡 提示：{currentQuestion.hint}</p>
            )}
          </div>

          {/* 选项题 */}
          {(currentQuestion.type === 'choice' || currentQuestion.type === 'figure') && (
            <div className="space-y-3">
              {currentQuestion.options.map((opt) => {
                let btnClass = 'bg-gray-50 hover:bg-amber-50 border-gray-200 hover:border-amber-300 text-gray-800'
                if (answered) {
                  if (opt === currentQuestion.answer) {
                    btnClass = 'bg-green-50 border-green-400 text-green-800'
                  } else if (opt === userAnswer && !isCorrect) {
                    btnClass = 'bg-red-50 border-red-400 text-red-800'
                  } else {
                    btnClass = 'bg-gray-50 border-gray-200 text-gray-400'
                  }
                }
                return (
                  <button
                    key={opt}
                    onClick={() => checkAnswer(opt)}
                    disabled={answered}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-medium ${btnClass}`}
                  >
                    {opt}
                    {answered && opt === currentQuestion.answer && ' ✅'}
                    {answered && opt === userAnswer && !isCorrect && ' ❌'}
                  </button>
                )
              })}
            </div>
          )}

          {/* 填空题 */}
          {currentQuestion.type === 'year' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && userAnswer && !answered) checkAnswer(Number(userAnswer)) }}
                  placeholder="输入年份（公元前用负数）"
                  disabled={answered}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:outline-none text-lg"
                  autoFocus
                />
                {!answered && (
                  <button
                    onClick={() => userAnswer && checkAnswer(Number(userAnswer))}
                    disabled={!userAnswer}
                    className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium disabled:opacity-50"
                  >
                    确认
                  </button>
                )}
              </div>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
                >
                  <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                    {isCorrect ? '✅ 正确！' : `❌ 正确答案是：${formatYearFull(currentQuestion.answer)}`}
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* 结果反馈 + 下一题 */}
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              {(currentQuestion.type === 'choice' || currentQuestion.type === 'figure') && (
                <div className={`p-3 rounded-xl mb-3 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className={isCorrect ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                    {isCorrect ? '✅ 回答正确！' : `❌ 正确答案：${currentQuestion.answer}`}
                  </p>
                  {currentQuestion.event?.significance && (
                    <p className="text-xs text-gray-500 mt-1">💡 {currentQuestion.event.significance}</p>
                  )}
                </div>
              )}
              <button
                onClick={nextQuestion}
                className="w-full py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
              >
                {currentIdx < questions.length - 1 ? '下一题 →' : '查看结果 🎯'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
