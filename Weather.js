const map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
let precipitationLayer;
let windLayer;
let stormLayer;
document.getElementById('getWeather').addEventListener('click', function () {
    const city = document.getElementById('city').value.trim();
    const apiKey = 'your_api key';
    if (city === '') {
        alert('Please enter a city name.');
        return;
    }
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetchWeather(apiUrl);
});
document.getElementById('getLocationWeather').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const apiKey = 'Your_api_key'; 
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            fetchWeather(apiUrl);
            updateMap(lat, lon);
        }, (error) => {
            alert('Unable to retrieve your location. Please try again.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});
function fetchWeather(apiUrl) {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather data not available');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            updateMap(data.coord.lat, data.coord.lon); 
        })
        .catch(error => {
            alert('Error fetching weather data: ' + error.message);
        });
}
function displayWeather(data) {
    const cityName = data.name;
    const description = data.weather[0].description;
    const temperature = `${data.main.temp}°C`;
    const humidity = `Humidity: ${data.main.humidity}%`;
    const windSpeed = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('cityName').textContent = cityName;
    document.getElementById('description').textContent = description;
    document.getElementById('temperature').textContent = temperature;
    document.getElementById('humidity').textContent = humidity;
    document.getElementById('windSpeed').textContent = windSpeed;
}
function updateMap(lat, lon) {
    map.setView([lat, lon], 10);
    if (precipitationLayer) map.removeLayer(precipitationLayer);
    if (windLayer) map.removeLayer(windLayer);
    if (stormLayer) map.removeLayer(stormLayer);
    const apiKey = 'your_api_key';
    precipitationLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
        attribution: 'Precipitation data © OpenWeatherMap'
    }).addTo(map);
    windLayer = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
        attribution: 'Wind data © OpenWeatherMap'
    }).addTo(map);
    stormLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
        attribution: 'Storm data © OpenWeatherMap'
    }).addTo(map);
}
