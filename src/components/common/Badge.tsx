interface BadgeProps {
  title: string
  description?: string
  icon?: string
}

export function Badge({ title, description, icon = '🏆' }: BadgeProps) {
  return (
    <div
      role="img"
      aria-label={`バッジ: ${title}`}
      className="inline-flex flex-col items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-xl p-4 text-center"
    >
      <span className="text-4xl">{icon}</span>
      <span className="font-bold text-gray-900 dark:text-gray-100">{title}</span>
      {description && (
        <span className="text-sm text-gray-600 dark:text-gray-400">{description}</span>
      )}
    </div>
  )
}

export default Badge
