/**
 * @name DocEdit
 * @description
 * @author darcrand
 */

import { ArrowLeftOutlined } from '@ant-design/icons'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { Button, Space } from 'antd'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { TabAside } from './TabAside'
import { LexicalEditor, LexicalEditorContext } from './LexicalEditor'

function DocEditContent() {
  const [editor] = useLexicalComposerContext()
  const navigate = useNavigate()
  const onSave = useCallback(() => {
    editor.update(() => {
      const stateJSON = editor.getEditorState().toJSON()
      console.log('json', stateJSON)
    })
  }, [editor])

  return (
    <section className='flex flex-col h-screen'>
      <header className='flex items-center px-4 py-2 border-b'>
        <Button type='link' icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          返回
        </Button>

        <h1 className='mx-auto flex items-center'>文档模版</h1>

        <Space>
          <Button type='primary' ghost onClick={onSave}>
            临时保存
          </Button>
          <Button type='primary'>发布</Button>
        </Space>
      </header>

      <section className='flex-1 flex overflow-auto'>
        <main className='flex-1 overflow-auto'>
          <LexicalEditor />
        </main>

        <TabAside />
      </section>
    </section>
  )
}

export default function DocEdit() {
  return (
    <>
      <LexicalEditorContext>
        <DocEditContent />
      </LexicalEditorContext>
    </>
  )
}
