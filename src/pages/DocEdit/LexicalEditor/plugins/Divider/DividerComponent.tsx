/**
 * @name DividerComponent
 * @description 自定义分割线组件显示内容
 * @author darcrand
 */

import { useCallback, useEffect, useMemo, useRef } from 'react'
import lexical from 'lexical'
import clsx from 'clsx'
import { Popover, Radio, Space } from 'antd'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import { SketchPicker } from 'react-color'

import { $isDividerNode } from './DividerNode'

export type DividerComponentProps = {
  size?: 'small' | 'normal' | 'large'
  borderStyle?: 'solid' | 'dashed' | 'double'
  borderColor?: string
}

const borderStyleOptions = [
  { value: 'solid', label: '实线' },
  { value: 'dashed', label: '虚线' },
  { value: 'double', label: '双线' },
]

const sizeOptions = [
  { value: 'small', label: '小', px: 1 },
  { value: 'normal', label: '中', px: 2 },
  { value: 'large', label: '大', px: 4 },
]

export default function DividerComponent(props: DividerComponentProps & { nodeKey: lexical.NodeKey }) {
  const [editor] = useLexicalComposerContext()
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(props.nodeKey)
  const ref = useRef<HTMLDivElement>(null)

  const onRemove = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && lexical.$isNodeSelection(lexical.$getSelection())) {
        event.preventDefault()

        const node = lexical.$getNodeByKey(props.nodeKey)
        if ($isDividerNode(node)) {
          node.selectPrevious()
          node.remove()
        }
      }

      return false
    },
    [isSelected, props.nodeKey]
  )

  // 在组件内部注册事件
  useEffect(() => {
    return mergeRegister(
      // 1. 鼠标点击时让节点选中或取消选中
      editor.registerCommand<MouseEvent>(
        lexical.CLICK_COMMAND,
        (event) => {
          if (event.target === ref.current || ref.current?.contains?.(event.target as Node)) {
            if (!event.shiftKey) {
              clearSelection()
            }
            setSelected(true)
            return true
          }

          return false
        },
        lexical.COMMAND_PRIORITY_LOW
      ),

      // 2. 按下 退格键 时，删除节点
      editor.registerCommand(lexical.KEY_BACKSPACE_COMMAND, onRemove, lexical.COMMAND_PRIORITY_LOW),

      // 3. 按下 删除键 时，删除节点
      editor.registerCommand(lexical.KEY_DELETE_COMMAND, onRemove, lexical.COMMAND_PRIORITY_LOW)
    )
  }, [clearSelection, editor, isSelected, onRemove, props.nodeKey, setSelected])

  const onUpdateProps = useCallback(
    (nextProps: Partial<DividerComponentProps>) => {
      editor.update(() => {
        const node = lexical.$getNodeByKey(props.nodeKey)
        if ($isDividerNode(node)) {
          node.setProps(nextProps)
        }
      })
    },
    [editor, props.nodeKey]
  )

  const borderTopWidth = useMemo(() => {
    const x = props.borderStyle === 'double' ? 3 : 1
    return (sizeOptions.find((v) => v.value === props.size)?.px ?? 1) * x
  }, [props.borderStyle, props.size])

  return (
    <>
      <Popover
        open={isSelected}
        content={
          <Space direction='vertical' size={[0, 8]}>
            <Radio.Group
              buttonStyle='solid'
              value={props.borderStyle}
              onChange={(e) => {
                onUpdateProps({ borderStyle: e.target.value })
              }}
            >
              {borderStyleOptions.map((v) => (
                <Radio.Button key={v.value} value={v.value}>
                  {v.label}
                </Radio.Button>
              ))}
            </Radio.Group>

            <Radio.Group
              buttonStyle='solid'
              value={props.size}
              onChange={(e) => {
                onUpdateProps({ size: e.target.value })
              }}
            >
              {sizeOptions.map((v) => (
                <Radio.Button key={v.value} value={v.value}>
                  {v.label}
                </Radio.Button>
              ))}
            </Radio.Group>

            <SketchPicker
              width='260px'
              color={props.borderColor}
              onChangeComplete={(color) => onUpdateProps({ borderColor: color.hex })}
            />
          </Space>
        }
      >
        <div ref={ref} className={clsx('py-2 cursor-pointer', isSelected && 'outline outline-blue-300')}>
          <div
            className='pointer-events-none'
            style={{
              border: 'none',
              borderTopWidth,
              borderTopStyle: props.borderStyle,
              borderTopColor: props.borderColor,
            }}
          />
        </div>
      </Popover>
    </>
  )
}

DividerComponent.defaultProps = {
  borderStyle: 'solid',
  size: 'normal',
  borderColor: '#333333',
} as DividerComponentProps
