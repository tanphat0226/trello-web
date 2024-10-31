import { Navigate, Route, Routes } from 'react-router-dom'

import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import Board from '~/pages/Boards/_id'
import AccountVerification from './pages/Auth/AccountVerification'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/board/656f2c7ee57083faa909a763' />} replace={true} />
      {/* Board Details */}
      <Route path='/board/:boardId' element={<Board />} />

      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />

      {/* 404 Page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
