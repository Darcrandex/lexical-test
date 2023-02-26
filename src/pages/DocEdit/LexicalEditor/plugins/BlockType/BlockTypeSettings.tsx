/**
 * @name BlockTypeSettings
 * @description 普通文本块（h1-h3 p ul li）配置面板
 * @author darcrand
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text'
import { $setBlocksType_experimental, $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection'
import { Button, Divider, Select, Space } from 'antd'
import * as lexical from 'lexical'
import { SketchPicker } from 'react-color'
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

export const ElementFormatOptions = [
  { value: 'left', label: '左对齐' },
  { value: 'center', label: '居中' },
  { value: 'right', label: '右对齐' },
  { value: 'justify', label: '两端对齐' },
]

function useTextStyles() {
  const [editor] = useLexicalComposerContext()
  const [color, setColor] = useState('#000')

  const setTextStyles = useCallback(
    (styles: Record<string, string>) => {
      editor.update(() => {
        console.log('ssss', styles)
        const selection = lexical.$getSelection()
        console.log('selection', selection)

        if (lexical.$isRangeSelection(selection)) {
          $patchStyleText(selection, styles)
        }
      })
    },
    [editor]
  )

  const onUpdated = useCallback(() => {
    editor.update(() => {
      const selection = lexical.$getSelection()
      if (lexical.$isRangeSelection(selection)) {
        setColor($getSelectionStyleValueForProperty(selection, 'color', '#000'))
      }
    })
  }, [editor])

  useEffect(() => {
    return editor.registerUpdateListener(onUpdated)
  }, [editor, onUpdated])

  return { color, setTextStyles }
}

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
  const onFormatText = useCallback(
    (type: lexical.TextFormatType) => {
      editor.update(() => {
        editor.dispatchCommand(lexical.FORMAT_TEXT_COMMAND, type)
      })
    },
    [editor]
  )

  // 修改块元素对齐方式
  const onFormatElement = useCallback(
    (type: lexical.ElementFormatType) => {
      editor.update(() => {
        editor.dispatchCommand(lexical.FORMAT_ELEMENT_COMMAND, type)
      })
    },
    [editor]
  )

  // 基础样式
  const { color, setTextStyles } = useTextStyles()

  if (!currBlockNode || TextBlockTypes.every((t) => t !== currBlockNode.nodeType))
    return <p className='py-4 text-center text-gray-300'>请先选择一个节点</p>

  return (
    <>
      <Select className='w-40' value={type} onChange={onSetBlockType} options={TextTypeOptions} />
      <Divider />

      <Space>
        {ElementFormatOptions.map((v) => (
          <Button key={v.value} type='link' onClick={() => onFormatElement(v.value as lexical.ElementFormatType)}>
            {v.label}
          </Button>
        ))}
      </Space>
      <Divider />

      <Space>
        {TextFormatOptions.map((v) => (
          <Button key={v.value} type='link' onClick={() => onFormatText(v.value as lexical.TextFormatType)}>
            {v.label}
          </Button>
        ))}
      </Space>
      <Divider />

      <Button onClick={() => setTextStyles({ color: '#fa4526' })}>color</Button>

      {/* 组件点击会让 selection 丢失 */}
      <SketchPicker color={color} onChangeComplete={(color) => setTextStyles({ color: color.hex })} />
    </>
  )
}
