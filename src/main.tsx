import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { AuthProvider } from '@/app/providers/AuthProvider'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { ToastProvider } from '@/shared/components/ui/toast'

import '@/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
