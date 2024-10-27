import ReactDOM from 'react-dom/client'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from '~/App.jsx'
import theme from '~/theme'

// Config React Toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { ConfirmProvider } from 'material-ui-confirm'

// Config Redux Store
import { Provider } from 'react-redux'
import { store } from './redux/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <CssVarsProvider theme={theme}>
      <ConfirmProvider
        defaultOptions={{
          allowClose: false,
          dialogProps: { maxWidth: 'xs' },
          confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
          cancellationButtonProps: { color: 'inherit' }
        }}
      >
        <CssBaseline />
        <App />
        <ToastContainer position='bottom-right' theme='colored' />
      </ConfirmProvider>
    </CssVarsProvider>
  </Provider>
  // </React.StrictMode>
)
