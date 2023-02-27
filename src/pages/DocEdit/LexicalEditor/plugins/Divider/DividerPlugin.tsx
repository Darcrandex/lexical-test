/**
 * @name DividerPlugin
 * @description
 * @author darcrand
 */

import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalCommand, createCommand, COMMAND_PRIORITY_EDITOR } from 'lexical'
import { $insertNodeToNearestRoot } from '@lexical/utils'

import { $createDividerNode } from './DividerNode'

export const INSERT_DIVIDER: LexicalCommand<undefined> = createCommand('INSERT_DIVIDER')

export default function DividerPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand<string>(
      INSERT_DIVIDER,
      (payload) => {
        const node = $createDividerNode()
        $insertNodeToNearestRoot(node)
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
