import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QuizBoard } from '../../components/quiz/QuizBoard'
import { createQuizEngine } from '../../modules/quizEngine'

const store: Record<string, string> = {}
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v },
    removeItem: (k: string) => { delete store[k] },
    clear: () => Object.keys(store).forEach((k) => delete store[k]),
  },
  writable: true,
})

const engine = createQuizEngine()

beforeEach(() => localStorage.clear())

describe('クイズセッションの問題数（要件3.3）', () => {
  it('10問指定でセッションに10問以上含まれる', () => {
    const session = engine.startSession(10, 'all', new Set())
    expect(session.questions.length).toBeGreaterThanOrEqual(10)
  })

  it('5問など10未満を指定しても最低10問になる', () => {
    const session = engine.startSession(5, 'all', new Set())
    expect(session.questions.length).toBeGreaterThanOrEqual(10)
  })

  it('20問指定で20問になる', () => {
    const session = engine.startSession(20, 'all', new Set())
    expect(session.questions.length).toBe(20)
  })
})

describe('QuizBoard 表示', () => {
  it('手牌と役選択ボタン・進捗が表示される', () => {
    const session = engine.startSession(10, 'all', new Set())
    render(
      <MemoryRouter>
        <QuizBoard
          question={session.questions[0]}
          questionNumber={1}
          totalQuestions={session.questions.length}
          feedback={null}
          onSubmit={() => {}}
          onNext={() => {}}
        />
      </MemoryRouter>
    )
    expect(screen.getByText(/問題 1 \//)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '回答する' })).toBeInTheDocument()
  })

  it('役ボタンを選択して回答するとonSubmitが呼ばれる', () => {
    const session = engine.startSession(10, 'all', new Set())
    let submitted = false
    render(
      <MemoryRouter>
        <QuizBoard
          question={session.questions[0]}
          questionNumber={1}
          totalQuestions={10}
          feedback={null}
          onSubmit={() => { submitted = true }}
          onNext={() => {}}
        />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'タンヤオ' }))
    fireEvent.click(screen.getByRole('button', { name: '回答する' }))
    expect(submitted).toBe(true)
  })
})
