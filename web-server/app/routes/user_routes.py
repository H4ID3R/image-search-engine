from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.controllers.user_controllers import UserController
from app.services.user_service import UserService
from app.auth import Token
from pydantic import BaseModel
from app.utils.dependencies import OAuth2EmailPasswordRequestForm


router = APIRouter()

class UserCreateRequest(BaseModel):
    email: str
    username: str
    password: str

class UserLoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register")
async def register_user(request: UserCreateRequest):
    try:
        return await UserController.register_user(request.email, request.username, request.password)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/token", response_model=Token)
async def login_user(form_data: OAuth2EmailPasswordRequestForm = Depends()):
    try:
        return await UserService.authenticate_user(form_data.email, form_data.password)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
