import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { TilesPage } from './pages/TilesPage'
import { LessonPage } from './pages/LessonPage'
import { YakuPage } from './pages/YakuPage'
import { YakuDetailPage } from './pages/YakuDetailPage'
import { QuizPage } from './pages/QuizPage'
import { ScorePage } from './pages/ScorePage'
import { PracticePage } from './pages/PracticePage'
import { ProgressPage } from './pages/ProgressPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tiles" element={<TilesPage />} />
        <Route path="/tiles/:lessonId" element={<LessonPage />} />
        <Route path="/yaku" element={<YakuPage />} />
        <Route path="/yaku/:yakuId" element={<YakuDetailPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/score" element={<ScorePage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
