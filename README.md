# ☁ Skycast — Weather Dashboard

A clean, modern weather dashboard built with **vanilla HTML, CSS, and JavaScript**. No build tools. No frameworks. No API key needed.

![Skycast Preview](https://via.placeholder.com/900x500/0b0f1a/6ee7f7?text=Skycast+Weather+Dashboard)

## ✨ Features

- 🔍 **City Search** — Find weather anywhere in the world
- 🌡 **Current Conditions** — Temperature, feels like, humidity, wind, pressure, visibility
- 📅 **5-Day Forecast** — Daily highs & lows with weather icons
- 🌅 **Sun Tracker** — Sunrise, sunset, and current sun position
- 📱 **Responsive Design** — Works on mobile & desktop
- 🎨 **Dark UI** — Beautiful glassmorphism dark theme

## 🚀 Quick Start

1. Clone the repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/skycast.git
   cd skycast
   ```

2. Open `index.html` in your browser — that's it!

> No server needed. No npm install. Just open and run.

## 🔌 API Used

This project uses **[Open-Meteo](https://open-meteo.com/)** — a completely free, open-source weather API:
- ✅ No API key required
- ✅ No rate limits for personal use
- ✅ Accurate global data

## 📁 Project Structure

```
skycast/
├── index.html    # Main HTML structure
├── style.css     # All styles (dark theme, animations)
├── app.js        # Weather logic & API calls
└── README.md     # This file
```

## 🛠 Tech Stack

| Layer      | Tech                    |
|------------|-------------------------|
| Markup     | HTML5                   |
| Styling    | CSS3 (Custom Properties, Grid, Flexbox, Animations) |
| Logic      | Vanilla JavaScript (ES2020+, async/await) |
| Weather    | Open-Meteo API (free)   |
| Geocoding  | Open-Meteo Geocoding API |
| Fonts      | Google Fonts (Syne + DM Mono) |

## 📸 Customize

Want to change the default city? Edit the last line of `app.js`:

```js
search('Jakarta'); // Change to any city you like
```

## 📄 License

MIT — free to use, modify, and share.

---

Made with ♥ using Open-Meteo
