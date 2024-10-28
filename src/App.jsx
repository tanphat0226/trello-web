import { Routes, Route, Navigate } from 'react-router-dom'

import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/board/656f2c7ee57083faa909a763' />} replace={true} />
      {/* Board Details */}
      <Route path='/board/:boardId' element={<Board />} />

      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />

      {/* 404 Page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
