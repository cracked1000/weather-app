import { useState } from 'react'
import './SearchBar.css'

function SearchBar({ onSearch }) {
  const [city, setCity] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim()) {
      onSearch(city.trim())
      setCity('')
    }
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter a city"
        className="search-input"
      />
      <button type="submit" className="search-button">
        Add City
      </button>
    </form>
  )
}

export default SearchBar