/**
 * @name ImageSettings
 * @description 图片节点属性面板
 * @author darcrand
 */

import { Button, InputNumber } from 'antd'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { $getNodeByKey } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { useCurrentBlockNode } from '../../utils/use-current-block-node'
import { IMAGE_NODE_TYPE, $isImageNode } from './ImageNode'
import { ImageComponentProps } from './ImageComponent'

export function ImageSettings() {
  const { currBlockNode } = useCurrentBlockNode()
  const [editor] = useLexicalComposerContext()
  const [imageProps, setImageProps] = useState<ImageComponentProps>()

  const updatePropsToForm = useCallback(() => {
    editor.update(() => {
      if (currBlockNode?.nodeKey) {
        const node = $getNodeByKey(currBlockNode.nodeKey)
        if ($isImageNode(node)) {
          setImageProps(node.getLatest().__props)
        }
      }
    })
  }, [editor, currBlockNode?.nodeKey, setImageProps])

  // 切换多个 Image 节点时刷新
  useEffect(() => {
    updatePropsToForm()
  }, [updatePropsToForm])

  // 修改 Image 属性时刷新
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.update(updatePropsToForm)
    })
  }, [editor, updatePropsToForm])

  const updatePropsToNode = useCallback(
    (nextProps: Partial<ImageComponentProps>) => {
      editor.update(() => {
        if (currBlockNode?.nodeKey) {
          const node = $getNodeByKey(currBlockNode.nodeKey)
          if ($isImageNode(node)) {
            node.setProps(nextProps)
          }
        }
      })
    },
    [editor, currBlockNode?.nodeKey]
  )

  const uploadImage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const imageFile = event.target.files?.[0]
      if (imageFile) {
        const reader = new FileReader()
        reader.readAsDataURL(imageFile)
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            updatePropsToNode({ src: reader.result })
          }
        }
      }
    },
    [updatePropsToNode]
  )

  const onRemoveNode = useCallback(() => {
    editor.update(() => {
      if (currBlockNode?.nodeKey) {
        const node = $getNodeByKey(currBlockNode.nodeKey)
        if ($isImageNode(node)) {
          node.selectPrevious()
          node.remove()
        }
      }
    })
  }, [editor, currBlockNode?.nodeKey])

  if (currBlockNode?.nodeType !== IMAGE_NODE_TYPE) return null

  return (
    <>
      <h1>ImageSettings</h1>
      <Button onClick={onRemoveNode}>remove</Button>

      <label className='block m-6 border border-dashed rounded-xl border-blue-300 cursor-pointer hover:border-blue-500 transition-all'>
        <p className='py-8 text-center'>{imageProps?.src ? '替换图片' : '选择图片'}</p>
        <input type='file' hidden accept='image/*' onChange={uploadImage} />
      </label>

      <InputNumber value={imageProps?.height} onChange={(value) => updatePropsToNode({ height: value || undefined })} />
    </>
  )
}
