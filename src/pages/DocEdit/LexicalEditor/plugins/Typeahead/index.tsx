/**
 * @name TypeaheadPlugin
 * @description 输入 / 出现输入类型提示框
 * @author darcrand
 */

import * as ReactDOM from 'react-dom'
import { useCallback, useMemo, useState } from 'react'
import { TextNode } from 'lexical'
import { LexicalTypeaheadMenuPlugin, useBasicTypeaheadTriggerMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { PickerOption } from './PickerOption'
import { PickerMenuItem } from './PickerMenuItem'
import './styles.scss'

export function TypeaheadPlugin() {
  const [editor] = useLexicalComposerContext()

  const [queryString, setQueryString] = useState<string | null>(null)

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
      new PickerOption('H1', {
        onSelect(queryString) {
          console.log('selected', queryString)
        },
      }),
    ]
  }, [])

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
