from fastapi import HTTPException
import requests

from config import OPEN_WEATHER_API_KEY


def get_weather(lat: float, lon: float):
    url = f"https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&appid={OPEN_WEATHER_API_KEY}&units=metric"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        # Extract current weather data
        current_weather = data["current"]["weather"][0]["description"]
        temperature = data["current"]["temp"]
        return f"weather is {current_weather}, with temperature of {temperature} celsius."
    else:
        raise HTTPException(status_code=400, detail="Failed to fetch weather data. Please check the coordinates.")