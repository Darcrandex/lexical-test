/**
 * @name TabBlockInfo
 * @description 当前选中的节点的属性面板
 * @author darcrand
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import * as richText from '@lexical/rich-text'
import * as utils from '@lexical/utils'
import * as lexical from 'lexical'
import { useCallback, useEffect, useState } from 'react'

export function TabBlockInfo() {
  const [editor] = useLexicalComposerContext()
  const [currNode, setNode] = useState<{ nodeKey: lexical.NodeKey; nodeType: string } | undefined>(undefined)

  const onEditorUpdated = useCallback(() => {
    editor.update(() => {
      const selection = lexical.$getSelection()

      if (lexical.$isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode()
        const currBlockNode = utils.$findMatchingParent(anchorNode, (curr) => curr.getType() !== 'text') || anchorNode
        const nodeType = richText.$isHeadingNode(currBlockNode) ? currBlockNode.getTag() : currBlockNode.getType()
        const nodeKey = currBlockNode.getKey()
        setNode({ nodeKey, nodeType })
      }
    })
  }, [editor, setNode])

  useEffect(() => {
    return editor.registerUpdateListener(onEditorUpdated)
  }, [editor, onEditorUpdated])

  return (
    <>
      <h1>TabBlockInfo</h1>
      <p>{currNode?.nodeKey}</p>
      <p>{currNode?.nodeType}</p>
    </>
  )
}
