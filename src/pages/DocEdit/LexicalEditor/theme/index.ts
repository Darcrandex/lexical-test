import type { EditorThemeClasses } from 'lexical'
import './base.scss'
import './elements.scss'

// 类名前缀；注意要和 scss 保持一致
const THEME_PREFIX = 'lexical-node__'

// 配置内容元素的默认样式类名
export const customTheme: EditorThemeClasses = {
  heading: {
    h1: `${THEME_PREFIX}h1`,
    h2: `${THEME_PREFIX}h2`,
    h3: `${THEME_PREFIX}h3`,
  },

  paragraph: `${THEME_PREFIX}p`,
}
