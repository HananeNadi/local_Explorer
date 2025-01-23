from datetime import datetime, timezone
import logging
from typing import Optional, List
from pymongo import ReturnDocument
from bson import ObjectId

from app.model.user import User
from app.db.connect import user_collection
from app.utils.weather import get_weather


class UserService:
    @staticmethod
    async def create_user(user: User) -> str:
        """Create a new user."""
        user.weather = get_weather(float(user.latitude), float(user.longitude))
        user_data = user.model_dump(by_alias=True)
        result = await user_collection.insert_one(user_data)
        return str(result.inserted_id)

    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[User]:
        """Retrieve a user by their ID."""
        if not ObjectId.is_valid(user_id):
            return None
        user_data = await user_collection.find_one({"_id": user_id})
        if user_data:
            return User(**user_data)
        return None
    
    @staticmethod
    async def get_user_by_identifier(identifier: str) -> Optional[User]:
        """Retrieve a user by their identifier."""
        user_data = await user_collection.find_one({"user_identifier": identifier})
        if user_data:
            return User(**user_data)
        return None


    @staticmethod
    async def update_user(user_id: str, updates: dict) -> Optional[User]:
        """Update user details."""
        if not ObjectId.is_valid(user_id):
            return None

        updates["updated_at"] = datetime.now(timezone.utc)

        updated_user = await user_collection.find_one_and_update(
            {"_id": user_id},
            {"$set": updates},
            return_document=ReturnDocument.AFTER
        )

        if updated_user:
            return User(**updated_user)

        return None