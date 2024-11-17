import { useEffect, useState } from "react"
import axios from "axios"

const App = () => {
  const [input, setInput] = useState("")
  const [countries, setCountries] = useState([])
  const [isTrue, setIsTrue] = useState(null)
  const [showCountry, setShowCountry] = useState(null)

  useEffect(() => {
    if (isTrue) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then((response) => {
          setCountries(response.data.map((c) => c.name.common))
        })
    }
  }, [isTrue])

  const handleChange = (event) => {
    setInput(event.target.value)
    setIsTrue(true)
  }

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(input.toLowerCase())
  )

  const handleClick = (country) => {
    setShowCountry(country)
    console.log(`Show details of ${country}`)
  }

  return (
    <div>
      find countries <input type="text" value={input} onChange={handleChange} />
      {showCountry ? (
        <CountryDetail country={showCountry} />
      ) : (
        <div>
          {filteredCountries.length === 1 ? (
            <CountryDetail country={filteredCountries[0]} />
          ) : filteredCountries.length <= 10 ? (
            filteredCountries.map((c, i) => (
              <p key={i}>
                {c}
                <button onClick={() => handleClick(c)}>show</button>
              </p>
            ))
          ) : (
            <p>Too many matches, specify another filter</p>
          )}
        </div>
      )}
    </div>
  )
}

const CountryDetail = ({ country }) => {
  const [details, setDetails] = useState([])
  const [capital, setCapital] = useState("")
  const [weather, setWeather] = useState([])

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
      .then((response) => {
        setDetails(details.concat(response.data))
        setCapital(response.data.capital[0])
        // console.log(response.data.capital[0])
      })
  }, [])

  useEffect(() => {
    if (capital) {
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${API_KEY}`
        )
        .then((response) => {
          setWeather(weather.concat(response.data))
          console.log(response.data)
        })
    }
  }, [capital])
  return (
    <div>
      {details.map((c, i) => {
        return (
          <div key={i}>
            <h1>{c.name.common}</h1>
            <p>capital {c.capital}</p>
            <p>area {c.area}</p>
            <h4>languages:</h4>
            <ul>
              {Object.entries(c.languages).map(([i, l]) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
            <img src={c.flags.svg} />
          </div>
        )
      })}
      {weather.map((d, i) => {
        return (
          <div key={i}>
            <h2>Weather in {d.name}</h2>
            <p>temperature {d.main.temp}</p>
            <img
              src={`https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`}
              alt=""
            />
            <p>wind {d.wind.speed}</p>
          </div>
        )
      })}
    </div>
  )
}

export default App
