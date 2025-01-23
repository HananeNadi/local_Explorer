from motor.motor_asyncio import AsyncIOMotorClient

from config import (
    MONGO_DETAILS,
    DATABASE_NAME,
    USER_COLLECTION,
    PLACE_COLLECTION
)

client = AsyncIOMotorClient(MONGO_DETAILS)

database = client[DATABASE_NAME]
user_collection = database[USER_COLLECTION]
call_collection = database[PLACE_COLLECTION]
