/**
 * @name TabBlockInfo
 * @description 当前选中的节点的属性面板
 * @author darcrand
 */

import { CloseOutlined } from '@ant-design/icons'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import * as utils from '@lexical/utils'
import * as lexical from 'lexical'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDocAsideTab } from '../stores'

import { BlockTypeSettings, TextBlockTypes } from '../LexicalEditor/plugins/BlockType'

export function TabBlockInfo() {
  const params = useParams()
  const { setCurrTabKey } = useDocAsideTab(params.id)

  const [editor] = useLexicalComposerContext()
  const [currNode, setNode] = useState<{ nodeKey: lexical.NodeKey; nodeType: string } | undefined>(undefined)

  const onEditorUpdated = useCallback(() => {
    editor.update(() => {
      const selection = lexical.$getSelection()

      if (lexical.$isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode()
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

  return (
    <>
      <header className='flex items-center justify-between p-2 border-b'>
        <span>节点配置</span>
        <span
          className='text-lg text-gray-800 hover:text-gray-500 transition-all cursor-pointer'
          onClick={() => setCurrTabKey(undefined)}
        >
          <CloseOutlined />
        </span>
      </header>

      <p>{currNode?.nodeKey}</p>
      <p>{currNode?.nodeType}</p>

      {!!currNode && !!currNode.nodeKey && TextBlockTypes.some((t) => t === currNode?.nodeType) && (
        <BlockTypeSettings nodeKey={currNode.nodeKey} />
      )}
    </>
  )
}
