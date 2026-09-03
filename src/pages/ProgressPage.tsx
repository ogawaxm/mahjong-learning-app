import { useState } from 'react'
import { PageLayout } from '../components/common/PageLayout'
import { ProgressDashboard } from '../components/progress/ProgressDashboard'
import { progressTracker } from '../modules/progressTracker'

export function ProgressPage() {
  const [progress, setProgress] = useState(() => progressTracker.getProgress())
  const [rate, setRate] = useState(() => progressTracker.calculateCompletionRate())

  const handleReset = () => {
    progressTracker.resetProgress()
    setProgress(progressTracker.getProgress())
    setRate(progressTracker.calculateCompletionRate())
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-4">学習進捗</h1>
      <ProgressDashboard progress={progress} completionRate={rate} onReset={handleReset} />
    </PageLayout>
  )
}

export default ProgressPage
