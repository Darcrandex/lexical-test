/**
 * @name PickerMenuItem
 * @description 组件选项渲染组件
 * @author darcrand
 */

import clsx from 'clsx'
import { PickerOption } from './PickerOption'

export type PickerMenuItemProps = {
  isSelected: boolean
  onClick: () => void
  option: PickerOption
}

export function PickerMenuItem(props: PickerMenuItemProps) {
  return (
    <li
      key={props.option.key}
      ref={props.option.setRefElement}
      className={clsx('lexical__typeahead-nodes-item', props.isSelected && 'bg-gray-300')}
      onClick={props.onClick}
    >
      {props.option.title}
    </li>
  )
}
