import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.jsx'

const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-t3hzeyatvmvl1qsj.us.auth0.com'
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || 'G4k7fxOD37mjr8o6xOxSevy0xRPq6PES'
const audience = import.meta.env.VITE_AUTH0_AUDIENCE || 'https://weather-api'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: 'openid profile email'
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)