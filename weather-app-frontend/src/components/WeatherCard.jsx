import './WeatherCard.css'

function WeatherCard({ weather }) {
  const temp = Math.round(weather.main.temp)
  const description = weather.weather[0].description
  const cityName = weather.name
  const iconCode = weather.weather[0].icon
   
  // OpenWeatherMap icon URL
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
   
  // Get card color based on temperature
  const getCardColor = (temp) => {
    if (temp <= 0) return 'cold'
    if (temp <= 15) return 'cool'
    if (temp <= 25) return 'warm'
    return 'hot'
  }

  const cardColor = getCardColor(temp)

  return (
    <div className={`weather-card ${cardColor}`}>            
      <div className="card-header">
        <h3 className="city-name">{cityName}</h3>
        <span className="temperature">{temp}°C</span>
      </div>

      <div className="weather-info">
        <div className="weather-icon-large">
          <img 
            src={iconUrl} 
            alt={description}
            className="weather-icon-img"
            onError={(e) => {
              // Fallback to emoji if image fails to load
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <span className="weather-icon-fallback" style={{display: 'none'}}>
            🌤️
          </span>
        </div>
        <p className="weather-description">
          {description.charAt(0).toUpperCase() + description.slice(1)}
        </p>
      </div>

      <div className="additional-info">
        <div className="info-row">
          <span className="label">Feels like:</span>
          <span className="value">{Math.round(weather.main.feels_like || temp)}°C</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard