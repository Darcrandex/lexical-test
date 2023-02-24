/**
 * @name PickerMenuItem
 * @description 组件选项渲染组件
 * @author darcrand
 */

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
      className='lexical__typeahead-nodes-item'
      onClick={props.onClick}
    >
      {props.option.title}
    </li>
  )
}
