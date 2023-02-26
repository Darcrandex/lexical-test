/**
 * @name ImageComponent
 * @description 独占一行的图片
 * @author darcrand
 */

import { useEffect, useRef } from 'react'
import lexical from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'

export type ImageComponentProps = { src?: string; width?: string | number; height?: string | number }

export function ImageComponent(props: ImageComponentProps & { nodeKey: lexical.NodeKey }) {
  const [editor] = useLexicalComposerContext()
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(props.nodeKey)
  const ref = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    return mergeRegister(
      // 1. 点击选中
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
      )
    )
  }, [clearSelection, editor, setSelected])

  return (
    <>
      <section ref={ref}>
        <h1>ImageComponent</h1>
        <p>isSelected {isSelected ? 'yes' : 'no'}</p>

        {props.src ? (
          <img src={props.src} alt='' width={props.width} height={props.height} />
        ) : (
          <div className='w-full h-10 bg-gray-300 text-gray-50'>no image</div>
        )}
      </section>
    </>
  )
}

ImageComponent.defaultProps = { width: '100%', height: 200 } as ImageComponentProps
