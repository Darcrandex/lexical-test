/**
 * @name BlockTypeSettings
 * @description 普通文本块（h1-h3 p ul li）配置面板
 * @author darcrand
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text'
import { $setBlocksType_experimental } from '@lexical/selection'
import { Button, Divider, Select, Space } from 'antd'
import * as lexical from 'lexical'
import { useCallback, useEffect, useState } from 'react'
import { useCurrentBlockNode } from '../../utils/use-current-block-node'

export const TextBlockTypes = ['paragraph', 'heading']
export const TextTypeOptions = [
  { value: 'paragraph', label: '段落' },
  { value: 'h1', label: '标题 1' },
  { value: 'h2', label: '标题 2' },
  { value: 'h3', label: '标题 3' },
]

export const TextFormatOptions = [
  { value: 'bold', label: 'B' },
  { value: 'italic', label: 'I' },
  { value: 'underline', label: 'U' },
  { value: 'code', label: '<>' },
]

export function BlockTypeSettings() {
  const { currBlockNode } = useCurrentBlockNode()
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
      if (!currBlockNode) return

      const node = lexical.$getNodeByKey(currBlockNode.nodeKey)
      if (node) {
        const textType = $isHeadingNode(node) ? node.getTag() : node.getType()
        updateType(textType)
      }
    })
    // 当同一行文本，切换成不同的类型，内容不变但 nodeKey 会变
  }, [currBlockNode, currBlockNode?.nodeKey, editor, updateType])

  // 修改文本样式
  const onFormat = useCallback(
    (type: lexical.TextFormatType) => {
      editor.update(() => {
        editor.dispatchCommand(lexical.FORMAT_TEXT_COMMAND, type)
      })
    },
    [editor]
  )

  if (!currBlockNode || TextBlockTypes.every((t) => t !== currBlockNode.nodeType))
    return <p className='py-4 text-center text-gray-300'>请先选择一个节点</p>

  return (
    <>
      <Select className='w-40' value={type} onChange={onSetBlockType} options={TextTypeOptions} />
      <Divider />
      <Space>
        {TextFormatOptions.map((v) => (
          <Button key={v.value} type='link' onClick={() => onFormat(v.value as lexical.TextFormatType)}>
            {v.label}
          </Button>
        ))}
      </Space>
    </>
  )
}
