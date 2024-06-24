from typing import List
from fastapi import APIRouter, UploadFile, File, Depends
from app.controllers.image_controller import ImageController
from app.schemas.image import ImageResponse
from app.auth import get_current_user

router = APIRouter()

@router.post("/upload", response_model=ImageResponse)
async def upload_image(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    return await ImageController.upload_image(file, user['id'])

@router.get("/list", response_model=List[ImageResponse])
async def list_images(user: dict = Depends(get_current_user)):
    return await ImageController.list_images(user['id'])

@router.post("/search", response_model=List[ImageResponse])
async def search_images(file: UploadFile = File(...), user: dict = Depends(get_current_user)): 
    return await ImageController.search_images(file, user['id'])  