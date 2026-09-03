import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { PageLayout } from '../components/common/PageLayout'
import { LessonViewer } from '../components/lessons/LessonViewer'
import { getLessonById } from '../data/lessons'
import { progressTracker } from '../modules/progressTracker'

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const lesson = lessonId ? getLessonById(lessonId) : undefined
  const [completed, setCompleted] = useState(
    () => !!lessonId && progressTracker.getProgress().completedLessons.includes(lessonId)
  )

  if (!lesson) {
    return (
      <PageLayout>
        <p>レッスンが見つかりません。</p>
        <Link to="/tiles" className="text-blue-600 dark:text-blue-400 underline">
          レッスン一覧へ戻る
        </Link>
      </PageLayout>
    )
  }

  const handleComplete = () => {
    progressTracker.markLessonComplete(lesson.id)
    setCompleted(true)
  }

  return (
    <PageLayout>
      <LessonViewer lesson={lesson} />
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={handleComplete}
          disabled={completed}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
        >
          {completed ? '完了済み ✓' : 'レッスンを完了する'}
        </button>
        <button
          onClick={() => navigate('/tiles')}
          className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          一覧へ戻る
        </button>
      </div>
    </PageLayout>
  )
}

export default LessonPage
