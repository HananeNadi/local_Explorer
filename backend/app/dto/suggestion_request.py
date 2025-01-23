


from pydantic import BaseModel


class SuggestionRequest(BaseModel):
    weather: str
    current_time: str
    history: list