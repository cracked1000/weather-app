import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import WeatherCard from './components/WeatherCard'
import SearchBar from './components/SearchBar'
import './App.css'

const API_BASE = 'http://localhost:8080'

function App() {
  const { 
    isLoading, 
    isAuthenticated, 
    getAccessTokenSilently, 
    user,
    loginWithRedirect,
    logout,
    error: authError 
  } = useAuth0()
  
  const [preloadedWeather, setPreloadedWeather] = useState([])
  const [searchedCities, setSearchedCities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchPreloadedWeather()
    }
  }, [isAuthenticated])

  const getAuthHeaders = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'https://weather-api',
        },
      })
      return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    } catch (error) {
      console.error('Error getting access token:', error)
      setError('Authentication failed')
      return {}
    }
  }

  const fetchPreloadedWeather = async () => {
    try {
      setLoading(true)
      setError(null)
      const headers = await getAuthHeaders()
      const response = await axios.get(`${API_BASE}/weather/preloaded`, { headers })
      setPreloadedWeather(response.data)
    } catch (err) {
      setError('Failed to load weather data')
      console.error('Error fetching preloaded weather:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (city) => {
    try {
      setError(null)
      const headers = await getAuthHeaders()
      const response = await axios.get(`${API_BASE}/weather`, {
        params: { city },
        headers
      })
      
      // Check if city is already in searched cities to avoid duplicates
      const cityExists = searchedCities.some(weather => 
        weather.name.toLowerCase() === response.data.name.toLowerCase()
      )
      
      if (!cityExists) {
        setSearchedCities(prev => [...prev, response.data])
      }
    } catch (err) {
      setError('City not found')
      console.error('Error searching weather:', err)
    }
  }

  // Show loading screen while Auth0 is initializing
  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth error if there's an authentication issue
  if (authError) {
    return (
      <div className="app">
        <div className="auth-error">
          <h2>Authentication Error</h2>
          <p>{authError.message}</p>
          <button 
            className="auth-button login-button"
            onClick={() => loginWithRedirect()}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="app">
        <div className="login-screen">
          <div className="login-content">
            <div className="logo">
              <span className="weather-icon">☀️</span>
              <h1>Weather App</h1>
            </div>
            <p>Please log in to access weather data</p>
            <button 
              className="auth-button login-button"
              onClick={() => loginWithRedirect()}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Combine searched cities first, then preloaded weather
  const allWeatherData = [...searchedCities, ...preloadedWeather]

  const handleReset = () => {
    setSearchedCities([])
    setError(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="weather-icon">☀️</span>
            <h1>Weather App</h1>
          </div>
          
          <div className="header-controls">
            <SearchBar onSearch={handleSearch} />
            {searchedCities.length > 0 && (
              <button
                className="reset-button"
                onClick={handleReset}
                title="Clear searched cities"
              >
                Reset
              </button>
            )}
            <div className="auth-section">
              <div className="user-profile">
                <img 
                  src={user?.picture} 
                  alt={user?.name}
                  className="user-avatar"
                />
                <div className="user-info">
                  <span className="user-name">{user?.name}</span>
                  <span className="user-email">{user?.email}</span>
                </div>
              </div>
              <button
                className="auth-button logout-button"
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error">
            <p>{error}</p>
            <button onClick={() => {
              setError(null)
              fetchPreloadedWeather()
            }}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && allWeatherData.length === 0 && (
          <div className="no-data">
            <p>No weather data available</p>
          </div>
        )}

        {!loading && allWeatherData.length > 0 && (
          <div className="weather-grid">
            {allWeatherData.map((weather, index) => (
              <WeatherCard key={`${weather.name}-${index}`} weather={weather} />
            ))}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>2024 Weather Technologies</p>
      </footer>
    </div>
  )
}

export default App