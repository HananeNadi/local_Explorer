"use client"

import { useEffect, useState } from "react"

interface WeatherData {
  temperature: number
  description: string
}

export default function Weather({weatherString}: any) {
  const description = weatherString.match(/weather is (.*?),/)?.[1] || "Unknown";
  const temperature = parseFloat(weatherString.match(/temperature of ([\d.]+)/)?.[1] || "0");

  if (!temperature) return <div>Loading weather data...</div>

  return (
    <div>
      <p className="text-2xl">{temperature}°C</p>
      <p>{description}</p>
    </div>
  )
}

