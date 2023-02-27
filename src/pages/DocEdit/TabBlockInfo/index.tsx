/**
 * @name TabBlockInfo
 * @description 当前选中的节点的属性面板
 * @author darcrand
 */

import { CloseOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import clsx from 'clsx'

import { useDocAsideTab } from '../stores'
import { BlockTypeSettings } from '../LexicalEditor/plugins/BlockType'
import { ImageSettings } from '../LexicalEditor/plugins/Image'
import { useCurrentBlockNode } from '../LexicalEditor/utils/use-current-block-node'

export function TabBlockInfo(props: { show: boolean }) {
  const params = useParams()
  const { setCurrTabKey } = useDocAsideTab(params.id)
  const { currBlockNode } = useCurrentBlockNode()

  return (
    <>
      <aside className={clsx('flex-col w-96 border-l', props.show ? 'flex' : 'hidden')}>
        <header className='flex items-center justify-between p-2 border-b'>
          <span>节点配置</span>
          <span
            className='text-lg text-gray-800 hover:text-gray-500 transition-all cursor-pointer'
            onClick={() => setCurrTabKey(undefined)}
          >
            <CloseOutlined />
          </span>
        </header>

        <div className='bg-gray-200'>
          <p>debug</p>
          <p>
            {currBlockNode?.nodeKey} {currBlockNode?.nodeType}
          </p>
        </div>

        {!currBlockNode && <p className='py-4 text-center text-gray-300'>请先选择一个节点</p>}

        <BlockTypeSettings />
        <ImageSettings />
      </aside>
    </>
  )
}
