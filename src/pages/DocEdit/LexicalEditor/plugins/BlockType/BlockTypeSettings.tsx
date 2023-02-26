/**
 * @name BlockTypeSettings
 * @description 普通文本块（h1-h3 p ul li）配置面板
 * @description 配置面板的交互需要禁用 select 事件，否则编辑器的 selection 会丢失
 * @author darcrand
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text'
import { $setBlocksType_experimental, $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection'
import { Button, Divider, Select, Space } from 'antd'
import * as lexical from 'lexical'
import { GithubPicker } from 'react-color'
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

export const FontSizeOptions = [
  { value: '16px', label: '16px' },
  { value: '18px', label: '18px' },
  { value: '20px', label: '20px' },
]

export const FontFamilyOptions = [
  { value: '微软雅黑', label: '微软雅黑' },
  { value: '宋体', label: '宋体' },
  { value: '黑体', label: '黑体' },
]

function useTextStyles() {
  const [editor] = useLexicalComposerContext()
  const [fontColor, setColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('')
  const [fontSize, setFontSize] = useState(FontSizeOptions[0].value)
  const [fontFamily, setFontFamily] = useState(FontFamilyOptions[0].value)

  const setTextStyles = useCallback(
    (styles: Record<string, string>) => {
      editor.update(() => {
        const selection = lexical.$getSelection()
        if (lexical.$isRangeSelection(selection)) {
          // 应用样式并修改对应节点元素的 style 属性
          $patchStyleText(selection, styles)
        }
      })
    },
    [editor]
  )

  const onUpdated = useCallback(() => {
    const selection = lexical.$getSelection()
    if (lexical.$isRangeSelection(selection)) {
      setColor($getSelectionStyleValueForProperty(selection, 'color', '#000000'))
      setBgColor($getSelectionStyleValueForProperty(selection, 'background-color', ''))
      setFontSize($getSelectionStyleValueForProperty(selection, 'font-size', FontSizeOptions[0].value))
      setFontFamily($getSelectionStyleValueForProperty(selection, 'font-family', FontFamilyOptions[0].value))
    }
  }, [])

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.update(onUpdated)
    })
  }, [editor, onUpdated])

  return { fontColor, bgColor, fontSize, fontFamily, setTextStyles }
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

  // 缩进方式
  const onSetIndent = useCallback(
    (type: lexical.LexicalCommand<void>) => {
      editor.update(() => {
        editor.dispatchCommand(type, undefined)
      })
    },
    [editor]
  )

  // 基础样式
  const { fontColor, bgColor, fontSize, fontFamily, setTextStyles } = useTextStyles()

  if (!currBlockNode || TextBlockTypes.every((t) => t !== currBlockNode.nodeType))
    return <p className='py-4 text-center text-gray-300'>请先选择一个节点</p>

  return (
    <>
      <Select className='w-40' value={type} onChange={onSetBlockType} options={TextTypeOptions} />
      <Divider />

      <Space wrap>
        {ElementFormatOptions.map((v) => (
          <Button key={v.value} type='link' onClick={() => onFormatElement(v.value as lexical.ElementFormatType)}>
            {v.label}
          </Button>
        ))}

        <Button type='link' onClick={() => onSetIndent(lexical.OUTDENT_CONTENT_COMMAND)}>
          减少缩进
        </Button>
        <Button type='link' onClick={() => onSetIndent(lexical.INDENT_CONTENT_COMMAND)}>
          增加 缩进
        </Button>
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

      <p>{fontColor}</p>
      <GithubPicker className='select-none' color={fontColor} onChange={(res) => setTextStyles({ color: res.hex })} />
      <Divider />

      <p>{bgColor}</p>
      <GithubPicker
        className='select-none'
        color={bgColor}
        onChange={(res) => setTextStyles({ 'background-color': res.hex })}
      />
      <Divider />

      <p>{fontSize}</p>
      <ul className='flex flex-wrap select-none cursor-pointer'>
        {FontSizeOptions.map((v) => (
          <li key={v.value} className='m-2' onClick={() => setTextStyles({ 'font-size': v.value })}>
            {v.label}
          </li>
        ))}
      </ul>

      <p>{fontFamily}</p>
      <ul className='flex flex-wrap select-none cursor-pointer'>
        {FontFamilyOptions.map((v) => (
          <li key={v.value} className='m-2' onClick={() => setTextStyles({ 'font-family': v.value })}>
            {v.label}
          </li>
        ))}
      </ul>
    </>
  )
}
