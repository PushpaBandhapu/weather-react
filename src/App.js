import React,{useState, useEffect } from 'react'
import axios from 'axios'
import Ash from './assets/ash.jpg';
import Clear from './assets/clear.jpg';
import Clouds from './assets/clouds.jpg';
import Drizzle from './assets/drizzle.jpg';
import Dust from './assets/dust.jpg';
import Fog from './assets/fog.jpg';
import Haze from './assets/haze.jpg';
import Mist from './assets/mist.jpg';
import Rain from './assets/rain.jpg';
import Sand from './assets/sand.jpg';
import Smoke from './assets/smoke.jpg';
import Snow from './assets/snow.jpg';
import Squall from './assets/squall.jpg';
import Thunderstorm from './assets/thunderstrom.jpg';
import Tornado from './assets/tornado.jpg';


function App() {
  const [data,setData] = useState({})
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('')

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
    }, (err) => {
      setError('Unable to fetch.Please enter location manually.');
    });
  }, []);

  const fetchWeatherByCoords = (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=d6d770dee8d3316ac1c8da3fb9d3b243`;
    axios.get(url).then((response) => {
      setData(response.data);
      console.log(response.data)
      updateBackground(response.data.weather[0].main)
    }).catch((error) => {
      setError('Failed to fetch weather data for your location.');
    });
  }
  

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=d6d770dee8d3316ac1c8da3fb9d3b243`
      axios.get(url).then((response) => {
        setData(response.data)
        console.log(response.data)
        setError('');
        updateBackground(response.data.weather[0].main)
      }).catch((error) => {
        if(error.response && error.response.status == 400) {
          setError("Please Enter the Valid city name");
        } else {
          setError("An error occured.Please try again");
        }
      })
      setLocation('')
    }
    
  }

  const updateBackground = (weatherCondition) => {
    const weatherBackgrounds = {
        Clear:  Clear,
        Clouds: Clouds, // Cloudy sky
        Rain:  Rain, // Rainy weather
        Snow: Snow, // Snowy weather
        Drizzle: Drizzle, // Light rain
        Thunderstorm: Thunderstorm, // Thunderstorm
        Mist:  Mist, // Misty weather
        Smoke:  Smoke, // Smoke
        Haze:  Haze, // Haze
        Dust: Dust, // Dusty weather
        Fog: Fog, // Foggy weather
        Sand:  Sand, // Sand or dust whirls
        Ash: Ash, // Volcanic ash
        Squall: Squall, // Squalls
        Tornado: Tornado, // Tornado
    }
    const imageUrl = weatherBackgrounds[weatherCondition] || './assets/sunset.jpg';
    setBackgroundImageUrl(imageUrl);
  }

  return (
    <div className="app" style={{ 
      backgroundImage: `url(${process.env.PUBLIC_URL + backgroundImageUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      }}>
      <div className="search">
        <input 
        value={location}
        onChange={event => setLocation(event.target.value)}
        onKeyPress={searchLocation}
        placeholder='Enter Location'
        type="text"/>
        {error && <div style={{color: 'red'}}>{error}</div>} {/* Display error message */}
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
            
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>
        {data.name !== undefined &&
          <div className="bottom">
            <div className="feels">
              {data.main ? <p className="bold">{data.main.feels_like.toFixed()}°F</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className="bold">{data.wind.speed.toFixed()}MPH</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        }
        
      </div>
      
    </div>
  );
}

export default App;
