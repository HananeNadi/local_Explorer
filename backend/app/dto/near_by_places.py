


from pydantic import BaseModel


class NearByPlaces(BaseModel):
    lat: str
    lon: str
    history: list
    current_time: str
    weather: str