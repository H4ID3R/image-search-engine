from app.services.user_service import UserService

class UserController:
    @staticmethod
    async def register_user(email: str, username: str, password: str):
        return await UserService.create_user(email, username, password)

    @staticmethod
    async def login_user(email: str, password: str):
        return await UserService.authenticate_user(email, password)
    

