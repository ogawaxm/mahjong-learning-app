import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { LessonPage } from '../../pages/LessonPage'
import { TilesPage } from '../../pages/TilesPage'
import { LESSONS } from '../../data/lessons'

beforeEach(() => {
  localStorage.clear()
})

function renderLesson(lessonId: string) {
  return render(
    <MemoryRouter initialEntries={[`/tiles/${lessonId}`]}>
      <Routes>
        <Route path="/tiles/:lessonId" element={<LessonPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('LessonPage 必須コンテンツ', () => {
  it('各レッスンページはタイトルと本文セクションを表示する（要件1.1, 1.3）', () => {
    for (const lesson of LESSONS) {
      const { unmount } = renderLesson(lesson.id)
      // タイトル表示
      expect(screen.getByRole('heading', { level: 1, name: lesson.title })).toBeInTheDocument()
      // 各セクションの見出しが存在する
      for (const section of lesson.sections) {
        expect(screen.getByText(section.heading)).toBeInTheDocument()
      }
      unmount()
    }
  })

  it('完了ボタンが存在する（要件1.5）', () => {
    renderLesson(LESSONS[0].id)
    expect(screen.getByRole('button', { name: /レッスンを完了する/ })).toBeInTheDocument()
  })

  it('基本用語レッスン（ツモ・ロン等）が個別に存在する（要件1.4）', () => {
    const termLessons = ['lesson_tsumo_ron', 'lesson_riichi', 'lesson_pon_chi', 'lesson_kan']
    for (const id of termLessons) {
      expect(LESSONS.some((l) => l.id === id)).toBe(true)
    }
  })
})

describe('TilesPage', () => {
  it('全レッスンのタイトルが一覧表示される（要件1.1）', () => {
    render(
      <MemoryRouter>
        <TilesPage />
      </MemoryRouter>
    )
    for (const lesson of LESSONS) {
      expect(screen.getByText(lesson.title)).toBeInTheDocument()
    }
  })
})
