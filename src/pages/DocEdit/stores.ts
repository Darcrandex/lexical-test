import { atomFamily, useRecoilState } from 'recoil'

// 右侧菜单栏
const docTabState = atomFamily<string | undefined, string>({ key: 'doc-detail/aside-tab-state', default: undefined })
export function useDocAsideTab(id = 'new') {
  const [currTabKey, setCurrTabKey] = useRecoilState(docTabState(id))
  return { currTabKey, setCurrTabKey }
}
