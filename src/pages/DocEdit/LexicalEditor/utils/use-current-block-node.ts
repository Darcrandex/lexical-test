import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import * as utils from '@lexical/utils'
import * as lexical from 'lexical'
import { useCallback, useEffect, useState } from 'react'

/**
 * @description 获取当前一个距离光标最近的 块 节点，或一个被选中的不可编辑文本的节点
 */
export function useCurrentBlockNode() {
  const [editor] = useLexicalComposerContext()
  const [currBlockNode, setNode] = useState<{ nodeKey: lexical.NodeKey; nodeType: string } | undefined>(undefined)

  const onEditorUpdated = useCallback(() => {
    editor.update(() => {
      const selection = lexical.$getSelection()

      if (lexical.$isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode()
        // 注意：返回的是一个距离光标最近的 块 节点
        const currBlockNode = utils.$findMatchingParent(anchorNode, (curr) => curr.getType() !== 'text') || anchorNode
        const nodeType = currBlockNode.getType()
        const nodeKey = currBlockNode.getKey()
        setNode({ nodeKey, nodeType })
      }
    })
  }, [editor, setNode])

  useEffect(() => {
    return editor.registerUpdateListener(onEditorUpdated)
  }, [editor, onEditorUpdated])

  return { currBlockNode }
}
