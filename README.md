# Local Explorer

Local Explorer is a sophisticated web application designed to recommend personalized activities based on a user's location, weather conditions, and preferences. The application leverages cutting-edge technologies like AI-driven recommendations, geolocation, and weather integration to provide an intuitive and seamless user experience.

## Features
- **Geolocation and Weather Integration**: Uses browser-based geolocation and a weather API to suggest activities tailored to your current location and weather conditions.
- **AI-Powered Recommendations**: Employs Gemini AI (orchestrated by LangChain) to generate personalized activity suggestions for both indoor and outdoor activities.
- **Interactive Map Integration**: Utilizes Google Maps API to display locations of suggested activities with real-time data, including directions and details.
- **User History**: Stores user interactions and suggestion history in MongoDB for an enhanced experience over time.

## Technologies Used
### Backend
- **FastAPI**: Handles server-side logic, user authentication, and API endpoints.
- **LangChain**: Orchestrates AI-powered functionality using Gemini for activity suggestions.
- **MongoDB**: Stores user profiles and interaction history.

### Frontend
- **Next.js**: Builds the user interface with server-side rendering for optimal performance and SEO.
- **Google Maps API**: Displays interactive maps and activity locations.
- **Weather API**: Fetches real-time weather data to tailor suggestions.

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/local-explorer.git
   cd local-explorer

2. Install dependencies:

### Backend
```bash
cd backend
pip install -r requirements.txt

uvicorn main:app --reload
```
### Frontend
```bash
cd frontend
npm install

npm run dev
```
## Screenshots
# Homepage
![local_explorer png](https://github.com/user-attachments/assets/3d10cb04-253a-417b-a4f7-dbb6f61fc914)



Developed with ❤️ by Hanane Nadi.


