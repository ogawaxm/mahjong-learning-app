import { PageLayout } from '../components/common/PageLayout'
import { LessonCard } from '../components/lessons/LessonCard'
import { LESSONS } from '../data/lessons'
import { progressTracker } from '../modules/progressTracker'

export function TilesPage() {
  const progress = progressTracker.getProgress()
  const completedSet = new Set(progress.completedLessons)

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-1">牌と基本ルール</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        全{LESSONS.length}レッスン。牌の種類と基本ルールを順番に学びましょう。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LESSONS.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} completed={completedSet.has(lesson.id)} />
        ))}
      </div>
    </PageLayout>
  )
}

export default TilesPage
