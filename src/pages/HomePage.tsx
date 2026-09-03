import { Link } from 'react-router-dom'
import { PageLayout } from '../components/common/PageLayout'
import { progressTracker } from '../modules/progressTracker'
import { LESSONS } from '../data/lessons'
import { YAKU_LIST } from '../data/yaku'

interface ModeProgress {
  type: 'percentage' | 'accuracy' | 'count'
  value: number
  label: string
  status: 'not_started' | 'in_progress' | 'completed'
}

interface ModeCardProps {
  modeId: 'tiles' | 'yaku' | 'quiz' | 'score' | 'practice'
  title: string
  icon: string
  progress: ModeProgress
  href: string
}

function ctaLabel(status: ModeProgress['status']): string {
  if (status === 'not_started') return '始める'
  if (status === 'completed') return '復習する'
  return '続きから'
}

function ModeCard({ title, icon, progress, href }: ModeCardProps) {
  return (
    <Link
      to={href}
      className="block border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-3">{progress.label}</p>
      <span className="inline-block px-3 py-1 rounded bg-blue-600 text-white text-sm">
        {ctaLabel(progress.status)}
      </span>
    </Link>
  )
}

export function HomePage() {
  const progress = progressTracker.getProgress()
  const overallRate = Math.round(progressTracker.calculateCompletionRate() * 100)

  const lessonPct = Math.round((progress.completedLessons.length / LESSONS.length) * 100)
  const yakuPct = Math.round((progress.learnedYaku.length / YAKU_LIST.length) * 100)
  const quizTotals = progress.quizHistory.reduce(
    (acc, s) => ({ c: acc.c + s.correctCount, t: acc.t + s.totalCount }),
    { c: 0, t: 0 }
  )
  const quizAccuracy = quizTotals.t > 0 ? Math.round((quizTotals.c / quizTotals.t) * 100) : 0

  const statusFromPct = (pct: number): ModeProgress['status'] =>
    pct === 0 ? 'not_started' : pct >= 100 ? 'completed' : 'in_progress'

  const cards: ModeCardProps[] = [
    {
      modeId: 'tiles', title: '牌と基本ルール', icon: '🀇', href: '/tiles',
      progress: { type: 'percentage', value: lessonPct, label: `進捗: ${lessonPct}%`, status: statusFromPct(lessonPct) },
    },
    {
      modeId: 'yaku', title: '役の学習', icon: '🎴', href: '/yaku',
      progress: { type: 'percentage', value: yakuPct, label: `進捗: ${yakuPct}%`, status: statusFromPct(yakuPct) },
    },
    {
      modeId: 'quiz', title: '役判定クイズ', icon: '❓', href: '/quiz',
      progress: { type: 'accuracy', value: quizAccuracy, label: `正答率: ${quizAccuracy}%`, status: progress.quizHistory.length > 0 ? 'in_progress' : 'not_started' },
    },
    {
      modeId: 'score', title: '点数計算の学習', icon: '🔢', href: '/score',
      progress: { type: 'count', value: 0, label: '符計算を学ぶ', status: 'not_started' },
    },
    {
      modeId: 'practice', title: '実践練習', icon: '⚔️', href: '/practice',
      progress: { type: 'count', value: progress.practiceHistory.length, label: `対戦数: ${progress.practiceHistory.length}`, status: progress.practiceHistory.length > 0 ? 'in_progress' : 'not_started' },
    },
  ]

  return (
    <PageLayout>
      <section className="mb-6">
        <h1 className="text-2xl font-bold mb-2">ようこそ、麻雀学習アプリへ</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-2">全体進捗</p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-blue-600 h-4 transition-all"
            style={{ width: `${overallRate}%` }}
            role="progressbar"
            aria-valuenow={overallRate}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">{overallRate}%</p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <ModeCard key={card.modeId} {...card} />
        ))}
      </div>
    </PageLayout>
  )
}

export default HomePage
