# WeatherWise: A Modern Weather Forecast App

This is a weather forecasting application built with Next.js, TypeScript, and Tailwind CSS. It provides current weather conditions, a 5-day forecast, and detailed weather insights for any city. The app leverages Genkit for AI-powered weather descriptions and is styled with ShadCN UI components.

## ✨ Features

- **Current Weather:** Get real-time temperature, humidity, wind speed, and "feels like" temperature.
- **5-Day Forecast:** See the weather forecast for the next five days.
- **Detailed Charts:** Visualize temperature trends with interactive charts.
- **AI-Powered Descriptions:** Get friendly and context-aware weather descriptions powered by Google's Gemini model through Genkit.
- **City Search with Suggestions:** Easily find any city with autocomplete suggestions.
- **Responsive Design:** A beautiful and modern user interface that works on all devices.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini Models
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching:** OpenWeatherMap API

## 🚀 Getting Started

To get started with this project in Firebase Studio, simply ask the AI assistant to make changes or add new features.

To run the project locally:

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your OpenWeatherMap API key:
    ```
    OPENWEATHER_API_KEY=your_api_key_here
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.
