import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { verifyUserAPI } from '~/apis'
import PageLoading from '~/components/Loading/PageLoading'

function AccountVerification() {
  // Get email value and token from URL
  const [searchParams] = useSearchParams()
  // const email = searchParams.get('email')
  // const token = searchParams.get('token')
  const { email, token } = Object.fromEntries([...searchParams])

  const [verified, setVerified] = useState(false)

  // Call API to verify account
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }
  }, [email, token])

  // If URL invalid (no email or token), redirect to login page
  if (!email || !token) return <Navigate to='/404' />

  // If yet to verify account, display loading
  if (!verified) return <PageLoading caption='Verifying your account...' />

  // If account already verified, redirect to login page with verifiedEmail value

  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification
