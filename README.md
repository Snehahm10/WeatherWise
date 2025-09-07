m# WeatherWise: A Modern Weather Forecast App

WeatherWise is a beautifully designed, AI-enhanced weather forecasting application built with a modern tech stack. It delivers real-time weather data, detailed 5-day forecasts, and insightful visualizations for any city in the world. Powered by Next.js, Genkit, and the OpenWeatherMap API, this app showcases a seamless blend of server-side rendering, AI-driven content generation, and a responsive, component-based UI.

## ✨ Features

- **Current Weather:** Get real-time temperature, humidity, wind speed, and "feels like" temperature.
- **5-Day Forecast:** See the weather forecast for the next five days, with daily highs and lows.
- **Detailed Charts:** Visualize temperature trends with interactive, beautifully rendered charts.
- **AI-Powered Descriptions:** Get friendly and context-aware weather descriptions powered by Google's Gemini model through Genkit, tailored to the time of day.
- **City Search with Suggestions:** Easily find any city with autocomplete suggestions powered by the OpenWeatherMap Geocoding API.
- **Responsive Design:** A stunning and modern user interface that looks great on all devices, built with Tailwind CSS and ShadCN UI.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini Models
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) for lightweight global state.
- **Data Fetching:** OpenWeatherMap API for weather and forecast data.

## 🚀 Getting Started

This project is optimized for development in Firebase Studio. You can get started by simply asking the AI assistant to make changes or add new features.

To run the project locally, follow these steps:

### 1. Installation

First, install the project dependencies using npm:
```bash
npm install
```

### 2. Environment Variables

Next, you'll need to set up your environment variables. Create a file named `.env` in the root of your project and add your OpenWeatherMap API key. You can get a free API key from the [OpenWeatherMap website](https://openweathermap.org/api).

```
OPENWEATHER_API_KEY=your_api_key_here
```
*Note: The Genkit/Gemini API key is managed by Firebase Studio and does not need to be set locally for this project configuration.*

### 3. Running the Application

You can run the application in a few different ways:

- **Run the Next.js app and Genkit server together (recommended for development):**
  This command starts the Next.js development server and the Genkit development server concurrently.
  ```bash
  npm run dev
  ```
  The Next.js application will be available at `http://localhost:9002`.
  The Genkit developer UI will be available at `http://localhost:4000`.

- **Run only the Next.js development server:**
  ```bash
  npm start
  ```
  The application will be available at `http://localhost:9002`.

- **Run the Genkit server in watch mode:**
  This is useful if you are actively developing AI flows and want the server to restart on changes.
  ```bash
  npm run genkit:watch
  ```

### 4. Building for Production

To create a production-ready build of the application, run:
```bash
npm run build
```
This will compile the Next.js application into an optimized set of static files and server-side code.
