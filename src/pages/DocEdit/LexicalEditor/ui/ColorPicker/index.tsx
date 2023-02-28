/**
 * @name ColorPicker
 * @description 自定义的颜色选择器
 * @author darcrand
 */

import { Popover } from 'antd'

export type ColorPickerProps = { children?: JSX.Element; color?: string; onChange?: (color: string) => void }

const colors = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#607d8b',
]

const size = 22
const spacing = 8
const col = 5

export function ColorPicker(props: ColorPickerProps) {
  return (
    <>
      <Popover
        placement='bottomLeft'
        content={
          <ul className='select-none flex flex-wrap' style={{ maxWidth: col * (size + 2 * spacing) }}>
            {colors.map((v) => (
              <li
                key={v}
                className='transition-all hover:shadow-md cursor-pointer'
                style={{ width: size, height: size, margin: spacing, backgroundColor: v }}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  props.onChange?.(v)
                }}
              ></li>
            ))}
          </ul>
        }
      >
        {props.children}
      </Popover>
    </>
  )
}
