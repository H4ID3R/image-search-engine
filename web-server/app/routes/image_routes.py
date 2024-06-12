from fastapi import APIRouter, UploadFile, File, Depends
from app.controllers.image_controller import ImageController
from app.schemas.image import ImageResponse
from app.auth import get_current_user

router = APIRouter()

@router.post("/upload", response_model=ImageResponse)
async def upload_image(file: UploadFile = File(...), user = Depends(get_current_user)):
    return await ImageController.upload_image(file, user.id)