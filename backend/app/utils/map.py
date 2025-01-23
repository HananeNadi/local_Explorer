from fastapi import HTTPException
import requests

from config import GOOGLE_PLACES_API_KEY


def find_nearby_places(lat: float, lon: float, query: str):
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lon}&radius=5000&keyword={query}&key={GOOGLE_PLACES_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if data["status"] == "OK":
            places = []
            for place in data["results"][:5]:  # Limit to top 3 results
                places.append({
                    "name": place["name"],
                    "address": place.get("vicinity", "Address not available"),
                    "latitude": place["geometry"]["location"]["lat"],
                    "longitude": place["geometry"]["location"]["lng"],
                })
            print(places, "places")
            return places
        elif data["status"] == "ZERO_RESULTS":
            return []  # Return an empty list if no places are found
        else:
            raise HTTPException(status_code=400, detail=f"Google Places API error: {data['status']}")
    else:
        raise HTTPException(status_code=400, detail="Failed to fetch places data.")