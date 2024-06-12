from datetime import datetime, timezone
import uuid
from google.cloud import storage, firestore
from fastapi import HTTPException, UploadFile
from app.config import Config

class ImageService:
    @staticmethod
    async def upload_image(file: UploadFile, user_id: str):
        try:
            # Upload image to GCS
            storage_client = storage.Client()
            bucket = storage_client.bucket(Config.GOOGLE_CLOUD_STORAGE_BUCKET)
            blob = bucket.blob(f"{uuid.uuid4()}-{file.filename}")
            blob.upload_from_file(file.file)

            # Store metadata in Firestore
            firestore_client = firestore.Client(project=Config.GOOGLE_CLOUD_PROJECT_ID)
            doc_ref = firestore_client.collection("images").document()
            image_data = {
                "image_url": blob.public_url,
                "uploaded_at": datetime.now(timezone.utc).isoformat(),
                "filename": file.filename,
                "user_id": user_id,
            }
            doc_ref.set(image_data)

            # Add image to user's images list
            user_ref = firestore_client.collection("users").document(user_id)
            user_ref.update({
                "images": firestore.ArrayUnion([doc_ref.id])
            })

            return {
                "image_url": blob.public_url,
                "filename": file.filename,
                "uploaded_at": datetime.now(timezone.utc).isoformat()
            }

        except Exception as e:
            print(f"Error uploading file to Google Cloud Storage: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")

    @staticmethod
    async def list_images(user_id: str):
        try:
            firestore_client = firestore.Client(project=Config.GOOGLE_CLOUD_PROJECT_ID)
            user_ref = firestore_client.collection("users").document(user_id)
            user = user_ref.get()
            if not user.exists:
                raise HTTPException(status_code=404, detail="User not found")

            user_data = user.to_dict()
            image_ids = user_data.get("images", [])
            images = []
            for image_id in image_ids:
                image_ref = firestore_client.collection("images").document(image_id)
                image = image_ref.get()
                if image.exists:
                    image_data = image.to_dict()
                    images.append({
                        "image_url": image_data.get("image_url"),
                        "filename": image_data.get("filename"),
                        "uploaded_at": image_data.get("uploaded_at")
                    })

            return images

        except Exception as e:
            print(f"Error listing images: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")
