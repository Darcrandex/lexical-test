/**
 * @name TabBaseInfo
 * @description 侧边文档基本信息 tab
 * @author darcrand
 */

import { CloseOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { useDocAsideTab } from '../stores'

export function TabBaseInfo(props: { show: boolean }) {
  const params = useParams()
  const { setCurrTabKey } = useDocAsideTab(params.id)

  if (!props.show) return null

  return (
    <>
      <aside className='flex flex-col w-96 border-l'>
        <header className='flex items-center justify-between p-2 border-b'>
          <span>基本信息</span>
          <span
            className='text-lg text-gray-800 hover:text-gray-500 transition-all cursor-pointer'
            onClick={() => setCurrTabKey(undefined)}
          >
            <CloseOutlined />
          </span>
        </header>
      </aside>
    </>
  )
}
