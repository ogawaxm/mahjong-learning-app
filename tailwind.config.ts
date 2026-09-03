import type { Config } from 'tailwindcss'

// Tailwind CSS v4 では設定は主に CSS の @import と @custom-variant で行うが、
// 互換性のため darkMode 戦略を明示する。
const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
}

export default config
