import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import Board from '~/pages/Boards/_id'
import AccountVerification from './pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from './redux/user/userSlice'

// Protected Route
// https://www.robinwieruch.de/react-router-private-routes/
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      <Route path='/' element={<Navigate to='/board/656f2c7ee57083faa909a763' />} replace={true} />

      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* Board Details */}
        <Route path='/board/:boardId' element={<Board />} />
      </Route>
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
