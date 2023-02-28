/**
 * @name BlockTypeSettings
 * @description 普通文本块（h1-h3 p ul li）配置面板
 * @description 配置面板的交互需要禁用 select 事件，否则编辑器的 selection 会丢失
 * @author darcrand
 */

import { useCallback, useEffect, useState } from 'react'
import { Button, Divider, Space } from 'antd'
import * as lexical from 'lexical'
import { GithubPicker } from 'react-color'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text'
import { $setBlocksType_experimental, $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection'
import { $getNearestBlockElementAncestorOrThrow } from '@lexical/utils'
import {
  $isListNode,
  $isListItemNode,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'

import { useCurrentBlockNode } from '../../utils/use-current-block-node'

// 允许使用配置的节点类型
// 能触发聚焦的节点类型
export const TextBlockTypes = [lexical.ParagraphNode, 'paragraph', 'heading', 'listitem']
// 可选的节点元素类型
export const TextTypeOptions = [
  { value: 'paragraph', label: '段落' },
  { value: 'h1', label: '标题 1' },
  { value: 'h2', label: '标题 2' },
  { value: 'h3', label: '标题 3' },
  { value: 'ul', label: '无序列表' },
  { value: 'ol', label: '有序列表' },
]

export const TextFormatOptions = [
  { value: 'bold', label: 'B' },
  { value: 'italic', label: 'I' },
  { value: 'underline', label: 'U' },
  { value: 'code', label: '<>' },
  { value: 'strikethrough', label: 'S' },
  { value: 'subscript', label: 'Sub' },
  { value: 'superscript', label: 'Sup' },
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

// 修改所需文本内容的样式
function useTextStyles() {
  const [editor] = useLexicalComposerContext()
  const [fontColor, setColor] = useState('')
  const [bgColor, setBgColor] = useState('')
  const [fontSize, setFontSize] = useState('')
  const [fontFamily, setFontFamily] = useState('')

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
      setColor($getSelectionStyleValueForProperty(selection, 'color'))
      setBgColor($getSelectionStyleValueForProperty(selection, 'background-color'))
      setFontSize($getSelectionStyleValueForProperty(selection, 'font-size'))
      setFontFamily($getSelectionStyleValueForProperty(selection, 'font-family'))
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
          } else if (/h[1-6]{1}/.test(key)) {
            // h1 - h6
            // @ts-ignore
            $setBlocksType_experimental(selection, () => $createHeadingNode(key))
          } else if (key === 'ul') {
            if (type !== 'ul') {
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
            } else {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
            }
          } else if (key === 'ol') {
            if (type !== 'ol') {
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
            } else {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
            }
          }
        }
      })
    },
    [editor, type]
  )

  useEffect(() => {
    editor.update(() => {
      if (!currBlockNode) return

      const node = lexical.$getNodeByKey(currBlockNode.nodeKey)
      if (node) {
        let blockType = ''
        if ($isHeadingNode(node)) {
          // h1 - h6
          blockType = node.getTag()
        } else if ($isListItemNode(node)) {
          // ul ol
          const parent = node.getParent()
          if ($isListNode(parent)) {
            blockType = parent.getTag()
          }
        } else {
          blockType = node.getType()
        }
        updateType(blockType)
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

  // 清空样式
  const onClearFormat = useCallback(() => {
    editor.update(() => {
      const selection = lexical.$getSelection()
      if (lexical.$isRangeSelection(selection)) {
        // 只清空当前块元素的样式
        // $selectAll(selection)
        selection.getNodes().forEach((node) => {
          if (lexical.$isTextNode(node)) {
            node.setFormat(0)
            node.setStyle('')
            $getNearestBlockElementAncestorOrThrow(node).setFormat('')
          }
          if ($isDecoratorBlockNode(node)) {
            node.setFormat('')
          }
        })
      }
    })
  }, [editor])

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

  if (!currBlockNode || TextBlockTypes.every((t) => t !== currBlockNode.nodeType)) return null

  return (
    <>
      <p>{type}</p>
      <ul className='flex flex-wrap cursor-pointer'>
        {TextTypeOptions.map((v) => (
          <li key={v.value} className='m-2' onClick={() => onSetBlockType(v.value)}>
            {v.label}
          </li>
        ))}
      </ul>
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

      <Space wrap>
        {TextFormatOptions.map((v) => (
          <Button key={v.value} type='link' onClick={() => onFormatText(v.value as lexical.TextFormatType)}>
            {v.label}
          </Button>
        ))}
        <Button type='link' onClick={onClearFormat}>
          clear
        </Button>
      </Space>
      <Divider />

      <p>{fontColor}</p>
      <GithubPicker color={fontColor} onChange={(res) => setTextStyles({ color: res.hex })} />
      <Divider />

      <p>{bgColor}</p>
      <GithubPicker color={bgColor} onChange={(res) => setTextStyles({ 'background-color': res.hex })} />
      <Divider />

      <p>{fontSize}</p>
      <ul className='flex flex-wrap cursor-pointer'>
        {FontSizeOptions.map((v) => (
          <li key={v.value} className='m-2' onClick={() => setTextStyles({ 'font-size': v.value })}>
            {v.label}
          </li>
        ))}
      </ul>

      <p>{fontFamily}</p>
      <ul className='flex flex-wrap cursor-pointer'>
        {FontFamilyOptions.map((v) => (
          <li key={v.value} className='m-2' onClick={() => setTextStyles({ 'font-family': v.value })}>
            {v.label}
          </li>
        ))}
      </ul>
    </>
  )
}
