from typing import List
from fastapi import UploadFile
from app.services.image_service import ImageService
from app.schemas.image import ImageResponse

class ImageController:
    @staticmethod
    async def upload_image(file: UploadFile, user_id: str) -> ImageResponse:
        response = await ImageService.upload_image(file, user_id)
        return ImageResponse(**response)

    @staticmethod
    async def list_images(user_id: str) -> List[ImageResponse]:
        images = await ImageService.list_images(user_id)
        return images
