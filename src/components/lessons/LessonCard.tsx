import { Link } from 'react-router-dom'
import type { Lesson } from '../../data/lessons'

interface LessonCardProps {
  lesson: Lesson
  completed: boolean
}

export function LessonCard({ lesson, completed }: LessonCardProps) {
  return (
    <Link
      to={`/tiles/${lesson.id}`}
      className="block border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">{lesson.title}</h3>
        {completed && <span className="text-green-600 dark:text-green-400" aria-label="完了">✓</span>}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{lesson.summary}</p>
    </Link>
  )
}

export default LessonCard
