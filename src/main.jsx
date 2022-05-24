import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import {ContextProvider} from '../src/context'
import 'lib-flexible/flexible'
import './index.css'
import ErrorFallback from './components/error-boundary/error-fallback'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary fallbackRender={ErrorFallback}>
    <Router>
      <ContextProvider>
        <App />
      </ContextProvider>
    </Router>
  </ErrorBoundary>
)
