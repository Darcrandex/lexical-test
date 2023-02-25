/**
 * @name BlockTypeSettings
 * @description 普通文本块（h1-h3 p ul li）配置面板
 * @author darcrand
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text'
import { $setBlocksType_experimental } from '@lexical/selection'
import { Select } from 'antd'
import * as lexical from 'lexical'
import { NodeKey } from 'lexical'
import { useCallback, useEffect, useState } from 'react'

export const TextBlockTypes = ['paragraph', 'heading']

export const TextTypeOptions = [
  { value: 'paragraph', label: '段落' },
  { value: 'h1', label: '标题 1' },
  { value: 'h2', label: '标题 2' },
  { value: 'h3', label: '标题 3' },
]

export type BlockTypeSettingsProps = { nodeKey: NodeKey }

export function BlockTypeSettings(props: BlockTypeSettingsProps) {
  const [editor] = useLexicalComposerContext()
  const [type, updateType] = useState<string>('paragraph')

  const onSetBlockType = useCallback(
    (key: string) => {
      editor.update(() => {
        const selection = lexical.$getSelection()
        if (lexical.$isRangeSelection(selection)) {
          if (key === 'paragraph') {
            $setBlocksType_experimental(selection, () => lexical.$createParagraphNode())
          } else {
            // @ts-ignore
            $setBlocksType_experimental(selection, () => $createHeadingNode(key))
          }
        }
      })
    },
    [editor]
  )

  useEffect(() => {
    editor.update(() => {
      const node = lexical.$getNodeByKey(props.nodeKey)
      if (node) {
        const textType = $isHeadingNode(node) ? node.getTag() : node.getType()
        updateType(textType)
      }
    })
    // 当同一行文本，切换成不同的类型，内容不变但 nodeKey 会变
  }, [props.nodeKey, editor, updateType])

  return (
    <>
      <Select className='w-40' value={type} onChange={onSetBlockType} options={TextTypeOptions} />
    </>
  )
}
