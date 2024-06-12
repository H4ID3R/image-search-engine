from fastapi import UploadFile
from app.services.image_service import ImageService
from app.schemas.image import ImageResponse

class ImageController:
    @staticmethod
    async def upload_image(file: UploadFile, user_id: str) -> ImageResponse:
        image_url = await ImageService.upload_image(file, user_id)
        return {"image_url": image_url}
    