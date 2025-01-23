from app.dto.suggestion_request import SuggestionRequest


def get_prompt(request: SuggestionRequest):

    if request.history != []:
        history = "\n-".join(request.history)
    else: 
        history = ""
    return f"""Suggest 5 unique and specific activities for {request.weather}.
    Include both indoor and outdoor options. Do not include generic headings like 'Outdoor Activities' or 'Indoor Activities'.
    Each activity should be distinct and not repetitive.

    These suggestions are going to be used as keyword for this api https://maps.googleapis.com/maps/api/place/nearbysearch.

    Current time: {request.current_time}
    Places already suggested: {history}

    Give me only the keywords separeted by -
    """
