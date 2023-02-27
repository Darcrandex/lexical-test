/**
 * @name TypeaheadPlugin
 * @description 输入 / 出现输入类型提示框
 * @author darcrand
 */

import * as ReactDOM from 'react-dom'
import { useCallback, useMemo, useState } from 'react'
import { TextNode, $getSelection, $isRangeSelection } from 'lexical'
import { LexicalTypeaheadMenuPlugin, useBasicTypeaheadTriggerMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createHeadingNode } from '@lexical/rich-text'
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list'
import { $setBlocksType_experimental } from '@lexical/selection'

import { PickerOption } from './PickerOption'
import { PickerMenuItem } from './PickerMenuItem'
import { INSERT_IMAGE } from '../Image/ImagePlugin'
import { INSERT_DIVIDER } from '../Divider'
import './styles.scss'

export function TypeaheadPlugin() {
  const [editor] = useLexicalComposerContext()

  const [, setQueryString] = useState<string | null>(null)

  // 选择菜单中的其中一项时
  const onSelectOption = useCallback(
    (selectedOption: PickerOption, nodeToRemove: TextNode | null, closeMenu: () => void, matchingString: string) => {
      editor.update(() => {
        if (nodeToRemove) {
          nodeToRemove.remove()
        }
        selectedOption.onSelect(matchingString)
        closeMenu()
      })
    },
    [editor]
  )

  // 判断是否需要展开下拉菜单
  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  })

  const menuOptions = useMemo(() => {
    return [
      ...Array(3)
        .fill(0)
        .map(
          (_, i) =>
            new PickerOption(`标题 ${i + 1}`, {
              onSelect(queryString) {
                editor.update(() => {
                  const selection = $getSelection()
                  if ($isRangeSelection(selection)) {
                    // @ts-ignore
                    $setBlocksType_experimental(selection, () => $createHeadingNode(`h${i + 1}`))
                  }
                })
              },
            })
        ),

      new PickerOption('无序列表', {
        onSelect(queryString) {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        },
      }),

      new PickerOption('有序列表', {
        onSelect(queryString) {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        },
      }),

      new PickerOption('图片', {
        onSelect(queryString) {
          editor.dispatchCommand(INSERT_IMAGE, undefined)
        },
      }),

      new PickerOption('分割线', {
        onSelect(queryString) {
          editor.dispatchCommand(INSERT_DIVIDER, undefined)
        },
      }),
    ]
  }, [editor])

  return (
    <LexicalTypeaheadMenuPlugin<PickerOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={menuOptions}
      menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) =>
        anchorElementRef.current
          ? ReactDOM.createPortal(
              <ul className='lexical__typeahead-nodes-list'>
                {menuOptions.map((v, i) => (
                  <PickerMenuItem
                    key={v.key}
                    option={v}
                    isSelected={selectedIndex === i}
                    onClick={() => {
                      setHighlightedIndex(i)
                      selectOptionAndCleanUp(v)
                    }}
                  />
                ))}
              </ul>,
              anchorElementRef.current
            )
          : null
      }
    />
  )
}
