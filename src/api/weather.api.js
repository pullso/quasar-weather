import axios from 'axios'

const API_KEY = 'e30ae14f8599a0dff344bd9e5c687737'
const API_URL = 'https://api.openweathermap.org/data/2.5/weather'

export const getWeatherByCoords = function ({lat, lon}) {
  return axios.get(`${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`).then(res => res.data)
}

export const getWeatherBySearch = (city) => {
  return axios.get(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`).then(res => res.data.weather ? res.data : null)
}

export const getCoords = () => {
  return axios.get(`https://freegeoip.app/json`).then(res=>res.data)
}
