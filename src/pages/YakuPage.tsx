import { PageLayout } from '../components/common/PageLayout'
import { YakuList } from '../components/yaku/YakuList'
import { progressTracker } from '../modules/progressTracker'

export function YakuPage() {
  const learnedIds = new Set(progressTracker.getProgress().learnedYaku)

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-1">役の学習</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        役をカテゴリ別に確認できます。検索でも絞り込めます。
      </p>
      <YakuList learnedIds={learnedIds} />
    </PageLayout>
  )
}

export default YakuPage
