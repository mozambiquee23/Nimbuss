// === SKYCAST — Weather Dashboard ===
// Uses Open-Meteo (free, no API key) + Open-Meteo Geocoding

const API_GEO   = 'https://geocoding-api.open-meteo.com/v1/search';
const API_WEATHER = 'https://api.open-meteo.com/v1/forecast';

const $ = id => document.getElementById(id);

// WMO Weather code map
const WMO = {
  0:  { label: 'Clear Sky',        icon: '☀️' },
  1:  { label: 'Mostly Clear',     icon: '🌤' },
  2:  { label: 'Partly Cloudy',    icon: '⛅' },
  3:  { label: 'Overcast',         icon: '☁️' },
  45: { label: 'Foggy',            icon: '🌫' },
  48: { label: 'Icy Fog',          icon: '🌫' },
  51: { label: 'Light Drizzle',    icon: '🌦' },
  53: { label: 'Drizzle',          icon: '🌦' },
  55: { label: 'Heavy Drizzle',    icon: '🌧' },
  61: { label: 'Light Rain',       icon: '🌧' },
  63: { label: 'Rain',             icon: '🌧' },
  65: { label: 'Heavy Rain',       icon: '🌧' },
  71: { label: 'Light Snow',       icon: '🌨' },
  73: { label: 'Snow',             icon: '❄️' },
  75: { label: 'Heavy Snow',       icon: '❄️' },
  77: { label: 'Snow Grains',      icon: '🌨' },
  80: { label: 'Light Showers',    icon: '🌦' },
  81: { label: 'Showers',          icon: '🌧' },
  82: { label: 'Heavy Showers',    icon: '⛈' },
  85: { label: 'Snow Showers',     icon: '🌨' },
  86: { label: 'Heavy Snow Shower',icon: '❄️' },
  95: { label: 'Thunderstorm',     icon: '⛈' },
  96: { label: 'Thunderstorm + Hail', icon: '⛈' },
  99: { label: 'Heavy Thunderstorm', icon: '⛈' },
};

const WIND_DIRS = ['N','NE','E','SE','S','SW','W','NW'];
function windDir(deg) {
  return WIND_DIRS[Math.round(deg / 45) % 8];
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });
}

function dayName(dateStr, i) {
  if (i === 0) return 'Today';
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
}

// === State ===
let state = { loaded: false };

// === UI helpers ===
function showLoading() {
  $('loading').classList.remove('hidden');
  $('weatherMain').classList.add('hidden');
  $('emptyState').classList.add('hidden');
  $('errorMsg').classList.add('hidden');
}
function showEmpty() {
  $('emptyState').classList.remove('hidden');
  $('loading').classList.add('hidden');
  $('weatherMain').classList.add('hidden');
}
function showError(msg) {
  $('errorMsg').textContent = msg;
  $('errorMsg').classList.remove('hidden');
  $('loading').classList.add('hidden');
  $('weatherMain').classList.add('hidden');
  $('emptyState').classList.add('hidden');
}
function showWeather() {
  $('weatherMain').classList.remove('hidden');
  $('loading').classList.add('hidden');
  $('emptyState').classList.add('hidden');
  $('errorMsg').classList.add('hidden');
}

// === Geocoding ===
async function geocode(cityName) {
  const url = `${API_GEO}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error('City not found');
  return data.results[0];
}

// === Weather fetch ===
async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      'temperature_2m','apparent_temperature','relative_humidity_2m',
      'wind_speed_10m','wind_direction_10m','surface_pressure',
      'visibility','weather_code','is_day'
    ].join(','),
    daily: [
      'weather_code','temperature_2m_max','temperature_2m_min',
      'sunrise','sunset'
    ].join(','),
    forecast_days: 5,
    timezone: 'auto',
  });
  const res = await fetch(`${API_WEATHER}?${params}`);
  return res.json();
}

// === Render ===
function render(geo, weather) {
  const c  = weather.current;
  const d  = weather.daily;
  const wmo = WMO[c.weather_code] || { label: 'Unknown', icon: '🌡' };

  // Main card
  $('cityName').textContent    = geo.name;
  $('countryName').textContent = `${geo.admin1 ? geo.admin1 + ', ' : ''}${geo.country}`;
  $('tempValue').textContent   = Math.round(c.temperature_2m);
  $('feelsLike').textContent   = Math.round(c.apparent_temperature);
  $('weatherIconBig').textContent = wmo.icon;
  $('weatherDesc').textContent = wmo.label;
  $('weatherCode').textContent = `WMO ${c.weather_code}`;

  // Stats
  const hum = c.relative_humidity_2m;
  $('humidity').textContent  = `${hum}%`;
  $('humidityBar').style.width = `${hum}%`;
  $('windSpeed').textContent = `${Math.round(c.wind_speed_10m)} km/h`;
  $('windDir').textContent   = `From ${windDir(c.wind_direction_10m)}`;
  $('visibility').textContent = c.visibility !== undefined
    ? `${(c.visibility / 1000).toFixed(1)} km`
    : '— km';
  $('pressure').textContent  = `${Math.round(c.surface_pressure)} hPa`;
  $('pressureTrend').textContent = c.surface_pressure > 1013 ? 'High pressure' : 'Low pressure';

  // Forecast
  const fRow = $('forecastRow');
  fRow.innerHTML = '';
  d.time.forEach((dateStr, i) => {
    const fw = WMO[d.weather_code[i]] || { icon: '🌡' };
    fRow.innerHTML += `
      <div class="forecast-day">
        <div class="fc-day-name">${dayName(dateStr, i)}</div>
        <div class="fc-icon">${fw.icon}</div>
        <div class="fc-temp-max">${Math.round(d.temperature_2m_max[i])}°</div>
        <div class="fc-temp-min">${Math.round(d.temperature_2m_min[i])}°</div>
      </div>`;
  });

  // Sun
  const srRaw = d.sunrise[0];
  const ssRaw = d.sunset[0];
  const sr = new Date(srRaw);
  const ss = new Date(ssRaw);
  const now = new Date();
  $('sunrise').textContent = formatTime(srRaw);
  $('sunset').textContent  = formatTime(ssRaw);

  const totalMs  = ss - sr;
  const elapsedMs = Math.min(Math.max(now - sr, 0), totalMs);
  const progress = totalMs > 0 ? elapsedMs / totalMs : 0.5;
  $('sunDot').style.left = `${progress * 100}%`;
  $('arcFill').style.width = `${progress * 100}%`;

  const diffMs = ss - sr;
  const diffH  = Math.floor(diffMs / 3600000);
  const diffM  = Math.floor((diffMs % 3600000) / 60000);
  $('daylightHours').textContent = `${diffH}h ${diffM}m`;

  showWeather();
}

// === Search ===
async function search(cityName) {
  if (!cityName.trim()) return;
  showLoading();
  try {
    const geo     = await geocode(cityName);
    const weather = await fetchWeather(geo.latitude, geo.longitude);
    render(geo, weather);
  } catch (err) {
    showError('City not found. Please check the spelling and try again.');
    console.error(err);
  }
}

// === Init ===
$('currentDate').textContent = formatDate();
showEmpty();

$('searchBtn').addEventListener('click', () => search($('cityInput').value));
$('cityInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') search($('cityInput').value);
});

document.querySelectorAll('.city-tag').forEach(btn => {
  btn.addEventListener('click', () => {
    $('cityInput').value = btn.dataset.city;
    search(btn.dataset.city);
  });
});

// Auto-load with Jakarta as default
search('Jakarta');
