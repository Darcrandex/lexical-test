/**
 * @name DropDownMenus
 * @description 自定义的轻量的下来菜单
 * @description 由于 antd 提供的组件会在点击时，使左侧编辑区的 selection 清空，因此自定义了这个下拉组件
 * @author darcrand
 */

import { Button, Popover } from 'antd'
import clsx from 'clsx'
import { useMemo } from 'react'

export type DropDownMenusProps = {
  options: { value: string; label: string }[]
  value?: string
  onChange?: (value: string) => void
}

export function DropDownMenus(props: DropDownMenusProps) {
  const currLabel = useMemo(
    () => props.options.find((v) => v.value === props.value)?.label || '默认',
    [props.options, props.value]
  )
  return (
    <>
      <Popover
        placement='bottomLeft'
        content={
          <ul>
            {props.options.map((v) => (
              <li
                key={v.value}
                className={clsx(
                  'select-none mb-2 last:mb-0 rounded-md transition-all cursor-pointer',
                  v.value === props.value ? 'text-blue-400' : 'text-gray-600 hover:text-blue-300'
                )}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  props.onChange?.(v.value)
                }}
              >
                {v.label}
              </li>
            ))}
          </ul>
        }
      >
        <Button type='text'>{currLabel}</Button>
      </Popover>
    </>
  )
}
