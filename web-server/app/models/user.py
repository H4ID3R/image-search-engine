from pydantic import BaseModel

class User(BaseModel):
    email: str
    username: str
    password: str
    images: list = []
    created_at: str