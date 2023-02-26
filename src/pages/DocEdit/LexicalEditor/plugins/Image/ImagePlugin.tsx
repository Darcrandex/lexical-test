/**
 * @name DividerPlugin
 * @description 图片块元素插件
 * @author darcrand
 */

import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalCommand, createCommand, COMMAND_PRIORITY_EDITOR } from 'lexical'
import { $insertNodeToNearestRoot } from '@lexical/utils'

import { $createImageNode } from './ImageNode'

export const INSERT_IMAGE: LexicalCommand<void> = createCommand('INSERT_IMAGE')

export function ImagePlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand<string>(
      INSERT_IMAGE,
      (payload) => {
        const node = $createImageNode()
        $insertNodeToNearestRoot(node)
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
