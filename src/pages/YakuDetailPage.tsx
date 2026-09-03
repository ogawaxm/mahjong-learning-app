import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { PageLayout } from '../components/common/PageLayout'
import { YakuDetail } from '../components/yaku/YakuDetail'
import { getYakuById } from '../data/yaku'
import { progressTracker } from '../modules/progressTracker'

export function YakuDetailPage() {
  const { yakuId } = useParams<{ yakuId: string }>()
  const navigate = useNavigate()
  const yaku = yakuId ? getYakuById(yakuId) : undefined
  const [learned, setLearned] = useState(
    () => !!yakuId && progressTracker.getProgress().learnedYaku.includes(yakuId)
  )

  if (!yaku) {
    return (
      <PageLayout>
        <p>役が見つかりません。</p>
        <Link to="/yaku" className="text-blue-600 dark:text-blue-400 underline">
          役一覧へ戻る
        </Link>
      </PageLayout>
    )
  }

  const handleMarkLearned = () => {
    progressTracker.markYakuLearned(yaku.id)
    setLearned(true)
  }

  return (
    <PageLayout>
      <YakuDetail yaku={yaku} learned={learned} onMarkLearned={handleMarkLearned} />
      <button
        onClick={() => navigate('/yaku')}
        className="mt-6 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        一覧へ戻る
      </button>
    </PageLayout>
  )
}

export default YakuDetailPage
