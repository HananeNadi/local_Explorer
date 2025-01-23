from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import EmailStr

from app.model.user import User
from app.service.user import UserService



router = APIRouter()

@router.post("/", response_model=User)
async def create_user(user: User):
    user_exists = await UserService.get_user_by_identifier(user.user_identifier)
    if user_exists:
        raise HTTPException(status_code=400, detail="Identifier already registered")
    user_id = await UserService.create_user(user)
    return {**user.model_dump(), "id": user_id}


@router.get("/find", response_model=User)
async def get_user_by_identifier(identifier: str = Query(..., description="The identifier of the user to retrieve")):
    """
    Get a user by identifier.
    """
    user = await UserService.get_user_by_identifier(identifier)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/", response_model=List[User])
async def list_users(): 
    """
    Get all users.
    """
    users = await UserService.list_users()
    return users

@router.get("/{user_id}", response_model=User)
async def get_user_by_id(user_id: str):
    user = await UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user



@router.put("/{user_id}", response_model=User)
async def update_user(user_id: str, updates: dict):
    user = await UserService.update_user(user_id, updates)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}")
async def delete_user(user_id: str):
    success = await UserService.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted successfully"}
