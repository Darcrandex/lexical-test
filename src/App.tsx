/**
 * @name App
 * @description
 * @author darcrand
 */

import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import DocEdit from './pages/DocEdit'

const router = createBrowserRouter([
  { path: '/doc-manage/:id/edit', element: <DocEdit /> },
  { path: '*', element: <div>404</div> },
])

export default function App() {
  return (
    <>
      <RouterProvider router={router} fallbackElement={<div>loading...</div>} />
    </>
  )
}
