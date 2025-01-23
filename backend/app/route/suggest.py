from fastapi import APIRouter
from langchain_google_genai import ChatGoogleGenerativeAI


from app.dto.suggestion_request import SuggestionRequest
from app.utils.prompt import get_prompt
from app.utils.map import find_nearby_places
from app.dto.near_by_places import NearByPlaces
from app.dto.location import Location
from config import GEMINI_MODEL_NAME, GOOGLE_API_KEY

model = ChatGoogleGenerativeAI(model=GEMINI_MODEL_NAME,convert_system_message_to_human=True, api_key=GOOGLE_API_KEY)

router = APIRouter()

@router.post("/activities")
async def get_sugguestions(request: SuggestionRequest):
    suggestions = model.invoke(get_prompt(request)).content

    return {"suggestions": suggestions}

@router.post("/nearby_places")
async def get_nearby_places(request: NearByPlaces):
    suggestions = model.invoke(get_prompt(request)).content
    print(suggestions)
    places =[]
    for suggestion in suggestions.split("-"):
        places.append((suggestion, find_nearby_places(request.lat, request.lon, suggestion.replace(" ", "_"))))

    return {"suggestions": places}



