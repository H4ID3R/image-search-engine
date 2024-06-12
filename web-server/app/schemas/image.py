from pydantic import BaseModel

class ImageResponse(BaseModel):
    image_url: str

