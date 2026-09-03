import type { Lesson } from '../../data/lessons'
import { TilePopup } from '../common/TilePopup'
import { TileDisplay } from '../common/TileImage'

interface LessonViewerProps {
  lesson: Lesson
}

export function LessonViewer({ lesson }: LessonViewerProps) {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{lesson.title}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{lesson.summary}</p>

      {lesson.tiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {lesson.tiles.map((tile) => (
            <TilePopup key={tile.id} tile={tile}>
              <TileDisplay tile={tile} size="md" />
            </TilePopup>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {lesson.sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{section.heading}</h2>
            <p className="text-gray-700 dark:text-gray-300">{section.body}</p>
          </section>
        ))}
      </div>
    </article>
  )
}

export default LessonViewer
