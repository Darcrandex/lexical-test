/**
 * @name EmptyPlaceholderPlugin
 * @description 设置空的聚焦的 p h1 - h6 的展示位
 * @author darcrand
 */

import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getNodeByKey, $isParagraphNode } from 'lexical'
import { $isHeadingNode } from '@lexical/rich-text'
import { useCurrentBlockNode } from '../../utils/use-current-block-node'

import './styles.scss'

const PARAGRAPH_EMPTY_CLASS = 'lexical__empty-text'

export function EmptyPlaceholderPlugin() {
  const { currBlockNode } = useCurrentBlockNode()
  const [editor] = useLexicalComposerContext()

  // 空段落占位符
  useEffect(() => {
    editor.update(() => {
      if (currBlockNode && currBlockNode.nodeKey) {
        const node = $getNodeByKey(currBlockNode.nodeKey)
        if (($isParagraphNode(node) || $isHeadingNode(node)) && node.getAllTextNodes().length === 0) {
          const ele = editor.getElementByKey(currBlockNode.nodeKey)
          ele?.classList.add(PARAGRAPH_EMPTY_CLASS)
        }
      }
    })

    return () => {
      if (currBlockNode && currBlockNode.nodeKey) {
        editor.update(() => {
          const ele = editor.getElementByKey(currBlockNode.nodeKey)
          ele?.classList.remove(PARAGRAPH_EMPTY_CLASS)
        })
      }
    }
  }, [currBlockNode, editor])

  return null
}
