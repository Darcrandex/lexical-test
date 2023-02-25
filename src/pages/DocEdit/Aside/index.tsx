/**
 * @name Aside
 * @description 侧边内容
 * @author darcrand
 */

import { BlockOutlined, FileTextOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { useParams } from 'react-router-dom'

import { useDocAsideTab } from '../stores'
import { TabBaseInfo } from '../TabBaseInfo'
import { TabBlockInfo } from '../TabBlockInfo'

const tabs = [
  { key: 'base', Icon: FileTextOutlined, Content: TabBaseInfo },
  { key: 'block', Icon: BlockOutlined, Content: TabBlockInfo },
]

export function Aside() {
  const params = useParams()
  const { currTabKey, setCurrTabKey } = useDocAsideTab(params.id)

  return (
    <>
      {Boolean(currTabKey) && (
        <aside className='w-96 border-l'>
          {tabs
            .filter(({ key }) => key === currTabKey)
            .map(({ key, Content }) => (
              <Content key={key} />
            ))}
        </aside>
      )}

      <nav className='border-l'>
        {tabs.map(({ key, Icon }) => (
          <span
            key={key}
            className={clsx(
              'block px-4 py-2 text-2xl cursor-pointer transition-all hover:text-blue-300',
              currTabKey === key ? 'text-blue-400' : 'text-gray-400'
            )}
            onClick={() => setCurrTabKey(key)}
          >
            <Icon />
          </span>
        ))}
      </nav>
    </>
  )
}
