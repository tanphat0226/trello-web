import ReactDOM from 'react-dom/client'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import App from '~/App.jsx'
import theme from '~/theme'

// Config React Toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { ConfirmProvider } from 'material-ui-confirm'

// Config Redux Store
import { Provider } from 'react-redux'
import { store } from './redux/store'

// Config React Router Dom
import { BrowserRouter } from 'react-router-dom'

// Config Redux Persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)

// injectStore technique: Kỹ thuật sử dụng redux store ở các file ngoài component
import { injectStore } from './utils/authorizeAxios'
injectStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <BrowserRouter basename='/'>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider
            defaultOptions={{
              allowClose: false,
              dialogProps: { maxWidth: 'xs' },
              confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
              cancellationButtonProps: { color: 'inherit' }
            }}
          >
            <GlobalStyles styles={{ a: { color: 'inherit', textDecoration: 'none' } }} />
            <CssBaseline />
            <App />
            <ToastContainer position='bottom-right' theme='colored' />
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
)
