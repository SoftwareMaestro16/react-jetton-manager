import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider
      manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
      uiPreferences={{
        colorsSet: {
          [THEME.DARK]: {
            connectButton: {
              background: '#ff7f11', // ярко-оранжевый
            },
            accent: '#ff7f11',
            telegramButton: '#ff7f11',
            background: {
              primary: '#0d0d0d',    // почти чёрный
              secondary: '#1a1a1a',  // тёмно-серый
              tint: '#262626',       // чуть светлее, но всё ещё тёмный
            },
            text: {
              primary: '#ffffff',
              secondary: '#cccccc',
            },
          },
          [THEME.LIGHT]: {
            connectButton: {
              background: '#ff7f11',
            },
            accent: '#ff7f11',
            telegramButton: '#ffa94d',
            background: {
              primary: '#fff8f0',
              secondary: '#fff3e0',
              tint: '#ffe0b3',
            },
            text: {
              primary: '#000000',
              secondary: '#333333',
            },
          },
        },
      }}
    >
      <App />
    </TonConnectUIProvider>
  </StrictMode>,
)