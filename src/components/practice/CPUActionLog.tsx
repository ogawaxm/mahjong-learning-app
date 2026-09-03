interface CPUActionLogProps {
  logs: string[]
}

export function CPUActionLog({ logs }: CPUActionLogProps) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <span className="font-semibold text-sm">CPU 操作ログ</span>
      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400 max-h-40 overflow-y-auto">
        {logs.length === 0 ? (
          <li className="text-gray-400">まだ操作はありません。</li>
        ) : (
          logs.slice(-10).reverse().map((log, i) => <li key={i}>{log}</li>)
        )}
      </ul>
    </div>
  )
}

export default CPUActionLog
