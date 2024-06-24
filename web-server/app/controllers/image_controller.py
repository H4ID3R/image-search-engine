from typing import List
from fastapi import UploadFile
from app.services.image_service import ImageService
from app.schemas.image import ImageResponse

class ImageController:
    @staticmethod
    async def upload_image(file: UploadFile, user_id: str) -> ImageResponse:
        service = ImageService()
        response = await service.upload_image(file, user_id)
        return ImageResponse(**response)

    @staticmethod
    async def list_images(user_id: str) -> List[ImageResponse]:
        service = ImageService()
        images = await service.list_images(user_id)
        return [ImageResponse(**image) for image in images]
    
    @staticmethod
    async def search_images(file: UploadFile, user_id: str) -> List[ImageResponse]:  # Add user_id parameter
        service = ImageService()
        images = await service.search_images(file, user_id)  # Pass user_id to service
        return [ImageResponse(**image) for image in images]
