/**
 * @name LexicalEditor
 * @description 完全自定义的富文本编辑器
 * @author darcrand
 */

import { LexicalComposer, InitialConfigType } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'

import { HeadingNode, QuoteNode } from './nodes'

import { TypeaheadPlugin } from './plugins/Typeahead'
import { customTheme } from './theme'
import { ImageNode, ImagePlugin } from './plugins/Image'

export function LexicalEditorContext(props: {
  children: JSX.Element | string | (JSX.Element | string)[]
  editorState?: string
}) {
  const initialConfig: InitialConfigType = {
    namespace: 'doc-editor',

    // 注册渲染节点
    nodes: [HeadingNode, QuoteNode, ImageNode],
    onError: (error: Error) => {
      throw error
    },

    theme: customTheme,
    editable: true,
    editorState: props.editorState,
  }

  return <LexicalComposer initialConfig={initialConfig}>{props.children}</LexicalComposer>
}

export function LexicalEditor() {
  return (
    <>
      <section className='lexical__outer'>
        <RichTextPlugin
          contentEditable={<ContentEditable className='lexical__root' />}
          placeholder={<p className='lexical__placeholder'>请输入内容</p>}
          ErrorBoundary={LexicalErrorBoundary}
        />

        {/* 注册插件 */}
        <TypeaheadPlugin />
        <ImagePlugin />
      </section>
    </>
  )
}
