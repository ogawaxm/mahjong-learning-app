import type { ScoreResult } from '../../types'

interface ScoreBreakdownProps {
  result: ScoreResult | null
  error: string | null
}

export function ScoreBreakdown({ result, error }: ScoreBreakdownProps) {
  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-300">
        {error}
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex gap-6 mb-4">
        <div>
          <span className="text-sm text-gray-500">飜数</span>
          <p className="text-2xl font-bold">{result.han}飜</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">符</span>
          <p className="text-2xl font-bold">{result.fu}符</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">合計点数</span>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.totalPoints}点</p>
        </div>
      </div>

      <h3 className="font-semibold mb-2">成立役</h3>
      <ul className="mb-4 text-sm">
        {result.yaku.map((y) => (
          <li key={y.id}>・{y.name}</li>
        ))}
      </ul>

      <h3 className="font-semibold mb-2">計算内訳</h3>
      <table className="w-full text-sm">
        <tbody>
          {result.breakdown.map((step, i) => (
            <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-1">{step.label}</td>
              <td className="py-1 text-right">{step.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ScoreBreakdown
