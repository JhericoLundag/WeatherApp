document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "69EOT88CQXPyu0yiweHIzXuH3PnJxIUG";
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const weatherDiv1 = document.getElementById("weather1");
    const weatherDiv2 = document.getElementById("weather2");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        // Fetch current conditions
        const currentConditionsUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;
        fetch(currentConditionsUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayCurrentWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching current weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching current weather data.</p>`;
            });

        // Fetch 5-day forecast
        const fiveDayForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;
        fetch(fiveDayForecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayFiveDayForecast(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML = `<p>No weather forecast available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching 5-day forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching 5-day forecast data.</p>`;
            });

        // Fetch hourly forecast
        const hourlyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&metric=true`;
        fetch(hourlyForecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    weatherDiv.innerHTML = `<p>No hourly forecast available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function displayCurrentWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const icon = data.WeatherIcon;

        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
            <img src="https://developer.accuweather.com/sites/default/files/${icon.toString().padStart(2, '0')}-s.png" alt="${weather}">
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayFiveDayForecast(data) {
        let weatherContent = `<h2>5-Day Weather Forecast</h2>`;
        data.forEach(forecast => {
            const date = new Date(forecast.Date);
            const temperatureMin = forecast.Temperature.Minimum.Value;
            const temperatureMax = forecast.Temperature.Maximum.Value;
            const weather = forecast.Day.IconPhrase;
            const icon = forecast.Day.Icon;

            const forecastDiv = document.createElement("div");
            forecastDiv.classList.add("forecast-item");
            forecastDiv.innerHTML = `
                <h3>${date.toDateString()}</h3>
                <p>Min Temperature: ${temperatureMin}°C</p>
                <p>Max Temperature: ${temperatureMax}°C</p>
                <p>Weather: ${weather}</p>
                <img src="https://developer.accuweather.com/sites/default/files/${icon.toString().padStart(2, '0')}-s.png" alt="${weather}">
            `;

            weatherDiv1.appendChild(forecastDiv);
        });
    }

    function displayHourlyForecast(data) {
        let weatherContent = `<h2>Hourly Forecast</h2>`;
        data.forEach(forecast => {
            const date = new Date(forecast.DateTime);
            const temperature = forecast.Temperature.Value;
            const weather = forecast.IconPhrase;
            const icon = forecast.WeatherIcon;

            const forecastDiv = document.createElement("div");
            forecastDiv.classList.add("forecast-item");
            forecastDiv.innerHTML = `
                <h3>${date.toLocaleString()}</h3>
                <p>Temperature: ${temperature}°C</p>
                <p>Weather: ${weather}</p>
                <img src="https://developer.accuweather.com/sites/default/files/${icon.toString().padStart(2, '0')}-s.png" alt="${weather}">
            `;

            weatherDiv2.appendChild(forecastDiv);
        });
    }
});
