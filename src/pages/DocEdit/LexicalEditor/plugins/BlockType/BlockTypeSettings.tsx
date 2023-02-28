/**
 * @name BlockTypeSettings
 * @description 普通文本块（h1-h3 p ul li）配置面板
 * @description 配置面板的交互需要禁用 select 事件，否则编辑器的 selection 会丢失
 * @author darcrand
 */

import { useCallback, useEffect, useState } from 'react'
import { Button, Form, Space } from 'antd'
import {
  FontColorsOutlined,
  BgColorsOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  AlignCenterOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  ClearOutlined,
} from '@ant-design/icons'
import * as lexical from 'lexical'
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
import { DropDownMenus } from '../../ui/DropdownMenus'
import { ColorPicker } from '../../ui/ColorPicker'

// 允许使用配置的节点类型
// 能触发聚焦的节点类型
export const TextBlockTypes = [lexical.ParagraphNode, 'paragraph', 'heading', 'listitem']
// 可选的节点元素类型
export const ElementTypes = [
  { value: 'p', label: '段落' },
  { value: 'h1', label: '标题 1' },
  { value: 'h2', label: '标题 2' },
  { value: 'h3', label: '标题 3' },
  { value: 'ul', label: '无序列表' },
  { value: 'ol', label: '有序列表' },
]

export const Aligns = [
  { value: 'left', label: '左对齐', Icon: <AlignLeftOutlined /> },
  { value: 'center', label: '居中', Icon: <AlignCenterOutlined /> },
  { value: 'right', label: '右对齐', Icon: <AlignRightOutlined /> },
  // { value: 'justify', label: '两端对齐' },
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
  const [fontColor, setColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('')
  const [fontSize, setFontSize] = useState('')
  const [fontFamily, setFontFamily] = useState('')
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isSubscript, setIsSubscript] = useState(false)
  const [isSuperscript, setIsSuperscript] = useState(false)

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
      setBgColor($getSelectionStyleValueForProperty(selection, 'background-color'))
      setFontSize($getSelectionStyleValueForProperty(selection, 'font-size', FontSizeOptions[0].value))
      setFontFamily($getSelectionStyleValueForProperty(selection, 'font-family', FontFamilyOptions[0].value))

      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setIsSubscript(selection.hasFormat('subscript'))
      setIsSuperscript(selection.hasFormat('superscript'))
    }
  }, [])

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.update(onUpdated)
    })
  }, [editor, onUpdated])

  return {
    fontColor,
    bgColor,
    fontSize,
    fontFamily,
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isSubscript,
    isSuperscript,
    setTextStyles,
  }
}

export function BlockTypeSettings() {
  const { currBlockNode } = useCurrentBlockNode()
  const [editor] = useLexicalComposerContext()
  const [eleType, updateEleType] = useState<string>('p')

  const setEleType = useCallback(
    (key: string) => {
      editor.update(() => {
        const selection = lexical.$getSelection()
        if (lexical.$isRangeSelection(selection)) {
          if (key === 'p') {
            $setBlocksType_experimental(selection, () => lexical.$createParagraphNode())
          } else if (/h[1-6]{1}/.test(key)) {
            // h1 - h6
            // @ts-ignore
            $setBlocksType_experimental(selection, () => $createHeadingNode(key))
          } else if (key === 'ul') {
            if (eleType !== 'ul') {
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
            } else {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
            }
          } else if (key === 'ol') {
            if (eleType !== 'ol') {
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
            } else {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
            }
          }
        }
      })
    },
    [editor, eleType]
  )

  useEffect(() => {
    editor.update(() => {
      if (!currBlockNode) return

      const node = lexical.$getNodeByKey(currBlockNode.nodeKey)
      if (node) {
        let elementType = ''
        if (lexical.$isParagraphNode(node)) {
          elementType = 'p'
        } else if ($isHeadingNode(node)) {
          // h1 - h6
          elementType = node.getTag()
        } else if ($isListItemNode(node)) {
          // ul ol
          const parent = node.getParent()
          if ($isListNode(parent)) {
            elementType = parent.getTag()
          }
        } else {
          elementType = node.getType()
        }
        // 把节点的类型转化为对应的元素类型；其他的自定义节点使用它原来的 type
        updateEleType(elementType)
      }
    })
    // 当同一行文本，切换成不同的类型，内容不变但 nodeKey 会变
  }, [currBlockNode, currBlockNode?.nodeKey, editor, updateEleType])

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
  const {
    fontColor,
    bgColor,
    fontSize,
    fontFamily,
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isSubscript,
    isSuperscript,
    setTextStyles,
  } = useTextStyles()

  if (!currBlockNode || TextBlockTypes.every((t) => t !== currBlockNode.nodeType)) return null

  return (
    <>
      <section className='mx-4'>
        <Form labelCol={{ span: 6 }} labelAlign='left' colon={false}>
          <Form.Item label='文本'>
            <Space>
              <DropDownMenus
                options={ElementTypes}
                value={eleType}
                onChange={(value) => {
                  setEleType(value)
                }}
              />

              <DropDownMenus
                options={FontFamilyOptions}
                value={fontFamily}
                onChange={(value) => {
                  setTextStyles({ 'font-family': value })
                }}
              />

              <DropDownMenus
                options={FontSizeOptions}
                value={fontSize}
                onChange={(value) => {
                  setTextStyles({ 'font-size': value })
                }}
              />
            </Space>
          </Form.Item>

          <Form.Item label='颜色'>
            <Space>
              <ColorPicker color={fontColor} onChange={(value) => setTextStyles({ color: value })}>
                <Button type='text' icon={<FontColorsOutlined style={{ color: fontColor }} />}></Button>
              </ColorPicker>

              <ColorPicker color={bgColor} onChange={(value) => setTextStyles({ 'background-color': value })}>
                <Button type='text' icon={<BgColorsOutlined style={{ color: bgColor }} />}></Button>
              </ColorPicker>
            </Space>
          </Form.Item>

          <Form.Item label='对齐'>
            <Space>
              {Aligns.map((v) => (
                <Button
                  key={v.value}
                  type='text'
                  icon={v.Icon}
                  onClick={() => onFormatElement(v.value as lexical.ElementFormatType)}
                />
              ))}
            </Space>
          </Form.Item>

          <Form.Item label='缩进'>
            <Space>
              <Button
                icon={<MenuFoldOutlined />}
                type='text'
                onClick={() => onSetIndent(lexical.OUTDENT_CONTENT_COMMAND)}
              />
              <Button
                icon={<MenuUnfoldOutlined />}
                type='text'
                onClick={() => onSetIndent(lexical.INDENT_CONTENT_COMMAND)}
              />
            </Space>
          </Form.Item>

          <Form.Item label='文本修饰'>
            <Space>
              <Button type={isBold ? 'link' : 'text'} icon={<BoldOutlined />} onClick={() => onFormatText('bold')} />
              <Button
                type={isItalic ? 'link' : 'text'}
                icon={<ItalicOutlined />}
                onClick={() => onFormatText('italic')}
              />
              <Button
                type={isUnderline ? 'link' : 'text'}
                icon={<UnderlineOutlined />}
                onClick={() => onFormatText('underline')}
              />
              <Button
                type={isStrikethrough ? 'link' : 'text'}
                icon={<StrikethroughOutlined />}
                onClick={() => onFormatText('strikethrough')}
              />

              <Button type={isSubscript ? 'link' : 'text'} onClick={() => onFormatText('subscript')}>
                <var>
                  x<sub>2</sub>
                </var>
              </Button>
              <Button type={isSuperscript ? 'link' : 'text'} onClick={() => onFormatText('superscript')}>
                <var>
                  x<sup>2</sup>
                </var>
              </Button>
            </Space>
          </Form.Item>

          <Form.Item label='样式清空'>
            <Button type='text' icon={<ClearOutlined />} onClick={onClearFormat} />
          </Form.Item>
        </Form>
      </section>
    </>
  )
}
