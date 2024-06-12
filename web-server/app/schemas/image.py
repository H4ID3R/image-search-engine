from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ImageResponse(BaseModel):
    image_url: str
    filename: str
    uploaded_at: Optional[datetime]

