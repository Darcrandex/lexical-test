/**
 * @name ImageComponent
 * @description 独占一行的图片
 * @author darcrand
 */

import { useEffect } from 'react'
import lexical from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'

export type ImageComponentProps = { src?: string; width?: string | number; height?: string | number }

export function ImageComponent(props: ImageComponentProps & { nodeKey: lexical.NodeKey }) {
  const [editor] = useLexicalComposerContext()
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(props.nodeKey)

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        lexical.CLICK_COMMAND,
        () => {
          return true
        },
        lexical.COMMAND_PRIORITY_LOW
      )
    )
  }, [editor])

  return (
    <>
      <h1>ImageComponent</h1>

      {props.src ? (
        <img src={props.src} alt='' width={props.width} height={props.height} />
      ) : (
        <div className='w-full h-10 bg-gray-300 text-gray-50'>no image</div>
      )}
    </>
  )
}

ImageComponent.defaultProps = { width: '100%', height: 200 } as ImageComponentProps
