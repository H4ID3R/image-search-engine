from datetime import datetime, timedelta, timezone
from google.cloud import firestore
from fastapi import HTTPException
from passlib.context import CryptContext
from app.auth import create_access_token
from app.config import Config

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    @staticmethod
    async def create_user(email: str, username: str, password: str):
        try:
            firestore_client = firestore.Client(project=Config.GOOGLE_CLOUD_PROJECT_ID)
            print(f"Firestore client: {firestore_client}")
            users_ref = firestore_client.collection("users")

            # Check if user already exists
            user_query = users_ref.where(field_path="email", op_string="==", value=email).stream()
            username_query = users_ref.where(field_path="username", op_string="==", value=username).stream() # Username is unique
            for user in user_query or username_query:
                raise HTTPException(status_code=400, detail="User already exists")
            
            # Hash password
            hashed_password = pwd_context.hash(password)

            # Create user
            user_data = {
                "email": email,
                "username": username,
                "password": hashed_password,
                "created_at": datetime.now(timezone.utc),
                "images": []
            }
            user_ref = users_ref.add(user_data)
            user_id = user_ref[1].id  # Get the generated user ID

            # Generate access token
            access_token_expires = timedelta(hours=Config.ACCESS_TOKEN_EXPIRE_HOURS)
            access_token = create_access_token(user_id=user_id, email=email, expires_delta=access_token_expires)
            return {"access_token": access_token, "token_type": "bearer"}
        
        except Exception as e:
            print(f"Error creating user: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")
        
    @staticmethod
    async def authenticate_user(email: str, password: str):
        try:
            firestore_client = firestore.Client(project=Config.GOOGLE_CLOUD_PROJECT_ID)
            users_ref = firestore_client.collection("users")

            # Get user
            user_query = users_ref.where(field_path="email", op_string="==", value=email).stream()
            user = None
            for u in user_query:
                user = u
            if user is None:
                raise HTTPException(status_code=400, detail="User not found")
            
            # Verify password
            user_data = user.to_dict()
            if not pwd_context.verify(password, user_data["password"]):
                raise HTTPException(status_code=400, detail="Incorrect password")
            
            user_id = user.id  # Get the user ID

            # Generate access token as user is authenticated
            access_token_expires = timedelta(hours=Config.ACCESS_TOKEN_EXPIRE_HOURS)
            access_token = create_access_token(user_id=user_id, email=email, expires_delta=access_token_expires)

            return {"access_token": access_token, "token_type": "bearer"}
        
        except Exception as e:
            print(f"Error authenticating user: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")
