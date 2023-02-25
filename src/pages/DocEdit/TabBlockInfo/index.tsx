/**
 * @name TabBlockInfo
 * @description 当前选中的节点的属性面板
 * @author darcrand
 */

import { CloseOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { useDocAsideTab } from '../stores'
import { BlockTypeSettings } from '../LexicalEditor/plugins/BlockType'
import clsx from 'clsx'

export function TabBlockInfo(props: { show: boolean }) {
  const params = useParams()
  const { setCurrTabKey } = useDocAsideTab(params.id)

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

        <BlockTypeSettings />
      </aside>
    </>
  )
}
