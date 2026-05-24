/**
 * Pesona Desa Wisata Nusantara - Logic
 * Fetches real-time weather data for Bali (Penglipuran proxy)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const API_KEY = 'd6ec29b6f6a6afbf6443c3776cff3124'; // Replace with your actual OpenWeatherMap API key
    const CITY = 'Bali'; // Destination for weather report
    const UNITS = 'metric'; // Use Celsius
    
    // DOM Elements
    const weatherData = document.getElementById('weather-data');
    const weatherLoading = document.getElementById('weather-loading');
    const weatherError = document.getElementById('weather-error');
    
    const tempEl = document.getElementById('weather-temp');
    const descEl = document.getElementById('weather-desc');
    const humidityEl = document.getElementById('weather-humidity');

    /**
     * Fetch weather data from OpenWeatherMap API
     */
    async function fetchWeather() {
        if (API_KEY === 'YOUR_API_KEY') {
            console.warn('Weather API Key is placeholder. Please provide a valid OpenWeatherMap API Key.');
            showError('Please set a valid YOUR_API_KEY in script.js');
            return;
        }

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=${UNITS}&appid=${API_KEY}`);
            
            if (!response.ok) {
                throw new Error('Weather data fetch failed');
            }

            const data = await response.json();
            updateWeatherUI(data);
        } catch (error) {
            console.error('Error fetching weather:', error);
            showError();
        }
    }

    /**
     * Update the UI with fetched weather data
     * @param {Object} data - Weather data from API
     */
    function updateWeatherUI(data) {
        tempEl.textContent = `${Math.round(data.main.temp)}°C`;
        descEl.textContent = data.weather[0].description;
        humidityEl.textContent = `${data.main.humidity}%`;
        
        weatherLoading.classList.add('hidden');
        weatherData.classList.remove('hidden');
        weatherError.classList.add('hidden');
    }

    /**
     * Show error message in UI
     * @param {string} customMsg - Optional custom error message
     */
    function showError(customMsg) {
        weatherLoading.classList.add('hidden');
        weatherData.classList.add('hidden');
        weatherError.classList.remove('hidden');
        
        if (customMsg) {
            weatherError.textContent = customMsg;
        }
    }

    // Initialize fetch
    fetchWeather();
});
