from fastapi import FastAPI
from app.route import user, place, suggest
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now (replace "*" with specific URLs in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include routes
app.include_router(place.router, prefix="/place", tags=["database"])
app.include_router(user.router, prefix="/users", tags=["users"]) 
app.include_router(suggest.router, prefix="/suggest", tags=["suggestions"]) 


@app.get("/")
def root():
    return {"message": "Welcome to the FastAPI Backend"}
