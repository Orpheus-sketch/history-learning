import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext'
import { AccountProvider } from './context/AccountContext'
import { SubjectProvider } from './context/SubjectContext'
import './index.css'
import './styles/themes.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AccountProvider>
        <SubjectProvider>
          <App />
        </SubjectProvider>
      </AccountProvider>
    </ThemeProvider>
  </StrictMode>,
)
