from datetime import datetime, timezone
from bson import ObjectId
from pydantic import BaseModel, Field


class User(BaseModel):
    id: str = Field(alias="_id", default_factory=lambda: str(ObjectId()))
    user_identifier: str
    latitude: str
    longitude: str
    weather: str
    last_weather_update: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    suggestion_history: list = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True